import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ShareCard({ title = 'Check this out', url = window.location.href }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const shareText = `${title} —`; // customize the share text

  useEffect(() => {
    function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); 
        }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);


  function handleShareToggle() {
    setMenuOpen(prev => !prev);
  }

  // Open X (Twitter) intent composer
  function handleShareX() {
    const text = encodeURIComponent(shareText);
    const shareUrl = encodeURIComponent(url);
    const intentUrl = `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer,width=600,height=420');
    setMenuOpen(false);
  }

  // Use Web Share API if available
  async function handleNativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: shareText, url });
      } else {
        // fallback: open X composer
        handleShareX();
      }
    } catch (err) {
      console.warn('Share failed', err);
      alert('Share cancelled or failed');
    } finally {
      setMenuOpen(false);
    }
  }

  // Copy link to clipboard
  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    } catch (err) {
      console.warn('Copy failed', err);
      alert('Could not copy link. You can manually copy: ' + url);
    } finally {
      setMenuOpen(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <button
            onClick={handleShareToggle}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>

          {/* Simple dropdown menu */}
          {menuOpen && (
            <div
              style={{ minWidth: 200 }}
              className="absolute left-0 bottom-12 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50"
            >
              <button
                onClick={handleShareX}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-sky-600" viewBox="0 0 24 24" fill="currentColor">
                  {/* twitter icon (filled) */}
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9A12.13 12.13 0 013 4.89a4.28 4.28 0 001.33 5.72c-.63-.02-1.23-.19-1.75-.49v.05a4.28 4.28 0 003.43 4.2c-.3.08-.62.12-.95.12-.23 0-.45-.02-.66-.06a4.29 4.29 0 004 2.98A8.59 8.59 0 012 19.54 12.11 12.11 0 008.29 21c7.55 0 11.69-6.26 11.69-11.69v-.53A8.36 8.36 0 0022.46 6z" />
                </svg>
                Share to X
              </button>

              {/* <button
                onClick={handleNativeShare}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M12 3v13M7 8l5-5 5 5" />
                </svg>
                Native Share
              </button> */}

              <button
                onClick={handleCopyLink}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 14.828a4 4 0 010-5.657l1.414-1.414a4 4 0 115.657 5.657l-1.414 1.414M9.172 9.172a4 4 0 010 5.657l-1.414 1.414a4 4 0 11-5.657-5.657l1.414-1.414" />
                </svg>
                Copy link
              </button>
            </div>
          )}
        </div>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-5 py-2.5 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all shadow-md font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
