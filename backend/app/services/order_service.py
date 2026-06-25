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
        raise HTTPException(status_code=400, detail="User is not assigned to any warehouse")

    return assignment.warehouse_id


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


def add_order_item(db: Session, user: User, order_id: int, product_id: int, quantity: int, selling_price: float):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if user.role not in ["staff", "manager"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    if user.role == "staff" and order.created_by != user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own order")

    if order.status != "PENDING":
        raise HTTPException(status_code=400, detail="Cannot modify a processed order")

    subtotal = quantity * selling_price

    item = OrderItem(
        order_id=order_id,
        product_id=product_id,
        quantity=quantity,
        selling_price=selling_price,
        subtotal=subtotal,
    )

    order.total_amount += subtotal

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def get_orders_for_user(db: Session, user: User):
    if user.role == "staff":
        return db.query(Order).filter(Order.created_by == user.id).order_by(Order.id.desc()).all()

    if user.role == "manager":
        warehouse_id = _get_user_warehouse_id(db, user)
        return db.query(Order).filter(Order.warehouse_id == warehouse_id).order_by(Order.id.desc()).all()

    if user.role == "admin":
        return db.query(Order).order_by(Order.id.desc()).all()

    raise HTTPException(status_code=403, detail="Not allowed")


def get_pending_orders_for_manager(db: Session, user: User):
    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can view pending orders")

    warehouse_id = _get_user_warehouse_id(db, user)

    return db.query(Order).filter(
        Order.warehouse_id == warehouse_id,
        Order.status == "PENDING"
    ).order_by(Order.id.desc()).all()


def approve_order(db: Session, user: User, order_id: int):
    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can approve orders")

    manager_warehouse_id = _get_user_warehouse_id(db, user)

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.warehouse_id != manager_warehouse_id:
        raise HTTPException(status_code=403, detail="You cannot approve orders from another warehouse")

    if order.status != "PENDING":
        raise HTTPException(status_code=400, detail="Order already processed")

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    if not items:
        raise HTTPException(status_code=400, detail="Order has no items")

    # 1) validate stock first
    for item in items:
        stock = db.query(Inventory).filter(
            Inventory.warehouse_id == order.warehouse_id,
            Inventory.product_id == item.product_id
        ).first()

        if not stock or stock.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for product {item.product_id}"
            )

    # 2) deduct stock + stock movement
    for item in items:
        stock = db.query(Inventory).filter(
            Inventory.warehouse_id == order.warehouse_id,
            Inventory.product_id == item.product_id
        ).first()

        stock.quantity -= item.quantity

        db.add(StockMovement(
            warehouse_id=order.warehouse_id,
            product_id=item.product_id,
            user_id=user.id,
            movement_type="OUT",
            quantity=item.quantity
        ))

    order.status = "APPROVED"
    db.commit()

    return {"message": "Order approved and stock updated"}


def reject_order(db: Session, user: User, order_id: int):
    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can reject orders")

    manager_warehouse_id = _get_user_warehouse_id(db, user)

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.warehouse_id != manager_warehouse_id:
        raise HTTPException(status_code=403, detail="You cannot reject orders from another warehouse")

    if order.status != "PENDING":
        raise HTTPException(status_code=400, detail="Order already processed")

    order.status = "REJECTED"
    db.commit()

    return {"message": "Order rejected"}
