from paddleocr import PaddleOCR, PPStructure
from PIL import Image
import re
from typing import Dict, Any
import pdf2image
from preprocess import preprocess_image   # ← Add this line

ocr = PaddleOCR(use_angle_cls=True, lang='en')           # 'en' + 'hi' if needed: lang=['en','hi']
structure_engine = PPStructure(table=True, ocr=True)     # enables table recognition

def extract_from_image(image_path: str) -> Dict[str, Any]:
    try:
        # Preprocess
        processed = preprocess_image(image_path)

        # Try table structure first (best for marksheets)
        result = structure_engine(processed)
        
        extracted = {"subjects": {}, "details": {}, "status": "partial", "note": ""}

        for res in result:
            if res['type'].lower() == 'table':
                for row in res['res']:
                    if len(row) >= 2:
                        subj = str(row[0]).strip()
                        mark = str(row[1]).strip()
                        if re.search(r'\d{2,3}', mark):  # looks like marks
                            extracted["subjects"][subj] = mark
                        elif "total" in subj.lower() or "percentage" in subj.lower():
                            extracted["details"][subj] = mark

            # Also collect key-value pairs or plain text
            elif res['type'].lower() in ['text', 'key_value']:
                for line in res['res']:
                    text = line[1][0] if isinstance(line[1], tuple) else str(line)
                    # Simple key-value heuristic
                    if "name" in text.lower() or "roll" in text.lower() or "father" in text.lower():
                        extracted["details"]["raw_text"] = extracted["details"].get("raw_text", "") + text + "\n"

        # Fallback: plain OCR if no table detected
        if not extracted["subjects"]:
            ocr_result = ocr.ocr(processed, cls=True)
            text_lines = [line[1][0] for r in ocr_result for line in r]
            
            current_subj = None
            for txt in text_lines:
                txt = txt.strip()
                if re.match(r'^[A-Za-z\s&]+$', txt) and len(txt) > 3:  # possible subject
                    current_subj = txt
                elif current_subj and re.match(r'\d{2,3}(?:\s*/\s*\d{2,3})?', txt):
                    extracted["subjects"][current_subj] = txt
                    current_subj = None

        # Calculate total if possible
        total = 0
        for m in extracted["subjects"].values():
            try:
                total += int(re.search(r'\d+', m).group())
            except:
                pass
        if total > 0:
            extracted["details"]["calculated_total"] = str(total)

        extracted["status"] = "success" if len(extracted["subjects"]) >= 3 else "partial"
        if extracted["status"] == "partial":
            extracted["note"] = "Some marks/subjects may be missing due to image quality or format variation."

        return extracted

    except Exception as e:
        return {"status": "error", "note": str(e), "subjects": {}, "details": {}}


def process_file(file_path: str) -> Dict:
    if file_path.lower().endswith('.pdf'):
        images = pdf2image.convert_from_path(file_path)
        if not images:
            return {"status": "error", "note": "PDF has no pages"}
        # For simplicity: process only first page (most marksheets are single page)
        images[0].save("temp_page.jpg", "JPEG")
        return extract_from_image("temp_page.jpg")
    else:
        return extract_from_image(file_path)