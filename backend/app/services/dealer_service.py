from fastapi import HTTPException

from app.models.dealer import Dealer


# ---------------- CREATE DEALER ----------------

def create_dealer(db, data):

    existing = db.query(Dealer).filter(
        Dealer.phone == data.phone
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Dealer already exists"
        )

    dealer = Dealer(
        name=data.name,
        phone=data.phone,
        email=data.email,
        address=data.address,
        gst_number=data.gst_number
    )

    db.add(dealer)
    db.commit()
    db.refresh(dealer)

    return dealer


# ---------------- GET ALL DEALERS ----------------

def get_all_dealers(db):

    return db.query(Dealer).all()


# ---------------- GET DEALER BY ID ----------------

def get_dealer_by_id(db, dealer_id):

    dealer = db.query(Dealer).filter(
        Dealer.id == dealer_id
    ).first()

    if not dealer:
        raise HTTPException(
            status_code=404,
            detail="Dealer not found"
        )

    return dealer


# ---------------- UPDATE DEALER ----------------

def update_dealer(db, dealer_id, data):

    dealer = get_dealer_by_id(db, dealer_id)

    for key, value in data.dict(exclude_unset=True).items():
        setattr(dealer, key, value)

    db.commit()
    db.refresh(dealer)

    return dealer

# ---------------- DELETE DEALER ----------------

def delete_dealer(db, dealer_id):

    dealer = get_dealer_by_id(
        db,
        dealer_id
    )

    db.delete(dealer)
    db.commit()

    return {
        "message": "Dealer deleted successfully"
    }
