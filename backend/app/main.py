from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine

# Routers
from app.routers import warehouses
from app.routers import warehouse_assignment
from app.routers import products
from app.routers import inventory
from app.routers import containers
from app.routers.auth import router as auth_router
# from app.routers import transport
from app.routers import reports
# from app.routers import dealer
from app.routers import customers
from app.routers import shipments
from app.routers import customers
from app.routers import orders
from app.routers import transport_cost
from app.routers import reports


# Modules
from app.models.shipment import Shipment
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Inventory Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AUTH
app.include_router(auth_router)


# CORE MODULES
app.include_router(warehouses.router)
app.include_router(warehouse_assignment.router)
app.include_router(products.router)
app.include_router(inventory.router)
app.include_router(containers.router)
# app.include_router(dealer.router)
# app.include_router(transport.router)

app.include_router(shipments.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(transport_cost.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {
        "message": "Smart Inventory Management API Running"
    }
