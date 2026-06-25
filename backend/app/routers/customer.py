from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse
)

from app.services.customer_service import (
    create_customer,
    get_customers
)

router = APIRouter(prefix="/customers", tags=["Customers"])


# CREATE CUSTOMER (STAFF ONLY)
@router.post("/", response_model=CustomerResponse)
def add_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_customer(db, current_user, data)


# GET ALL CUSTOMERS (ADMIN/MANAGER/STAFF VIEW)
@router.get("/", response_model=list[CustomerResponse])
def list_customers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_customers(db)
