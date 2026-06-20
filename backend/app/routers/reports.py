from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import report_service

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/shipment/{shipment_id}/profit")
def shipment_profit(shipment_id: int, db: Session = Depends(get_db)):
    return report_service.get_shipment_profit(db, shipment_id)

@router.get("/monthly")
def monthly_revenue(month: int, year: int, db: Session = Depends(get_db)):
    return report_service.get_monthly_revenue(db, month, year)

@router.get("/warehouse/{warehouse_id}")
def warehouse_report(warehouse_id: int, db: Session = Depends(get_db)):
    return report_service.get_warehouse_summary(db, warehouse_id)

