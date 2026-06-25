from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.models.order import Order
from app.models.order_item import OrderItem

from app.schemas.order import (
    OrderCreate,
    OrderItemCreate,
    OrderResponse,
    OrderItemResponse
)

from app.services.order_service import (
    create_order,
    add_order_item,
    get_orders_for_user,
    get_pending_orders_for_manager,
    approve_order,
    reject_order
)

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse)
def create_new_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_order(db, current_user, data.customer_id, data.payment_type)


@router.post("/{order_id}/items", response_model=OrderItemResponse)
def create_order_item(
    order_id: int,
    data: OrderItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return add_order_item(
        db,
        current_user,
        order_id,
        data.product_id,
        data.quantity,
        data.selling_price
    )


@router.get("/", response_model=list[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_orders_for_user(db, current_user)


@router.get("/pending", response_model=list[OrderResponse])
def list_pending_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_pending_orders_for_manager(db, current_user)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if current_user.role == "staff" and order.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    if current_user.role == "manager":
        # manager can only see own warehouse orders
        from app.models.warehouse_assignment import WarehouseAssignment
        assignment = db.query(WarehouseAssignment).filter(
            WarehouseAssignment.user_id == current_user.id
        ).first()
        if not assignment or assignment.warehouse_id != order.warehouse_id:
            raise HTTPException(status_code=403, detail="Not allowed")

    return order


@router.get("/{order_id}/items", response_model=list[OrderItemResponse])
def get_order_items(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if current_user.role == "staff" and order.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()


@router.put("/{order_id}/approve")
def approve_order_route(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return approve_order(db, current_user, order_id)


@router.put("/{order_id}/reject")
def reject_order_route(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return reject_order(db, current_user, order_id)
