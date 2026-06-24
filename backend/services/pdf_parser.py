import fitz

def extract_text_from_pdf(pdf_bytes):
    # Open the PDF file using PyMuPDF
    pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")

    # Initialize an empty string to store the extracted text
    extracted_text = ""

    # Iterate through each page in the PDF
    for page_number in range(pdf_document.page_count):
        page = pdf_document.load_page(page_number)
        extracted_text += page.get_text()

    return extracted_text