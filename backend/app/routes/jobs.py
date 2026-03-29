from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.database import get_db
from app.models.user import User
from app.models.job import JobPreference, JobRecommendation, SkillGap
from app.models.skill import Skill
from app.utils.auth_utils import get_current_user
from app.utils.ai_utils import get_job_recommendations_ai, analyze_job_description_ai
import json

router = APIRouter()

# ---- Pydantic Schemas ----
class JobPreferenceRequest(BaseModel):
    job_role: str
    industry: Optional[str] = None
    experience_level: Optional[str] = "entry"

class JobDescriptionRequest(BaseModel):
    job_description: str
    job_title: str


@router.post("/preferences")
def save_job_preferences(
    data: JobPreferenceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ইউজারের Job Preference save করো"""
    # আগের preference delete করো
    db.query(JobPreference).filter(JobPreference.user_id == current_user.id).delete()

    preference = JobPreference(
        user_id=current_user.id,
        job_role=data.job_role,
        industry=data.industry,
        experience_level=data.experience_level
    )
    db.add(preference)
    db.commit()
    db.refresh(preference)

    return {"message": "✅ Job preference সেভ হয়েছে!", "preference": {
        "job_role": preference.job_role,
        "industry": preference.industry,
        "experience_level": preference.experience_level
    }}


@router.get("/recommendations")
def get_job_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """AI দিয়ে Job Recommendations দেখাও"""
    # ইউজারের skills নাও
    skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()
    skill_list = [s.skill_name for s in skills]

    # ইউজারের preference নাও
    preference = db.query(JobPreference).filter(
        JobPreference.user_id == current_user.id
    ).first()

    if not skill_list and not preference:
        raise HTTPException(
            status_code=400,
            detail="আগে resume upload করুন বা job preference দিন!"
        )

    # AI দিয়ে recommendations নাও
    result = get_job_recommendations_ai(
        skills=skill_list,
        job_role=preference.job_role if preference else "",
        industry=preference.industry if preference else "",
        experience_level=preference.experience_level if preference else "entry"
    )

    # Database এ save করো
    db.query(JobRecommendation).filter(
        JobRecommendation.user_id == current_user.id
    ).delete()

    for job in result.get("recommendations", []):
        rec = JobRecommendation(
            user_id=current_user.id,
            job_title=job.get("title", ""),
            company_type=job.get("company_type", ""),
            required_skills=json.dumps(job.get("required_skills", [])),
            match_percentage=job.get("match_percentage", 0)
        )
        db.add(rec)
    db.commit()

    return result


@router.post("/analyze-description")
def analyze_job_description(
    data: JobDescriptionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Job Description analyze করো এবং Skill Gap বের করো"""
    # ইউজারের skills নাও
    skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()
    user_skills = [s.skill_name for s in skills]

    # AI দিয়ে analyze করো
    result = analyze_job_description_ai(
        job_description=data.job_description,
        job_title=data.job_title,
        user_skills=user_skills
    )

    # Skill Gap database এ save করো
    db.query(SkillGap).filter(
        SkillGap.user_id == current_user.id,
        SkillGap.job_title == data.job_title
    ).delete()

    for skill in result.get("missing_skills", []):
        gap = SkillGap(
            user_id=current_user.id,
            job_title=data.job_title,
            missing_skill=skill.get("skill", ""),
            priority=skill.get("priority", "medium")
        )
        db.add(gap)
    db.commit()

    return result


@router.get("/skill-gap")
def get_skill_gaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ইউজারের সব Skill Gaps দেখাও"""
    gaps = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).all()
    return {
        "user_id": current_user.id,
        "skill_gaps": [
            {
                "job_title": g.job_title,
                "missing_skill": g.missing_skill,
                "priority": g.priority
            } for g in gaps
        ],
        "total_gaps": len(gaps)
    }