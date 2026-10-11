import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    contract_id = Column(String(36), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=True)
    alert_type = Column(String(50), nullable=False) # renewal, expiration, notice_deadline, obligation_due, high_risk, custom
    alert_date = Column(Date, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="unread") # unread, read, resolved
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    organization = relationship("Organization", back_populates="alerts")
    contract = relationship("Contract", back_populates="alerts")
