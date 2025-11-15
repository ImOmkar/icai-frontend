  // import React, { useEffect, useState } from 'react';
  // import { Plus, Send, Edit2, Trash2, Save, X, FileText, Eye, EyeOff, Bell } from 'lucide-react';
  // import API from '../api';

  // export default function AdminCMS() {
  //   const [items, setItems] = useState([]);
  //   const [editing, setEditing] = useState(null);
  //   const [form, setForm] = useState({ title: '', category: 'Publications', body: '', pdf: '', banner: '', published: false });
  //   const [loading, setLoading] = useState(true);
  //   const [saving, setSaving] = useState(false);
  //   const [showModal, setShowModal] = useState(false);

  //   useEffect(() => {
  //     API.get('/content')
  //       .then(r => {
  //         setItems(r.data);
  //         setLoading(false);
  //       })
  //       .catch(() => {
  //         setLoading(false);
  //       });
  //   }, []);

  //   function openModal(id = null) {
  //     if (id) {
  //       const it = items.find(x => x.id === id);
  //       setEditing(id);
  //       setForm({ ...it });
  //     } else {
  //       setEditing(null);
  //       setForm({ title: '', category: 'Publications', body: '', pdf: '', published: false });
  //     }
  //     setShowModal(true);
  //   }

  //   function closeModal() {
  //     setShowModal(false);
  //     setEditing(null);
  //     setForm({ title: '', category: 'Publications', body: '', pdf: '', published: false });
  //   }

  //   function save() {
  //     if (!form.title) {
  //       alert('Title required');
  //       return;
  //     }
  //     setSaving(true);
  //     if (editing) {
  //       API.put(`/content/${editing}`, form).then(() => window.location.reload());
  //     } else {
  //       API.post('/content', { ...form, views: 0 }).then(() => window.location.reload());
  //     }
  //   }

  //   function remove(id) {
  //     if (window.confirm('Delete?')) API.delete(`/content/${id}`).then(() => window.location.reload());
  //   }

  // function triggerPushServer() {
  //   const payload = {
  //     type: 'demo',
  //     title: 'Demo push',
  //     body: 'Push from admin (server-side simulation)',
  //     priority: 'high',
  //     sentAt: new Date().toISOString(),
  //     audience: 'all'
  //   };

  //   API.post('/pushes', payload)
  //     .then(() => alert('Push queued. Clients will simulate delivery.'))
  //     .catch(() => alert('Failed to queue the push.'));
  // }

  //   const getCategoryColor = (category) => {
  //     const colors = {
  //       'Publications': 'bg-blue-100 text-blue-700 border-blue-200',
  //       'Webinars': 'bg-purple-100 text-purple-700 border-purple-200',
  //       'Announcements': 'bg-orange-100 text-orange-700 border-orange-200',
  //       "What's New": 'bg-green-100 text-green-700 border-green-200'
  //     };
  //     return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  //   };

  //   const sortedItems = [...items].sort((a, b) => {
  //     const aTime = Date.parse(a.createdAt || a.publishedAt || '') || 0;
  //     const bTime = Date.parse(b.createdAt || b.publishedAt || '') || 0;
  //     if (bTime !== aTime) return bTime - aTime;
  //     // fallback to numeric id descending
  //     const aId = typeof a.id === 'number' ? a.id : parseInt(a.id || '0', 10) || 0;
  //     const bId = typeof b.id === 'number' ? b.id : parseInt(b.id || '0', 10) || 0;
  //     return bId - aId;
  //   });

  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
  //       <div className="max-w-6xl mx-auto">
  //         {/* Header */}
  //         <div className="mb-8">
  //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">

  //             {/* Left Section: Icon + Title */}
  //             <div className="flex items-start sm:items-center gap-3">
  //                 <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg flex-shrink-0">
  //                 <FileText className="w-7 h-7 text-white" />
  //                 </div>

  //                 <div>
  //                 <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
  //                   Admin CMS
  //                 </h2>
  //                 <p className="text-gray-600 text-sm mt-1">
  //                   Manage content and notifications
  //                 </p>
  //                 </div>
  //             </div>

  //             {/* Right Section: Buttons (responsive) */}
  //             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
  //                 <button
  //                   onClick={() => openModal()}
  //                   className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg font-medium  transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
  //                   >
  //                   <Plus className="w-4 h-4" />
  //                   New Content
  //                 </button>

  //                 <button
  //                   onClick={triggerPushServer}
  //                   className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-all w-full sm:w-auto"
  //                   >
  //                   <Bell className="w-4 h-4" />
  //                   Send Notification
  //                 </button>
  //             </div>
  //             </div>
  //         </div>

  //         {/* Content List */}
  //         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
  //           <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
  //             <h3 className="text-lg font-semibold text-gray-900">Content Library</h3>
  //             <p className="text-sm text-gray-500 mt-0.5">{items.length} items total</p>
  //           </div>

  //           <div className="px-1 py-2">
  //             {loading ? (
  //               <div className="flex items-center justify-center py-12">
  //                 <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  //               </div>
  //             ) : sortedItems.length === 0 ? (
  //               <div className="text-center py-12">
  //                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //                   <FileText className="w-8 h-8 text-gray-400" />
  //                 </div>
  //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
  //                 <p className="text-gray-500 text-sm mb-4">Create your first content item to get started</p>
  //                 <button
  //                   onClick={() => openModal()}
  //                   className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
  //                 >
  //                   <Plus className="w-4 h-4" />
  //                   Create Content
  //                 </button>
  //               </div>
  //             ) : (
  //               <div className="grid md:grid-cols-2 gap-2">
  //                 {sortedItems.map(i => (
  //                   <div
  //                     key={i.id}
  //                     className="p-5 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all hover:shadow-md bg-white"
  //                   >
  //                     <div className="flex items-start justify-between gap-3 mb-3">
  //                       <div className="flex-1 min-w-0">
  //                         <h4 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">{i.title}</h4>
  //                         <div className="flex items-center gap-2 flex-wrap">
  //                           <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(i.category)}`}>
  //                             {i.category}
  //                           </span>
  //                           {i.published ? (
  //                             <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200">
  //                               <Eye className="w-3 h-3" />
  //                               Published
  //                             </span>
  //                           ) : (
  //                             <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border border-gray-200">
  //                               <EyeOff className="w-3 h-3" />
  //                               Draft
  //                             </span>
  //                           )}
  //                           {i.views > 0 && (
  //                             <span className="text-xs text-gray-500">{i.views} views</span>
  //                           )}
  //                           {/* show createdAt if available */}
  //                           {i.createdAt && (
  //                             <span className="text-xs text-gray-400 ml-2">• {new Date(i.createdAt).toLocaleString()}</span>
  //                           )}
  //                         </div>
  //                       </div>
  //                     </div>
  //                     <div className="flex gap-2 pt-3 border-t border-gray-100">
  //                       <button
  //                         onClick={() => openModal(i.id)}
  //                         className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all border border-blue-200"
  //                       >
  //                         <Edit2 className="w-4 h-4" />
  //                         Edit
  //                       </button>
  //                       <button
  //                         onClick={() => remove(i.id)}
  //                         className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-all border border-red-200"
  //                       >
  //                         <Trash2 className="w-4 h-4" />
  //                         Delete
  //                       </button>
  //                     </div>
  //                   </div>
  //                 ))}
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </div>

  //       {/* Modal */}
  //       {showModal && (
  //         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
  //           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
  //             {/* Modal Header */}
  //             <div className="bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 px-6 py-5 flex items-center justify-between">
  //               <h3 className="text-xl font-semibold text-white">
  //                 {editing ? 'Edit Content' : 'Create New Content'}
  //               </h3>
  //               <button
  //                 onClick={closeModal}
  //                 className="p-2 hover:bg-white/20 rounded-lg transition-colors"
  //               >
  //                 <X className="w-5 h-5 text-white" />
  //               </button>
  //             </div>

  //             {/* Modal Body */}
  //             <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
  //               {/* Title */}
  //               <div>
  //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
  //                   Title <span className="text-red-500">*</span>
  //                 </label>
  //                 <input
  //                   type="text"
  //                   placeholder="Enter title"
  //                   value={form.title || ''}
  //                   onChange={e => setForm({ ...form, title: e.target.value })}
  //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
  //                 />
  //               </div>

  //               {/* Category */}
  //               <div>
  //                 <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
  //                 <select
  //                   value={form.category}
  //                   onChange={e => setForm({ ...form, category: e.target.value })}
  //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
  //                 >
  //                   <option>Publications</option>
  //                   <option>Webinars</option>
  //                   <option>Announcements</option>
  //                   <option>What's New</option>
  //                 </select>
  //               </div>

  //               {/* Body */}
  //               <div>
  //                 <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
  //                 <textarea
  //                   placeholder="Enter content"
  //                   value={form.body || ''}
  //                   onChange={e => setForm({ ...form, body: e.target.value })}
  //                   rows={8}
  //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm font-mono"
  //                 />
  //               </div>

  //               {/* PDF URL */}
  //               <div>
  //                 <label className="block text-sm font-semibold text-gray-700 mb-2">PDF URL (Optional)</label>
  //                 <input
  //                   type="text"
  //                   placeholder="/sample.pdf or URL"
  //                   value={form.pdf || ''}
  //                   onChange={e => setForm({ ...form, pdf: e.target.value })}
  //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
  //                 />
  //               </div>

  //               {/* Published Checkbox */}
  //               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
  //                 <label className="flex items-center gap-3 cursor-pointer">
  //                   <input
  //                     type="checkbox"
  //                     checked={form.published || false}
  //                     onChange={e => setForm({ ...form, published: e.target.checked })}
  //                     className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
  //                   />
  //                   <div>
  //                     <span className="text-sm font-semibold text-gray-900 block">Publish immediately</span>
  //                     <span className="text-xs text-gray-500">Make this content visible to all users</span>
  //                   </div>
  //                 </label>
  //               </div>
  //             </div>

  //             {/* Modal Footer */}
  //             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
  //               <button
  //                 onClick={closeModal}
  //                 className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
  //               >
  //                 Cancel
  //               </button>
  //               <button
  //                 onClick={save}
  //                 disabled={saving}
  //                 className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  //               >
  //                 {saving ? (
  //                   <>
  //                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  //                     Saving...
  //                   </>
  //                 ) : (
  //                   <>
  //                     <Save className="w-4 h-4" />
  //                     {editing ? 'Update' : 'Create'}
  //                   </>
  //                 )}
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

import React, { useEffect, useState } from 'react';
import { Plus, Send, Edit2, Trash2, Save, X, FileText, Eye, EyeOff, Bell, CheckCircle } from 'lucide-react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function AdminCMS() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Publications', body: '', pdf: '', banner: '', videoUrl: '', published: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    API.get('/content')
      .then(r => {
        setItems(r.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  function openModal(id = null) {
    if (id) {
      const it = items.find(x => x.id === id);
      setEditing(id);
      // ensure banner is present when editing (fallback to '')
      setForm({ ...it, banner: it.banner || '' });
    } else {
      setEditing(null);
      // include banner default
      setForm({ title: '', category: 'Publications', body: '', pdf: '', banner: '', videoUrl: '', published: false });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm({ title: '', category: 'Publications', body: '', pdf: '', banner: '', videoUrl: '', published: false });
  }

  const formatBytes = (bytes, decimals = 1) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const dm = Math.max(0, decimals);
    const sizes = ['B','KB','MB','GB','TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reader.abort();
      reject(new Error('Problem reading file.'));
    };
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  // Convert file → base64
  function fileToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  }

  // function handlePDFUpload(e) {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   fileToBase64(file, (base64) => {
  //     setForm({ ...form, pdf: base64 });
  //   });
  // }

  const handlePDFUpload = async (e) => {
    const file = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF.');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      // store base64/dataURL (existing app expects form.pdf)
      setForm(prev => ({ ...prev, pdf: dataUrl, _pdfName: file.name, _pdfSize: file.size }));
    } catch (err) {
      console.error(err);
      alert('Failed to read PDF.');
    }
  };

  const removePDF = () => {
    setForm(prev => {
      const copy = { ...prev };
      delete copy.pdf;
      delete copy._pdfName;
      delete copy._pdfSize;
      return copy;
    });
  };

  // function handleBannerUpload(e) {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   fileToBase64(file, (base64) => {
  //     setForm({ ...form, banner: base64 });
  //   });
  // }

  const handleBannerUpload = async (e) => {
    const file = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image for banner.');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      // store banner dataUrl (existing app expects form.banner)
      setForm(prev => ({ ...prev, banner: dataUrl, _bannerName: file.name, _bannerSize: file.size }));
    } catch (err) {
      console.error(err);
      alert('Failed to read image.');
    }
  };

  const removeBanner = () => {
    setForm(prev => {
      const copy = { ...prev };
      delete copy.banner;
      delete copy._bannerName;
      delete copy._bannerSize;
      return copy;
    });
  };

  function save() {
    if (!form.title) {
      alert('Title required');
      return;
    }

    setSaving(true);

    if (editing) {
      API.put(`/content/${editing}`, form)
        .then(() => window.location.reload())
        .catch(() => setSaving(false));
    } else {
      API.post('/content', {
        ...form,
        views: 0,
        createdAt: new Date().toISOString(),
        pdf: form.pdf || "",
        banner: form.banner || ""
      })
        .then(() => window.location.reload())
        .catch(() => setSaving(false));
    }
  }


  function remove(id) {
    if (window.confirm('Delete?')) API.delete(`/content/${id}`).then(() => window.location.reload());
  }

  function triggerPushServer() {
    const payload = {
      type: 'demo',
      title: 'Demo push',
      body: 'Push from admin (server-side simulation)',
      priority: 'high',
      sentAt: new Date().toISOString(),
      audience: 'all'
    };

    API.post('/pushes', payload)
      .then(() => alert('Push queued. Clients will simulate delivery.'))
      .catch(() => alert('Failed to queue the push.'));
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Publications': 'bg-blue-100 text-blue-700 border-blue-200',
      'Webinars': 'bg-purple-100 text-purple-700 border-purple-200',
      'Announcements': 'bg-orange-100 text-orange-700 border-orange-200',
      "What's New": 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const sortedItems = [...items].sort((a, b) => {
    const aTime = Date.parse(a.createdAt || a.publishedAt || '') || 0;
    const bTime = Date.parse(b.createdAt || b.publishedAt || '') || 0;
    if (bTime !== aTime) return bTime - aTime;
    const aId = typeof a.id === 'number' ? a.id : parseInt(a.id || '0', 10) || 0;
    const bId = typeof b.id === 'number' ? b.id : parseInt(b.id || '0', 10) || 0;
    return bId - aId;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">

            {/* Left Section: Icon + Title */}
            <div className="flex items-start sm:items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg flex-shrink-0">
                <FileText className="w-7 h-7 text-white" />
                </div>

                <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Admin CMS
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Manage content and notifications
                </p>
                </div>
            </div>

            {/* Right Section: Buttons (responsive) */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg font-medium  transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                  >
                  <Plus className="w-4 h-4" />
                  New Content
                </button>

                <button
                  onClick={triggerPushServer}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-all w-full sm:w-auto"
                  >
                  <Bell className="w-4 h-4" />
                  Send Notification
                </button>
            </div>
            </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Content Library</h3>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} items total</p>
          </div>

          <div className="px-1 py-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : sortedItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
                <p className="text-gray-500 text-sm mb-4">Create your first content item to get started</p>
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Content
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-2">
                {sortedItems.map(i => (
                  <div
                    key={i.id}
                    className="p-5 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all hover:shadow-md bg-white"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        {/* <h4 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">{i.title}</h4> */}

                        <Link 
                          to={`/content/${i.id}`} 
                          className="font-semibold text-slate-800  hover:text-sky-600 transition-colors text-base mb-2 line-clamp-2"
                        >
                          {i.title}
                        </Link>

                        {/* Banner preview (if present) */}
                        {i.banner && (
                          <div className="mb-2">
                            {/* plain img is fine in CRA/react; if linter flags, see ESLint note below */}
                            <img src={i.banner} alt={`${i.title} banner`} className="w-full h-52 object-cover rounded-md mb-2 border" />
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(i.category)}`}>
                            {i.category}
                          </span>
                          {i.published ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200">
                              <Eye className="w-3 h-3" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border border-gray-200">
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </span>
                          )}
                          {i.views > 0 && (
                            <span className="text-xs text-gray-500">{i.views} views</span>
                          )}
                          {i.pdf && (
                            <a
                              href={i.pdf}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 underline ml-1"
                            >
                              View PDF
                            </a>
                          )}
                          {i.createdAt && (
                            <span className="text-xs text-gray-400 ml-2">• {new Date(i.createdAt).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openModal(i.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all border border-blue-200"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => remove(i.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-all border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 px-6 py-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                {editing ? 'Edit Content' : 'Create New Content'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={form.title || ''}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                >
                  <option>Publications</option>
                  <option>Webinars</option>
                  <option>Announcements</option>
                  <option>What's New</option>
                </select>
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                <textarea
                  placeholder="Enter content"
                  value={form.body || ''}
                  onChange={e => setForm({ ...form, body: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm font-mono"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Video URL (Optional)</label>
                <input
                  type="text"
                  placeholder="full embed URL. e.g https://www.youtube.com/embed/xxxxx"
                  value={form.videoUrl || ''}
                  onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                {form.videoUrl && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Preview (if embeddable):</span>
                    <div className="mt-1">
                      <div className="w-full max-h-44 overflow-hidden rounded-md border">
                        {/* use iframe for common embed URLs; it will fall back harmlessly if not embeddable */}
                        <iframe
                          src={form.videoUrl}
                          title="video preview"
                          className="w-full h-40"
                          style={{ border: 'none' }}
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PDF URL */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePDFUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />

                {form.pdf && (
                  <p className="text-xs text-green-700 mt-1">PDF uploaded ✓</p>
                )}
              </div> */}

              {/* Banner URL */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />

                {form.banner && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Preview:</span>
                    <img
                      src={form.banner}
                      alt="banner preview"
                      className="w-full max-h-44 object-cover rounded-md border mt-1"
                    />
                  </div>
                )}
              </div> */}

              {/* Upload PDF (improved chooser) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload PDF</label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handlePDFUpload({ dataTransfer: e.dataTransfer }); }}
                  className="group relative border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-sky-300 transition"
                  aria-label="Upload PDF dropzone"
                >
                  <div className="flex-shrink-0 bg-sky-50 rounded-md p-3">
                    <FileText className="w-6 h-6 text-sky-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">PDF file</div>
                        <div className="text-xs text-gray-500">Drag & drop here or click to choose.</div>
                      </div>

                      <div className="sm:flex sm:items-center gap-2 hidden">
                        <label
                          htmlFor="pdf-upload"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-md text-sm cursor-pointer select-none"
                        >
                          Choose PDF
                        </label>
                      </div>
                    </div>

                    {/* small details */}
                    <div className="mt-3 flex items-center gap-3">
                      {form._pdfName ? (
                        <>
                          <div className="text-sm text-gray-700 font-medium truncate">{form._pdfName}</div>
                          <div className="text-xs text-gray-400">• {formatBytes(form._pdfSize)}</div>
                          <button
                            type="button"
                            onClick={removePDF}
                            className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-xs border border-red-100"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">No PDF selected</div>
                      )}
                    </div>
                  </div>

                  {/* hidden native input (clickable via label) */}
                  <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    className="sr-only"
                  />
                </div>

                {form.pdf && (
                  <p className="text-xs text-green-700 mt-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> PDF uploaded ✓
                  </p>
                )}
              </div>

              {/* Upload Banner (improved chooser + preview) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Banner</label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleBannerUpload({ dataTransfer: e.dataTransfer }); }}
                  className="group relative border rounded-lg overflow-hidden bg-gray-50 p-2"
                >
                  {/* preview area */}
                  <div className={`w-full h-44 rounded-md bg-gray-100 flex items-center justify-center ${form.banner ? 'p-0' : 'p-6'}`}>
                    {form.banner ? (
                      <img src={form.banner} alt="banner preview" className="w-full h-44 object-cover" />
                    ) : (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm mx-auto mb-2">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="text-sm text-gray-600">Drop banner here or choose a file</div>
                        <div className="text-xs text-gray-400 mt-1">Recommended: 1200×400 (JPG/PNG)</div>
                      </div>
                    )}
                  </div>

                  {/* controls row */}
                  <div className="mt-3 flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="banner-upload"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm cursor-pointer hover:bg-gray-50"
                      >
                        Select image
                      </label>

                      {form._bannerName ? (
                        <div className="text-sm text-gray-700">
                          <div className="font-medium truncate max-w-xs">{form._bannerName}</div>
                          <div className="text-xs text-gray-400">{formatBytes(form._bannerSize)}</div>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      {form.banner && (
                        <button
                          type="button"
                          onClick={removeBanner}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-md text-sm border border-red-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="sr-only"
                  />
                </div>
              </div>


              {/* Published Checkbox */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published || false}
                    onChange={e => setForm({ ...form, published: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">Publish immediately</span>
                    <span className="text-xs text-gray-500">Make this content visible to all users</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editing ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
