from flask import Flask, request, jsonify
from flask_cors import CORS
from receipt_ocr import extract_text_rows
from receipt_llama import process_invoices
from oai import process_receipt_oai

app = Flask(__name__)
CORS(app)

@app.route('/api/local/process-receipt', methods=['POST'])
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
            app.logger.info('Got %s rows', len(rows))

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

@app.route('/api/gpt/process-receipt', methods=['POST'])
def process_receipt_gpt():
    try:
        # Check if an image is provided in the request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        # Read the image file bytes
        image_file = request.files['image']
        image_bytes = image_file.read()

        # Call the process_receipt function with the image bytes
        try:
            parsed_response = process_receipt_oai(image_bytes)
            if not parsed_response or not parsed_response.items:
                return jsonify({'error': 'Failed to process receipt or no items found'}), 400

            app.logger.info('Processed receipt with %s items', len(parsed_response.items))

        except Exception as e:
            return jsonify({'error': f'Text extraction or processing failed: {str(e)}'}), 400

        # Convert parsed response to dictionary for JSON serialization
        results = [item.dict() for item in parsed_response.items]
        return jsonify(results)

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
if __name__ == '__main__':
    app.run(port=8000, debug=True)