from flask import Flask, request, jsonify
import whisper
import os
import tempfile

# 創建 Flask 應用
app = Flask(__name__)

# 載入 Whisper 模型
model = whisper.load_model("base")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400
    
    # 生成臨時文件
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        file.save(temp_file.name)
        
        # 使用 Whisper 進行轉錄
        audio = whisper.load_audio(temp_file.name)
        audio = whisper.pad_or_trim(audio)
        mel = whisper.log_mel_spectrogram(audio).to(model.device)
        _, probs = model.detect_language(mel)
        detected_language = max(probs, key=probs.get)
        
        options = whisper.DecodingOptions()
        result = whisper.decode(model, mel, options)
        text = result.text

        # 刪除臨時文件
        os.remove(temp_file.name)

        return jsonify({"status": "success", "text": text, "language": detected_language})

if __name__ == '__main__':
    app.run(debug=True,port=5000)
