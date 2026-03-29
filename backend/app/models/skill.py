from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Skill(Base):
    """
    Skills টেবিল — ইউজারের সব skills এখানে save হবে
    """
    __tablename__ = "skills"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    source     = Column(String(50), default="resume")  # resume/manual
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ResumeUpload(Base):
    """
    Resume Upload টেবিল — কে কখন resume upload করেছে
    """
    __tablename__ = "resume_uploads"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename    = Column(String(255), nullable=False)
    file_path   = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())