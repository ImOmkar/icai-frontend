import React, {useState} from 'react';
import { Mail, Phone, Lock, Shield, Fingerprint, KeyRound, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import API from '../api';

export default function Login({onLogin}) {
  const [step, setStep] = useState('enter');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [consent, setConsent] = useState(false);

  function sendOtp() {
    const mockOtp = '123456';
    localStorage.setItem('mockOtp', mockOtp);
    localStorage.setItem('loginIdentifier', identifier);
    setStep('otp');
    alert(`(Demo) OTP = ${mockOtp}`);
  }

  function verifyOtp() {
    const saved = localStorage.getItem('mockOtp');
    if (otp === saved) {
      API.get('/users').then(r => {
        const users = r.data;
        const user = users.find(u => u.email === identifier || u.phone === identifier) || users[0];
        if (consent) user.consentGivenAt = new Date().toISOString();
        localStorage.setItem('sessionUser', JSON.stringify(user));
        onLogin(user);
      }).catch(() => {
        const user = {id:0, name:'Demo User', membership:'M-0000', consentGivenAt: consent ? new Date().toISOString() : null};
        localStorage.setItem('sessionUser', JSON.stringify(user));
        onLogin(user);
      });
    } else {
      alert('Invalid OTP (demo uses 123456)');
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-sky-400 to-blue-500 p-4 rounded-2xl shadow-2xl mb-4">
            <Shield className="text-white" size={48} />
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="">Sign in to continue to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
          {step === 'enter' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign in with OTP</h2>
                <p className="text-slate-600 text-sm">Enter your email or phone number to receive a one-time password</p>
              </div>

              {/* Identifier Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-slate-400" size={20} />
                  </div>
                  <input 
                    className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:border-purple-500 focus:outline-none transition-colors" 
                    placeholder="example@email.com or 7548574748" 
                    value={identifier} 
                    onChange={e=>setIdentifier(e.target.value)} 
                  />
                </div>
              </div>

              {/* Biometric Option */}
              <div className="mb-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500" />
                  <Fingerprint className="text-slate-400 group-hover:text-purple-600 transition-colors" size={20} />
                  <span className="text-sm font-medium text-slate-700">Enable biometric authentication</span>
                </label>
                <p className="text-xs text-slate-500 mt-2 ml-11">Quick sign-in with fingerprint or face ID (UI only)</p>
              </div>

              {/* Consent Checkbox */}
              <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={consent} 
                    onChange={e=>setConsent(e.target.checked)} 
                    className="w-5 h-5 mt-0.5 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500" 
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-700 block">I agree to data collection</span>
                    <p className="text-xs text-slate-600 mt-1">By checking this box, you consent to the collection and processing of your personal data as described in our Privacy Policy</p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={sendOtp} 
                  className="flex-1 bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-xl px-4 py-3 font-semibold transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                >
                  Send OTP
                  <ArrowRight size={20} />
                </button>
                <button 
                  onClick={()=>{ setIdentifier(''); setConsent(false); }} 
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
                >
                  Clear
                </button>
              </div>

              {/* Demo Notice */}
              {/* <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <KeyRound className="text-amber-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Demo Mode</p>
                    <p className="text-xs text-amber-700 mt-1">This is a demonstration. OTP will be 123456</p>
                  </div>
                </div>
              </div> */}
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="mb-6 text-center">
                <div className="inline-block bg-gradient-to-r from-sky-600 to-blue-600 p-4 rounded-full mb-4">
                  <Lock className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Enter OTP</h2>
                <p className="text-slate-600 text-sm">We've sent a one-time password to your device</p>
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  One-Time Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="text-slate-400" size={20} />
                  </div>
                  <input 
                    className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-cyan-500 focus:outline-none transition-colors" 
                    placeholder="000000" 
                    value={otp} 
                    onChange={e=>setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Demo OTP Display */}
              {/* <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Demo OTP Code</p>
                    <p className="text-2xl font-mono font-bold text-green-700 mt-1">123456</p>
                  </div>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={verifyOtp} 
                  className="flex-1 bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-xl px-4 py-3 font-semibold transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  Verify & Sign In
                </button>
                <button 
                  onClick={()=>setStep('enter')} 
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              </div>

              {/* Resend Option */}
              <div className="mt-6 text-center">
                <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                  Didn't receive the code? Resend OTP
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}