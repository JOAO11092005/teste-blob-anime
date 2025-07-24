// api/video-proxy.js

// Usando o node-fetch@2 que acabamos de instalar.
const fetch = require('node-fetch');

// Esta é a nossa função serverless.
module.exports = async (req, res) => {
  try {
    // 1. PEGAR O PARÂMETRO CORRETO: A URL do player usa '?video='
    const b64VideoUrl = req.query.video;

    // 2. VERIFICAR SE O PARÂMETRO EXISTE
    if (!b64VideoUrl) {
      // Se não existir, enviamos uma resposta de erro clara.
      return res.status(400).send("Erro: Parâmetro 'video' (codificado em base64) não encontrado na URL.");
    }

    // 3. DECODIFICAR A URL de Base64 para texto normal
    const videoUrl = Buffer.from(b64VideoUrl, 'base64').toString('ascii');

    // Medida de segurança: Opcional mas recomendado. Só permitir o domínio que você usa.
    if (!videoUrl.startsWith('https://animeflix.blog/')) {
      return res.status(403).send("Proxy não permitido para este domínio.");
    }

    // 4. FAZER A REQUISIÇÃO PARA O SERVIDOR DO VÍDEO
    const response = await fetch(videoUrl, {
      headers: {
        // Alguns servidores de vídeo bloqueiam requisições sem um 'Referer'.
        // Isso simula que a requisição está vindo do site original.
        'Referer': 'https://animeflix.blog/'
      }
    });

    // Se a resposta do servidor de vídeo não for OK (ex: 404, 500)
    if (!response.ok) {
      throw new Error(`Servidor de origem respondeu com erro: ${response.status} ${response.statusText}`);
    }

    // 5. ENVIAR A RESPOSTA DE VOLTA PARA O PLAYER
    // Copiamos os cabeçalhos importantes (tipo de conteúdo, tamanho) do vídeo original
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Content-Length', response.headers.get('content-length'));
    res.setHeader('Accept-Ranges', 'bytes'); // Essencial para o player poder "buscar" partes do vídeo

    // Enviamos o corpo do vídeo (os dados) diretamente para o navegador do usuário
    response.body.pipe(res);

  } catch (error) {
    // 6. LIDAR COM ERROS
    // Se qualquer coisa no bloco 'try' der errado, o 'catch' é executado.
    console.error("Erro no proxy de vídeo:", error);
    // Enviamos uma resposta de erro clara. Isso evita o timeout e o erro 502.
    res.status(500).send(`Erro interno no proxy: ${error.message}`);
  }
};