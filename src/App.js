// import React, {useState, useEffect} from 'react';
// import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import Feed from './components/Feed';
// import ContentView from './components/ContentView';
// import AdminCMS from './components/AdminCMS';
// import SuggestionForm from './components/SuggestionForm';
// import Analytics from './components/Analytics';
// import UserManagement from './components/UserManagement';
// import SuggestionAdmin from './components/SuggestionAdmin';
// import OfflineReading from './components/OfflineReading';
// import LogsAdmin from './components/LogsAdmin';
// import PushListener from './components/PushListener';

// function Header({user, onLogout}) {
//   return (
//     <header>
//       <Link to="/" style={{color:'white', marginRight:12}}>Feed</Link>
//       <Link to="/suggestions" style={{color:'white', marginRight:12}}>Suggest</Link>
//       <Link to="/admin" style={{color:'white', marginRight:12}}>Admin</Link>
//       <Link to="/admin/users" style={{color:'white', marginRight:12}}>Users</Link>
//       <Link to="/admin/suggestions" style={{color:'white', marginRight:12}}>Suggestions (Admin)</Link>
//       <Link to="/admin/logs" style={{color:'white', marginRight:12}}>Logs</Link>
//       <Link to="/offline" style={{color:'white', marginRight:12}}>Offline</Link>

//       <div style={{marginLeft:'auto'}} className="small">
//         {user ? (
//           <>
//             <span style={{marginRight:8}}>Hi, {user.name}</span>
//             <button onClick={onLogout} className="secondary">Logout</button>
//           </>
//         ) : (
//           <Link to="/login" style={{color:'white'}}>Login</Link>
//         )}
//       </div>
//     </header>
//   );
// }

// function Protected({children}) {
//   const user = localStorage.getItem('sessionUser');
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// }

// export default function App(){
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('sessionUser') || 'null'));

//   useEffect(()=> {
//     const stored = localStorage.getItem('sessionUser');
//     if(stored) setUser(JSON.parse(stored));
//   }, []);

//   function handleLogout() {
//     localStorage.removeItem('sessionUser');
//     setUser(null);
//     window.location = '/';
//   }

//   return (
//     <BrowserRouter>
//       <Header user={user} onLogout={handleLogout} />
//       {/* global push polling/rendering */}
//       <PushListener />
//       <div className="container">
//         <Routes>
//           <Route path="/login" element={<Login onLogin={(u)=>{ localStorage.setItem('sessionUser', JSON.stringify(u)); window.location = '/'; }} />} />
//           <Route path="/" element={<Feed />} />
//           <Route path="/content/:id" element={<ContentView />} />
//           <Route path="/suggestions" element={<SuggestionForm />} />

//           {/* Admin protected routes */}
//           <Route path="/admin" element={<Protected><AdminCMS /></Protected>} />
//           <Route path="/admin/analytics" element={<Protected><Analytics /></Protected>} />

//           {/* Newly added admin pages */}
//           <Route path="/admin/users" element={<Protected><UserManagement /></Protected>} />
//           <Route path="/admin/suggestions" element={<Protected><SuggestionAdmin /></Protected>} />
//           <Route path="/admin/logs" element={<Protected><LogsAdmin /></Protected>} />

//           {/* Offline reading */}
//           <Route path="/offline" element={<OfflineReading />} />

//           {/* fallback route (optional) */}
//           <Route path="*" element={<Feed />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }


import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Feed from './components/Feed';
import ContentView from './components/ContentView';
import AdminCMS from './components/AdminCMS';
import SuggestionForm from './components/SuggestionForm';
import Analytics from './components/Analytics';
import UserManagement from './components/UserManagement';
import SuggestionAdmin from './components/SuggestionAdmin';
import OfflineReading from './components/OfflineReading';
import LogsAdmin from './components/LogsAdmin';
import PushListener from './components/PushListener';
import AdminProfile from './components/AdminProfile';

function Header({user, onLogout}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const navLinks = [
    { to: '/', label: 'Feed', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { to: '/suggestions', label: 'Suggest', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { to: '/offline', label: 'Offline', icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
  ];
  
  const adminLinks = [
    { to: '/admin', label: 'CMS', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },    
    { to: '/admin/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { to: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { to: '/admin/suggestions', label: 'Suggestions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { to: '/admin/logs', label: 'Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
  ];

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 shadow-xl border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">Portal</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(link.to)
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              
              {/* Admin Dropdown */}
              {/* {user && (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    <span className="font-medium">Admin</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2">
                      {adminLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                            isActive(link.to)
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                          </svg>
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )} */}

              {user && (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    <span className="font-medium">{user.role === 'admin' ? "Admin" : "Member"}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2">
                      {user.role === 'admin' ? (
                        // full admin links for admin
                        adminLinks.map(link => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                              isActive(link.to)
                                ? 'bg-sky-600 text-white'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                            </svg>
                            <span className="font-medium">{link.label}</span>
                          </Link>
                        ))
                      ) : (
                        // regular user: only show profile item
                        <Link
                          to="/admin/profile"
                          className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                            isActive('/admin/profile')
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={adminLinks[1].icon} />
                          </svg>
                          <span className="font-medium">Profile</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-200 font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-all shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-700">
              <div className="space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(link.to)
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                    </svg>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
                
                {/* {user && (
                  <div className="pt-2 mt-2 border-t border-slate-700">
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</div>
                    {adminLinks.map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all ${
                          isActive(link.to)
                            ? 'bg-sky-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                        </svg>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                )} */}

                {user && (
                <div className="pt-2 mt-2 border-t border-slate-700">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</div>
                  {user.role === 'admin'
                    ? adminLinks.map(link => (
                        <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all ${
                            isActive(link.to) ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                          </svg>
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      ))
                    : (
                      <Link
                        to="/admin/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all ${
                          isActive('/admin/profile') ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={adminLinks[1].icon} />
                        </svg>
                        <span className="font-medium">Profile</span>
                      </Link>
                    )
                  }
                </div>
              )}

              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

function Protected({children}) {
  const user = localStorage.getItem('sessionUser');
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('sessionUser') || 'null'));


  useEffect(()=> {
    const stored = localStorage.getItem('sessionUser');
    if(stored) setUser(JSON.parse(stored));
  }, []);
  
  function handleLogout() {
    localStorage.removeItem('sessionUser');
    setUser(null);
    window.location = '/';
  }
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Header user={user} onLogout={handleLogout} />
        <PushListener />
        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/login" element={<Login onLogin={(u)=>{ localStorage.setItem('sessionUser', JSON.stringify(u)); window.location = '/'; }} />} />
            <Route path="/" element={<Feed />} />
            <Route path="/content/:id" element={<ContentView />} />
            <Route path="/suggestions" element={<SuggestionForm />} />
            <Route path="/admin" element={<Protected><AdminCMS /></Protected>} />
            <Route path="/admin/analytics" element={<Protected><Analytics /></Protected>} />
            <Route path="/admin/users" element={<Protected><UserManagement /></Protected>} />
            <Route path="/admin/suggestions" element={<Protected><SuggestionAdmin /></Protected>} />
            <Route path="/admin/logs" element={<Protected><LogsAdmin /></Protected>} />
            <Route path="/admin/profile" element={<Protected><AdminProfile /></Protected>} />
            <Route path="/offline" element={<OfflineReading />} />
            <Route path="*" element={<Feed />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}