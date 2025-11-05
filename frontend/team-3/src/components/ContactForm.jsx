import { useState } from "react";

export default function ContactForm() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "7388a9fc-6495-4faa-8650-34ea4a6b0e8d");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      setResult("Error");
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-3xl bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff] border border-[#ac1ec4]/20 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8a01] via-[#ac1ec4] to-[#1c50fe]"></div>

        <div className="p-6 sm:p-10 lg:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
            Contact Us
          </h3>
          <p className="text-center text-slate-600 mb-8">
            Have a question or feedback? Send us a message below.
          </p>

          <form onSubmit={onSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
                Your Name
              </label>
              <div className="flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4] transition-all">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g: Ada Lovelace"
                  aria-label="Name"
                  className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
                Email Address
              </label>
              <div className="flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4] transition-all">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g: ada@analytical.engine"
                  aria-label="Email"
                  className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
                Message
              </label>
              <div className="bg-white/80 px-3 py-2 rounded-md ring-1 ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4] transition-all">
                <textarea
                  name="message"
                  required
                  rows="5"
                  placeholder="How can we help?"
                  aria-label="Message"
                  className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500 resize-y min-h-[120px]"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-md font-semibold text-white bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] hover:shadow-lg hover:shadow-[#ac1ec4]/30 transition-all duration-200 hover:scale-[1.02]"
            >
              Submit Form
            </button>

            {result && (
              <div
                className={`text-sm text-center mt-2 p-3 rounded-md border ${
                  result === "Form Submitted Successfully"
                    ? "bg-green-50 text-green-600 border-green-200"
                    : result === "Sending...."
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {result}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
