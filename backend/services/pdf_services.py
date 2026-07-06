from pypdf import PdfReader

def extract_text(file):
    file.file.seek(0)
    pdf = PdfReader(file.file)
    text = ""

    for page in pdf.pages:
        text += page.extract_text()
    

    return text