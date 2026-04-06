from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.skill import Skill, ResumeUpload
from app.models.job import JobRecommendation, SkillGap
from app.models.learning import LearningRecommendation
from app.utils.auth_utils import get_current_user

router = APIRouter()


@router.get("/summary")
def get_progress_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_skills = db.query(Skill).filter(Skill.user_id == current_user.id).count()
    total_resumes = db.query(ResumeUpload).filter(ResumeUpload.user_id == current_user.id).count()
    total_jobs = db.query(JobRecommendation).filter(JobRecommendation.user_id == current_user.id).count()
    total_gaps = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).count()
    completed_learning = db.query(LearningRecommendation).filter(
        LearningRecommendation.user_id == current_user.id,
        LearningRecommendation.is_completed == True
    ).count()

    total_scope = total_skills + total_gaps
    readiness_percentage = round((total_skills / total_scope) * 100) if total_scope > 0 else 0

    return {
        "total_skills": total_skills,
        "total_resumes": total_resumes,
        "recommended_jobs": total_jobs,
        "skill_gaps": total_gaps,
        "completed_learning": completed_learning,
        "readiness_percentage": readiness_percentage
    }


@router.get("/details")
def get_progress_details(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()
    gaps = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).all()
    learning = db.query(LearningRecommendation).filter(
        LearningRecommendation.user_id == current_user.id
    ).all()

    return {
        "skills": [
            {
                "skill_name": s.skill_name,
                "source": s.source
            } for s in skills
        ],
        "skill_gaps": [
            {
                "job_title": g.job_title,
                "missing_skill": g.missing_skill,
                "priority": g.priority
            } for g in gaps
        ],
        "completed_learning": [
            {
                "id": r.id,
                "title": r.title,
                "skill": r.skill_name,
                "type": r.resource_type
            } for r in learning if r.is_completed
        ],
        "pending_learning": [
            {
                "id": r.id,
                "title": r.title,
                "skill": r.skill_name,
                "type": r.resource_type
            } for r in learning if not r.is_completed
        ]
    }