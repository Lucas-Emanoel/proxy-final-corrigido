// Arquivo: /api/proxy.js
// VERSÃO MAIS SIMPLES POSSÍVEL

module.exports = async (req, res) => {
  // Adiciona os cabeçalhos CORS.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');

  // Responde à requisição de "sondagem".
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pega a URL do parâmetro.
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send('Erro: O parâmetro "url" é obrigatório.');
  }

  try {
    // Usa o fetch global do ambiente da Vercel.
    const videoResponse = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
        'Referer': videoUrl // Usa a própria URL como referer.
      }
    });

    // Repassa os cabeçalhos da resposta original.
    res.setHeader('Content-Type', videoResponse.headers.get('content-type') || 'application/octet-stream');
    
    // Envia o status e o corpo da resposta.
    res.status(videoResponse.status);
    // A forma mais segura de fazer o pipe do stream.
    const body = await videoResponse.arrayBuffer();
    res.end(Buffer.from(body));

  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).send(`Erro interno no servidor de proxy: ${error.message}`);
  }
};
