
import React, { useState } from 'react';
import PersonaSelector from './components/PersonaSelector';
import ChatInterface from './components/ChatInterface';
import Avatar from './components/Avatar';

export default function App(){
  const [persona, setPersona] = useState({ id:'einstein', name:'Einstein', img:'/einstein.svg' });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  async function handleGenerate(topic, clearSetter){
    if(!topic) return;
    setLoading(true);
    try{
      const res = await fetch('http://localhost:5000/api/generate', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ persona: persona.id, topic })
      });
      const data = await res.json();
      if(data && data.text){
        setMessages(prev => [...prev, {from:'user', text: topic}, {from:'bot', text: data.text}]);
        clearSetter && clearSetter('');
        await speak(data.text);
      } else {
        setMessages(prev => [...prev, {from:'bot', text: 'Sorry — failed to generate.'}]);
      }
    }catch(e){
      console.error(e);
      setMessages(prev => [...prev, {from:'bot', text: 'Network error while generating.'}]);
    } finally {
      setLoading(false);
    }
  }

  function speak(text){
    if(!('speechSynthesis' in window)) return Promise.resolve();
    return new Promise((resolve)=>{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.onstart = ()=> setPlaying(true);
      u.onend = ()=> { setPlaying(false); resolve(); };
      u.onerror = ()=> { setPlaying(false); resolve(); };
      const vlist = window.speechSynthesis.getVoices();
      if(vlist && vlist.length){
        u.voice = vlist.find(v => v.lang && v.lang.startsWith('en')) || vlist[0];
      }
      window.speechSynthesis.speak(u);
    });
  }

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <div className="logo">EM</div>
          <div>
            <div className="title">EduMorph Pro Free</div>
            <div style={{fontSize:13, color:'#9fb0c8'}}>Pick a persona and ask anything — explanations, examples, and exercises.</div>
          </div>
        </div>

        <div style={{display:'flex', gap:18}}>
          <div style={{flex:1}}>
            <PersonaSelector persona={persona} onSelect={setPersona} />
            <ChatInterface onGenerate={handleGenerate} messages={messages} loading={loading} />
          </div>

          <div style={{width:260}}>
            <div className="avatar-box">
              <Avatar persona={persona} playing={playing} />
            </div>
            <div style={{marginTop:12, textAlign:'center', color:'#9fb0c8'}}>{playing ? 'Speaking...' : 'Idle'}</div>
          </div>
        </div>

        <div className="footer">EduMorph Pro Free — uses Hugging Face if available, otherwise local generator. Browser TTS for speech.</div>
      </div>
    </div>
  );
}
