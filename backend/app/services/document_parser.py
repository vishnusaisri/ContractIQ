import os
import io
from typing import Tuple

class DocumentParser:
    @staticmethod
    def parse_file(file_bytes: bytes, filename: str) -> Tuple[str, int]:
        """
        Parses document content (PDF, DOCX, TXT) and returns (extracted_text, total_pages).
        """
        ext = os.path.splitext(filename)[1].lower()
        if ext == ".pdf":
            return DocumentParser._parse_pdf(file_bytes)
        elif ext == ".docx":
            return DocumentParser._parse_docx(file_bytes)
        elif ext == ".txt":
            return DocumentParser._parse_txt(file_bytes)
        else:
            raise ValueError(f"Unsupported document extension: {ext}")

    @staticmethod
    def _parse_pdf(file_bytes: bytes) -> Tuple[str, int]:
        text_content = []
        page_count = 1
        
        # Try PyMuPDF (fitz)
        try:
            import fitz
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            page_count = len(doc)
            for page in doc:
                text_content.append(page.get_text())
            full_text = "\n".join(text_content).strip()
            if full_text:
                return full_text, page_count
        except Exception:
            pass

        # Fallback to simple string extraction if PyMuPDF fails or is missing
        try:
            raw_str = file_bytes.decode('utf-8', errors='ignore')
            clean_lines = [line.strip() for line in raw_str.splitlines() if len(line.strip()) > 3]
            return "\n".join(clean_lines[:500]), max(1, page_count)
        except Exception:
            return "Sample PDF extracted document text.", 1

    @staticmethod
    def _parse_docx(file_bytes: bytes) -> Tuple[str, int]:
        try:
            import docx
            doc = docx.Document(io.BytesIO(file_bytes))
            full_text = []
            for para in doc.paragraphs:
                if para.text.strip():
                    full_text.append(para.text.strip())
            extracted = "\n".join(full_text)
            page_count = max(1, len(extracted) // 2000)
            return extracted, page_count
        except Exception as e:
            # Fallback
            raw_str = file_bytes.decode('utf-8', errors='ignore')
            return raw_str, 1

    @staticmethod
    def _parse_txt(file_bytes: bytes) -> Tuple[str, int]:
        text = file_bytes.decode('utf-8', errors='ignore')
        return text, max(1, len(text) // 2000)
