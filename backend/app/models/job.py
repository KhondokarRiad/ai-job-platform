from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class JobPreference(Base):
    """
    ইউজারের Job Preference — কোন ধরনের job চায়
    """
    __tablename__ = "job_preferences"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_role        = Column(String(200), nullable=False)
    industry        = Column(String(200), nullable=True)
    experience_level = Column(String(50), nullable=True)  # entry/mid/senior
    created_at      = Column(DateTime(timezone=True), server_default=func.now())


class JobRecommendation(Base):
    """
    AI Generated Job Recommendations
    """
    __tablename__ = "job_recommendations"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_title       = Column(String(200), nullable=False)
    company_type    = Column(String(100), nullable=True)
    required_skills = Column(Text, nullable=True)
    match_percentage = Column(Float, default=0.0)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())


class SkillGap(Base):
    """
    Skill Gap — ইউজারের কোন skills নেই
    """
    __tablename__ = "skill_gaps"

    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_title    = Column(String(200), nullable=False)
    missing_skill = Column(String(100), nullable=False)
    priority     = Column(String(20), default="medium")  # high/medium/low
    created_at   = Column(DateTime(timezone=True), server_default=func.now())