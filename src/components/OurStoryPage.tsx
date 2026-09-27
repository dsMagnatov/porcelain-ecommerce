import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { items, Item } from '../data/items';
import { GlobalFooter } from './GlobalFooter';

const customEase = [0.76, 0, 0.24, 1];

interface OurStoryPageProps {
  onNavigate: (page: string) => void;
  onSelectItem?: (item: Item) => void;
}

interface Artist {
  image: string;
  name: string;
}

const artists: Artist[] = [
  { image: '/Team 1.png', name: 'HIROSHI TAKAHASHI' },
  { image: '/Team 2.png', name: 'LILA ROSÉ' },
  { image: '/Team 3.png', name: 'ELISE MONTCLAIR' },
  { image: '/Team 4.png', name: 'MEI LI' },
  { image: '/Team 5.png', name: 'KAI FOSTER' },
];

const ArtistCard: React.FC<{ image: string; name: string }> = ({ image, name }) => (
  <div className="flex flex-col group cursor-pointer">
    <div className="w-full aspect-[3/4] overflow-hidden bg-[#F4F4F5]">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
    <span className="text-[14px] font-bold text-[#333333] tracking-wider uppercase text-center mt-3 font-sans">
      {name}
    </span>
  </div>
);

export const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigate, onSelectItem }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-white text-[#1A2077] pt-28 md:pt-36 lg:pt-40 flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <div className="w-full relative overflow-hidden">
        {/* Desktop: Floral illustration touching the absolute edge of the browser window */}
        <motion.div
          className="hidden lg:flex absolute top-0 right-0 justify-end items-start pointer-events-none z-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: customEase, delay: 0.2 }}
        >
          <motion.img 
            src="/Flower.png" 
            alt="LunarCraft Porcelain Blossom" 
            className="w-[360px] lg:w-[420px] xl:w-[480px] 2xl:w-[520px] h-auto object-contain select-none translate-x-1 origin-bottom-right"
            animate={{ 
              y: [0, -14, 0],
              x: [0, -4, 0],
              rotate: [0, 2.2, -0.6, 0]
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between min-h-[160px] sm:min-h-[200px] md:min-h-[260px] lg:min-h-[300px]">
            {/* Main Display Title */}
            <motion.div
              className="z-10 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: customEase }}
            >
              <h1 className="text-[56px] sm:text-7xl md:text-8xl lg:text-[96px] xl:text-[110px] font-['Elsie_Swash_Caps'] text-[#1A2077] leading-[1.05] tracking-tight">
                Where Art<br />Meets Elegance
              </h1>
            </motion.div>

            {/* Mobile/Tablet: Flower touching the right edge of the viewport */}
            <motion.div
              className="flex lg:hidden justify-end items-start -mr-6 md:-mr-12 mt-4 pointer-events-none"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: customEase, delay: 0.2 }}
            >
              <motion.img 
                src="/Flower.png" 
                alt="LunarCraft Porcelain Blossom" 
                className="w-[200px] sm:w-[280px] md:w-[340px] h-auto object-contain select-none translate-x-1 origin-bottom-right"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 1.8, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>

          {/* Narrative Paragraph 1 */}
          <motion.div 
            className="mt-20 md:mt-28 lg:mt-32 max-w-[1240px] mx-auto flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: customEase, delay: 0.25 }}
          >
            <div className="w-16 h-[1px] bg-[#1A2077]/20 mb-8 md:mb-10"></div>
            <p className="text-center font-['Marcellus'] text-[#333333] text-[24px] md:text-[44px] leading-[1.4] px-4">
              We believe that every piece of art tells a story. A story of craftsmanship, tradition, and <span className="font-['Herr_Von_Muellerhoff'] text-[40px] md:text-[76px] text-[#1A2077] px-2 relative top-1.5 md:top-4 leading-[0.5]">passion</span>. Our journey began with a single vision — to create timeless, unique porcelain creations that not only enhance spaces but also evoke emotions and spark conversations.
            </p>
            <div className="w-16 h-[1px] bg-[#1A2077]/20 mt-8 md:mt-10"></div>
          </motion.div>
        </div>
      </div>

      {/* 2. FULL WIDTH WORKSHOP BANNER (Work.png) */}
      <motion.div 
        className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-20 mt-16 md:mt-24 lg:mt-28"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: customEase }}
      >
        <div className="w-full overflow-hidden">
          <img 
            src="/Work.png" 
            alt="LunarCraft Ceramic Atelier & Porcelain Artisan" 
            className="w-full h-auto object-cover select-none"
          />
        </div>
      </motion.div>

      {/* 3. CENTERED NARRATIVE 2 */}
      <motion.div 
        className="w-full max-w-[1240px] mx-auto px-6 md:px-12 mt-20 md:mt-28 lg:mt-32 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: customEase }}
      >
        <div className="w-16 h-[1px] bg-[#1A2077]/20 mb-8 md:mb-10"></div>
        <p className="text-center font-['Marcellus'] text-[#333333] text-[24px] md:text-[44px] leading-[1.4] px-4">
          At LunarCraft, we don't just make figurines; we create art that tells a story — a story of <span className="font-['Herr_Von_Muellerhoff'] text-[40px] md:text-[76px] text-[#1A2077] px-2 relative top-1.5 md:top-4 leading-[0.5]">elegance</span>, harmony, and the deep connection between culture and creativity. Each piece is designed to inspire, to transform spaces, and to be cherished for generations.
        </p>
        <div className="w-16 h-[1px] bg-[#1A2077]/20 mt-8 md:mt-10"></div>
      </motion.div>

      {/* 4. OUR ARTISTS SECTION */}
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-20 mt-24 md:mt-36 lg:mt-44">
        {/* Desktop 4-Column Grid Header: perfectly aligned with artist cards below */}
        <motion.div 
          className="hidden lg:grid grid-cols-4 gap-x-6 xl:gap-x-8 items-end mb-8 xl:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: customEase }}
        >
          {/* Columns 1-2: Title */}
          <div className="col-span-2">
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-['Elsie_Swash_Caps'] text-[#1A2077] leading-[0.95] tracking-tight">
              Our<br />Artists
            </h2>
          </div>

          {/* Columns 3-4: Text starting at Col 3 (LILA ROSÉ) and button in Col 4 (ELISE MONTCLAIR) */}
          <div className="col-start-3 col-span-2 flex flex-col gap-6">
            <p className="font-['Marcellus'] text-[#333333] text-2xl lg:text-[26px] xl:text-[30px] leading-[1.28] text-left">
              Passionate about art and craftsmanship?<br />
              Send us your application &amp; become part of our<br />
              story.
            </p>
            
            <div className="grid grid-cols-2 gap-x-6 xl:gap-x-8">
              {/* Col 3 spacer */}
              <div />
              {/* Col 4 button aligned with ELISE MONTCLAIR card */}
              <div>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="w-full bg-[#1A2077] text-white py-4 text-[14px] font-bold tracking-wider uppercase hover:bg-opacity-90 transition-all cursor-pointer font-sans text-center"
                >
                  JOIN OUR TEAM
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile & Tablet Header */}
        <div className="flex flex-col lg:hidden gap-6 mb-10">
          <h2 className="text-[56px] sm:text-6xl font-['Elsie_Swash_Caps'] text-[#1A2077] leading-[0.95] tracking-tight">
            Our<br />Artists
          </h2>
          <p className="font-['Marcellus'] text-[#333333] text-xl sm:text-2xl leading-[1.3] text-left">
            Passionate about art and craftsmanship? Send us your application &amp; become part of our story.
          </p>
          <button 
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto self-start bg-[#1A2077] text-white px-8 py-4 text-[14px] font-bold tracking-wider uppercase hover:bg-opacity-90 transition-all cursor-pointer font-sans text-center"
          >
            JOIN OUR TEAM
          </button>
        </div>

        {/* Desktop 4-Column Staggered Grid (Strictly as designed in mockup) */}
        <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-x-6 xl:gap-x-8 gap-y-12 xl:gap-y-16 items-start">
          {/* Column 1, Row 1: HIROSHI TAKAHASHI */}
          <div className="col-start-1 row-start-1">
            <ArtistCard image="/Team 1.png" name="HIROSHI TAKAHASHI" />
          </div>

          {/* Column 2, Row 2: MEI LI */}
          <div className="col-start-2 row-start-2">
            <ArtistCard image="/Team 4.png" name="MEI LI" />
          </div>

          {/* Column 3, Row 1: LILA ROSÉ */}
          <div className="col-start-3 row-start-1">
            <ArtistCard image="/Team 2.png" name="LILA ROSÉ" />
          </div>

          {/* Column 4, Row 1: ELISE MONTCLAIR */}
          <div className="col-start-4 row-start-1">
            <ArtistCard image="/Team 3.png" name="ELISE MONTCLAIR" />
          </div>

          {/* Column 4, Row 2: KAI FOSTER */}
          <div className="col-start-4 row-start-2">
            <ArtistCard image="/Team 5.png" name="KAI FOSTER" />
          </div>
        </div>

        {/* Mobile & Tablet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
          {artists.map((artist, idx) => (
            <ArtistCard key={idx} image={artist.image} name={artist.name} />
          ))}
        </div>
      </div>

      {/* 5. CENTERED NARRATIVE 3 */}
      <motion.div 
        className="w-full max-w-[1240px] mx-auto px-6 md:px-12 mt-24 md:mt-36 lg:mt-44 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: customEase }}
      >
        <div className="w-16 h-[1px] bg-[#1A2077]/20 mb-8 md:mb-10"></div>
        <p className="text-center font-['Marcellus'] text-[#333333] text-[24px] md:text-[44px] leading-[1.4] px-4">
          We invite you to explore our collection, to immerse yourself in the world of fine porcelain, and to discover a creation that speaks to you. Whether you're a collector, a designer, or an art lover, we are here to offer you something <span className="font-['Herr_Von_Muellerhoff'] text-[40px] md:text-[76px] text-[#1A2077] px-2 relative top-1.5 md:top-4 leading-[0.5]">truly</span> exceptional.
        </p>
        <div className="w-16 h-[1px] bg-[#1A2077]/20 mt-8 md:mt-10"></div>
      </motion.div>

      {/* 6. Products Marquee Carousel (exact match with ProductPage) */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2 mt-16 md:mt-24 lg:mt-32 mb-24 md:mb-36 flex flex-col">
        <div className="w-full overflow-hidden flex mt-4">
          <motion.div 
            className="flex gap-3 lg:gap-[30px] w-max pr-3 lg:pr-[30px]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 60, repeat: Infinity }}
          >
            {[...[items[8], items[0], items[1], items[4], items[2], items[5]], ...[items[8], items[0], items[1], items[4], items[2], items[5]]].map((prod, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  if (onSelectItem) {
                    onSelectItem(prod);
                  } else {
                    onNavigate('collection');
                  }
                }}
                className="flex flex-col items-center flex-shrink-0 w-[220px] sm:w-[260px] md:w-[340px] lg:w-[410px] cursor-pointer group"
              >
                <div className="w-full h-[260px] sm:h-[300px] md:h-[450px] lg:h-[550px] flex items-center justify-center p-3 md:p-8 mb-3 lg:mb-8">
                  <img 
                    src={prod.img} 
                    alt={prod.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                  />
                </div>
                <span className="text-[14px] font-bold tracking-wider text-[#333333] uppercase mb-1.5 lg:mb-3 font-sans">
                  {prod.name}
                </span>
                <span 
                  className="text-2xl lg:text-[34px] text-[#1A2077]" 
                  style={{ fontFamily: "'Elsie Swash Caps', serif" }}
                >
                  {prod.price}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Global Footer */}
      <div className="w-full mt-auto">
        <GlobalFooter />
      </div>
    </div>
  );
};
