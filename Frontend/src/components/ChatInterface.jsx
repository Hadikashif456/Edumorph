
import React, { useState } from 'react';

export default function ChatInterface({ onGenerate, messages, loading }){
  const [topic, setTopic] = useState('');

  const submit = async () => {
    if(!topic) return;
    await onGenerate(topic, setTopic);
  }

  return (
    <div>
      <div className="input-row">
        <input className="input" placeholder="Ask: Explain gravity" value={topic} onChange={e=>setTopic(e.target.value)} />
        <button onClick={submit} disabled={loading} style={{padding:'10px 12px', borderRadius:10, border:'none', background:'linear-gradient(90deg,#7c3aed,#06b6d4)', color:'#fff'}}>Explain</button>
      </div>

      <div className="messages">
        {messages.map((m, idx) => (
          <div className="msg" key={idx}>
            <div className="meta">{m.from==='bot' ? 'Teacher' : 'You'}</div>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
