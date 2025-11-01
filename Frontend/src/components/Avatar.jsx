
import React from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Avatar({ persona, playing }){
  const img = (persona && persona.img) || '/einstein.svg';
  const controls = useAnimation();
  const blink = useAnimation();

  React.useEffect(()=>{
    if(playing){
      controls.start({ scaleY: [1, 0.5, 1], transition: { duration: 0.6, repeat: Infinity } });
    } else {
      controls.stop();
      controls.set({ scaleY: 1 });
    }
  }, [playing]);

  React.useEffect(()=>{
    let t = setInterval(()=>{ blink.start({ scaleY: [1,0.1,1], transition:{duration:0.18} }) }, 4000);
    return ()=> clearInterval(t);
  }, []);

  return (
    <div style={{width:160, height:160, position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <img src={img} alt={persona && persona.name} style={{width:160, height:160, objectFit:'cover', borderRadius:12}} />
      <motion.div className="mouth" animate={controls} style={{}} />
      <motion.div className="eye left" animate={blink} style={{}} />
      <motion.div className="eye right" animate={blink} style={{}} />
    </div>
  )
}
