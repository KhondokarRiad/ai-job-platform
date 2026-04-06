from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from app.database import Base


class LearningRecommendation(Base):
    __tablename__ = "learning_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_title = Column(String(200), nullable=True)
    skill_name = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)  # course / certification / project
    title = Column(String(255), nullable=False)
    provider = Column(String(150), nullable=True)
    url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)