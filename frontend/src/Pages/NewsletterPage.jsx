import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageScroll } from '../hooks/usePageScroll';

function NewsletterPage() {
  usePageScroll();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#0a0a0b] text-white py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Newsletter
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Stay informed with the latest technology trends, industry insights, and Cache Digitech updates delivered to your inbox.
          </p>
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="py-16 sm:py-24 px-6 sm:px-8 lg:px-12 scroll-mt-20">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-(--apple-black) mb-4 text-center">
            Subscribe to our newsletter
          </h2>
          <p className="text-(--apple-gray) text-center mb-8">
            Get insights on digital transformation, infrastructure, and exclusive updates from our experts.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="mt-4 text-green-600 font-medium text-center">
              Thank you for subscribing. We&apos;ll be in touch.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-6">
            Connect with us for the latest in infrastructure, cloud, and cybersecurity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/contactus")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </button>
            <a
              href="https://www.linkedin.com/company/cache-digitech-pvt-ltd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-red-500 hover:text-red-600 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Follow on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NewsletterPage;
