import React, { useEffect, useState } from 'react';
import { Download, ExternalLink, BookOpen, Wifi, WifiOff, CheckCircle, FileText } from 'lucide-react';
import API from '../api'
import { Link } from 'react-router-dom';

const registerServiceWorker = () => {};
const cacheUrls = (urls) => {
  console.log('Caching URLs:', urls);
};

export default function OfflineReading() {
  const [content, setContent] = useState([]);
  const [offlineList, setOfflineList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registerServiceWorker();
    API.get('/content')
      .then(r => {
        setContent(r.data.filter(c => c.pdf));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    const saved = JSON.parse(localStorage.getItem('offlineList') || '[]');
    setOfflineList(saved);
  }, []);

  function toggleOffline(item) {
    let updated;
    if (offlineList.includes(item.id)) {
      updated = offlineList.filter(id => id !== item.id);
    } else {
      updated = [item.id, ...offlineList];
      cacheUrls([item.pdf]);
    }
    setOfflineList(updated);
    localStorage.setItem('offlineList', JSON.stringify(updated));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Offline Reading</h2>
              <p className="text-gray-600 text-sm mt-1">Cache documents for offline access</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">How It Works</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Mark items to cache PDFs for offline reading. Service worker technology enables seamless access even without an internet connection.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        {content.length > 0 && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{content.length}</span> documents available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-500" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-indigo-600">{offlineList.length}</span> cached offline
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">Loading documents...</p>
            </div>
          </div>
        ) : content.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Available</h3>
            <p className="text-gray-500 text-sm">Check back later for new content</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {content.map(c => {
              const isOffline = offlineList.includes(c.id);
              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${
                    isOffline
                      ? 'border-indigo-200 bg-indigo-50/30'
                      : 'border-gray-100 hover:border-indigo-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 ${
                            isOffline ? 'bg-indigo-100' : 'bg-gray-100'
                          }`}
                        >
                          <FileText
                            className={`w-5 h-5 ${
                              isOffline ? 'text-indigo-600' : 'text-gray-500'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            {/* {c.title} */}
                            <Link 
                              to={`/content/${c.id}`} 
                              className="font-semibold text-slate-800  hover:text-sky-600 transition-colors text-base mb-2 line-clamp-2"
                            >
                              {c.title}
                            </Link>
                            {isOffline && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Cached
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">{c.title}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleOffline(c)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            isOffline
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm'
                          }`}
                        >
                          {isOffline ? (
                            <>
                              <WifiOff className="w-4 h-4" />
                              Remove from Offline
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Mark for Offline
                            </>
                          )}
                        </button>

                        <a
                          href={c.pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}