from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.skill import Skill
from app.models.job import SkillGap
from app.models.learning import LearningRecommendation
from app.utils.auth_utils import get_current_user
from app.utils.ai_utils import get_learning_recommendations_ai

router = APIRouter()


@router.post("/recommendations")
def generate_learning_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gaps = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).all()

    if not gaps:
        raise HTTPException(
            status_code=400,
            detail="আগে job description analyze করে skill gap তৈরি করুন।"
        )

    missing_skills = sorted(list({g.missing_skill for g in gaps}))
    job_title = gaps[0].job_title if gaps else ""

    ai_result = get_learning_recommendations_ai(
        missing_skills=missing_skills,
        job_title=job_title
    )

    db.query(LearningRecommendation).filter(
        LearningRecommendation.user_id == current_user.id
    ).delete()

    def save_items(items, resource_type):
        for item in items:
            rec = LearningRecommendation(
                user_id=current_user.id,
                job_title=job_title,
                skill_name=item.get("skill", ""),
                resource_type=resource_type,
                title=item.get("title", ""),
                provider=item.get("provider", ""),
                url=item.get("url", ""),
                description=item.get("description", "")
            )
            db.add(rec)

    save_items(ai_result.get("courses", []), "course")
    save_items(ai_result.get("certifications", []), "certification")
    save_items(ai_result.get("projects", []), "project")

    db.commit()

    return {
        "message": "✅ Learning recommendations তৈরি হয়েছে!",
        **ai_result
    }


@router.get("/recommendations")
def get_saved_learning_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rows = db.query(LearningRecommendation).filter(
        LearningRecommendation.user_id == current_user.id
    ).all()

    return {
        "courses": [
            {
                "id": r.id,
                "title": r.title,
                "provider": r.provider,
                "url": r.url,
                "skill": r.skill_name,
                "description": r.description,
                "is_completed": r.is_completed
            }
            for r in rows if r.resource_type == "course"
        ],
        "certifications": [
            {
                "id": r.id,
                "title": r.title,
                "provider": r.provider,
                "url": r.url,
                "skill": r.skill_name,
                "description": r.description,
                "is_completed": r.is_completed
            }
            for r in rows if r.resource_type == "certification"
        ],
        "projects": [
            {
                "id": r.id,
                "title": r.title,
                "provider": r.provider,
                "url": r.url,
                "skill": r.skill_name,
                "description": r.description,
                "is_completed": r.is_completed
            }
            for r in rows if r.resource_type == "project"
        ]
    }


@router.post("/complete/{resource_id}")
def mark_learning_completed(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rec = db.query(LearningRecommendation).filter(
        LearningRecommendation.id == resource_id,
        LearningRecommendation.user_id == current_user.id
    ).first()

    if not rec:
        raise HTTPException(status_code=404, detail="Learning resource পাওয়া যায়নি!")

    rec.is_completed = True
    rec.completed_at = datetime.utcnow()

    existing_skill = db.query(Skill).filter(
        Skill.user_id == current_user.id,
        Skill.skill_name.ilike(rec.skill_name)
    ).first()

    if not existing_skill:
        new_skill = Skill(
            user_id=current_user.id,
            skill_name=rec.skill_name,
            source="learning"
        )
        db.add(new_skill)

    db.query(SkillGap).filter(
        SkillGap.user_id == current_user.id,
        SkillGap.missing_skill.ilike(rec.skill_name)
    ).delete(synchronize_session=False)

    db.commit()

    return {
        "message": "✅ Learning completed! Skill profile update হয়েছে।",
        "completed_skill": rec.skill_name
    }