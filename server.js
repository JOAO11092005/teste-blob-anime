// server.js ATUALIZADO
const express = require('express');
const fetch = require('node-fetch');
const path = require('path'); // NOVO: Módulo para lidar com caminhos de arquivos
const app = express();

// A porta é fornecida pela Render, ou usamos 3000 localmente
const port = process.env.PORT || 3000; 

// Rota do proxy (continua igual)
app.get('/video-proxy', async (req, res) => {
    try {
        const videoUrl = 'https://animeflix.blog/Animes/Letra-K/Kaijuu%208-gou/Dub/01.mp4';
        const response = await fetch(videoUrl);

        if (!response.ok) {
            throw new Error(`Erro no servidor de origem: ${response.statusText}`);
        }
        
        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Content-Length', response.headers.get('content-length'));
        response.body.pipe(res);

    } catch (error) {
        console.error("Erro no proxy:", error);
        res.status(500).send("Erro ao buscar o vídeo via proxy.");
    }
});

// NOVO: Rota principal para servir o arquivo HTML
// Quando alguém acessar a URL raiz ('/'), nós enviamos o arquivo teste.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'teste.html'));
});

app.listen(port, () => {
    // A mensagem do console foi um pouco simplificada
    console.log(`Servidor rodando na porta ${port}`);
});