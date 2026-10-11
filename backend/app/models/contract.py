import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    uploaded_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    contract_name = Column(String(255), nullable=False)
    contract_type = Column(String(100), nullable=True)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=True)
    status = Column(String(50), default="COMPLETED") # UPLOADED, EXTRACTING, ANALYZING, RISK_ANALYSIS, COMPLETED, FAILED
    
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    renewal_date = Column(Date, nullable=True)
    renewal_type = Column(String(50), nullable=True) # auto, manual, none
    notice_period_days = Column(Integer, nullable=True)
    
    contract_value = Column(Float, nullable=True)
    currency = Column(String(10), default="INR")
    
    risk_score = Column(Integer, default=0)
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    
    summary = Column(Text, nullable=True)
    raw_text = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    organization = relationship("Organization", back_populates="contracts")
    uploader = relationship("User", back_populates="contracts")
    clauses = relationship("Clause", back_populates="contract", cascade="all, delete-orphan")
    obligations = relationship("Obligation", back_populates="contract", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="contract", cascade="all, delete-orphan")
