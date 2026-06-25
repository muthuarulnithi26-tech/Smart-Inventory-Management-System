from app.models.user import User
from app.models.warehouse_assignment import WarehouseAssignment


def get_warehouse_users(db, warehouse_id):

    assignments = db.query(
        WarehouseAssignment
    ).filter(
        WarehouseAssignment.warehouse_id == warehouse_id
    ).all()

    users = []

    for assignment in assignments:

        user = db.query(User).filter(
            User.id == assignment.user_id
        ).first()

        if user:
            users.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": assignment.role,
                "warehouse_id": warehouse_id
            })

    return users
