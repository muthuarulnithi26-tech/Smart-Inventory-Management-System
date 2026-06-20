from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.shipment import Shipment
from app.models.transport_cost import TransportCost
from app.models.order_item import OrderItem
from app.models.inventory import Inventory


def get_shipment_profit(db: Session, shipment_id: int):

    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id
    ).first()

    if not shipment:
        return None

    order = db.query(Order).filter(
        Order.id == shipment.order_id
    ).first()

    transport = db.query(TransportCost).filter(
        TransportCost.shipment_id == shipment_id
    ).first()

    transport_cost = transport.total_cost if transport else 0

    profit = order.total_amount - transport_cost

    return {
        "shipment_id": shipment_id,
        "order_total": order.total_amount,
        "transport_cost": transport_cost,
        "profit": profit
    }

from datetime import datetime


def get_monthly_revenue(db: Session, month: int, year: int):

    orders = db.query(Order).filter(
        Order.created_at.month == month,
        Order.created_at.year == year
    ).all()

    total = sum(o.total_amount for o in orders)

    return {
        "month": month,
        "year": year,
        "revenue": total
    }

def get_warehouse_summary(db: Session, warehouse_id: int):

    orders = db.query(Order).filter(
        Order.warehouse_id == warehouse_id
    ).all()

    revenue = sum(o.total_amount for o in orders)

    shipments = db.query(Shipment).filter(
        Shipment.order_id.in_([o.id for o in orders])
    ).all()

    return {
        "warehouse_id": warehouse_id,
        "total_orders": len(orders),
        "total_shipments": len(shipments),
        "revenue": revenue
    }

