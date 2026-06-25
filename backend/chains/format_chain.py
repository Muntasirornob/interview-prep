from langchain_core.messages import HumanMessage, SystemMessage

from promts.promts_reader import get_format_prompt


def format_resume_chain(resume, llm):
    system_prompt = get_format_prompt()
    resume_json = resume.model_dump_json(indent=2)

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Generate the HTML resume for the following data:\n\n{resume_json}"),
    ]

    response = llm.invoke(messages)
    html_output = response.content if hasattr(response, "content") else str(response)

    if "<!DOCTYPE html>" in html_output:
        html_output = html_output[html_output.index("<!DOCTYPE html>") :]

    return html_output.strip()