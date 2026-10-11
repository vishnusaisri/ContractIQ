import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Obligation(Base):
    __tablename__ = "obligations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = Column(String(36), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    responsible_party = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    due_date = Column(Date, nullable=True)
    frequency = Column(String(50), nullable=True) # One-time, Monthly, Quarterly, Annual
    status = Column(String(50), default="Pending") # Pending, In Progress, Completed, Overdue
    priority = Column(String(20), default="Medium") # Low, Medium, High, Critical
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    contract = relationship("Contract", back_populates="obligations")
