import programsData from '../data/programs.json';
import feesData from '../data/fees.json';
import eligibilityData from '../data/eligibility.json';
import prerequisitesData from '../data/prerequisites.json';
import scholarshipsData from '../data/scholarships.json';
import faqsData from '../data/faqs.json';

// Helper to determine relevant JSON files and load their content
export function getRelevantContext(query, selectedCategory = 'All') {
  const sourcesUsed = [];
  let contextParts = [];

  const lowerQuery = query.toLowerCase();

  // 1. Check Programs
  const hasProgramsKeywords = lowerQuery.match(/(program|course|degree|major|bs|ms|phd|computer science|software|engineering|bba|psychology|linguistics|mathematics|offer)/);
  if (selectedCategory === 'Programs' || hasProgramsKeywords) {
    contextParts.push(`### Programs Offered:\n${JSON.stringify(programsData, null, 2)}`);
    sourcesUsed.push('programs.json');
  }

  // 2. Check Fees
  const hasFeesKeywords = lowerQuery.match(/(fee|cost|charge|dues|challan|refund|installment|payment|pay|security|tuition)/);
  if (selectedCategory === 'Fees' || hasFeesKeywords) {
    contextParts.push(`### Fee Structure & Refund Policy:\n${JSON.stringify(feesData, null, 2)}`);
    sourcesUsed.push('fees.json');
  }

  // 3. Check Eligibility
  const hasEligibilityKeywords = lowerQuery.match(
    /(eligible|eligibility|criteria|percentage|marks|cgpa|gpa|matric|fsc|a-level|o-level|supply|supplementary|result awaiting|improve|equivalence|ibcc|division|3rd division|nat|nat-ie|nat-im|nat-ics|nat-icom|nat-ia|nat-igs|gat|gat-a|gat-b|gat-c|gat-d|gat general|gat subject|gre|phd test|entry test|interview|test validity|test format|subject test|remedial|deficiency|acca|pre-medical|pre-engineering)/
  );
  if (selectedCategory === 'Eligibility' || hasEligibilityKeywords) {
    contextParts.push(`### Eligibility Criteria:\n${JSON.stringify(eligibilityData, null, 2)}`);
    sourcesUsed.push('eligibility.json');
  }

  // 4. Check Prerequisites
  const hasPrerequisitesKeywords = lowerQuery.match(/(prerequisite|pre-requisite|background|ics|pre-medical|pre-engineering|icom|dae|additional math|biology|nat category|which nat|which gat)/);
  if (selectedCategory === 'Prerequisites' || hasPrerequisitesKeywords) {
    contextParts.push(`### Program Prerequisites:\n${JSON.stringify(prerequisitesData, null, 2)}`);
    sourcesUsed.push('prerequisites.json');
  }

  // 5. Check Scholarships
  const hasScholarshipsKeywords = lowerQuery.match(/(scholarship|financial aid|need-based|peef|endowment|merit scholarship|academic excellence)/);
  if (selectedCategory === 'Scholarships' || hasScholarshipsKeywords) {
    contextParts.push(`### Scholarships & Financial Aid:\n${JSON.stringify(scholarshipsData, null, 2)}`);
    sourcesUsed.push('scholarships.json');
  }

  // 6. Hostel & Transport — dedicated keyword trigger
  const hasHostelTransportKeywords = lowerQuery.match(/(hostel|transport|bus|route|accommodation|room|mess|warden|pick.?up|drop.?off|travel|commute|timing|shuttle|van|vehicle|35k|55k|security deposit)/);
  if (selectedCategory === 'Hostel & Transport' || hasHostelTransportKeywords) {
    const hostelFaqs = faqsData.filter(f => f.category === 'Hostel & Transport');
    if (hostelFaqs.length > 0) {
      contextParts.push(`### Hostel & Transport (CUI Wah Campus Specific):\n${JSON.stringify(hostelFaqs, null, 2)}`);
      if (!sourcesUsed.includes('faqs.json')) sourcesUsed.push('faqs.json');
    }
  }

  // 7. General FAQ matching
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 3);
  let relevantFaqs = faqsData;

  if (selectedCategory !== 'All' && selectedCategory !== 'FAQs') {
    // Partial match to handle 'Hostel & Transport' and similar
    relevantFaqs = faqsData.filter(faq =>
      faq.category.toLowerCase() === selectedCategory.toLowerCase() ||
      faq.category.toLowerCase().replace(' & ', ' ').includes(selectedCategory.toLowerCase().replace(' & ', ''))
    );
  } else if (queryWords.length > 0) {
    relevantFaqs = faqsData.filter(faq => {
      return queryWords.some(word =>
        faq.question.toLowerCase().includes(word) ||
        faq.answer.toLowerCase().includes(word)
      );
    });
  }

  if (relevantFaqs.length === 0) {
    relevantFaqs = faqsData.slice(0, 10);
  } else {
    relevantFaqs = relevantFaqs.slice(0, 30);
  }

  contextParts.push(`### Relevant FAQs:\n${JSON.stringify(relevantFaqs, null, 2)}`);
  if (!sourcesUsed.includes('faqs.json')) sourcesUsed.push('faqs.json');

  return {
    context: contextParts.join('\n\n'),
    sources: sourcesUsed
  };
}

export async function askAI({ provider, apiKey, model, query, category, chatHistory = [] }) {
  const { context, sources } = getRelevantContext(query, category);

  const systemPrompt = `You are the official AI Admission Assistant for COMSATS University Islamabad (CUI) Wah Campus ONLY.
Your ONLY job is to answer questions using the specific CUI Wah Campus JSON data provided below.

CRITICAL RULES:
1. ALWAYS use the provided JSON context. It contains specific, accurate CUI Wah Campus data — fees in Rs., hostel details, transport routes, merit cutoffs, timings, etc.
2. NEVER give generic or vague answers like "contact the admission office" if the specific answer is in the context.
3. When hostel/transport data is available, state the exact fee (Rs. 55,000 hostel, Rs. 35,000 transport), room types, routes, timings, etc.
4. If the answer is truly not in the context, respond: "I couldn't find this information in the knowledge base."
5. Use clear markdown: bold headings, bullet points, numbered steps.
6. Output ONLY valid JSON:
{
  "answer": "Your detailed markdown answer with specific figures.",
  "sources": ["list of source files used"]
}

CUI WAH CAMPUS DATA:
${context}`;


  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  // Add conversation history (up to last 6 messages) for context
  const recentHistory = chatHistory.slice(-6);
  recentHistory.forEach(msg => {
    if (msg.sender === 'user') {
      messages.push({ role: 'user', content: msg.text });
    } else {
      // In history, LLM response might be JSON or parsed text, send the text part
      const textVal = typeof msg.text === 'string' ? msg.text : msg.text.answer;
      messages.push({ role: 'assistant', content: textVal });
    }
  });

  // Add current user query
  messages.push({ role: 'user', content: query });

  try {
    return await callSingleProvider(provider, apiKey, model, messages);
  } catch (primaryError) {
    console.warn(`Primary provider (${provider}) failed. Attempting automatic fallback... Error:`, primaryError.message);

    // Fallback options loaded from environment
    const envGroq = import.meta.env.VITE_GROQ_API_KEY || '';
    const envCohere = import.meta.env.VITE_COHERE_API_KEY || '';
    const envOpenRouter = import.meta.env.VITE_OPENROUTER_API_KEY || '';

    // List of candidates to try if primary provider fails
    const candidates = [];
    if (envGroq && provider !== 'groq') {
      candidates.push({ provider: 'groq', key: envGroq, model: 'llama-3.3-70b-versatile' });
    }
    if (envCohere && provider !== 'cohere') {
      candidates.push({ provider: 'cohere', key: envCohere, model: 'command-a-plus-05-2026' });
    }
    if (envOpenRouter && provider !== 'openrouter') {
      candidates.push({ provider: 'openrouter', key: envOpenRouter, model: 'meta-llama/llama-3.3-70b-instruct:free' });
    }

    // Attempt fallbacks sequentially
    for (const candidate of candidates) {
      try {
        console.log(`Fallback: Trying ${candidate.provider} with model ${candidate.model}...`);
        const result = await callSingleProvider(candidate.provider, candidate.key, candidate.model, messages);
        if (result && result.answer) {
          result.answer += `\n\n*— Response served via fallback provider (${
            candidate.provider === 'cohere' 
              ? 'Cohere' 
              : candidate.provider === 'openrouter' 
              ? 'OpenRouter' 
              : 'Groq'
          }) due to temporary rate limits on the primary provider.*`;
        }
        return result;
      } catch (fallbackError) {
        console.warn(`Fallback to ${candidate.provider} failed:`, fallbackError.message);
      }
    }

    // All candidates failed or were unconfigured
    return {
      answer: `Error communicating with ${provider.toUpperCase()} API: ${primaryError.message}. (Temporary rate limit reached; fallback providers were also exhausted or unconfigured).`,
      sources: []
    };
  }
}

// Single provider request execution helper
async function callSingleProvider(prov, key, mdl, messages) {
  let url = '';
  if (prov === 'groq') {
    url = 'https://api.groq.com/openai/v1/chat/completions';
  } else if (prov === 'cohere') {
    url = 'https://api.cohere.ai/compatibility/v1/chat/completions';
  } else if (prov === 'openrouter') {
    url = 'https://openrouter.ai/api/v1/chat/completions';
  } else if (prov === 'openai') {
    url = 'https://api.openai.com/v1/chat/completions';
  } else {
    throw new Error(`Invalid provider: ${prov}`);
  }

  if (!key) {
    throw new Error(`API key is missing for ${prov}`);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`
  };

  if (prov === 'openrouter') {
    headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    headers['X-Title'] = 'CUI Admission Assistant';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      model: mdl,
      messages: messages,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    let errMsg = '';
    try {
      const err = await response.json();
      errMsg = err.error?.message || `${prov.toUpperCase()} API returned status ${response.status}`;
    } catch {
      errMsg = `${prov.toUpperCase()} API returned status ${response.status}`;
    }
    throw new Error(errMsg);
  }

  const data = await response.json();
  const textResult = data.choices?.[0]?.message?.content;

  if (!textResult) {
    throw new Error(`No response content received from ${prov.toUpperCase()}.`);
  }

  return JSON.parse(textResult);
}
