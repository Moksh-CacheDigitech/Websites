import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePageScroll } from '../hooks/usePageScroll';
import { fetchContactInfo } from '../lib/sanityQueries';

const ZOHO_CONTACT_FORM_URL =
  'https://forms.zohopublic.in/cachedigiteh1/form/CacheTest/formperma/8iVU_cZT4Drao9gm87I9to2E1ugmhqy5xSi8N9li9iM';

const DEFAULT_CONTACT = {
  title: 'Contact Us',
  eyebrow: 'Get in touch',
  subtitle: "Have a question or want to work together? We're here to help.",
  email: 'info@cachedigitech.com',
  emailNote: 'We reply within 24 hours',
  phone: '+91 180030 94333',
  phoneNote: 'Mon-Fri, 9am-6pm IST',
  offices: [
    {
      label: 'Delhi Office',
      line1: 'CRC2 Building Cache Digitech Sultanpur',
      line2: 'Delhi 110030',
    },
    {
      label: 'Mumbai Office',
      line1: '404, C-Wing, Eastern Court Junction',
      line2: 'Tejapal & Parleshwar Road, Vile Parle East, Mumbai 400057',
    },
    {
      label: 'Dubai Office',
      line1: 'Compass Building, Al Hulaila',
      line2: 'AL Hulaila Industrial Zone-FZ, Ras Al Khaimah, UAE',
    },
  ],
  formUrl: ZOHO_CONTACT_FORM_URL,
};

const ContactUsPage = () => {
  usePageScroll();
  const [cms, setCms] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchContactInfo().then(({ contact, error }) => {
      if (cancelled) return;
      if (!error && contact) setCms(contact);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const info = cms || DEFAULT_CONTACT;

  const contactItems = useMemo(() => {
    const items = [
      {
        icon: Mail,
        label: 'Email',
        value: info.email,
        href: info.email ? `mailto:${info.email}` : undefined,
        description: info.emailNote,
      },
      {
        icon: Phone,
        label: 'Phone',
        value: info.phone,
        href: info.phone ? `tel:${String(info.phone).replace(/\s/g, '')}` : undefined,
        description: info.phoneNote,
      },
    ];
    for (const office of info.offices || []) {
      items.push({
        icon: MapPin,
        label: office.label,
        value: office.line1,
        description: office.line2,
      });
    }
    return items;
  }, [info]);

  const formUrl = info.formUrl || ZOHO_CONTACT_FORM_URL;

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/80">
      <main className="pt-24 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8" id="contact-main">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12 lg:mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600 mb-3">
              {info.eyebrow || 'Get in touch'}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {info.title || 'Contact Us'}
            </h1>
            <div className="w-16 h-1 bg-red-500 rounded-full mx-auto mb-5" aria-hidden />
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {info.subtitle || DEFAULT_CONTACT.subtitle}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch min-h-[calc(100vh-14rem)]">
            <section
              className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100"
              aria-labelledby="get-in-touch-heading"
            >
              <h2 id="get-in-touch-heading" className="text-2xl font-bold text-gray-900 mb-2">
                {info.reachHeading || 'Reach out'}
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                {info.reachIntro || 'Choose your preferred way to connect.'}
              </p>

              <div className="space-y-1">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100 transition-colors group-hover:bg-red-100 group-hover:ring-red-200" aria-hidden>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-gray-900 font-medium hover:text-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-900 font-medium">{item.value}</p>
                        )}
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </>
                  );
                  return (
                    <div
                      key={item.label + (item.value || '')}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-colors group ${item.href ? 'hover:bg-gray-50/80' : ''
                        }`}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="flex flex-col min-h-[min(70vh,700px)] lg:min-h-0" aria-label="Contact form">
              <iframe
                src={formUrl}
                title="Contact us form"
                className="w-full flex-1 min-h-[min(70vh,700px)] lg:min-h-0 border-0 rounded-xl"
                allowFullScreen
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUsPage;
