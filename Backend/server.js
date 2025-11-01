
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HF_API = process.env.HUGGINGFACE_API_KEY || null;
const HF_MODEL = process.env.HUGGINGFACE_MODEL || 'google/flan-t5-large';

function localExplain(persona, topic){
  const p = persona || 'einstein';
  const tone = {
    einstein: {
      intro: `Alright — let's explore "${topic}" with curiosity and clear analogies.`,
      style: `I'll explain the idea step-by-step, give an intuitive analogy, and finish with a quick exercise.`
    },
    cartoon: {
      intro: `Hey kiddo! Let's have fun learning about "${topic}"!`,
      style: `Short simple steps, a funny example, and a tiny practice you can try.`
    },
    ironman: {
      intro: `Stark mode: breaking down "${topic}" like a tech demo.`,
      style: `We'll get the concept, why it matters, and a challenge to test your skills.`
    }
  }[p] || {intro: `Let's learn "${topic}"`, style: ''};

  const explanation = [];
  explanation.push(tone.intro);
  explanation.push('---');
  explanation.push('1) Quick definition — what it is:');
  explanation.push(`${topic} is best thought of as a concept that can be described like this: [concise definition].`);
  explanation.push('2) How it works — step by step:');
  explanation.push(' - Step 1: Identify the core elements.');
  explanation.push(' - Step 2: See how those elements interact.');
  explanation.push('3) Intuition / analogy:');
  explanation.push(`Imagine ${topic} as a system where ... (use a familiar everyday comparison).`);
  explanation.push('4) Example:');
  explanation.push(`Try this concrete example: [a small demonstration related to ${topic}].`);
  explanation.push('5) Quick practice:');
  explanation.push(' - Exercise: Try to explain the idea in one sentence.');
  explanation.push('6) Summary:');
  explanation.push('In short: focus on the main mechanism and practice with small examples.');
  explanation.push('---');
  explanation.push(tone.style);
  if(p === 'einstein') explanation.push('Analogy: Think of it like spacetime curving under mass — very useful for intuition.');
  if(p === 'cartoon') explanation.push('Fun tip: Draw a doodle that shows the parts!');
  if(p === 'ironman') explanation.push('Geek note: Consider how you would optimize or simulate this in code.');

  return explanation.join('\\n\\n');
}

async function callHuggingFace(persona, topic){
  const promptPersona = {
    einstein: "You are a wise physics-inclined teacher who uses analogies and clear explanations.",
    cartoon: "You are a playful teacher for kids, use simple language, metaphors and fun examples.",
    ironman: "You are a witty tech-genius teacher with clever analogies and crisp technical depth."
  }[persona] || "You are a clear and helpful teacher.";

  const prompt = `${promptPersona}\\n\\nExplain the following concept in depth, structured with: definition, how it works (step-by-step), an intuition/analogy, a concrete example, a quick exercise, and a concise summary.\\n\\nTopic: ${topic}`;

  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(HF_MODEL)}`;
  const headers = {
    'Content-Type': 'application/json'
  };
  if(HF_API) headers['Authorization'] = `Bearer ${HF_API}`;

  const body = { inputs: prompt, parameters: { max_new_tokens: 512, temperature: 0.2 } };

  try{
    const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if(!resp.ok){
      const txt = await resp.text();
      console.error('HF error', resp.status, txt);
      return null;
    }
    const data = await resp.json();
    if(Array.isArray(data) && data.length && data[0].generated_text){
      return data[0].generated_text;
    }
    if(data.generated_text) return data.generated_text;
    if(Array.isArray(data) && data[0] && typeof data[0] === 'string') return data[0];
    return JSON.stringify(data);
  } catch(err){
    console.error('HF call failed', err);
    return null;
  }
}

app.post('/api/generate', async (req, res) => {
  const { persona, topic } = req.body || {};
  if(!topic) return res.status(400).json({ error: 'topic required' });

  let text = null;
  // Try HF with or without key, but fallback to local generator when HF fails
  text = await callHuggingFace(persona, topic);
  if(!text) text = localExplain(persona, topic);

  res.json({ text });
});

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log('EduMorph Pro Free backend running on', port));
