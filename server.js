const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const cors = require("cors");
const axios = require("axios");

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors({ origin: "https://jstec1.github.io" }));
const upload = multer();

// Função para atualizar o grade01.html no GitHub
async function atualizarGradeHTML(novaUrl) {
  const token = process.env.GITHUB_TOKEN; // Token pessoal do GitHub
  const repo = "JSTec1/Capaocanoapanobianco";
  const path = "grade01.html";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    console.log("🔄 Buscando conteúdo atual do grade01.html...");
    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const conteudoAtual = Buffer.from(data.content, "base64").toString("utf-8");

    console.log("🔍 Substituindo URL antiga pela nova...");
    const novoConteudo = conteudoAtual.replace(
      /https:\/\/res\.cloudinary\.com\/[^"]+\/image\/upload\/[^"]+\/NFT\.jpg/g,
      novaUrl
    );

    if (novoConteudo === conteudoAtual) {
      console.warn(
        "⚠️ Nenhuma alteração detectada no conteúdo. Verifique o padrão da URL."
      );
      return;
    }

    console.log("📤 Enviando atualização para o GitHub...");
    const resposta = await axios.put(
      apiUrl,
      {
        message: "Atualiza link da imagem NFT.jpg com nova URL do Cloudinary",
        content: Buffer.from(novoConteudo).toString("base64"),
        sha: data.sha,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log("✅ grade01.html atualizado com sucesso!");
    return resposta.data;
  } catch (erro) {
    console.error("❌ Erro ao atualizar grade01.html:", erro.message);
    throw erro;
  }
}

// Endpoint de upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) throw new Error("Arquivo não enviado");

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: "denouonoc/grade/NFT",
            overwrite: true,
            resource_type: "image",
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
    console.log("🖼️ Upload concluído. URL da imagem:", result.secure_url);

    // Atualiza grade01.html com a nova URL
    await atualizarGradeHTML(result.secure_url);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Erro no upload:", err);
    res.status(500).json({ error: err.message });
  }
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error("Middleware de erro:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);
