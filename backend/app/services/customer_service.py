from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.customer import Customer


def create_customer(db: Session, user, data):

    if user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Only staff can create customers"
        )

    customer = Customer(
        name=data.name,
        email=data.email,
        phone=data.phone,
        address=data.address
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


def get_customers(db: Session):
    return db.query(Customer).all()
