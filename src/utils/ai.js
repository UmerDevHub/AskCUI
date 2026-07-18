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

  // 6. Check FAQs (Filter FAQs based on keywords to keep context concise and highly relevant)
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 3);
  let relevantFaqs = faqsData;

  if (selectedCategory !== 'All' && selectedCategory !== 'FAQs') {
    // If a specific category is chosen, filter FAQs by that category
    relevantFaqs = faqsData.filter(faq => faq.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  } else if (queryWords.length > 0) {
    // Otherwise, find FAQs matching query words
    relevantFaqs = faqsData.filter(faq => {
      return queryWords.some(word => 
        faq.question.toLowerCase().includes(word) || 
        faq.answer.toLowerCase().includes(word)
      );
    });
  }

  // Fallback to top FAQs if no words match
  if (relevantFaqs.length === 0) {
    relevantFaqs = faqsData.slice(0, 10);
  } else {
    // Limit to top 25 matches to avoid overloading context
    relevantFaqs = relevantFaqs.slice(0, 25);
  }

  contextParts.push(`### Relevant Frequently Asked Questions:\n${JSON.stringify(relevantFaqs, null, 2)}`);
  sourcesUsed.push('faqs.json');

  return {
    context: contextParts.join('\n\n'),
    sources: sourcesUsed
  };
}

export async function askAI({ provider, apiKey, model, query, category, chatHistory = [] }) {
  const { context, sources } = getRelevantContext(query, category);

  const systemPrompt = `You are the official AI Admission Assistant for COMSATS University Islamabad (CUI).
Your goal is to answer the user's questions about admissions, programs, fees, eligibility, prerequisites, scholarships, and campus facilities.

CRITICAL RULES:
1. Answer ONLY using the provided JSON context. Do not invent, assume, or extrapolate any information.
2. If the answer is not explicitly found in the context, you MUST respond exactly with: "I couldn't find this information in the knowledge base." Do not attempt to give advice, suggest checking the website, or provide contact numbers unless they are in the context.
3. Keep the response factual, concise, and helpful. Use clear markdown formatting (bold, bullet points, headers) for readability.
4. You must output your response in JSON format matching this schema:
{
  "answer": "Your detailed answer in markdown format. Use list, bold text, etc., where appropriate.",
  "sources": ["list", "of", "json", "files", "actually", "used", "to", "answer", "this", "question"]
}
Only list sources from the context that actually contained the information used to write the answer. If the answer was not found, return empty sources array [].

JSON CONTEXT PROVIDED:
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
    const providers = ['groq', 'cohere', 'openrouter', 'openai'];
    if (!providers.includes(provider)) {
      throw new Error(`Invalid AI provider: ${provider}`);
    }

    let url = '';
    if (provider === 'groq') {
      url = 'https://api.groq.com/openai/v1/chat/completions';
    } else if (provider === 'cohere') {
      url = 'https://api.cohere.ai/compatibility/v1/chat/completions';
    } else if (provider === 'openrouter') {
      url = 'https://openrouter.ai/api/v1/chat/completions';
    } else if (provider === 'openai') {
      url = 'https://api.openai.com/v1/chat/completions';
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = window.location.origin || 'http://localhost:5173';
      headers['X-Title'] = 'CUI Admission Assistant';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: messages,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `${provider.toUpperCase()} API returned status ${response.status}`);
    }

    const data = await response.json();
    const textResult = data.choices?.[0]?.message?.content;

    if (!textResult) {
      throw new Error(`No response content received from ${provider.toUpperCase()}.`);
    }

    return JSON.parse(textResult);
  } catch (error) {
    console.error("AI Error:", error);
    return {
      answer: `Error communicating with ${provider.toUpperCase()} API: ${error.message}. Please check your API key, connection, or model settings.`,
      sources: []
    };
  }
}
