import os 

PROMTS_DIR = os.path.dirname(os.path.abspath(__file__))

def read_promts():
    promts = {}
    for filename in os.listdir(PROMTS_DIR):
        if filename.endswith(".md"):
            with open(os.path.join(PROMTS_DIR, filename), "r", encoding="utf-8") as f:
                promts[filename] = f.read()
    return promts