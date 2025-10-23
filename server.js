const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const cors = require("cors");

// Configuração do Cloudinary usando variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
console.log("🔍 Verificando variáveis de ambiente:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

// CORS para permitir requisições do GitHub Pages
app.use(cors({ origin: "https://jstec1.github.io" }));

// Multer para lidar com upload de arquivos
const upload = multer();

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) throw new Error("Arquivo não enviado");

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: "denouonoc/grade/NFT",
            overwrite: true,
            resource_type: "image"
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Erro no upload:", err);
    res.status(500).json({ error: err.message });
  }
});

// Middleware para capturar qualquer erro não tratado
app.use((err, req, res, next) => {
  console.error("Middleware de erro:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);
