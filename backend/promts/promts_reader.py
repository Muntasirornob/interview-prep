import os 

PROMTS_DIR = os.path.dirname(os.path.abspath(__file__))

def get_ats_prompt():
    prompt_path = os.path.join(PROMTS_DIR, "ats.md")
    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()
    
def get_rewrite_prompt():
    prompt_path = os.path.join(PROMTS_DIR, "rewrite.md")
    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()

def get_skills_prompt():
    prompt_path = os.path.join(PROMTS_DIR, "skills.md")
    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()
    
def get_format_prompt():
    prompt_path = os.path.join(PROMTS_DIR, "format.md")
    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()