from flask import Flask, request, jsonify
from flask_cors import CORS
from receipt_ocr import extract_text_rows
from receipt_llama import process_invoices

app = Flask(__name__)
CORS(app)

@app.route('/api/process-receipt', methods=['POST'])
def process_receipt():
    try:
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided'
            }), 400
            
        image_file = request.files['image']
        
        image_bytes = image_file.read()
        
        try:
            rows = extract_text_rows(image_bytes)
        except Exception as e:
            return jsonify({
                'error': f'Text extraction failed: {str(e)}'
            }), 400
            
        results = process_invoices(rows)
        
        if not results:
            return jsonify({
                'error': 'Failed to process receipt or no items found'
            }), 400
            
        return jsonify(results)
        
    except Exception as e:
        return jsonify({
            'error': f'Unexpected error: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)