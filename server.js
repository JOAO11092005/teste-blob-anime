// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000; // Você pode usar a porta que quiser

// Servir os arquivos estáticos da pasta 'public' (onde está o player.html)
app.use(express.static('public'));

// Aqui está a sua API de proxy, agora dentro do Express
app.get('/api/video-proxy', async (req, res) => {
    // IMPORTANTE: O URL do vídeo deve vir da requisição, não ser fixo!
    const videoUrl = req.query.url; 

    if (!videoUrl) {
        return res.status(400).send("Erro: O parâmetro 'url' do vídeo é obrigatório.");
    }

    try {
        // Medida de segurança simples: só permitir proxy para o domínio do animeflix
        if (!videoUrl.startsWith('https://animeflix.blog/')) {
             return res.status(403).send("Proxy não permitido para este domínio.");
        }

        const response = await fetch(videoUrl, {
            headers: { 'Referer': 'https://animeflix.blog/' } // Alguns servidores exigem o Referer
        });

        if (!response.ok) {
            throw new Error(`Erro no servidor de origem: ${response.status} ${response.statusText}`);
        }

        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Content-Length', response.headers.get('content-length'));
        res.setHeader('Accept-Ranges', 'bytes'); // Importante para streaming e busca no vídeo

        response.body.pipe(res);

    } catch (error) {
        console.error("Erro no proxy:", error);
        res.status(500).send(`Erro ao buscar o vídeo via proxy: ${error.message}`);
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse o player em http://localhost:${PORT}/player.html`);
});