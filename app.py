from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# 配置共享目录（可修改为你想共享的路径）
SHARED_DIR = "/home/ubuntu/files"  # 建议提前创建此目录

# 确保目录存在
os.makedirs(SHARED_DIR, exist_ok=True)

# 根路径：列出文件和目录
@app.route('/api/files', methods=['GET'])
def list_files():
    path = request.args.get('path', '')
    full_path = os.path.join(SHARED_DIR, path)
    full_path = os.path.abspath(full_path)

    # 安全检查：防止路径穿越
    if not full_path.startswith(SHARED_DIR):
        return jsonify({"error": "Access denied"}), 403

    if not os.path.exists(full_path):
        return jsonify({"error": "Path not found"}), 404

    if not os.path.isdir(full_path):
        return jsonify({"error": "Not a directory"}), 400

    items = []
    for item in os.listdir(full_path):
        item_path = os.path.join(full_path, item)
        stat = os.stat(item_path)
        items.append({
            "name": item,
            "is_dir": os.path.isdir(item_path),
            "size": stat.st_size,
            "modified": stat.st_mtime
        })

    return jsonify({
        "path": os.path.relpath(full_path, SHARED_DIR),
        "files": items
    })

# 下载文件
@app.route('/api/download', methods=['GET'])
def download_file():
    path = request.args.get('path', '')
    full_path = os.path.join(SHARED_DIR, path)
    full_path = os.path.abspath(full_path)

    if not full_path.startswith(SHARED_DIR):
        return jsonify({"error": "Access denied"}), 403

    if not os.path.exists(full_path):
        return jsonify({"error": "File not found"}), 404

    if os.path.isdir(full_path):
        return jsonify({"error": "Cannot download a directory"}), 400

    directory = os.path.dirname(full_path)
    filename = os.path.basename(full_path)
    return send_from_directory(directory, filename, as_attachment=True)

# 上传文件
@app.route('/api/upload', methods=['POST'])
def upload_file():
    path = request.form.get('path', '')
    full_path = os.path.join(SHARED_DIR, path)
    full_path = os.path.abspath(full_path)

    if not full_path.startswith(SHARED_DIR):
        return jsonify({"error": "Access denied"}), 403

    if not os.path.exists(full_path):
        # 如果路径是目录，直接使用；否则视为文件名
        if not os.path.exists(os.path.dirname(full_path)):
            return jsonify({"error": "Target directory does not exist"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # 构造保存路径
    save_path = os.path.join(full_path, file.filename) if os.path.isdir(full_path) else full_path

    try:
        file.save(save_path)
        return jsonify({"message": "File uploaded successfully", "saved_to": save_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 启动服务
if __name__ == '__main__':
    print(f"Shared directory: {SHARED_DIR}")
    app.run(host='0.0.0.0', port=5000)
