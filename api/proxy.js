// Arquivo: /api/proxy.js
// VERSÃO SIMPLIFICADA SEM DEPENDÊNCIAS EXTERNAS

export default async function handler(req, res) {
  // Adiciona os cabeçalhos CORS para permitir que seu app acesse o proxy.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');

  // Responde à requisição de "sondagem" do navegador.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pega a URL do parâmetro 'url'.
  const { searchParams } = new URL(req.url, `https://placeholder.com` );
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return res.status(400).send('Erro: O parâmetro "url" é obrigatório.');
  }

  try {
    // Usa o fetch nativo do ambiente Node.js
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
    // ReadableStream.fromWeb está disponível em Node.js v16.5+
    return videoResponse.body.pipeTo(res);

  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).send('Erro interno no servidor de proxy.');
  }
}
