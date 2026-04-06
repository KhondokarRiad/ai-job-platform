from google import genai
import os
import json
from PyPDF2 import PdfReader
from docx import Document as DocxDocument
from dotenv import load_dotenv

load_dotenv()

def get_model_name():
    return os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def parse_json_response(text: str, fallback: dict):
    try:
        text = text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print("Gemini error:", repr(e))
        return fallback

def get_model_name():
    return os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

def get_client():
    return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_text_from_pdf(file_path: str) -> str:
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except:
        return ""

def extract_text_from_docx(file_path: str) -> str:
    try:
        doc = DocxDocument(file_path)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except:
        return ""

def extract_skills_with_ai(resume_text: str) -> dict:
    try:
        client = get_client()
        prompt = f"""
        Resume থেকে তথ্য বের করো। শুধু JSON দাও:
        {{
            "skills": ["skill1", "skill2"],
            "education": [{{"degree": "", "institution": "", "year": ""}}],
            "experience": [{{"title": "", "company": "", "duration": ""}}],
            "summary": "ছোট summary"
        }}
        Resume: {resume_text[:3000]}
        """
        response = client.models.generate_content(model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), contents=prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print("Gemini error:", repr(e))
        return {"skills": [], "education": [], "experience": [], "summary": "AI analysis failed"}


def get_job_recommendations_ai(skills: list, job_role: str, industry: str, experience_level: str) -> dict:
    """AI দিয়ে Job Recommendations তৈরি করো"""
    try:
        client = get_client()
        prompt = f"""
        একজন job seeker এর জন্য job recommendations দাও। শুধু JSON দাও:
        {{
            "recommendations": [
                {{
                    "title": "job title",
                    "company_type": "startup/corporate/remote",
                    "required_skills": ["skill1", "skill2"],
                    "match_percentage": 85,
                    "description": "ছোট description"
                }}
            ],
            "total_match": 75
        }}

        ইউজারের Skills: {", ".join(skills) if skills else "Not provided"}
        Preferred Job Role: {job_role}
        Industry: {industry}
        Experience Level: {experience_level}

        ৫টা job recommendation দাও।
        """
        response = client.models.generate_content(model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), contents=prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print("Gemini error:", repr(e))
        return {"recommendations": [], "total_match": 0}


def analyze_job_description_ai(job_description: str, job_title: str, user_skills: list) -> dict:
    """Job Description analyze করো এবং Skill Gap বের করো"""
    try:
        client = get_client()
        prompt = f"""
        Job Description analyze করো এবং skill gap বের করো। শুধু JSON দাও:
        {{
            "required_skills": ["skill1", "skill2"],
            "matching_skills": ["skill1"],
            "missing_skills": [
                {{"skill": "skill name", "priority": "high/medium/low"}}
            ],
            "readiness_percentage": 75,
            "summary": "ছোট analysis"
        }}

        Job Title: {job_title}
        Job Description: {job_description[:2000]}
        ইউজারের Skills: {", ".join(user_skills) if user_skills else "None"}
        """
        response = client.models.generate_content(model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), contents=prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print("Gemini error:", repr(e))
        return {
            "required_skills": [],
            "matching_skills": [],
            "missing_skills": [],
            "readiness_percentage": 0,
            "summary": "AI analysis failed"
        }
def get_learning_recommendations_ai(missing_skills: list, job_title: str) -> dict:
    try:
        client = get_client()

        prompt = f"""
        একজন job seeker এর missing skills এর উপর ভিত্তি করে learning recommendations দাও।
        শুধু valid JSON return করবে।

        Output format:
        {{
          "courses": [
            {{
              "title": "course title",
              "provider": "Coursera/Udemy/etc",
              "url": "https://example.com",
              "skill": "Python",
              "description": "short description"
            }}
          ],
          "certifications": [
            {{
              "title": "certification title",
              "provider": "Google/AWS/etc",
              "url": "https://example.com",
              "skill": "Cloud",
              "description": "short description"
            }}
          ],
          "projects": [
            {{
              "title": "project title",
              "provider": "Self Practice",
              "url": "",
              "skill": "React",
              "description": "short description"
            }}
          ]
        }}

        Job Title: {job_title}
        Missing Skills: {", ".join(missing_skills) if missing_skills else "None"}

        Rules:
        - 3 courses
        - 2 certifications
        - 2 projects
        - realistic, short, simple
        - valid JSON only
        """

        response = client.models.generate_content(
            model=get_model_name(),
            contents=prompt
        )

        fallback = {
            "courses": [],
            "certifications": [],
            "projects": []
        }

        return parse_json_response(response.text, fallback)

    except Exception as e:
        print("Gemini error:", repr(e))
        return {
            "courses": [],
            "certifications": [],
            "projects": []
        }    
    