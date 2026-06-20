from pydantic import BaseModel


class ContainerLoadProduct(BaseModel):
    container_id: int
    product_id: int
    quantity: int