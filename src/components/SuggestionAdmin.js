import React, {useEffect, useState} from 'react';
import { Lightbulb, Download, FileText, Paperclip, Calendar, MessageSquare, ArrowDownToLine } from 'lucide-react';
import API from '../api';

function toCSV(rows){
  if(!rows.length) return '';
  const keys = Object.keys(rows[0]);
  const lines = rows.map(r => keys.map(k => {
    const v = r[k] === null || r[k] === undefined ? '' : String(r[k]).replace(/"/g,'""');
    return `"${v}"`;
  }).join(','));
  return `"${keys.join('","')}"\n` + lines.join('\n');
}

export default function SuggestionAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => fetchList(), []);

  function fetchList(){
    setLoading(true);
    API.get('/suggestions').then(r => {
      // normalize: if suggestion has no status treat as pending
      const normalized = (r.data || []).map(s => ({ status: 'pending', ...s, ...(s.status ? {status: s.status} : {}) }));
      setList(normalized.reverse());
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  function downloadAttachment(item){
    if(!item.fileData || !item.fileName) { alert('No file attached'); return; }
    const link = document.createElement('a');
    link.href = item.fileData;
    link.download = item.fileName || 'attachment';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function exportCSV(){
    const csvRows = list.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description,
      createdAt: l.createdAt,
      fileName: l.fileName || '',
      status: l.status || 'pending',
      moderator: l.moderator || '',
      moderatedAt: l.moderatedAt || ''
    }));
    const csv = toCSV(csvRows);
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'suggestions.csv'; a.click(); URL.revokeObjectURL(url);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  // moderation action
  async function setStatus(item, newStatus) {
    if (!item || !item.id) return;
    const moderator = getModeratorName();
    const moderatedAt = new Date().toISOString();
    // ask for confirmation for reject
    if (newStatus === 'rejected' && !window.confirm(`Reject suggestion #${item.id}?`)) return;

    try {
      // patch the suggestion with status, moderator, moderatedAt
      await API.patch(`/suggestions/${item.id}`, { status: newStatus, moderator, moderatedAt });
      // optionally add a log entry
      await API.post('/logs', { type: 'moderation', suggestionId: item.id, action: newStatus, moderator, at: moderatedAt });
      // refresh list
      fetchList();
    } catch (err) {
      console.error('Moderation failed', err);
      alert('Failed to update status (demo).');
    }
  }

  function getModeratorName(){
    try {
      const raw = localStorage.getItem('sessionUser');
      if (!raw) return 'admin';
      const user = JSON.parse(raw);
      return user.name || user.email || 'admin';
    } catch {
      return 'admin';
    }
  }

  async function bulkApprovePending(){
    if (!window.confirm('Approve all pending suggestions?')) return;
    const pending = list.filter(s => (s.status || 'pending') === 'pending');
    const moderator = getModeratorName();
    const moderatedAt = new Date().toISOString();
    try {
      // patch each (simple loop — ok for prototype)
      for (const s of pending) {
        await API.patch(`/suggestions/${s.id}`, { status: 'approved', moderator, moderatedAt });
        await API.post('/logs', { type: 'moderation', suggestionId: s.id, action: 'approved', moderator, at: moderatedAt });
      }
      fetchList();
    } catch (err) {
      console.error(err);
      alert('Bulk approve failed (demo).');
    }
  }

  if(loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-600 text-lg">Loading suggestions...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = list.filter(s => (s.status || 'pending') === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 md:mt-4 m-0 p-2 ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-3 rounded-xl shadow-lg">
                <Lightbulb className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-800">Suggestions</h2>
                <p className="text-slate-600">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {pendingCount > 0 && (
                <button 
                  onClick={bulkApprovePending}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  Approve All Pending
                </button>
              )}

              <button 
                onClick={exportCSV}
                className="bg-gradient-to-br from-sky-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <ArrowDownToLine size={20} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-4 rounded-xl">
                <MessageSquare className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Suggestions</p>
                <p className="text-3xl font-bold text-slate-800">{list.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-xl">
                <Paperclip className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">With Attachments</p>
                <p className="text-3xl font-bold text-slate-800">
                  {list.filter(s => s.fileName).length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-4 rounded-xl">
                <FileText className="text-pink-600" size={24} />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Recent (7 days)</p>
                <p className="text-3xl font-bold text-slate-800">
                  {list.filter(s => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(s.createdAt) > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Total Suggestions */}
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-4 rounded-xl">
                <MessageSquare className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Suggestions</p>
                <p className="text-3xl font-bold text-slate-800">{list.length}</p>
              </div>
            </div>

            {/* With Attachments */}
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-xl">
                <Paperclip className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">With Attachments</p>
                <p className="text-3xl font-bold text-slate-800">
                  {list.filter(s => s.fileName).length}
                </p>
              </div>
            </div>

            {/* Recent 7 days */}
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-4 rounded-xl">
                <FileText className="text-pink-600" size={24} />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Recent (7 days)</p>
                <p className="text-3xl font-bold text-slate-800">
                  {
                    list.filter(s => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(s.createdAt) > weekAgo;
                    }).length
                  }
                </p>
              </div>
            </div>

            {/* Approved */}
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-4 rounded-xl">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-slate-800">
                  {list.filter(s => (s.status || 'pending') === 'approved').length}
                </p>
              </div>
            </div>

            {/* Rejected */}
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-4 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-slate-800">
                  {list.filter(s => (s.status || 'pending') === 'rejected').length}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {list.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="inline-block bg-slate-100 p-6 rounded-full mb-4">
                <Lightbulb className="text-slate-400" size={48} />
              </div>
              <p className="text-slate-500 text-lg">No suggestions yet</p>
              <p className="text-slate-400 text-sm mt-2">Check back later for user feedback and ideas</p>
            </div>
          )}
          
          {list.map((s, idx) => {
            const status = (s.status || 'pending');
            return (
            <div 
              key={s.id} 
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border-l-4"
              style={{ borderColor: status === 'approved' ? '#10b981' : status === 'rejected' ? '#ef4444' : '#6366f1' }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                      #{s.id}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800">{s.title}</h3>

                    {/* status badge */}
                    <span className={`ml-3 text-sm font-semibold px-3 py-1 rounded-full ${
                      status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {status.toUpperCase()}
                    </span>

                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar size={16} />
                    <span>{formatDate(s.createdAt)}</span>
                    {s.moderator && <span className="ml-3 text-xs text-slate-400">• moderated by {s.moderator} on {formatDate(s.moderatedAt)}</span>}
                  </div>
                </div>
                
                {s.fileName && (
                  <button 
                    onClick={() => downloadAttachment(s)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                )}
              </div>

              <p className="text-slate-700 leading-relaxed mb-4">{s.description}</p>

              {s.fileName && (
                <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 border border-slate-200 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Paperclip className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Attachment</p>
                    <p className="text-sm text-slate-500">{s.fileName}</p>
                  </div>
                </div>
              )}

              {/* moderation actions */}
              <div className="flex items-center gap-3">
                {(status === 'pending') ? (
                  <>
                    <button
                      onClick={() => setStatus(s, 'approved')}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => setStatus(s, 'rejected')}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-slate-600">Moderation complete</div>
                )}
              </div>
            </div>
          )})}
        </div>

        {/* Footer */}
        {list.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Showing all {list.length} suggestion{list.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
