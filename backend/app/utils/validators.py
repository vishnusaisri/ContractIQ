import os
from typing import Tuple

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 # 25MB

def validate_uploaded_file(filename: str, size: int) -> Tuple[bool, str]:
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"Unsupported file extension '{ext}'. Allowed extensions: .pdf, .docx, .txt"
    if size > MAX_FILE_SIZE_BYTES:
        return False, f"File size exceeds limit of 25MB."
    return True, "Valid"
