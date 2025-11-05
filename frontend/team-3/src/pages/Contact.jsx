import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Contact() {
  const { api } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      return "Please fill in all fields.";
    }
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim());
    if (!emailOk) return "Please enter a valid email.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus({ loading: false, success: null, error: validationError });
      return;
    }
    setStatus({ loading: true, success: null, error: null });
    try {
      const resp = await api.post(`/support_ticket`, form);
      const data = resp?.data || {};
      console.log("Response:", resp.status, data);

      if (resp.status >= 200 && resp.status < 300) {
        setStatus({
          loading: false,
          success: "Thanks! We received your message.",
          error: null,
        });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        const errorMsg =
          data?.error ||
          data?.message ||
          `Server error (${resp.status}). Please try again.`;
        setStatus({
          loading: false,
          success: null,
          error: errorMsg,
        });
      }
    } catch (err) {
      console.error("Request error:", err);
      setStatus({
        loading: false,
        success: null,
        error:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          `Network error: ${err.message}. Please check your connection and try again.`,
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="!text-5xl sm:!text-6xl font-extrabold tracking-tight font-urbanist sky-gradient-text">
            Contact Us
          </h1>
          <div className="h-1 w-24 mx-auto rounded sky-gradient" />
          <p className="text-gray-600">
            Have a question or need help? Send us a message.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white/50 dark:bg-white/10 backdrop-blur rounded-2xl border shadow-sm p-6 sm:p-8 space-y-5"
        >
          {status.error && (
            <div className="rounded-md border border-red-200 bg-red-50 text-red-800 px-4 py-2 text-sm">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="rounded-md border border-green-200 bg-green-50 text-green-800 px-4 py-2 text-sm">
              {status.success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-left">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={updateField}
                className="w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </div>
            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                className="w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="jane@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="text-left">
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              value={form.subject}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="How can we help?"
            />
          </div>

          <div className="text-left">
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={form.message}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Tell us a bit more..."
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={status.loading}
              className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] hover:shadow-lg hover:shadow-[#ac1ec4]/30 transition-all disabled:opacity-60"
            >
              {status.loading ? "Sending..." : "Send Message"}
            </button>
            <p className="text-xs text-gray-500">
              We’ll get back to you via email.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
