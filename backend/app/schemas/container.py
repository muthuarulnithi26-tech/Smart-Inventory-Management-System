from pydantic import BaseModel


# ---------------- CREATE CONTAINER ----------------

class ContainerCreate(BaseModel):
    container_number: str
    source_warehouse_id: int
    destination_warehouse_id: int


# ---------------- CONTAINER RESPONSE ----------------

class ContainerResponse(BaseModel):
    id: int
    container_number: str
    source_warehouse_id: int
    destination_warehouse_id: int
    status: str

    class Config:
        from_attributes = True


# ---------------- UPDATE STATUS ----------------

class ContainerStatusUpdate(BaseModel):
    status: str
    