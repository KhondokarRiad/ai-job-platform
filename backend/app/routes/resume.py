from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.skill import Skill, ResumeUpload
from app.utils.auth_utils import get_current_user
from app.utils.ai_utils import extract_text_from_pdf, extract_text_from_docx, extract_skills_with_ai
import os
import shutil
import uuid

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # File extension চেক
    filename = file.filename
    ext = filename.split(".")[-1].lower()
    if ext not in ["pdf", "doc", "docx"]:
        raise HTTPException(status_code=400, detail="শুধু PDF, DOC বা DOCX ফাইল আপলোড করা যাবে!")

    # ফাইল save করো
    unique_filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Resume upload record save করো
    resume_record = ResumeUpload(
        user_id=current_user.id,
        filename=filename,
        file_path=file_path
    )
    db.add(resume_record)
    db.commit()

    # Text extract করো
    if ext == "pdf":
        resume_text = extract_text_from_pdf(file_path)
    else:
        resume_text = extract_text_from_docx(file_path)

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="ফাইল থেকে text বের করা যায়নি!")

    # AI দিয়ে skills বের করো
    ai_result = extract_skills_with_ai(resume_text)

    # Skills database এ save করো
    if ai_result.get("skills"):
        # আগের skills delete করো
        db.query(Skill).filter(Skill.user_id == current_user.id).delete()

        # নতুন skills save করো
        for skill_name in ai_result["skills"]:
            skill = Skill(
                user_id=current_user.id,
                skill_name=skill_name,
                source="resume"
            )
            db.add(skill)
        db.commit()

    return {
        "message": "✅ রিজিউমি সফলভাবে আপলোড ও বিশ্লেষণ হয়েছে!",
        "filename": filename,
        "extracted_data": ai_result
    }


@router.get("/skills")
def get_user_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ইউজারের সব skills দেখাও"""
    skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()
    return {
        "user_id": current_user.id,
        "full_name": current_user.full_name,
        "skills": [s.skill_name for s in skills],
        "total_skills": len(skills)
    }