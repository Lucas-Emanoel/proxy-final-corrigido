// Arquivo: /api/proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    res.setHeader('Content-Type', videoResponse.headers.get('content-type'));
    res.setHeader('Content-Length', videoResponse.headers.get('content-length'));
    res.setHeader('Accept-Ranges', 'bytes');
    
    res.status(videoResponse.status);
    videoResponse.body.pipe(res);

  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).send('Erro interno no servidor de proxy.');
  }
};
