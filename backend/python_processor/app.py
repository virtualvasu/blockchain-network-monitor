from quart import Quart, jsonify
from data_processor import fetch_data, process_data
from quart_cors import cors

app = Quart(__name__)
app = cors(app, allow_origin="*")

@app.route('/processed_data', methods=['GET'])
async def get_processed_data():
    try:
        print("✅ Request received: Fetching and processing data...")

        # Fetch raw data and process it properly
        raw_data = await fetch_data()
        processed_data = await process_data(raw_data)

        # Return clean JSON response with a success status
        return jsonify({"status": "success", "data": processed_data})

    except Exception as e:
        # Handle errors gracefully
        print(f"❌ Error processing data: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
