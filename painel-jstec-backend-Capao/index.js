const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const cors = require("cors");
const { Octokit } = require("@octokit/rest");

// Configuração do Cloudinary
console.log("Variáveis de ambiente:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(cors({ origin: "*" }));

const upload = multer();

// Configuração do GitHub
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const REPO_OWNER = "JSTec1";
const REPO_NAME = "Capaocanoapanobianco";
const FILE_PATH = "grade01.html";
const COMMIT_MESSAGE = "Atualiza imagem da grade com novo link e timestamp";

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) throw new Error("Arquivo não enviado");

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "denouonoc/grade" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    console.log("Upload concluído:", result.secure_url);

    // 🔧 Atualiza o grade01.html no GitHub
    const imagemUrl = result.secure_url;
    const timestamp = Date.now();
    const novoLink = `${imagemUrl}?v=${timestamp}`;

    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
    });

    const conteudoAtual = Buffer.from(fileData.content, "base64").toString("utf-8");

    const novoConteudo = conteudoAtual.replace(
      /https:\/\/res\.cloudinary\.com\/[^"]+NFT\.(jpg|png|webp)\?v=\d+/g,
      novoLink
    );

    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
      message: COMMIT_MESSAGE,
      content: Buffer.from(novoConteudo).toString("base64"),
      sha: fileData.sha,
    });

    console.log("✅ grade01.html atualizado com novo link.");
    res.json({ success: true, url: novoLink });

  } catch (err) {
    console.error("Erro no upload:", err);
    res.status(500).json({ error: err.message });
  }
});

// Porta padrão do Render ou 5000 localmente
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
