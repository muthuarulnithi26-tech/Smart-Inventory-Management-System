from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.inventory import Inventory
from app.models.warehouse_assignment import WarehouseAssignment
# from app.models.order import Order
# from app.models.inventory import Inventory
from app.models.product import Product

def get_staff_dashboard(db, user):

    assignment = db.query(
        WarehouseAssignment
    ).filter(
        WarehouseAssignment.user_id == user.id
    ).first()

    if not assignment:
        return {
            "total_orders": 0,
            "pending_orders": 0,
            "approved_orders": 0,
            "rejected_orders": 0,
            "stock_items": 0
        }

    warehouse_id = assignment.warehouse_id

    orders = db.query(Order).filter(
        Order.created_by == user.id
    ).all()

    stock = db.query(Inventory).filter(
        Inventory.warehouse_id == warehouse_id
    ).all()

    return {
        "total_orders": len(orders),

        "pending_orders":
        len([o for o in orders if o.status == "PENDING"]),

        "approved_orders":
        len([o for o in orders if o.status == "APPROVED"]),

        "rejected_orders":
        len([o for o in orders if o.status == "REJECTED"]),

        "stock_items": len(stock)
    }
def get_staff_orders(db, user):

    return db.query(Order).filter(
        Order.created_by == user.id
    ).order_by(
        Order.id.desc()
    ).all()
def get_staff_order(db, user, order_id):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.created_by == user.id
    ).first()

    return order
def get_staff_stock(db, user):

    assignment = db.query(
        WarehouseAssignment
    ).filter(
        WarehouseAssignment.user_id == user.id
    ).first()

    if not assignment:
        return []

    inventory = db.query(
        Inventory
    ).filter(
        Inventory.warehouse_id == assignment.warehouse_id
    ).all()

    result = []

    for item in inventory:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        result.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": product.name if product else "",
            "quantity": item.quantity
        })

    return result
