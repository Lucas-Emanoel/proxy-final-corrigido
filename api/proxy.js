// Arquivo: /api/proxy.js
// VERSÃO FINAL E CORRETA - Usando a sintaxe mais compatível

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Adiciona os cabeçalhos CORS para permitir que seu app acesse o proxy.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');

  // Responde à requisição de "sondagem" do navegador.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pega a URL do parâmetro 'url'.
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send('Erro: O parâmetro "url" é obrigatório.');
  }

  try {
    const videoResponse = await fetch(videoUrl, {
      headers: {
        'Range': req.headers.range || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Repassa os cabeçalhos da resposta original
    res.setHeader('Content-Type', videoResponse.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Content-Length', videoResponse.headers.get('content-length') || '0');
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Envia o status e o corpo da resposta
    res.status(videoResponse.status);
    videoResponse.body.pipe(res);

  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).send('Erro interno no servidor de proxy.');
  }
};
