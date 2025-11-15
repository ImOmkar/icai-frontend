import { useEffect, useState } from 'react';
import { User, Mail, Phone, CreditCard, RefreshCw, LogIn, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import API from '../api';

export default function AdminProfile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('sessionUser') || 'null'));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('sessionUser');
    if (!raw) {
      setProfile(null);
      return;
    }
    try {
      const usr = JSON.parse(raw);
      setProfile(usr);
      if (usr && usr.id) refreshProfile(usr.id, false);
    } catch (e) {
      setProfile(null);
    }
  }, []);

  function refreshProfile(idParam, showLoading = true) {
    const raw = localStorage.getItem('sessionUser');
    let id = idParam;
    if (!id && raw) {
      try {
        const u = JSON.parse(raw);
        id = u && u.id;
      } catch {}
    }
    if (!id) {
      return;
    }
    if (showLoading) setLoading(true);
    API.get(`/users/${id}`)
      .then(res => {
        setProfile(res.data);
        localStorage.setItem('sessionUser', JSON.stringify(res.data));
      })
      .catch(() => {})
      .finally(() => {
        if (showLoading) setLoading(false);
      });
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <User className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white">{user.role === "admin" ? "Admin Profile" : "Member Profile"}</h3>
              </div>
            </div>
            
            <div className="p-12 text-center">
              <div className="inline-block bg-slate-100 p-6 rounded-full mb-6">
                <LogIn className="text-slate-400" size={48} />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-3">Not Logged In</h4>
              <p className="text-slate-600 mb-6">No admin is currently logged in. Please login to view your profile.</p>
              <a 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 w-full sm:w-auto"
              >
                <LogIn size={20} />
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm flex-shrink-0">
                  <User className="text-white" size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{user.role === "admin" ? "Admin Profile" : "Member Profile"}</h3>
                  <p className="text-slate-300 text-sm">Manage your account information</p>
                </div>
              </div>
              <button 
                onClick={() => refreshProfile(profile.id)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all backdrop-blur-sm border border-white/20 disabled:opacity-50 w-full sm:w-auto sm:self-end"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Status Badge */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium w-full sm:w-auto justify-center ${
                profile.active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {profile.active ? <CheckCircle size={18} /> : <XCircle size={18} />}
                {profile.active ? 'Active Account' : 'Inactive Account'}
              </div>
              {profile.role && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium w-full sm:w-auto justify-center">
                  <Shield size={18} />
                  {profile.role}
                </div>
              )}
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <User size={16} />
                  Full Name
                </label>
                <div className="text-lg font-semibold text-slate-800">
                  {profile.name || '-'}
                </div>
              </div>

              {/* Membership */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <CreditCard size={16} />
                  Membership No.
                </label>
                <div className="text-lg font-mono font-semibold text-slate-800">
                  {profile.membership || '-'}
                </div>
              </div>

              {/* Email */}
              {profile.email && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <div className="text-lg font-semibold text-slate-800 break-all">
                    {profile.email}
                  </div>
                </div>
              )}

              {/* Phone */}
              {profile.phone && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <div className="text-lg font-mono font-semibold text-slate-800">
                    {profile.phone}
                  </div>
                </div>
              )}
            </div>

            {/* Consent Info */}
            {profile.consentGivenAt && (
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Data Consent Provided</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Consent given on {new Date(profile.consentGivenAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Read-Only Profile</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This shows the logged-in user's basic profile information. Contact system administrator to update these details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="text-blue-600" size={20} />
              </div>
              <h4 className="font-semibold text-slate-800">Account ID</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900">{profile.id || '-'}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Shield className="text-green-600" size={20} />
              </div>
              <h4 className="font-semibold text-slate-800">Access Level</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900">{profile.role || 'Standard'}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <CreditCard className="text-purple-600" size={20} />
              </div>
              <h4 className="font-semibold text-slate-800">Member Type</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900">{profile.membership ? 'Premium' : 'Basic'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}