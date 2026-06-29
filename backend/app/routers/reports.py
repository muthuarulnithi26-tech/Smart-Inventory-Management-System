from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])


# ---------------- FRONTEND COMPATIBLE REPORTS ----------------

@router.get("/admin")
def admin_report(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return report_service.get_admin_report(db, user)


@router.get("/orders")
def order_report(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return report_service.get_order_report(db, user)


@router.get("/stock")
def stock_report(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return report_service.get_stock_report(db, user)


# ---------------- YOUR EXISTING REPORTS (KEEP) ----------------

@router.get("/shipment/{shipment_id}/profit")
def shipment_profit(shipment_id: int, db: Session = Depends(get_db)):
    return report_service.get_shipment_profit(db, shipment_id)


@router.get("/monthly")
def monthly_revenue(month: int, year: int, db: Session = Depends(get_db)):
    return report_service.get_monthly_revenue(db, month, year)


@router.get("/warehouse/{warehouse_id}")
def warehouse_report(warehouse_id: int, db: Session = Depends(get_db)):
    return report_service.get_warehouse_summary(db, warehouse_id)
