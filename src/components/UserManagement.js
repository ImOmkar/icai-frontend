import React, {useEffect, useState} from 'react';
import { Users, UserCheck, UserX, UserMinus, Shield } from 'lucide-react';
import API from '../api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    setLoading(true);
    API.get('/users').then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }

  function toggleActive(user) {
    const payload = { ...user, active: !user.active };
    API.put(`/users/${user.id}`, payload).then(() => fetchUsers()).catch(() => alert('Failed to update'));
  }

  function anonymize(user) {
    if (!window.confirm(`Anonymize user ${user.name}? This will remove PII (demo).`)) return;
    const anonym = { ...user, name: `anon-${user.id}`, email: `anon+${user.id}@example.com`, phone: null, membership: null, active: false, anonymizedAt: new Date().toISOString() };
    API.put(`/users/${user.id}`, anonym).then(() => {
      API.post('/logs', { type: 'anonymize', userId: user.id, at: new Date().toISOString(), note: 'DPDPA anonymize demo' }).finally(() => fetchUsers());
    }).catch(() => alert('Failed to anonymize (demo)'));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600 text-lg">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 md:mt-4 m-0 p-2 ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-3 rounded-xl">
              <Users className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-bold text-slate-800">User Management</h2>
          </div>
          <p className="text-slate-600 ml-16">Manage user accounts, permissions, and data privacy</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {users.filter(u => u.active).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Inactive Users</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {users.filter(u => !u.active && !u.anonymizedAt).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <UserX className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Anonymized</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {users.filter(u => u.anonymizedAt).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 text-white">
                  <th className="text-left py-4 px-6 font-semibold">Name</th>
                  <th className="text-left py-4 px-6 font-semibold">Membership</th>
                  <th className="text-left py-4 px-6 font-semibold">Email</th>
                  <th className="text-left py-4 px-6 font-semibold">Phone</th>
                  <th className="text-left py-4 px-6 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr 
                    key={u.id} 
                    className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                      u.anonymizedAt ? 'bg-purple-50' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{u.name}</span>
                        {u.anonymizedAt && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                            Anonymized
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {u.membership ? (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          u.membership === 'Premium' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.membership}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{u.email || '-'}</td>
                    <td className="py-4 px-6 text-slate-600">{u.phone || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${
                        u.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${u.active ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleActive(u)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105 ${
                            u.active
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => anonymize(u)}
                          className="px-4 py-2 rounded-lg font-medium text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all hover:scale-105 flex items-center gap-1"
                        >
                          <Shield size={16} />
                          Anonymize
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-slate-500 text-sm">
          Total Users: {users.length}
        </div>
      </div>
    </div>
  );
}