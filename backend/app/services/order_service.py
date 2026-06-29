from __future__ import annotations

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.inventory import Inventory
from app.models.warehouse_assignment import WarehouseAssignment
from app.models.stock_movement import StockMovement

def _get_user_warehouse_id(db: Session, user: User) -> int:
    assignment = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.user_id == user.id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=400,
            detail="User is not assigned to any warehouse"
        )

    return assignment.warehouse_id


def _get_order_or_404(db: Session, order_id: int) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def _assert_staff_owns_order(user: User, order: Order):
    if user.role == "staff" and order.created_by != user.id:
        raise HTTPException(status_code=403, detail="You can only access your own order")


def _assert_manager_warehouse_access(db: Session, user: User, order: Order):
    manager_warehouse_id = _get_user_warehouse_id(db, user)
    if order.warehouse_id != manager_warehouse_id:
        raise HTTPException(
            status_code=403,
            detail="You cannot access orders from another warehouse"
        )


def create_order(db: Session, user: User, customer_id: int, payment_type: str):
    if user.role != "staff":
        raise HTTPException(status_code=403, detail="Only staff can create orders")

    warehouse_id = _get_user_warehouse_id(db, user)

    order = Order(
        customer_id=customer_id,
        warehouse_id=warehouse_id,
        created_by=user.id,
        payment_type=payment_type,
        total_amount=0,
        status="PENDING",
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


def add_order_item(
    db: Session,
    user: User,
    order_id: int,
    product_id: int,
    quantity: int,
    selling_price: float
):
    order = _get_order_or_404(db, order_id)

    if user.role not in ["staff", "manager"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    if user.role == "staff":
        _assert_staff_owns_order(user, order)

    if user.role == "manager":
        _assert_manager_warehouse_access(db, user, order)

    if order.status != "PENDING":
        raise HTTPException(status_code=400, detail="Cannot modify a processed order")

    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    if selling_price < 0:
        raise HTTPException(status_code=400, detail="Selling price cannot be negative")

    subtotal = quantity * selling_price

    item = OrderItem(
        order_id=order_id,
        product_id=product_id,
        quantity=quantity,
        selling_price=selling_price,
        subtotal=subtotal,
    )

    db.add(item)

    # keep order total in sync
    order.total_amount += subtotal

    db.commit()
    db.refresh(item)

    return item


def get_orders_for_user(db: Session, user: User):
    if user.role == "staff":
        return (
            db.query(Order)
            .filter(Order.created_by == user.id)
            .order_by(Order.id.desc())
            .all()
        )

    if user.role == "manager":
        warehouse_id = _get_user_warehouse_id(db, user)
        return (
            db.query(Order)
            .filter(Order.warehouse_id == warehouse_id)
            .order_by(Order.id.desc())
            .all()
        )

    if user.role == "admin":
        return db.query(Order).order_by(Order.id.desc()).all()

    raise HTTPException(status_code=403, detail="Not allowed")


def get_pending_orders_for_manager(db: Session, user: User):
    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can view pending orders")

    warehouse_id = _get_user_warehouse_id(db, user)

    return (
        db.query(Order)
        .filter(
            Order.warehouse_id == warehouse_id,
            Order.status == "PENDING"
        )
        .order_by(Order.id.desc())
        .all()
    )


def get_order_by_id(db: Session, user: User, order_id: int):
    order = _get_order_or_404(db, order_id)

    if user.role == "staff":
        _assert_staff_owns_order(user, order)

    elif user.role == "manager":
        _assert_manager_warehouse_access(db, user, order)

    elif user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    return order


def get_order_items(db: Session, user: User, order_id: int):
    order = _get_order_or_404(db, order_id)

    if user.role == "staff":
        _assert_staff_owns_order(user, order)

    elif user.role == "manager":
        _assert_manager_warehouse_access(db, user, order)

    elif user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    return (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order_id)
        .order_by(OrderItem.id.asc())
        .all()
    )

def approve_order(db: Session, user: User, order_id: int):
    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can approve orders")

    try:
        manager_warehouse_id = _get_user_warehouse_id(db, user)
        order = _get_order_or_404(db, order_id)

        if order.warehouse_id != manager_warehouse_id:
            raise HTTPException(
                status_code=403,
                detail="You cannot approve orders from another warehouse"
            )

        if order.status != "PENDING":
            raise HTTPException(status_code=400, detail="Order already processed")

        items = db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).all()

        if not items:
            raise HTTPException(status_code=400, detail="Order has no items")

        # Load stock map
        stocks = db.query(Inventory).filter(
            Inventory.warehouse_id == order.warehouse_id
        ).all()

        stock_map = {s.product_id: s for s in stocks}

        # ---------------- VALIDATION PHASE ----------------
        for item in items:
            stock = stock_map.get(item.product_id)

            if not stock:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product {item.product_id} not in inventory"
                )

            if stock.quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for product {item.product_id}"
                )

        # ---------------- DEDUCTION PHASE ----------------
        for item in items:
            stock = stock_map[item.product_id]
            stock.quantity -= item.quantity

            db.add(
                StockMovement(
                    warehouse_id=order.warehouse_id,
                    product_id=item.product_id,
                    user_id=user.id,
                    movement_type="OUT",
                    quantity=item.quantity
                )
            )

        # update order total properly
        order.total_amount = sum(
            item.quantity * item.selling_price for item in items
        )

        order.status = "APPROVED"

        db.commit()

        return {"message": "Order approved and stock updated"}

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
def reject_order(db: Session, user: User, order_id: int):
    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can reject orders")

    try:
        manager_warehouse_id = _get_user_warehouse_id(db, user)
        order = _get_order_or_404(db, order_id)

        if order.warehouse_id != manager_warehouse_id:
            raise HTTPException(
                status_code=403,
                detail="You cannot reject orders from another warehouse"
            )

        if order.status != "PENDING":
            raise HTTPException(status_code=400, detail="Order already processed")

        order.status = "REJECTED"
        db.commit()

        return {"message": "Order rejected"}

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    