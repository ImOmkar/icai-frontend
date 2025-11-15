import React, {useEffect, useState} from 'react';
import API from '../api';

export default function PushListener() {
  const [lastChecked, setLastChecked] = useState(new Date(0));
  const [messages, setMessages] = useState([]);

  useEffect(()=> {
    const id = setInterval(checkPushes, 9000);
    checkPushes();
    return ()=> clearInterval(id);
  }, []);

  function checkPushes(){
    API.get('/pushes').then(r => {
      const pushes = r.data || [];
      // pick pushes we haven't shown
      const newPushes = pushes.filter(p => new Date(p.at) > new Date(lastChecked));
      if(newPushes.length){
        setMessages(prev => [...newPushes, ...prev]);
        newPushes.forEach(p => {
          if ("Notification" in window && Notification.permission === "granted") {
            try { new Notification(p.title || 'Push', { body: p.body || '', data:p }); } catch(e){}
          }
        });
        setLastChecked(new Date());
      } else {
        setLastChecked(new Date());
      }
    }).catch(()=>{/* ignore errors */});
  }

  return (
    <div style={{position:'fixed', right:12, bottom:12, width:320, zIndex:999}}>
      {/* {messages.slice(0,3).map((m, idx)=> (
        <div key={idx} style={{background:'#fff', padding:10, border:'1px solid #ddd', marginTop:8, borderRadius:8, boxShadow:'0 2px 6px rgba(0,0,0,0.08)'}}>
          <b>{m.title}u</b>
          <div className="small">{m.body}</div>
          <div className="small" style={{marginTop:6}}>{new Date(m.at).toLocaleString()}</div>
        </div>
      ))} */}
    </div>
  );
}
