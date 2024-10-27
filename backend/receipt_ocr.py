import cv2
import numpy as np
import easyocr

def preprocess_receipt(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    if image is None:
        raise ValueError("Failed to decode image")
        
    _, thresholded = cv2.threshold(image, 150, 255, cv2.THRESH_BINARY)
    return cv2.convertScaleAbs(thresholded, alpha=1.5, beta=0)

def perform_ocr(image):
    reader = easyocr.Reader(['de'])
    return reader.readtext(image)

def extract_text_rows(image_bytes):
    processed_image = preprocess_receipt(image_bytes)
    result = perform_ocr(processed_image)

    sorted_result = sorted(result, key=lambda x: x[0][0][1])

    rows = []
    current_row = []
    previous_y = sorted_result[0][0][0][1]
    row_threshold = 10

    for (bbox, text, prob) in sorted_result:
        current_y = bbox[0][1]
        if abs(current_y - previous_y) < row_threshold:
            current_row.append(text)
        else:
            rows.append(" ".join(current_row))
            current_row = [text]
        previous_y = current_y
    
    if current_row:
        rows.append(" ".join(current_row))

    return rows
