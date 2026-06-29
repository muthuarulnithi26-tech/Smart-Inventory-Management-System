from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.core.security import hash_password

from app.models.user import User
from app.models.warehouse import Warehouse
from app.models.warehouse_assignment import WarehouseAssignment
from app.models.order import Order


# ---------------- CREATE MANAGER ----------------
def create_manager(db: Session, data):

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(400, "Email already exists")

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == data.warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(404, "Warehouse not found")

    manager = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="manager",
        warehouse_id=warehouse.id   # ✅ IMPORTANT FIX
    )

    db.add(manager)
    db.commit()
    db.refresh(manager)

    return {
        "message": "Manager created",
        "manager_id": manager.id,
        "warehouse_id": warehouse.id
    }
def get_managers(db: Session):

    managers = db.query(User).filter(
        User.role == "manager"
    ).all()

    return managers
def get_staff(db: Session):

    staff = db.query(User).filter(
        User.role == "staff"
    ).all()

    return staff
def get_warehouse_users(
    db: Session,
    warehouse_id: int
):

    assignments = db.query(
        WarehouseAssignment
    ).filter(
        WarehouseAssignment.warehouse_id == warehouse_id
    ).all()

    result = []

    for a in assignments:

        user = db.query(User).filter(
            User.id == a.user_id
        ).first()

        if user:
            result.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": a.role
            })

    return result

# ---------------- ADMIN DASHBOARD ----------------

def admin_dashboard(db: Session):

    total_users = db.query(User).count()

    total_warehouses = db.query(Warehouse).count()

    total_managers = db.query(User).filter(
        User.role == "manager"
    ).count()

    pending_orders = db.query(Order).filter(
        Order.status == "PENDING"
    ).count()

    return {
        "total_users": total_users,
        "total_warehouses": total_warehouses,
        "total_managers": total_managers,
        "pending_orders": pending_orders
    }
