// api/video-proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Pega a URL do vídeo do parâmetro de consulta 'url'
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send("Erro: Parâmetro 'url' do vídeo não fornecido.");
  }

  try {
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error(`Erro no servidor de origem: ${response.status} ${response.statusText}`);
    }

    // Copia os cabeçalhos importantes do vídeo original para a nossa resposta
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Content-Length', response.headers.get('content-length'));
    res.setHeader('Accept-Ranges', response.headers.get('accept-ranges')); // Importante para busca (seeking)

    // Envia o corpo do vídeo (os dados) diretamente para o navegador
    response.body.pipe(res);

  } catch (error) {
    console.error("Erro no proxy:", error);
    res.status(500).send(`Erro ao buscar o vídeo via proxy: ${error.message}`);
  }
};