// File: api/generate.js
export default async function handler(req, res) {
  // 1. Enable CORS so your website can talk to this server
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // SECURITY NOTE: Later, change '*' to 'https://www.ymk.digital'
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle the "Options" pre-flight check (browsers do this automatically)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Get the data from your frontend
  const { niche, keywords } = req.body;

  // 4. Get your secret key from the server environment
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server Error: API Key Missing' });
  }

  // 5. Construct the Prompt
  const prompt = `You are an SMB Growth Consultant. Generate 5 high-intent blog post ideas for the niche "${niche}" focusing on "${keywords}". 
  Return ONLY a JSON array. Each item must have: "topicTitle" and "contentBrief".`;

  try {
    // 6. Call Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // 7. Send the data back to your website
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
