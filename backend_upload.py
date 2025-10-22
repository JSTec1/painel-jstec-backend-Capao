from flask import Flask, request, jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import requests
import base64
import re
import time

app = Flask(__name__)
CORS(app)

# Configuração do Cloudinary
cloudinary.config(
    cloud_name='denouonoc',
    api_key='447492323831951',
    api_secret='GxkTFRSZDH5xEc-ruxYF7uAdUXE',
    secure=True
)

# Configuração do GitHub
import os
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_OWNER = 'JSTec1'
REPO_NAME = 'Capaocanoapanobianco'
FILE_PATH = 'grade01.html'
COMMIT_MESSAGE = 'Atualizando link da imagem NFT automaticamente via painel'

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Nenhuma imagem enviada.'}), 400

    image_file = request.files['image']

    try:
        # Upload da imagem para o Cloudinary
        result = cloudinary.uploader.upload(
            image_file,
            folder='denouonoc/grade',
            public_id='NFT',
            overwrite=True,
            use_filename=True,
            unique_filename=False
        )
        new_image_url = result['secure_url']

        # Adiciona parâmetro de versão para forçar atualização no navegador
        version = int(time.time())
        new_image_url_with_version = f"{new_image_url}?v={version}"

        # Obter conteúdo atual do arquivo grade01.html no GitHub
        headers = {
            'Authorization': f'token {GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3+json'
        }
        file_url = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}'
        response = requests.get(file_url, headers=headers)
        if response.status_code != 200:
            return jsonify({'error': 'Erro ao acessar o arquivo no GitHub.'}), 500

        file_data = response.json()
        sha = file_data['sha']
        content_encoded = file_data['content']
        content_decoded = base64.b64decode(content_encoded).decode('utf-8')

        # Substituir o link antigo da imagem NFT.jpg/png/webp pelo novo link com versão
        updated_content = re.sub(
            r'src="[^"]*NFT\.(jpg|png|webp)(\?v=\d+)?\"',
            f'src="{new_image_url_with_version}"',
            content_decoded
        )

        # Atualizar o arquivo no GitHub
        update_payload = {
            'message': COMMIT_MESSAGE,
            'content': base64.b64encode(updated_content.encode('utf-8')).decode('utf-8'),
            'sha': sha
        }
        update_response = requests.put(file_url, headers=headers, json=update_payload)
        if update_response.status_code != 200:
            return jsonify({'error': 'Erro ao atualizar o arquivo no GitHub.'}), 500

        return jsonify({'url': new_image_url_with_version, 'github_update': 'Arquivo atualizado com sucesso.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)