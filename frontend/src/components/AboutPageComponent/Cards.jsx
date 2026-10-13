import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Globe, Handshake, Target } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

function PartnershipCards() {
  const [benefitsVisible, setBenefitsVisible] = useState(false);
  const [logosVisible, setLogosVisible] = useState(false);
  const benefitsRef = useRef(null);
  const logosRef = useRef(null);

  useEffect(() => {
    const observers = [];
    const createObserver = (ref, setVisible, threshold = 0.1) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
      obs.observe(ref.current);
      observers.push(obs);
    };
    createObserver(benefitsRef, setBenefitsVisible);
    createObserver(logosRef, setLogosVisible);
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* OEM partnerships segregated by category (partnership tier) */
  const OEM_BY_CATEGORY = [
    {
      category: 'Titanium',
      items: [
        { name: 'Dell', level: 'Titanium', logo: '/community/dell.webp' },
      ],
    },
    {
      category: 'Premier',
      items: [
        { name: 'Cisco', level: 'Premier', logo: '/Partners/cisco.webp' },
      ],
    },
    {
      category: 'Gold & Silver',
      items: [
        { name: 'HP', level: 'Gold', logo: '/community/hpelogo.webp' },
        { name: 'Trellix', level: 'Gold', logo: '/Partners/trellix.webp' },
        { name: 'IBM', level: 'Silver', logo: '/community/ibmlogo.webp' },
      ],
    },
    {
      category: 'Cloud & CSP',
      items: [
        { name: 'Microsoft', level: 'CSP', logo: '/community/microsoft.webp' },
        { name: 'GCP', level: 'Partner', logo: '/community/gcp2.webp' },
        { name: 'AWS', level: 'Select', logo: '/community/awslogo.webp' },
        { name: 'Azure', level: 'Member', logo: '/community/microsoft.webp' },
        { name: 'Oracle', level: 'OPN Member', logo: '/community/oracle.webp' },
      ],
    },
    {
      category: 'Advance & MSSP',
      items: [
        { name: 'Fortinet', level: 'Advance, MSSP', logo: '/community/fortinet.webp' },
      ],
    },
    {
      category: 'Authorised',
      items: [
        { name: 'Broadcom', level: 'Authorised', logo: '/Partners/cloudsek.webp' },
        { name: 'Commscope', level: 'Netconnect', logo: '/Partners/everest.webp' },
        { name: 'Arista', level: 'Authorised', logo: '/Partners/arista.webp' },
        { name: 'Extreme', level: 'Authorised', logo: '/Partners/extreme.webp' },
      ],
    },
    {
      category: 'Enrolled',
      items: [
        { name: 'Nutanix', level: 'Enrolled', logo: '/Partners/nutanix.webp' },
        { name: 'Red Hat', level: 'Enrolled', logo: '/community/redhat.webp' },
        { name: 'Beyond Trust', level: 'Enrolled', logo: '/Partners/beyondtrust.webp' },
        { name: 'Tenable', level: 'Enrolled', logo: '/Partners/tenable.webp' },
        { name: 'Tufin', level: 'Enrolled', logo: '/Partners/tenable.webp' },
        { name: 'CrowdStrike', level: 'Enrolled', logo: '/Partners/trellix.webp' },
        { name: 'Firemon', level: 'Enrolled', logo: '/Partners/forescout.webp' },
        { name: 'Zscaler', level: 'Enrolled', logo: '/Partners/zscaler.webp' },
      ],
    },
    {
      category: 'Registered & Preferred',
      items: [
        { name: 'Everest', level: 'Registered', logo: '/Partners/everest.webp' },
        { name: 'Cloudera', level: 'Registered', logo: '/Partners/cloudsek.webp' },
        { name: 'Kaspersky', level: 'Registered', logo: '/Partners/kaspersky.webp' },
        { name: 'Haproxy', level: 'Registered', logo: '/Partners/haproxy.webp' },
        { name: 'Forescout', level: 'Registered', logo: '/Partners/forescout.webp' },
        { name: 'Palo Alto', level: 'Registered, Innovator', logo: '/community/paloalto.webp' },
        { name: 'Veeam', level: 'Registered & SP', logo: '/Partners/veeam.webp' },
        { name: 'IBM Apptio Cloud', level: 'Registered, SP', logo: '/community/ibmlogo.webp' },
        { name: 'NetApp', level: 'Approved, Preferred', logo: '/Partners/netapp.webp' },
      ],
    },
  ];

  /* Flatten all partners and deduplicate by logo so the same image is not shown twice */
  const allPartners = OEM_BY_CATEGORY.flatMap((group) =>
    group.items.map((partner) => ({ ...partner, category: group.category }))
  );
  const seenLogos = new Set();
  const uniquePartners = allPartners.filter((p) => {
    if (seenLogos.has(p.logo)) return false;
    seenLogos.add(p.logo);
    return true;
  });

  const partnershipBenefits = [
    { icon: Award, title: 'Certified Excellence', description: 'Gold and platinum partnerships with leading technology vendors' },
    { icon: Globe, title: 'Global Reach', description: 'Access to worldwide resources and latest technology innovations' },
    { icon: Handshake, title: 'Strategic Alliances', description: 'Deep partnerships enabling comprehensive solution delivery' },
    { icon: Target, title: 'Focused Solutions', description: 'Industry-specific solutions through specialized partnerships' },
  ];

  return (
    <div id="partners" className="min-h-screen bg-[#fafafa]">
      {/* Benefits + Image Section */}
      <section ref={benefitsRef} className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-100/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-red-50/20 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Partnership Benefits */}
            <div className={`space-y-5 transition-all duration-700 ${benefitsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold tracking-[0.2em] uppercase text-red-500 mb-2">Why partner with us</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-(--apple-black) tracking-tight leading-[1.08] mb-10">
                  Partnership Benefits
                </h2>
              </div>
              {partnershipBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className={`flex items-start gap-4 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-red-100 hover:shadow-lg transition-all duration-300 group ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: benefitsVisible ? `${index * 80}ms` : '0ms' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-(--apple-black) mb-1.5 group-hover:text-red-600 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-(--apple-gray) text-[15px] leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Partnership Image */}
            <div className={`relative transition-all duration-700 ${benefitsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: benefitsVisible ? '200ms' : '0ms' }}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: 'loop' }}
                className="rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              >
                <ImageWithFallback
                  src="/girl-hand.webp"
                  alt="Business Partnership"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/consultingservice"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Consulting & Auditing
                  <span className="text-base">&rarr;</span>
                </Link>
                <Link
                  to="/manageservices"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Managed Services
                  <span className="text-base">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos - 3D dome gallery (drag to rotate, click to enlarge) */}
      <section ref={logosRef} className="relative py-20 md:py-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #f1f5f9 50%, #fafbfc 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-100/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-red-50/20 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="text-center mb-12 md:mb-14">
            <p className="text-3xl sm:text-4xl font-extrabold tracking-[0.2em] uppercase text-red-500 mb-3">Network</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-light text-(--apple-black) tracking-tight leading-[1.08] max-w-2xl mx-auto">
              OEM Partnerships
            </h2>
            <div className="mt-4 w-12 h-0.5 bg-red-500/60 rounded-full mx-auto" aria-hidden />
            <p className="mt-6 text-lg md:text-xl text-(--apple-gray) max-w-xl mx-auto leading-relaxed">
              Trusted technology leaders we work with, by partnership category.
            </p>
          </header>

          <div
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 transition-all duration-700 ${logosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {uniquePartners.map((partner) => (
              <div
                key={`${partner.category}-${partner.name}`}
                className="group flex flex-col items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-100 p-4 sm:p-5 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
              >
                <ImageWithFallback
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-14 sm:max-h-16 w-auto h-auto object-contain flex-1"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-14 md:mt-16">
            <Link
              to="/about/leadership"
              className="inline-flex items-center gap-2 text-sm font-semibold text-(--apple-black) bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-700 px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm"
            >
              Meet our leadership team
              <span className="text-base" aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PartnershipCards;