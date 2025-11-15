import React, {useEffect, useState} from 'react';
import { Activity, AlertCircle, Info, CheckCircle, XCircle, Database, Clock, FileText, UserCheck, Undo2 } from 'lucide-react';
import API from '../api';

export default function LogsAdmin(){
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get('/logs').then(r => setLogs((r.data || []).reverse())).catch(() => {});
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function getLogIcon(type) {
    switch((type || '').toLowerCase()) {
      case 'error':
        return <XCircle className="text-red-600" size={20} />;
      case 'warning':
        return <AlertCircle className="text-orange-600" size={20} />;
      case 'info':
        return <Info className="text-blue-600" size={20} />;
      case 'anonymize':
        return <Database className="text-purple-600" size={20} />;
      case 'login':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'moderation':
        return <UserCheck className="text-indigo-600" size={20} />;
      default:
        return <FileText className="text-slate-600" size={20} />;
    }
  }

  function getLogStyle(type) {
    switch((type || '').toLowerCase()) {
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-orange-500 bg-orange-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
      case 'anonymize':
        return 'border-purple-500 bg-purple-50';
      case 'login':
        return 'border-green-500 bg-green-50';
      case 'moderation':
        return 'border-indigo-500 bg-indigo-50';
      default:
        return 'border-slate-500 bg-slate-50';
    }
  }

  function getLogBadgeStyle(type) {
    switch((type || '').toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-orange-100 text-orange-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      case 'anonymize':
        return 'bg-purple-100 text-purple-700';
      case 'login':
        return 'bg-green-100 text-green-700';
      case 'moderation':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  const logsByType = logs.reduce((acc, log) => {
    const type = (log.type || 'other').toLowerCase();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen md:mt-4 m-0 p-2 ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-3 rounded-xl shadow-lg">
              <Activity className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-bold">Server Logs</h2>
              <p className="text-slate-600">Real-time system activity monitoring (demo)</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-100 rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Logs</span>
              <Activity className="text-cyan-400" size={20} />
            </div>
            <p className="text-3xl font-bold">{logs.length}</p>
          </div>

          <div className="bg-gray-100 rounded-xl shadow-lg p-5 ">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Errors</span>
              <XCircle className="text-red-400" size={20} />
            </div>
            <p className="text-3xl font-bold">{logsByType.error || 0}</p>
          </div>

          <div className="bg-gray-100 rounded-xl shadow-lg p-5 ">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Warnings</span>
              <AlertCircle className="text-orange-400" size={20} />
            </div>
            <p className="text-3xl font-bold">{logsByType.warning || 0}</p>
          </div>

          <div className="bg-gray-100 rounded-xl shadow-lg p-5 ">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Info</span>
              <Info className="text-blue-400" size={20} />
            </div>
            <p className="text-3xl font-bold">{logsByType.info || 0}</p>
          </div>

          <div className="bg-gray-100 rounded-xl shadow-lg p-5 ">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Moderation</span>
              <UserCheck className="text-indigo-400" size={20} />
            </div>
            <p className="text-3xl font-bold">{logsByType.moderation || 0}</p>
          </div>
        </div>

        {/* Logs Container */}
        <div className="bg-gray-100 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-300">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FileText size={20} />
              Activity Log
            </h3>
          </div>

          <div className="p-4 max-h-[600px] overflow-y-auto">
            {logs.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block bg-slate-700 p-6 rounded-full mb-4">
                  <Activity className="text-slate-500" size={48} />
                </div>
                <p className="text-slate-400 text-lg">No logs yet</p>
                <p className="text-slate-500 text-sm mt-2">System activity will appear here</p>
              </div>
            )}

            <div className="space-y-3">
              {logs.map((l, idx) => {
                const type = (l.type || 'other').toLowerCase();

                // Special rendering for moderation logs
                if (type === 'moderation') {
                  return (
                    <div key={idx} className={`rounded-xl border-l-4 ${getLogStyle(l.type)} p-4 hover:shadow-md transition-all`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <UserCheck className="text-indigo-600" size={20} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getLogBadgeStyle(l.type)}`}>
                              {l.type}
                            </span>

                            <div className="flex items-center gap-1 text-slate-600 text-sm">
                              <Clock size={14} />
                              <span>{formatDate(l.at)}</span>
                            </div>
                          </div>

                          <div className="text-slate-800 font-medium mb-2">
                            Moderation action <span className="font-semibold">{l.action?.toUpperCase() || '-'}</span> on suggestion <span className="font-mono bg-white px-2 py-1 rounded">{l.suggestionId || l.suggestionID || l.suggestion || '-'}</span>
                          </div>

                          <div className="text-sm text-slate-600">
                            Moderator: <span className="font-medium">{l.moderator || l.user || 'unknown'}</span>
                          </div>

                          {l.note && (
                            <div className="mt-2 text-sm text-slate-700">
                              Note: {l.note}
                            </div>
                          )}

                          {l.details && (
                            <div className="mt-2 text-xs text-slate-600">
                              Details: {typeof l.details === 'string' ? l.details : JSON.stringify(l.details)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Default rendering for other log types
                return (
                  <div key={idx} className={`rounded-xl border-l-4 ${getLogStyle(l.type)} p-4 hover:shadow-md transition-all`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getLogIcon(l.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getLogBadgeStyle(l.type)}`}>
                            {l.type}
                          </span>
                          <div className="flex items-center gap-1 text-slate-600 text-sm">
                            <Clock size={14} />
                            <span>{formatDate(l.at)}</span>
                          </div>
                        </div>
                        
                        <div className="text-slate-800 font-medium">
                          {l.note || (typeof l === 'string' ? l : JSON.stringify(l))}
                        </div>
                        
                        {l.userId && (
                          <div className="mt-2 text-xs text-slate-600">
                            User ID: <span className="font-mono bg-white px-2 py-1 rounded">{l.userId}</span>
                          </div>
                        )}
                        
                        {l.details && (
                          <div className="mt-2 text-xs text-slate-600">
                            Details: {typeof l.details === 'string' ? l.details : JSON.stringify(l.details)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        {logs.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Showing {logs.length} log entr{logs.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
