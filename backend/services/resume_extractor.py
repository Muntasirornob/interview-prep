import re

def clean_resume_text(resume_text):
    """
    Cleans the resume text by removing unwanted characters and formatting.
    """
    # Remove non-ASCII characters
    resume_text = re.sub(r'[^\x00-\x7F]+', ' ', resume_text)
    # Remove line breaks and carriage returns
    resume_text = re.sub(r'[\r\n]+', ' ', resume_text)  
    # Remove extra whitespace
    resume_text = re.sub(r'\s+', ' ', resume_text).strip()
    
    return resume_text