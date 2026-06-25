from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.container import (
    ContainerCreate,
    ContainerResponse,
    ContainerStatusUpdate
)

from app.schemas.container_item import (
    ContainerLoadProduct
)

from app.services import container_service


router = APIRouter(
    prefix="/containers",
    tags=["Containers"]
)


# ---------------- CREATE CONTAINER ----------------

@router.post(
    "/",
    response_model=ContainerResponse
)
def create_container(
    data: ContainerCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return container_service.create_container(
        db,
        data,
        user
    )


# ---------------- LOAD PRODUCT ----------------

@router.post("/load-product")
def load_product(
    data: ContainerLoadProduct,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return container_service.load_product_to_container(
        db,
        data,
        user
    )


# ---------------- UPDATE CONTAINER STATUS ----------------

@router.put("/{container_id}/status")
def update_status(
    container_id: int,
    data: ContainerStatusUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return container_service.update_container_status(
        db,
        container_id,
        data.status,
        user
    )


# ---------------- UNLOAD CONTAINER ----------------

@router.post("/{container_id}/unload")
def unload(
    container_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    container = db.query(Container).filter(
        Container.id == container_id
    ).first()

    if container.status not in ["IN_TRANSIT", "LOADED"]:
     raise HTTPException(
        status_code=400,
        detail=f"Cannot unload from state {container.status}"
    )

    container.status = "UNLOADED"

    db.commit()

    return {
        "message": "Container unloaded"
    }
