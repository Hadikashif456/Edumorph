
import React from 'react';

const PERSONAS = [
  { id: 'einstein', name: 'Einstein', desc: 'Intelligent, analogy-driven', img: '/einstein.svg' },
  { id: 'cartoon', name: 'Cartoon', desc: 'Funny and simple', img: '/cartoon.svg' },
  { id: 'ironman', name: 'Ironman', desc: 'Genius & witty', img: '/ironman.svg' },
];

export default function PersonaSelector({ persona, onSelect }){
  return (
    <div style={{marginBottom:8}}>
      <div style={{display:'flex', gap:8}}>
        {PERSONAS.map((p) => (
          <div
            key={p.id}
            className={`persona-tile ${persona && persona.id === p.id ? 'selected' : ''}`}
            onClick={() => onSelect({ id: p.id, name: p.name, img: p.img })}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 10,
              border: persona && persona.id === p.id ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(255,255,255,0.03)',
            }}
          >
            <img src={p.img} alt={p.name} style={{width:48,height:48,borderRadius:8}}/>
            <div style={{fontSize:13}}>
              <div style={{fontWeight:700}}>{p.name}</div>
              <div style={{fontSize:12, color:'#94a3b8'}}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
