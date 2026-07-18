from pypdf import PdfReader
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name = os.getenv("CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
)


# store pdf in cloudinary
def store_pdf(file):
    try:
        result = cloudinary.uploader.upload(
            file,
            resource_type = 'raw',
            folder = "DocLens_pdfs"
        )


        return {
            "success": True,
            "message": "pdf uploaded successfully",
            "url": result.get("secure_url"),

        }
        
    
    except Exception as e:
        return {
            "success": False,
            "message": "cloudinary upload failed!",
            "error": str(e)

        }
    


# extract text from pdf
def extract_text(file):
    file.file.seek(0)
    pdf = PdfReader(file.file)
    text = ""

    for page in pdf.pages:
        text += page.extract_text() or ""
    

    return text