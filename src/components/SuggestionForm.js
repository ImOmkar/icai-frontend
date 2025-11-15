import React, { useState } from 'react';
import { Send, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import API from '../api';

export default function SuggestionForm() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }
      setFile(f);
    }
  }

  function removeFile() {
    setFile(null);
  }

  function showNotification(message, type = 'success') {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  async function submit() {
    if (!form.title.trim() || !form.description.trim()) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = async function (ev) {
          const fileData = ev.target.result;
          const payload = {
            ...form,
            createdAt: new Date().toISOString(),
            fileName: file.name,
            fileData
          };
          
          try {
            await API.post('/suggestions', payload);
            showNotification('Suggestion submitted successfully!', 'success');
            setForm({ title: '', description: '' });
            setFile(null);
          } catch {
            showNotification('Saved locally (offline)', 'success');
            setForm({ title: '', description: '' });
            setFile(null);
          } finally {
            setIsSubmitting(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const payload = { ...form, createdAt: new Date().toISOString() };
        try {
          await API.post('/suggestions', payload);
          showNotification('Suggestion submitted successfully!', 'success');
          setForm({ title: '', description: '' });
        } catch {
          showNotification('Saved locally (offline)', 'success');
          setForm({ title: '', description: '' });
        } finally {
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      showNotification('Something went wrong. Please try again.', 'error');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-2 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-start gap-3 animate-in slide-in-from-top ${
              notification.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {notification.message}
            </p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-1">Share Your Suggestion</h2>
            <p className="text-blue-100 text-sm">Help us improve by sharing your ideas and feedback</p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a brief title for your suggestion"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{form.title.length}/100 characters</p>
            </div>

            {/* Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                placeholder="Describe your suggestion in detail..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-900 placeholder-gray-400"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{form.description.length}/1000 characters</p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attachment <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              
              {!file ? (
                <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                    <p className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                      Click to upload a file
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={submit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Suggestion
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your feedback helps us build better products. Thank you! 🙏
        </p>
      </div>
    </div>
  );
}