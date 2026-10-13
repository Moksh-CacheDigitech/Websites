import React from "react";
import { useNavigate } from "react-router-dom";
import { usePageScroll } from '../hooks/usePageScroll';

const OFFERS = [
  {
    title: "Free infrastructure assessment",
    description: "Get a no-obligation review of your current IT infrastructure with recommendations to modernize and secure your environment.",
    cta: "Request assessment",
    highlight: "Complimentary",
  },
  {
    title: "Cloud migration consultation",
    description: "Discuss your cloud strategy with our experts. We help you plan migration, cost optimization, and security.",
    cta: "Book a call",
    highlight: "Free session",
  },
  {
    title: "Security & compliance review",
    description: "Understand your security posture and compliance gaps. We outline a practical roadmap aligned with your goals.",
    cta: "Learn more",
    highlight: "Expert review",
  },
];

function OffersPage() {
  usePageScroll();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#0a0a0b] text-white py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Special offers
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Exclusive value on infrastructure, cloud, and security services. Reach out to see how we can support your goals.
          </p>
        </div>
      </section>

      {/* Offers grid */}
      <section id="offers" className="py-16 sm:py-24 px-6 sm:px-8 lg:px-12 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-(--apple-black) mb-12 text-center">
            Current offers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {OFFERS.map((offer, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-red-100 transition-all duration-300 flex flex-col"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 mb-4">
                  {offer.highlight}
                </span>
                <h3 className="text-xl font-bold text-(--apple-black) mb-3">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                  {offer.description}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/contactus")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  {offer.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-(--apple-black) mb-4">
            Have a specific requirement?
          </h2>
          <p className="text-gray-600 mb-8">
            Tell us about your project and we&apos;ll tailor an offer for you.
          </p>
          <button
            type="button"
            onClick={() => navigate("/contactus")}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact us
          </button>
        </div>
      </section>
    </div>
  );
}

export default OffersPage;
