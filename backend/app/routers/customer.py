from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.core.deps import get_current_user

router = APIRouter(prefix="/customers", tags=["Customers"])


# ---------------- CREATE CUSTOMER ----------------
@router.post("/", response_model=CustomerResponse)
def create_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    customer = Customer(
        name=data.name,
        email=data.email,
        phone=data.phone
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


# ---------------- GET ALL CUSTOMERS ----------------
@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Customer).all()
