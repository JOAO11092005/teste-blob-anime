// api/video-proxy.js
const fetch = require('node-fetch');

// Esta é uma Função Serverless. Ela recebe o pedido (req) e a resposta (res).
module.exports = async (req, res) => {
  try {
    const videoUrl = 'https://animeflix.blog/Animes/Letra-K/Kaijuu%208-gou/Dub/03.mp4';
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error(`Erro no servidor de origem: ${response.statusText}`);
    }

    // Copiamos os cabeçalhos importantes do vídeo original para a nossa resposta
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Content-Length', response.headers.get('content-length'));

    // E enviamos o corpo do vídeo (os dados) diretamente para o navegador
    response.body.pipe(res);

  } catch (error) {
    console.error("Erro no proxy:", error);
    res.status(500).send("Erro ao buscar o vídeo via proxy.");
  }
};