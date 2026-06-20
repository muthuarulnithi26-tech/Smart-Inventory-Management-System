from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.dealer import (
    DealerCreate,
    DealerUpdate,
    DealerResponse
)

from app.services.dealer_service import (
    create_dealer,
    get_all_dealers,
    get_dealer_by_id,
    update_dealer,
    delete_dealer
)

router = APIRouter(
    prefix="/dealers",
    tags=["Dealers"]
)


# ---------------- CREATE DEALER ----------------

@router.post(
    "/",
    response_model=DealerResponse
)
def create(
    data: DealerCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return create_dealer(
        db,
        data
    )


# ---------------- GET ALL DEALERS ----------------

@router.get(
    "/",
    response_model=list[DealerResponse]
)
def get_all(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_all_dealers(db)


# ---------------- GET DEALER BY ID ----------------

@router.get(
    "/{dealer_id}",
    response_model=DealerResponse
)
def get_one(
    dealer_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_dealer_by_id(
        db,
        dealer_id
    )


# ---------------- UPDATE DEALER ----------------

@router.put(
    "/{dealer_id}",
    response_model=DealerResponse
)
def update(
    dealer_id: int,
    data: DealerUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return update_dealer(
        db,
        dealer_id,
        data
    )


# ---------------- DELETE DEALER ----------------

@router.delete(
    "/{dealer_id}"
)
def delete(
    dealer_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return delete_dealer(
        db,
        dealer_id
    )
