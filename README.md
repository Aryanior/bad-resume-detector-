# Is Your Resume Poopy?

A brutally honest AI-powered resume analyzer that roasts your resume, gives actionable feedback, and estimates your chances of getting hired.

---

## Overview

This project analyzes resumes using AI and provides:

* A sarcastic, Gen-Z style roast
* Actionable improvement suggestions
* An ATS-style score (out of 10)
* A rejection risk breakdown by resume sections
* A final verdict on whether you're getting the job

Built as a fun yet insightful tool to help users improve their resumes.

---

## Features

* Resume upload (PDF)
* AI-powered analysis using Groq (LLaMA model)
* Resume parsing via PDF.co API
* Animated and interactive UI
* Dynamic score visualization
* Section-wise rejection risk graph
* Verdict system based on ATS score

---

## Tech Stack

**Frontend**

* Next.js (App Router)
* React
* Tailwind CSS
* Recharts

**Backend**

* Next.js API Routes
* Groq SDK (AI analysis)
* PDF.co API (PDF to text conversion)

---

## How It Works

1. User uploads a resume (PDF)
2. File is sent to backend
3. PDF is converted to text via PDF.co
4. Text is analyzed using AI (Groq LLaMA model)
5. AI returns:

   * Roast
   * Suggestions
   * Score
   * Section analysis
6. Frontend displays results with animations and charts

---

## Environment Variables

Create a `.env.local` file in the root directory:

```
GROQ_API_KEY=your_groq_api_key
PDF_API_KEY=your_pdfco_api_key
```

---

## Installation

Clone the repository:

```
git clone https://github.com/yourusername/bad-resume-detector.git
cd bad-resume-detector
```

Install dependencies:

```
npm install
```

Run locally:

```
npm run dev
```

---

## Deployment

Deployed using Vercel.

Steps:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## Project Structure

```
app/
  api/roast/route.js   # Backend logic (AI + PDF processing)
  page.tsx             # Frontend UI
  layout.tsx           # Layout

public/                # Static assets
```

---

## Future Improvements

* Job description matching (real ATS simulation)
* More accurate scoring algorithm (logic + AI hybrid)
* Shareable results
* Resume templates
* User history

---

## Disclaimer

This tool is for entertainment and guidance purposes.
It does not guarantee actual hiring outcomes.

---

## Author

Aryan Mathuriya
AI & Data Science Student

---

## License

This project is open-source and available under the MIT License.
