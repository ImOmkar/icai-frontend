import React, {useEffect, useState} from 'react';
import API from '../api';

export default function Analytics(){
  const [stats, setStats] = useState(null);
  useEffect(()=> {
    API.get('/analytics').then(r=>setStats(r.data)).catch(()=>{/* fallback compute */});
    // simple fallback compute: count users + views
    API.get('/users').then(u=> {
      API.get('/content').then(c=> {
        setStats({users: u.data.length, contentViews: c.data.reduce((s,x)=>s+(x.views||0),0), errors: []});
      });
    }).catch(()=>{});
  }, []);

  if(!stats) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2>Admin Analytics</h2>
      <div>Users: {stats.users}</div>
      <div>Content views: {stats.contentViews}</div>
      <div>Errors logged: {stats.errors && stats.errors.length}</div>
    </div>
  );
}
