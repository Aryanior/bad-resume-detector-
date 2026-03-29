import Groq from "groq-sdk";

export async function POST(req) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const formData = await req.formData();
    const file = formData.get("file");

    // 🔹 STEP 1: upload file to PDF.co
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const uploadRes = await fetch("https://api.pdf.co/v1/file/upload", {
      method: "POST",
      headers: {
        "x-api-key": process.env.PDF_API_KEY,
      },
      body: uploadForm,
    });

    const uploadData = await uploadRes.json();

    if (!uploadData.url) {
      throw new Error("upload failed bro 💀");
    }

    // 🔹 STEP 2: convert uploaded PDF → text
    const pdfRes = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
      method: "POST",
      headers: {
        "x-api-key": process.env.PDF_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: uploadData.url,
      }),
    });

    const pdfData = await pdfRes.json();

    if (!pdfData.url) {
      throw new Error("conversion failed bro 💀");
    }

    // 🔹 STEP 3: fetch actual text content
    const textRes = await fetch(pdfData.url);
    const resumeTextRaw = await textRes.text();

    // 🔹 limit size (important for better AI output)
    const resumeText = resumeTextRaw.slice(0, 4000);

    // 🔹 random style to avoid repetition
    const styles = [
      "roast like a toxic Twitter user",
      "roast like a disappointed recruiter",
      "roast like a sarcastic friend",
      "roast like a brutally honest senior",
    ];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    // 🔹 STEP 4: AI CALL (IMPROVED PROMPT)
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `
You are a chaotic, unpredictable Gen Z resume roaster.

STYLE:
${randomStyle}

CRITICAL RULES:
- Every response MUST feel completely different
- DO NOT repeat phrases like "buzzwords", "copied", "mid"
- Be savage, funny, slightly offensive

GROUNDING:
- You MUST mention actual content from the resume
- Quote real words/phrases from it
- No generic advice

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "score": number (0-10),
  "roast": "multi-line roast (6-10 lines, very creative)",
  "suggestions": ["specific improvements"],
  "sections": [
    { "name": "section name", "rejection": number (0-100) }
  ]
}

RULES:
- Detect sections dynamically
- Score realistically (bad = 2–5, avg = 5–7, good = 7–9)
- Suggestions must be based on actual resume

Resume:
${resumeText}
`,
        },
      ],
    });

    const aiText = response.choices[0].message.content;

    // 🔹 STEP 5: SAFE JSON PARSING
    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      const match = aiText.match(/\{[\s\S]*\}/);

      if (match) {
        let cleaned = match[0]
          .replace(/[\n\r\t]/g, " ")
          .replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

        try {
          parsed = JSON.parse(cleaned);
        } catch (e) {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      throw new Error("AI JSON parsing failed 💀");
    }

    // 🔹 STEP 6: ADD SLIGHT SCORE VARIATION + ROUNDING
    parsed.score = Math.min(
      10,
      Math.max(
        1,
        Number((parsed.score + (Math.random() * 1 - 0.5)).toFixed(2))
      )
    );

    // 🔹 FINAL RESPONSE
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}