from sqlalchemy.orm import Session
from sqlalchemy import extract, func

from app.models.order import Order
from app.models.shipment import Shipment
from app.models.transport_cost import TransportCost
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.warehouse import Warehouse
from app.models.product import Product

# ---------------- SHIPMENT PROFIT ----------------
def get_shipment_profit(db: Session, shipment_id: int):
    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id
    ).first()

    if not shipment:
        return None

    order = db.query(Order).filter(
        Order.id == shipment.order_id
    ).first()

    if not order:
        return None

    transport = db.query(TransportCost).filter(
        TransportCost.shipment_id == shipment_id
    ).first()

    transport_cost = transport.total_cost if transport else 0
    profit = (order.total_amount or 0) - transport_cost

    return {
        "shipment_id": shipment_id,
        "order_total": order.total_amount or 0,
        "transport_cost": transport_cost,
        "profit": profit
    }


# ---------------- MONTHLY REVENUE ----------------
def get_monthly_revenue(db: Session, month: int, year: int):
    orders = db.query(Order).filter(
        extract("month", Order.created_at) == month,
        extract("year", Order.created_at) == year
    ).all()

    total = sum(o.total_amount or 0 for o in orders)

    return {
        "month": month,
        "year": year,
        "revenue": total
    }


# ---------------- WAREHOUSE SUMMARY ----------------
def get_warehouse_summary(db: Session, warehouse_id: int):
    orders = db.query(Order).filter(
        Order.warehouse_id == warehouse_id
    ).all()

    revenue = sum(o.total_amount or 0 for o in orders)

    shipments = db.query(Shipment).filter(
        Shipment.order_id.in_([o.id for o in orders])
    ).all()

    return {
        "warehouse_id": warehouse_id,
        "total_orders": len(orders),
        "total_shipments": len(shipments),
        "revenue": revenue
    }


# ---------------- ADMIN REPORT ----------------
# def get_admin_report(db: Session, user):
#     if user.role != "admin":
#         return {"error": "Not allowed"}

#     total_orders = db.query(Order).count()
#     total_stock = db.query(Inventory).count()
#     total_revenue = db.query(
#         func.coalesce(func.sum(Order.total_amount), 0)
#     ).scalar()

#     return {
#         "total_orders": total_orders,
#         "total_stock": total_stock,
#         "total_revenue": total_revenue
#     }

def get_stock_report(db: Session, user):

    stocks = (
        db.query(
            Inventory.id,
            Inventory.product_id,
            Product.name.label("product_name"),
            Inventory.warehouse_id,
            Inventory.quantity
        )
        .join(Product, Product.id == Inventory.product_id)
        .all()
    )

    total_stock = sum(s.quantity or 0 for s in stocks)

    stock_list = [
        {
            "id": s.id,
            "product_id": s.product_id,
            "product_name": s.product_name,
            "warehouse_id": s.warehouse_id,
            "quantity": s.quantity
        }
        for s in stocks
    ]

    return {
        "total_products": len(stocks),
        "total_stock_quantity": total_stock,
        "stocks": stock_list
    }
# ---------------- STOCK REPORT ----------------
def get_stock_report(db: Session, user):
    stocks = db.query(Inventory).all()

    result = []
    for item in stocks:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        warehouse = db.query(Warehouse).filter(
            Warehouse.id == item.warehouse_id
        ).first()

        result.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": product.name if product else None,
            "warehouse_id": item.warehouse_id,
            "warehouse_name": warehouse.name if warehouse else None,
            "quantity": item.quantity or 0
        })

    return result


# ---------------- ORDER REPORT ----------------
def get_order_report(db: Session, user):
    orders = db.query(Order).order_by(
        Order.id.desc()
    ).all()

    result = []
    for o in orders:
        result.append({
            "id": o.id,
            "customer_id": o.customer_id,
            "total_amount": o.total_amount or 0,
            "status": o.status
        })

    return result
