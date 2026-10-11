import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Clause(Base):
    __tablename__ = "clauses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = Column(String(36), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    clause_type = Column(String(100), nullable=False) # payment, termination, renewal, liability, indemnification, etc.
    clause_text = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    risk_level = Column(String(20), default="LOW")
    risk_score = Column(Integer, default=0)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    contract = relationship("Contract", back_populates="clauses")
