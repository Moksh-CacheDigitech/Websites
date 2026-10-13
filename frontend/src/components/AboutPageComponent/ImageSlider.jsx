import { Trophy } from 'lucide-react';
import SequentialCarousel from './SequentialCarousel';

const AWARD_SLIDES = [
  { id: 1, name: 'Best Women Entrepreneur Award', image: '/awards/Best Women Enterpreneur Award 1.avif' },
  { id: 2, name: 'Brightstar Award', image: '/awards/Brightstar Award 1.avif' },
  { id: 3, name: 'Business Leader Award', image: '/awards/Business Leader Award 1.avif' },
  { id: 4, name: 'CIOs INDIA Award', image: '/awards/CIOs INDIA Award 1.avif' },
  { id: 5, name: 'CIOs INDIA Award', image: '/awards/CIOs INDIA Award 2.avif' },
  { id: 6, name: 'Dell Technologies Award', image: '/awards/Dell Technologies Award 1.avif' },
  { id: 7, name: 'IBM Akshay Shonik Award', image: '/awards/IBM Akshay Shonik Award.avif' },
  { id: 8, name: 'Jubilant Award', image: '/awards/Jubliant Award 1.avif' },
  { id: 9, name: 'Savex Award', image: '/awards/Savex Award 1.avif' },
  { id: 10, name: 'Schneider Electric Award', image: '/awards/Schneider Electric Award 1.avif' },
  { id: 11, name: 'Warranty Service Provider Award', image: '/awards/Warranty Service Provider Award 1.avif' },
  { id: 12, name: 'Excellence 2011 CRN Award', image: '/awards/Xcellence 2011 CRN Award 1.avif' },
];

const AwardsSection = () => {
  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      <section
        className="relative pt-24 lg:pt-32 pb-8 md:pb-12 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #f1f5f9 50%, #fafbfc 100%)' }}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-100/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-red-50/20 blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10 mb-10 md:mb-14">
          <header className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mb-4">
              <Trophy className="h-7 w-7 text-red-600" aria-hidden />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-[0.2em] uppercase text-red-500 mb-3">
              Awards
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-light text-(--apple-black) tracking-tight leading-[1.08] max-w-2xl mx-auto">
              Awards & <span className="text-red-600 font-normal">Accolades</span>
            </h2>
            <div className="mt-4 w-12 h-0.5 bg-red-500/60 rounded-full mx-auto" aria-hidden />
            <p className="mt-6 text-lg md:text-xl text-(--apple-gray) max-w-2xl mx-auto leading-relaxed">
              Recognizing excellence and innovation in our journey of technological advancement and client satisfaction across three decades of industry leadership.
            </p>
          </header>
        </div>

        <div className="relative w-full h-[min(54vh,500px)] min-h-[420px] max-h-[540px] overflow-visible">
          <SequentialCarousel
            items={AWARD_SLIDES}
            cardGap={260}
            cardWidth={280}
            animationDuration={650}
            sequenceDelay={70}
            fadeStartIndex={3}
            autoPlay
            autoPlayInterval={3500}
            hideBackground
          />
        </div>
      </section>
    </div>
  );
};

export default AwardsSection;
