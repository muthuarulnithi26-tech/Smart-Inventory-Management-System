from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.user import User
from app.models.warehouse import Warehouse
from app.models.warehouse_assignment import WarehouseAssignment
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.customer import Customer
from app.models.order import Order
from app.models.shipment import Shipment


# ---------------- ADMIN DASHBOARD ----------------

def admin_dashboard(db: Session):
    total_users = db.query(User).count()

    total_managers = db.query(User).filter(
        User.role == "manager"
    ).count()

    total_staff = db.query(User).filter(
        User.role == "staff"
    ).count()

    total_warehouses = db.query(Warehouse).count()

    total_products = db.query(Product).count()

    total_customers = db.query(Customer).count()

    pending_orders = db.query(Order).filter(
        func.lower(Order.status) == "pending"
    ).count()

    approved_orders = db.query(Order).filter(
        func.lower(Order.status) == "approved"
    ).count()

    total_shipments = db.query(Shipment).count()

    dispatched_shipments = db.query(Shipment).filter(
        func.lower(Shipment.status) == "dispatched"
    ).count()

    delivered_shipments = db.query(Shipment).filter(
        func.lower(Shipment.status) == "delivered"
    ).count()

    return {
        "total_users": total_users,
        "total_managers": total_managers,
        "total_staff": total_staff,
        "total_warehouses": total_warehouses,
        "total_products": total_products,
        "total_customers": total_customers,
        "pending_orders": pending_orders,
        "approved_orders": approved_orders,
        "total_shipments": total_shipments,
        "dispatched_shipments": dispatched_shipments,
        "delivered_shipments": delivered_shipments,
    }


# ---------------- MANAGER DASHBOARD ----------------

def manager_dashboard(db: Session, user: User):
    assignment = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.user_id == user.id,
        WarehouseAssignment.role == "manager"
    ).first()

    if not assignment:
        return {
            "warehouse_id": None,
            "warehouse_name": None,
            "staff_count": 0,
            "stock_items": 0,
            "total_stock_quantity": 0,
            "pending_orders": 0,
            "approved_orders": 0,
            "shipments": 0,
            "total_order_value": 0,
        }

    warehouse_id = assignment.warehouse_id

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    staff_count = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.warehouse_id == warehouse_id,
        WarehouseAssignment.role == "staff"
    ).count()

    stock_items = db.query(Inventory).filter(
        Inventory.warehouse_id == warehouse_id
    ).count()

    pending_orders = db.query(Order).filter(
        Order.warehouse_id == warehouse_id,
        func.lower(Order.status) == "pending"
    ).count()

    approved_orders = db.query(Order).filter(
        Order.warehouse_id == warehouse_id,
        func.lower(Order.status) == "approved"
    ).count()

    shipments = db.query(Shipment).join(
        Order, Shipment.order_id == Order.id
    ).filter(
        Order.warehouse_id == warehouse_id
    ).count()

    total_stock_qty = db.query(
        func.coalesce(func.sum(Inventory.quantity), 0)
    ).filter(
        Inventory.warehouse_id == warehouse_id
    ).scalar()

    total_order_value = db.query(
        func.coalesce(func.sum(Order.total_amount), 0)
    ).filter(
        Order.warehouse_id == warehouse_id
    ).scalar()

    return {
        "warehouse_id": warehouse_id,
        "warehouse_name": warehouse.name if warehouse else None,
        "staff_count": staff_count,
        "stock_items": stock_items,
        "total_stock_quantity": total_stock_qty,
        "pending_orders": pending_orders,
        "approved_orders": approved_orders,
        "shipments": shipments,
        "total_order_value": total_order_value,
    }


# ---------------- STAFF DASHBOARD ----------------

def staff_dashboard(db: Session, user: User):
    assignment = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.user_id == user.id,
        WarehouseAssignment.role == "staff"
    ).first()

    if not assignment:
        return {
            "warehouse_id": None,
            "warehouse_name": None,
            "my_orders": 0,
            "pending_orders": 0,
            "approved_orders": 0,
            "stock_items": 0,
            "customers_count": 0,
        }

    warehouse_id = assignment.warehouse_id

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    my_orders = db.query(Order).filter(
        Order.created_by == user.id
    ).count()

    stock_items = db.query(Inventory).filter(
        Inventory.warehouse_id == warehouse_id
    ).count()

    customers_count = db.query(Customer).count()

    pending_orders = db.query(Order).filter(
        Order.created_by == user.id,
        func.lower(Order.status) == "pending"
    ).count()

    approved_orders = db.query(Order).filter(
        Order.created_by == user.id,
        func.lower(Order.status) == "approved"
    ).count()

    return {
        "warehouse_id": warehouse_id,
        "warehouse_name": warehouse.name if warehouse else None,
        "my_orders": my_orders,
        "pending_orders": pending_orders,
        "approved_orders": approved_orders,
        "stock_items": stock_items,
        "customers_count": customers_count,
    }
