// import React, {useEffect, useState} from 'react';
// import { useParams, Link } from 'react-router-dom';
// import API from '../api';
// import { Document, Page, pdfjs } from 'react-pdf';
// import SimpleModal from './SimpleModal';
// import ShareCard from './ShareCard';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// export default function ContentView() {
//   const { id } = useParams();
//   const [liveOpen, setLiveOpen] = useState(false);
//   const [item, setItem] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // New states for bookmark + feedback
//   const [bookmarked, setBookmarked] = useState(false);
//   const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message: string }

//   useEffect(()=> {
//     setLoading(true);
//     API.get(`/content/${id}`)
//       .then(r => {
//         setItem(r.data);
//         // if backend returns bookmarked flag inside item, use it
//         if (r.data && typeof r.data.bookmarked !== 'undefined') {
//           setBookmarked(!!r.data.bookmarked);
//         }
//         setLoading(false);
//       })
//       .catch(()=> {
//         setLoading(false);
//       });
//   }, [id]);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   // small helper to show transient feedback
//   function showFeedback(type, message, ms = 3000) {
//     setFeedback({ type, message });
//     setTimeout(()=> setFeedback(null), ms);
//   }

//   // Share handler - Web Share API if available, otherwise copy URL to clipboard
//   async function handleShare() {
//     const shareUrl = window.location.href;
//     const shareTitle = item?.title || 'Content';
//     // Try Web Share API
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: shareTitle,
//           url: shareUrl,
//           text: item?.description || ''
//         });
//         showFeedback('success', 'Shared successfully');
//       } catch (err) {
//         // user may have canceled or it failed
//         showFeedback('error', 'Share cancelled or failed');
//       }
//       return;
//     }

//     // Fallback: copy to clipboard
//     try {
//       if (navigator.clipboard && navigator.clipboard.writeText) {
//         await navigator.clipboard.writeText(shareUrl);
//       } else {
//         // legacy fallback
//         const el = document.createElement('textarea');
//         el.value = shareUrl;
//         document.body.appendChild(el);
//         el.select();
//         document.execCommand('copy');
//         document.body.removeChild(el);
//       }
//       showFeedback('success', 'Link copied to clipboard');
//     } catch (err) {
//       showFeedback('error', 'Could not copy link — please copy manually');
//     }
//   }

//   // Bookmark handler - optimistic UI, call backend to add/remove bookmark
//   async function handleBookmark() {
//     // optimistic toggle
//     const next = !bookmarked;
//     setBookmarked(next);

//     try {
//       if (next) {
//         // add bookmark
//         // assumed endpoint: POST /content/:id/bookmark
//         // adjust if your API differs
//         await API.post(`/content/${id}/bookmark`);
//         showFeedback('success', 'Added to bookmarks');
//       } else {
//         // remove bookmark
//         // assumed endpoint: DELETE /content/:id/bookmark
//         await API.delete(`/content/${id}/bookmark`);
//         showFeedback('success', 'Removed from bookmarks');
//       }
//     } catch (err) {
//       // revert optimistic update on error
//       setBookmarked(!next);
//       // try to show a helpful message
//       const msg = err?.response?.data?.detail || 'Server error while updating bookmark';
//       showFeedback('error', msg);
//       console.error('Bookmark error', err);
//     }
//   }

//   if(loading) {
//     return (
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
//           <div className="flex items-center justify-center gap-3">
//             <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
//             <span className="text-slate-600 font-medium">Loading content...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if(!item) {
//     return (
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
//           <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <h3 className="text-lg font-semibold text-slate-700 mb-1">Content not found</h3>
//           <p className="text-slate-500 mb-4">The content you're looking for doesn't exist</p>
//           <Link to="/" className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-all">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Feed
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <article className="max-w-5xl mx-auto space-y-6 relative">
//       {/* transient feedback toast */}
//       {feedback && (
//         <div className={`absolute right-6 top-6 z-50 rounded-md px-4 py-2 text-sm font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//           {feedback.message}
//         </div>
//       )}

//       {/* Breadcrumb Navigation */}
//       <nav className="flex items-center gap-2 text-sm mt-5 md:mx-0 mx-4">
//         <Link to="/" className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           Back to Feed
//         </Link>
//       </nav>

//       {/* Main Content Card */}
//       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//         {/* Header Section */}
//         <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-6">
//           <h1 className="text-3xl font-bold text-white mb-3">{item.title}</h1>
//           <div className="flex flex-wrap items-center gap-4 text-white/90">
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//               </svg>
//               {item.category}
//             </span>
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//               </svg>
//               {item.views} views
//             </span>
//           </div>
//         </div>

//         {/* Body Content */}
//         <div className="px-8 py-6">
//           <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{__html: item.body}} />
//         </div>
//       </div>

//       {/* PDF Section */}
//       {item.pdf && (
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-4 border-b border-slate-200">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//                 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                 </svg>
//                 PDF Document
//               </h2>
//               <div className="flex gap-2">
//                 <a 
//                   href={item.pdf} 
//                   download 
//                   className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-all shadow-md font-medium"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   <span className="hidden sm:inline">Download</span>
//                 </a>
//                 <a 
//                   href={item.pdf} 
//                   target="_blank" 
//                   rel="noreferrer" 
//                   className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-all font-medium"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                   </svg>
//                   <span className="hidden sm:inline">Open</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="p-6">
//             <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
//               <iframe
//                 src={item.pdf}
//                 title="PDF Viewer"
//                 className="w-full h-96 rounded-lg"
//                 style={{ border: 'none' }}
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Video Section */}
//       {item.videoUrl && (
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-slate-50 to-purple-50 px-8 py-4 border-b border-slate-200">
//             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//               </svg>
//               Webinar Live/Recording
//             </h2>
//           </div>
//           <div className="p-6">
//             <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
//               <iframe 
//                 title="webinar" 
//                 src={item.videoUrl} 
//                 className="absolute top-0 left-0 w-full h-full" 
//                 frameBorder="0" 
//                 allowFullScreen 
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               />
//             </div>
//             {/* Join Live (simulate) */}
//             <div className="mt-3 flex justify-end items-center">
//                 <button onClick={()=>setLiveOpen(true)} className="px-4 py-2 bg-gradient-to-r from-slate-50 to-purple-50 rounded">Join Live</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <SimpleModal open={liveOpen} title="Simulated Live Stream" onClose={()=>setLiveOpen(false)}>
//         <div className="text-sm text-gray-600 mb-3">This is a simulated live stream demo. Replace with real stream URL for production.</div>
//         <div className="aspect-w-16 aspect-h-9">
//           {/* use a live demo stream or sample video */}
//           <iframe title="live-sim" src="https://www.youtube.com/embed/jbCg_TPkSdQ?si=02gG7kRluBNK8mtI" className="w-full h-64" frameBorder="0" allowFullScreen />
//         </div>
//       </SimpleModal>

//       {/* Action Bar */}
//       <ShareCard title={item.title} url="https://example.com/content/2" />

//     </article>
//   );
// }

import React, {useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { Document, Page, pdfjs } from 'react-pdf';
import SimpleModal from './SimpleModal';
import ShareCard from './ShareCard';
import { useNavigate } from 'react-router-dom';
import { Plus, Send, Edit2, Trash2, Save, X, FileText, Eye, EyeOff, Bell, CheckCircle } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ContentView() {
  const { id } = useParams();
  const [liveOpen, setLiveOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // New states for bookmark + feedback
  const [bookmarked, setBookmarked] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message: string }

  useEffect(()=> {
    setLoading(true);
    API.get(`/content/${id}`)
      .then(r => {
        setItem(r.data);
        // if backend returns bookmarked flag inside item, use it
        if (r.data && typeof r.data.bookmarked !== 'undefined') {
          setBookmarked(!!r.data.bookmarked);
        }
        setLoading(false);
      })
      .catch(()=> {
        setLoading(false);
      });
  }, [id]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // small helper to show transient feedback
  function showFeedback(type, message, ms = 3000) {
    setFeedback({ type, message });
    setTimeout(()=> setFeedback(null), ms);
  }

  // Share handler - Web Share API if available, otherwise copy URL to clipboard
  async function handleShare() {
    const shareUrl = window.location.href;
    const shareTitle = item?.title || 'Content';
    // Try Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
          text: item?.description || ''
        });
        showFeedback('success', 'Shared successfully');
      } catch (err) {
        // user may have canceled or it failed
        showFeedback('error', 'Share cancelled or failed');
      }
      return;
    }

    // Fallback: copy to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // legacy fallback
        const el = document.createElement('textarea');
        el.value = shareUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      showFeedback('success', 'Link copied to clipboard');
    } catch (err) {
      showFeedback('error', 'Could not copy link — please copy manually');
    }
  }

  // Bookmark handler - optimistic UI, call backend to add/remove bookmark
  async function handleBookmark() {
    // optimistic toggle
    const next = !bookmarked;
    setBookmarked(next);

    try {
      if (next) {
        // add bookmark
        // assumed endpoint: POST /content/:id/bookmark
        // adjust if your API differs
        await API.post(`/content/${id}/bookmark`);
        showFeedback('success', 'Added to bookmarks');
      } else {
        // remove bookmark
        // assumed endpoint: DELETE /content/:id/bookmark
        await API.delete(`/content/${id}/bookmark`);
        showFeedback('success', 'Removed from bookmarks');
      }
    } catch (err) {
      // revert optimistic update on error
      setBookmarked(!next);
      // try to show a helpful message
      const msg = err?.response?.data?.detail || 'Server error while updating bookmark';
      showFeedback('error', msg);
      console.error('Bookmark error', err);
    }
  }

  if(loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">Loading content...</span>
          </div>
        </div>
      </div>
    );
  }

  if(!item) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Content not found</h3>
          <p className="text-slate-500 mb-4">The content you're looking for doesn't exist</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-5xl mx-auto space-y-6 relative">
      {/* transient feedback toast */}
      {feedback && (
        <div className={`absolute right-6 top-6 z-50 rounded-md px-4 py-2 text-sm font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm mt-5 md:mx-0 mx-4">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1); // go back
            } else {
              navigate("/"); // fallback if user opened page directly
            }
          }}
          className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Feed
        </button>
      </nav>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-3">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-white/90">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {item.category}
            </span>
            {item.published ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
                <Eye className="w-3 h-3" />
                Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
                <EyeOff className="w-3 h-3" />
                Draft
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {item.views} views
            </span>
          </div>
        </div>

        {/* Banner (NEW) */}
        {item.banner && (
          <div className="px-8 pt-6">
            <img
              src={item.banner}
              alt={`${item.title} banner`}
              className="w-full max-h-96 object-cover rounded-b-none rounded-t-xl border-b border-slate-200"
            />
          </div>
        )}

        {/* Body Content */}
        <div className="px-8 py-6">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{__html: item.body}} />
        </div>
      </div>

      {/* PDF Section */}
      {item.pdf && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF Document
              </h2>
              <div className="flex gap-2">
                <a 
                  href={item.pdf} 
                  download 
                  className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-all shadow-md font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </a>
                <a 
                  href={item.pdf} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-all font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="hidden sm:inline">Open</span>
                </a>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
              <iframe
                src={item.pdf}
                title="PDF Viewer"
                className="w-full h-96 rounded-lg"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Video Section */}
      {item.videoUrl && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-purple-50 px-8 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Webinar Live/Recording
            </h2>
          </div>
          <div className="p-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe 
                title="webinar" 
                src={item.videoUrl} 
                className="absolute top-0 left-0 w-full h-full" 
                frameBorder="0" 
                allowFullScreen 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            {/* Join Live (simulate) */}
            <div className="mt-3 flex justify-end items-center">
                <button onClick={()=>setLiveOpen(true)} className="px-4 py-2 bg-gradient-to-r from-slate-50 to-purple-50 rounded">Join Live</button>
            </div>
          </div>
        </div>
      )}

      <SimpleModal open={liveOpen} title="Simulated Live Stream" onClose={()=>setLiveOpen(false)}>
        <div className="text-sm text-gray-600 mb-3">This is a simulated live stream demo. Replace with real stream URL for production.</div>
        <div className="aspect-w-16 aspect-h-9">
          {/* use a live demo stream or sample video */}
          <iframe title="live-sim" src={item.videoUrl}  className="w-full h-64" frameBorder="0" allowFullScreen />
        </div>
      </SimpleModal>

      {/* Action Bar */}
      <ShareCard title={item.title} url="https://example.com/content/2" />

    </article>
  );
}
