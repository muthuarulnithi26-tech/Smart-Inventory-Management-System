
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.customer import CustomerCreate, CustomerResponse
from app.services.customer_service import create_customer

from app.schemas.staff import (
    StaffDashboardResponse,
    StaffOrderResponse,
    StaffStockResponse
)

from app.services.staff_service import (
    get_staff_dashboard,
    get_staff_orders,
    get_staff_order,
    get_staff_stock
)

router = APIRouter(prefix="/staff", tags=["Staff"])


# ---------------- DASHBOARD ----------------
@router.get("/dashboard", response_model=StaffDashboardResponse)
def staff_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "staff":
        raise HTTPException(status_code=403, detail="Not allowed")

    return get_staff_dashboard(db, current_user)


# ---------------- ORDERS ----------------
@router.get("/orders", response_model=list[StaffOrderResponse])
def staff_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "staff":
        raise HTTPException(status_code=403, detail="Not allowed")

    return get_staff_orders(db, current_user)


# ---------------- SINGLE ORDER ----------------
@router.get("/order/{order_id}", response_model=StaffOrderResponse)
def staff_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "staff":
        raise HTTPException(status_code=403, detail="Not allowed")

    order = get_staff_order(db, current_user, order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # SECURITY CHECK
    if order.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    return order


# ---------------- STOCK ----------------
@router.get("/stock", response_model=list[StaffStockResponse])
def staff_stock(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "staff":
        raise HTTPException(status_code=403, detail="Not allowed")

    return get_staff_stock(db, current_user)

@router.post("/customer", response_model=CustomerResponse)
def staff_create_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "staff":
        raise HTTPException(status_code=403, detail="Not allowed")

    return create_customer(db, current_user, data)

