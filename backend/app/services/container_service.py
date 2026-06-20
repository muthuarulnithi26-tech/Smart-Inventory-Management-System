from fastapi import HTTPException

from app.models.container import Container
from app.models.container_item import ContainerItem
from app.models.warehouse import Warehouse
from app.models.inventory import Inventory
from app.models.stock_movement import StockMovement

from app.core.warehouse_access import check_warehouse_access


# ---------------- CREATE CONTAINER ----------------

def create_container(db, data, user):

    source = db.query(Warehouse).filter(
        Warehouse.id == data.source_warehouse_id
    ).first()

    if not source:
        raise HTTPException(
            status_code=404,
            detail="Source warehouse not found"
        )

    destination = db.query(Warehouse).filter(
        Warehouse.id == data.destination_warehouse_id
    ).first()

    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination warehouse not found"
        )

    container = Container(
        container_number=data.container_number,
        source_warehouse_id=data.source_warehouse_id,
        destination_warehouse_id=data.destination_warehouse_id,
        created_by=user.id
    )

    db.add(container)
    db.commit()
    db.refresh(container)

    return container


# ---------------- LOAD PRODUCT TO CONTAINER ----------------

def load_product_to_container(
    db,
    data,
    user
):
    container = db.query(Container).filter(
        Container.id == data.container_id
    ).first()

    if not container:
        raise HTTPException(
            status_code=404,
            detail="Container not found"
        )

    if data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    check_warehouse_access(
        db,
        user.id,
        container.source_warehouse_id,
        required_roles=["admin", "manager"]
    )

    inventory = db.query(Inventory).filter(
        Inventory.warehouse_id == container.source_warehouse_id,
        Inventory.product_id == data.product_id
    ).first()

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Stock not found"
        )

    if inventory.quantity < data.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    inventory.quantity -= data.quantity

    item = db.query(ContainerItem).filter(
        ContainerItem.container_id == data.container_id,
        ContainerItem.product_id == data.product_id
    ).first()

    if item:
        item.quantity += data.quantity
    else:
        item = ContainerItem(
            container_id=data.container_id,
            product_id=data.product_id,
            quantity=data.quantity
        )
        db.add(item)

    db.add(
        StockMovement(
            warehouse_id=container.source_warehouse_id,
            product_id=data.product_id,
            user_id=user.id,
            movement_type="CONTAINER_LOAD",
            quantity=data.quantity
        )
    )

    db.commit()

    return {
        "message": "Product loaded successfully"
    }


# ---------------- UPDATE CONTAINER STATUS ----------------

def update_container_status(
    db,
    container_id,
    status,
    user
):
    container = db.query(Container).filter(
        Container.id == container_id
    ).first()

    if not container:
        raise HTTPException(
            status_code=404,
            detail="Container not found"
        )

    check_warehouse_access(
        db,
        user.id,
        container.source_warehouse_id,
        required_roles=["admin", "manager"]
    )

    valid_statuses = [
        "CREATED",
        "LOADED",
        "IN_TRANSIT",
        "DELIVERED"
    ]

    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    container.status = status

    db.commit()
    db.refresh(container)

    return container


# ---------------- UNLOAD CONTAINER ----------------

def unload_container(
    db,
    container_id,
    user
):
    container = db.query(Container).filter(
        Container.id == container_id
    ).first()

    if not container:
        raise HTTPException(
            status_code=404,
            detail="Container not found"
        )

    if container.status != "IN_TRANSIT":
        raise HTTPException(
            status_code=400,
            detail="Container must be IN_TRANSIT"
        )

    check_warehouse_access(
        db,
        user.id,
        container.destination_warehouse_id,
        required_roles=["admin", "manager"]
    )

    items = db.query(ContainerItem).filter(
        ContainerItem.container_id == container.id
    ).all()

    for item in items:

        inventory = db.query(Inventory).filter(
            Inventory.warehouse_id == container.destination_warehouse_id,
            Inventory.product_id == item.product_id
        ).first()

        if inventory:
            inventory.quantity += item.quantity
        else:
            inventory = Inventory(
                warehouse_id=container.destination_warehouse_id,
                product_id=item.product_id,
                quantity=item.quantity
            )
            db.add(inventory)

        db.add(
            StockMovement(
                warehouse_id=container.destination_warehouse_id,
                product_id=item.product_id,
                user_id=user.id,
                movement_type="CONTAINER_UNLOAD",
                quantity=item.quantity
            )
        )

    container.status = "DELIVERED"

    db.commit()

    return {
        "message": "Container delivered successfully"
    }
