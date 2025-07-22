// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000; // Nosso proxy vai rodar na porta 3000

app.get('/video-proxy', async (req, res) => {
    try {
        // A URL real do vídeo que queremos buscar
        const videoUrl = 'https://animeflix.blog/Animes/Letra-K/Kaijuu%208-gou/Dub/01.mp4';

        console.log(`Recebido pedido para o proxy. Buscando vídeo em: ${videoUrl}`);

        const response = await fetch(videoUrl);

        if (!response.ok) {
            throw new Error(`Erro no servidor de origem: ${response.statusText}`);
        }

        // Repassa os cabeçalhos importantes (como o tamanho do conteúdo) para o cliente
        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Content-Length', response.headers.get('content-length'));

        // Envia o corpo da resposta (o vídeo) para o navegador
        response.body.pipe(res);

    } catch (error) {
        console.error("Erro no proxy:", error);
        res.status(500).send("Erro ao buscar o vídeo via proxy.");
    }
});

// Isso serve o seu arquivo HTML principal
app.use(express.static('.')); 

app.listen(port, () => {
    console.log(`Servidor proxy rodando em http://localhost:${port}`);
    console.log(`Acesse seu player em http://localhost:${port}/teste.html`);
});