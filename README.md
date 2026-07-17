# AskCUI — COMSATS University Islamabad Admission AI Assistant

A modern, AI-powered admission assistant for COMSATS University Islamabad (Wah Campus). Built with React + Vite. Answers student queries about programs, fees, eligibility, prerequisites, scholarships, and more — using only official CUI data stored in local JSON files.

## Features

- 🤖 **AI Chat** — ChatGPT-style interface powered by Google Gemini
- 📚 **Knowledge Base** — Programs, Fees, Eligibility, Prerequisites, Scholarships, FAQs
- 🎓 **Category Explorer** — Browse NAT/GAT test categories, MS/PhD prerequisites, admission schedules
- 🌙 **Dark / Light Mode**
- 🔍 **Global Search** (Ctrl+K)
- 📱 **Mobile Responsive**
- 💾 **Conversation History** (localStorage)

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion
- Lucide Icons
- Google Gemini API (gemini-2.0-flash-lite)

## Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Get a free API key at: https://console.cloud.google.com/apis/credentials
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Deployment

```bash
npm run build
```
Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

## Data

All admission information is stored in `src/data/`:
- `programs.json` — BS, MS, PhD programs
- `fees.json` — Semester fees, refund policy
- `eligibility.json` — NAT/GAT categories, admission criteria
- `prerequisites.json` — BS, MS, PhD entry requirements
- `scholarships.json` — Merit and need-based scholarships
- `faqs.json` — Frequently asked questions

---

**COMSATS University Islamabad — Wah Campus**
