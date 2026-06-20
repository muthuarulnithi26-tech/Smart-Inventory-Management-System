from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product

from app.schemas.order import (
    OrderCreate,
    OrderResponse
)

from app.schemas.order_item import (
    OrderItemCreate,
    OrderItemResponse
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

# ---------------- CREATE ORDER ----------------

@router.post(
    "/",
    response_model=OrderResponse
)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    order = Order(
        customer_id=data.customer_id,
        warehouse_id=data.warehouse_id,
        payment_type=data.payment_type,
        created_by=user.id
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


# ---------------- GET ALL ORDERS ----------------

@router.get(
    "/",
    response_model=list[OrderResponse]
)
def get_orders(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Order).all()


# ---------------- GET ORDER BY ID ----------------

@router.get(
    "/{order_id}",
    response_model=OrderResponse
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


# ---------------- ADD ORDER ITEM ----------------

@router.post(
    "/{order_id}/items",
    response_model=OrderItemResponse
)
def add_order_item(
    order_id: int,
    data: OrderItemCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    product = db.query(Product).filter(Product.id == data.product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    subtotal = data.quantity * data.selling_price

    item = OrderItem(
        order_id=order_id,
        product_id=data.product_id,
        quantity=data.quantity,
        selling_price=data.selling_price,
        subtotal=subtotal
    )

    db.add(item)

    order.total_amount += subtotal

    db.commit()
    db.refresh(item)

    return item


# ---------------- GET ORDER ITEMS ----------------

@router.get(
    "/{order_id}/items",
    response_model=list[OrderItemResponse]
)
def get_order_items(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(OrderItem).filter(
        OrderItem.order_id == order_id
    ).all()


# ---------------- DELETE ORDER ITEM ----------------

@router.delete(
    "/items/{item_id}"
)
def delete_order_item(
    item_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    item = db.query(OrderItem).filter(OrderItem.id == item_id).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    order = db.query(Order).filter(Order.id == item.order_id).first()

    order.total_amount -= item.subtotal

    db.delete(item)
    db.commit()

    return {"message": "Order item deleted"}


# ---------------- APPROVE ORDER ----------------

@router.put("/{order_id}/approve")
def approve_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Order already processed"
        )

    order.status = "approved"
    db.commit()

    return {"message": "Order approved"}


# ---------------- REJECT ORDER ----------------

@router.put("/{order_id}/reject")
def reject_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = "rejected"

    db.commit()

    return {"message": "Order rejected"}
