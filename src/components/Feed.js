// import React, {useEffect, useState} from 'react';
// import API from '../api';
// import { Link } from 'react-router-dom';

// export default function Feed() {
//   const [items, setItems] = useState([]);
//   const [q, setQ] = useState('');
//   const [category, setCategory] = useState('All');
  
//   useEffect(()=> {
//     API.get('/content').then(r => setItems(r.data)).catch(()=>{/* ignore */});
//   },[]);

//   console.log(items)

//   const filtered = items
//     .filter(it => it.published === true)  
//     .filter(it =>
//       (category === 'All' || it.category === category) &&
//       (it.title.toLowerCase().includes(q.toLowerCase()) ||
//        (it.body || '').toLowerCase().includes(q.toLowerCase()))
//     )
//     .sort((a, b) => {
//       const aTime = Date.parse(a.createdAt || a.publishedAt || '') || 0;
//       const bTime = Date.parse(b.createdAt || b.publishedAt || '') || 0;
//       if (bTime !== aTime) return bTime - aTime;
//       const aId = typeof a.id === 'number' ? a.id : parseInt(a.id || '0', 10) || 0;
//       const bId = typeof b.id === 'number' ? b.id : parseInt(b.id || '0', 10) || 0;
//       return bId - aId;
//   });


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-slate-800 mb-2">Content Library</h1>
//           <p className="text-slate-600">Discover insights, publications, and updates</p>
//         </div>

//         {/* Search & Filter Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 backdrop-blur-sm bg-white/80">
//           <div className="flex gap-4 flex-col sm:flex-row">
//             <div className="flex-1 relative">
//               <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <input 
//                 className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" 
//                 placeholder="Search title or description" 
//                 value={q} 
//                 onChange={e=>setQ(e.target.value)} 
//               />
//             </div>
//             <div className="relative sm:w-52">
//               <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//               </svg>
//               <select 
//                 className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer" 
//                 value={category} 
//                 onChange={e=>setCategory(e.target.value)}
//               >
//                 <option>All</option>
//                 <option>Whats New</option>
//                 <option>Publications</option>
//                 <option>Webinars</option>
//                 <option>Announcements</option>
//               </select>
//               <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>
//           </div>
          
//           {/* Results count */}
//           <div className="mt-4 text-sm text-slate-600">
//             {filtered.length} {filtered.length === 1 ? 'result' : 'results'} found
//           </div>
//         </div>

//         {/* Content Grid */}
//         <div className="grid gap-5">
//           {filtered.map(item => (
//             <article key={item.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 p-6 transition-all duration-300 hover:scale-[1.01] hover:border-sky-300">
//               <div className="flex justify-between items-start gap-4">
//                 <div className="flex-1 min-w-0">
//                   <Link 
//                     to={`/content/${item.id}`} 
//                     className="text-xl font-bold text-slate-800 hover:text-sky-600 transition-colors line-clamp-2 block"
//                   >
//                     {item.title}
//                   </Link>
                  
//                   {/* Meta information */}
//                   <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
//                     <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-medium">
//                       {item.category}
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                       {item.views} views
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Desktop CTA */}
//                 <div className="hidden sm:block">
//                   <Link 
//                     to={`/content/${item.id}`} 
//                     className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-sky-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg group-hover:scale-105"
//                   >
//                     Open
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
              
//               {/* Content preview */}
//               <div className="mt-4 text-sm text-slate-700 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{__html: item.body}} />
              
//               {/* Mobile CTA */}
//               <div className="mt-4 sm:hidden">
//                 <Link 
//                   to={`/content/${item.id}`} 
//                   className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-sky-700 hover:to-blue-700 transition-all shadow-md"
//                 >
//                   Open
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </Link>
//               </div>
//             </article>
//           ))}
          
//           {/* Empty state */}
//           {filtered.length === 0 && (
//             <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-300">
//               <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="text-lg font-semibold text-slate-700 mb-1">No results found</h3>
//               <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, {useEffect, useState} from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Feed() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  
  useEffect(()=> {
    API.get('/content').then(r => setItems(r.data)).catch(()=>{/* ignore */});
  },[]);

  console.log(items)

  const filtered = items
    .filter(it => it.published === true)   // show only published content
    .filter(it =>
      (category === 'All' || it.category === category) &&
      (it.title.toLowerCase().includes(q.toLowerCase()) ||
       (it.body || '').toLowerCase().includes(q.toLowerCase()))
    )
    .sort((a, b) => {
      const aTime = Date.parse(a.createdAt || a.publishedAt || '') || 0;
      const bTime = Date.parse(b.createdAt || b.publishedAt || '') || 0;
      if (bTime !== aTime) return bTime - aTime;
      const aId = typeof a.id === 'number' ? a.id : parseInt(a.id || '0', 10) || 0;
      const bId = typeof b.id === 'number' ? b.id : parseInt(b.id || '0', 10) || 0;
      return bId - aId;
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Content Library</h1>
          <p className="text-slate-600">Discover insights, publications, and updates</p>
        </div>

        {/* Search & Filter Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 backdrop-blur-sm bg-white/80">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" 
                placeholder="Search title or description" 
                value={q} 
                onChange={e=>setQ(e.target.value)} 
              />
            </div>
            <div className="relative sm:w-52">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <select 
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer" 
                value={category} 
                onChange={e=>setCategory(e.target.value)}
              >
                <option>All</option>
                <option>Whats New</option>
                <option>Publications</option>
                <option>Webinars</option>
                <option>Announcements</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-slate-600">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'} found
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-5">
          {filtered.map(item => (
            <article key={item.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 p-6 transition-all duration-300 hover:scale-[1.01] hover:border-sky-300">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/content/${item.id}`} 
                    className="text-xl font-bold text-slate-800 hover:text-sky-600 transition-colors line-clamp-2 block"
                  >
                    {item.title}
                  </Link>
                  
                  {/* Meta information */}
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-medium">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {item.views} views
                    </span>
                  </div>
                </div>
                
                {/* Desktop CTA */}
                <div className="hidden sm:block">
                  <Link 
                    to={`/content/${item.id}`} 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-sky-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg group-hover:scale-105"
                  >
                    Open
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Banner (NEW) */}
              {item.banner && (
                <div className="mt-4">
                  <Link to={`/content/${item.id}`} className="block overflow-hidden rounded-xl">
                    <img
                      src={item.banner}
                      alt={`${item.title} banner`}
                      className="w-full h-44 object-cover rounded-xl border"
                    />
                  </Link>
                </div>
              )}

              {/* Content preview */}
              <div className="mt-4 text-sm text-slate-700 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{__html: item.body}} />
              
              {/* Mobile CTA */}
              <div className="mt-4 sm:hidden">
                <Link 
                  to={`/content/${item.id}`} 
                  className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-sky-700 hover:to-blue-700 transition-all shadow-md"
                >
                  Open
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
          
          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No results found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
