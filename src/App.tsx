import { AnimatePresence, motion, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionValue, useAnimationFrame, useVelocity, animate } from "motion/react";
import React, { useEffect, useState, useRef } from "react";
import { Plus, ChevronDown, ArrowLeft, X } from "lucide-react";
import { items } from "./data/items";
import { CollectionPage } from "./components/CollectionPage";
import { OurStoryPage } from "./components/OurStoryPage";
import { GlobalFooter } from "./components/GlobalFooter";

// Фирменный easing (график скорости) в стиле Obys Agency 
const customEase = [0.76, 0, 0.24, 1];

const AnimatedText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden mr-[0.25em] pb-[0.1em] -mb-[0.1em]">
          <motion.div
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{
              duration: 1.2,
              ease: customEase,
              delay: delay + i * 0.08,
            }}
            className="origin-top-left leading-none"
          >
            {word}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(onComplete, 600); // Небольшая задержка на 100%
      }
      setProgress(current);
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-navy flex flex-col items-between justify-between p-6 md:p-12 text-[#f8f8f8]"
      initial={{ y: "0%" }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: customEase }}
    >
      <div className="text-sm font-sans uppercase tracking-widest opacity-50 pt-2">
        Loading Experience
      </div>
      <div className="flex justify-end overflow-hidden pb-4">
        <motion.h1
          className="text-8xl md:text-[14rem] font-serif tracking-tighter leading-none"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: customEase }}
        >
          {progress}%
        </motion.h1>
      </div>
    </motion.div>
  );
};

const GlobalHeader = ({ onNavigate, currentPage }: { onNavigate: (page: string) => void, currentPage?: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getMenuItemClass = (page: string) => {
    const isSelected = currentPage === page;
    return `transition-all hidden md:block uppercase font-bold tracking-widest cursor-pointer ${
      isSelected 
        ? 'menu-item-selected line-through decoration-[#1A2077] decoration-[1.5px] text-[#1A2077] opacity-100' 
        : 'hover:opacity-60 text-[#1A2077] no-underline'
    }`;
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 w-full z-[200] flex items-center justify-between px-6 md:px-12 py-5 sm:py-6 md:py-8 text-[10px] md:text-xs font-bold tracking-widest uppercase transition-colors duration-700 text-[#1A2077] bg-white pointer-events-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: customEase, delay: 0.2 }}
      >
        <div className="flex flex-1 items-center gap-8">
          <button 
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="hover:opacity-60 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            {isMenuOpen ? <X className="w-3 h-3 md:w-4 md:h-4" /> : <Plus className="w-3 h-3 md:w-4 md:h-4" />} {isMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
          <button 
            onClick={() => onNavigate('collection')} 
            className={`hidden md:block ${getMenuItemClass('collection')}`}
          >
            COLLECTION
          </button>
          <button 
            onClick={() => onNavigate('story')} 
            className={`hidden md:block ${getMenuItemClass('story')}`}
          >
            OUR STORY
          </button>
        </div>
        <div className="flex items-center justify-center flex-1 cursor-pointer" onClick={() => onNavigate('home')}>
          <img src="/Logo.svg" alt="LunarCraft Logo" className="h-7 sm:h-8 md:h-10 hover:opacity-60 transition-opacity" />
        </div>
        <div className="flex-1 flex justify-end items-center gap-8">
          <button className="hover:opacity-60 transition-opacity flex items-center gap-1 hidden md:flex cursor-pointer">
            USD <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <a href="#" className="hover:opacity-60 transition-opacity">CART (0)</a>
          <button 
            onClick={() => onNavigate('contact')} 
            className={`hidden md:block ${getMenuItemClass('contact')}`}
          >
            CONTACT US
          </button>
        </div>
      </motion.header>

      {/* Full-screen overlay menu when MENU is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[190] bg-white flex flex-col justify-between p-8 md:p-16 pt-32 md:pt-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: customEase }}
          >
            <div className="flex flex-col gap-8 md:gap-12 max-w-4xl">
              {[
                { id: 'home', label: 'HOME' },
                { id: 'collection', label: 'COLLECTION' },
                { id: 'story', label: 'OUR STORY' },
                { id: 'contact', label: 'CONTACT US' },
              ].map((item) => {
                const isSelected = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`text-3xl md:text-5xl lg:text-6xl font-serif text-left tracking-wide uppercase transition-all cursor-pointer ${
                      isSelected
                        ? 'menu-item-selected line-through decoration-[#1A2077] decoration-[2px] text-[#1A2077]'
                        : 'text-[#1A2077]/70 hover:text-[#1A2077] hover:opacity-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-12 border-t border-[#1A2077]/10 text-xs font-bold tracking-widest text-[#1A2077]/60">
              <span className="uppercase">FINE PORCELAIN ARTISANAL ATELIER</span>
              <span className="uppercase">LUNARCRAFT@MAIL.COM • +38095 987 45 26</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};




const ProductPage = ({ item, onBack, onNavigate, onSelectItem }: { item: any, onBack: () => void, onNavigate?: (page: string) => void, onSelectItem?: (item: any) => void }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [item]);

  const accordionData = [
    {
      title: 'WARRANTY',
      content: 'All Azura pieces come with a 5-year international warranty covering any manufacturing defects. We stand behind the exceptional quality and durability of our artistic creations.'
    },
    {
      title: 'SHIPPING & RETURNS',
      content: 'We offer complimentary worldwide shipping on all orders. Each piece is carefully packaged in custom wooden crates. If you are not completely satisfied, you may return the item within 14 days of delivery.'
    },
    {
      title: 'MAINTENANCE',
      content: 'To preserve the beauty of your piece, dust regularly with a soft, dry microfiber cloth. Avoid direct sunlight and extreme temperature changes. Do not use chemical cleaners.'
    }
  ];

  const toggleAccordion = (title: string) => {
    setOpenAccordion(prev => prev === title ? null : title);
  };

  return (
    <motion.div 
      ref={scrollRef}
      className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto transition-colors duration-700"
      initial={{ opacity: 0, y: "50vh" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "50vh" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Content wrapper */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-12 pb-0 lg:pb-[164px] pt-24 sm:pt-28 md:pt-40">
        {/* First Screen Hero: takes full viewport on mobile so title and snake are comfortably placed, content begins on screen 2 */}
        <div className="w-full min-h-[calc(100dvh-110px)] md:min-h-0 flex flex-col justify-between md:justify-start pb-4 md:pb-0">
          {/* Back Button */}
          <div className="w-full flex justify-center md:justify-start mb-4 sm:mb-6 md:mb-8">
            <button 
              onClick={onBack} 
              className="flex items-center gap-2.5 text-[#1A2077] text-xs font-bold tracking-[0.2em] uppercase hover:opacity-60 transition-opacity cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> BACK TO ALL
            </button>
          </div>

          {/* Title */}
          <motion.div 
            className="w-full text-center mt-2 sm:mt-4 md:mt-0 mb-3 sm:mb-6 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[140px] font-serif capitalize text-[#1A2077] leading-none tracking-tight">
              {item.name.toLowerCase()}
            </h1>
          </motion.div>

          {/* Image / Video Box */}
          <motion.div 
            className="w-full max-w-[360px] sm:max-w-md md:max-w-5xl mx-auto flex-1 md:flex-none aspect-square md:aspect-[4/3] flex items-center justify-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {item.video ? (
              <motion.video 
                ref={videoRef}
                src={item.video} 
                autoPlay
                muted 
                loop
                playsInline
                className="w-full h-full object-contain mix-blend-multiply relative z-10 p-0 md:p-8"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse 48% 48% at 50% 50%, black 75%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 48% 48% at 50% 50%, black 75%, transparent 100%)',
                  filter: 'brightness(1.06) contrast(1.02)'
                }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : (
              <motion.img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-0 md:p-16 relative z-10"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </motion.div>
        </div>

        {/* Second Screen Section */}
        <div className="w-full mt-12 md:mt-16 mb-12 md:mb-32 px-0 lg:px-[100px]">
          {/* Description Text */}
          <div className="max-w-[1200px] mx-auto text-left md:text-center mb-16 md:mb-24">
            <p className="text-[24px] md:text-3xl lg:text-[34px] font-['Marcellus'] text-[#333333] leading-[1.38] md:leading-[1.5]">
              {item.description}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[30px] items-stretch lg:h-[845px]">
            {/* Specs & Buy Block (order-1 on mobile to appear right after text, order-2 on desktop) */}
            <div className="order-1 lg:order-2 flex flex-col w-full h-full justify-between">
              <div>
                <div className="flex flex-col border-t border-[#E5E5E5] w-full">
                  {/* Author */}
                  <div className="flex flex-row items-start py-4 lg:py-[22px] border-b border-[#E5E5E5]">
                    <span className="w-[45%] sm:w-[40%] text-[14px] font-bold tracking-wider text-[#1A2077] uppercase pt-0.5">Author</span>
                    <span className="w-[55%] sm:w-[60%] text-[14px] text-[#333] leading-relaxed">{item.author}</span>
                  </div>
                  {/* Year */}
                  <div className="flex flex-row items-start py-4 lg:py-[22px] border-b border-[#E5E5E5]">
                    <span className="w-[45%] sm:w-[40%] text-[14px] font-bold tracking-wider text-[#1A2077] uppercase pt-0.5">Year of production</span>
                    <span className="w-[55%] sm:w-[60%] text-[14px] text-[#333] leading-relaxed">{item.year}</span>
                  </div>
                  {/* Made in */}
                  <div className="flex flex-row items-start py-4 lg:py-[22px] border-b border-[#E5E5E5]">
                    <span className="w-[45%] sm:w-[40%] text-[14px] font-bold tracking-wider text-[#1A2077] uppercase pt-0.5">Made in</span>
                    <span className="w-[55%] sm:w-[60%] text-[14px] text-[#333] leading-relaxed">{item.madeIn}</span>
                  </div>
                  {/* Materials */}
                  <div className="flex flex-row items-start py-4 lg:py-[22px] border-b border-[#E5E5E5]">
                    <span className="w-[45%] sm:w-[40%] text-[14px] font-bold tracking-wider text-[#1A2077] uppercase pt-0.5">Materials</span>
                    <span className="w-[55%] sm:w-[60%] text-[14px] text-[#333] leading-relaxed pr-2 lg:pr-8">{item.materials}</span>
                  </div>
                  {/* Size */}
                  <div className="flex flex-row items-start py-4 lg:py-[22px] border-b border-[#E5E5E5]">
                    <span className="w-[45%] sm:w-[40%] text-[14px] font-bold tracking-wider text-[#1A2077] uppercase pt-0.5">Size</span>
                    <span className="w-[55%] sm:w-[60%] text-[14px] text-[#333] leading-relaxed">{item.size}</span>
                  </div>
                  {/* Rarity */}
                  <div className="flex flex-row items-start py-4 lg:py-[22px] border-b border-[#E5E5E5]">
                    <span className="w-[45%] sm:w-[40%] text-[14px] font-bold tracking-wider text-[#1A2077] uppercase pt-0.5">Rarity</span>
                    <span className="w-[55%] sm:w-[60%] text-[14px] text-[#333] leading-relaxed">{item.rarity}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-8 lg:mt-16 text-center lg:text-right">
                  <span className="text-[48px] md:text-[60px] lg:text-[130px] leading-none text-[#1A2077] tracking-tight" style={{ fontFamily: "'Elsie Swash Caps', serif" }}>
                    {item.price}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5 mt-6 lg:mt-10">
                  <button 
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('contact');
                      }
                      onBack();
                    }}
                    className="font-sans bg-[#F4F5F7] text-[#1A2077] py-4 lg:py-[18px] px-3 sm:px-4 text-[14px] font-bold tracking-wider uppercase hover:bg-[#EBEBEF] transition-colors cursor-pointer text-center"
                  >
                    Ask the question
                  </button>
                  <button className="font-sans bg-[#1A2077] text-white py-4 lg:py-[18px] px-3 sm:px-4 text-[14px] font-bold tracking-wider uppercase hover:bg-opacity-90 transition-colors cursor-pointer text-center">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>

            {/* Lifestyle Image (order-2 on mobile, order-1 on desktop) */}
            <div className="order-2 lg:order-1 w-full h-full bg-[#F4F5F7] min-h-[350px] lg:min-h-0">
              <img 
                src={item.secondaryImg} 
                alt={`${item.name} lifestyle`} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* New 2x2 Grid Layout */}
          <div className="w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[30px] mt-10 lg:mt-[124px]">
            {/* Top Left: Quote */}
            <div className="w-full h-full lg:h-[845px] flex flex-col justify-center p-8 md:p-12 lg:p-[100px] bg-white">
              <p className="text-3xl md:text-5xl lg:text-[50px] font-['Marcellus'] text-[#333333] leading-[1.3] mb-12">
                "Every piece of art carries its own story, and {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()} is a story of strength, elegance, and the eternal search for harmony."
              </p>
              <div className="text-right w-full pr-8 flex justify-end items-baseline gap-3">
                <motion.div
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  whileInView={{ clipPath: "inset(0 -20% 0 0)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, ease: "linear", delay: 0.2 }}
                  className="py-2"
                >
                  <span className="text-5xl lg:text-[70px] text-[#333333] whitespace-nowrap" style={{ fontFamily: "'Herr Von Muellerhoff', cursive" }}>
                    H.
                  </span>
                </motion.div>
                <motion.div
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  whileInView={{ clipPath: "inset(0 -20% 0 0)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.1, ease: "linear", delay: 0.7 }}
                  className="py-2"
                >
                  <span className="text-5xl lg:text-[70px] text-[#333333] whitespace-nowrap pr-4" style={{ fontFamily: "'Herr Von Muellerhoff', cursive" }}>
                    Takahashi
                  </span>
                </motion.div>
              </div>
            </div>
            
            {/* Top Right: Image */}
            <div className="w-full h-full lg:h-[845px] bg-[#F4F5F7]">
              <img 
                src="/grid-1.png" 
                alt={`${item.name} detail 1`} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Bottom Left: Image */}
            <div className="w-full h-full lg:h-[845px] bg-[#F4F5F7]">
              <img 
                src="/grid-2.png" 
                alt={`${item.name} detail 2`} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Bottom Right: Image */}
            <div className="w-full h-full lg:h-[845px] bg-[#F4F5F7]">
               <img 
                src="/grid-3.png" 
                alt={`${item.name} detail 3`} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[30px] mt-10 lg:mt-[124px]">
            {/* Left: Title */}
            <div className="flex flex-col">
              <h2 className="text-[56px] md:text-[100px] lg:text-[130px] leading-[1.05] md:leading-[1.1] text-[#1A2077]" style={{ fontFamily: "'Elsie Swash Caps', serif" }}>
                Shipping<br />& Returns
              </h2>
            </div>

            {/* Right: Accordion & Contact */}
            <div className="flex flex-col w-full h-full lg:mt-[260px]">
              <div className="flex flex-col w-full border-t border-[#E5E5E5]">
                {accordionData.map((acc, i) => {
                  const isOpen = openAccordion === acc.title;
                  return (
                    <div key={acc.title} className="flex flex-col border-b border-[#E5E5E5]">
                      <div 
                        onClick={() => toggleAccordion(acc.title)}
                        className="flex justify-between items-center py-[22px] cursor-pointer group"
                      >
                        <span className="text-[16px] font-bold tracking-wider text-[#1A2077] uppercase pt-0.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">{acc.title}</span>
                        <motion.svg 
                          width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                          animate={{ rotate: isOpen ? -180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1 group-hover:scale-110"
                        >
                          <path d="M4 4L12 12M12 12V4M12 12H4" stroke="#1A2077" strokeWidth="1.5"/>
                        </motion.svg>
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="pb-6 text-[#333333] font-['Poppins'] text-sm md:text-base leading-relaxed pr-8">
                              {acc.content}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-16 flex flex-col">
                <p className="text-3xl md:text-4xl lg:text-[40px] font-['Marcellus'] text-[#333333] leading-[1.3]">
                  Didn't find the answer to your question?<br />
                  We will be happy to answer you!
                </p>
                
                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('contact');
                      }
                      onBack();
                    }}
                    className="font-sans bg-[#1A2077] text-white py-4 lg:py-[18px] px-8 lg:px-[80px] text-[14px] font-bold tracking-wider uppercase hover:bg-opacity-90 transition-colors cursor-pointer text-center"
                  >
                    Contact us
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="w-[100vw] relative left-1/2 -translate-x-1/2 mt-24 md:mt-32 lg:mt-[200px] flex flex-col">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-12">
              <h2 className="text-[56px] md:text-[90px] lg:text-[120px] leading-[1.05] md:leading-[1.1] text-[#1A2077] mb-6 lg:mb-[60px]" style={{ fontFamily: "'Elsie Swash Caps', serif" }}>
                Related products
              </h2>
            </div>
            
            <div className="w-full overflow-hidden flex mt-0 lg:mt-4">
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
                        if (scrollRef.current) {
                          scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }
                    }}
                    className="flex flex-col items-center flex-shrink-0 w-[220px] sm:w-[260px] md:w-[340px] lg:w-[410px] cursor-pointer group"
                  >
                    <div className="w-full h-[260px] sm:h-[300px] md:h-[450px] lg:h-[550px] flex items-center justify-center p-3 md:p-8 mb-3 lg:mb-8">
                      <img src={prod.img} alt={prod.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    </div>
                    <span className="text-[14px] font-bold tracking-wider text-[#333333] uppercase mb-1.5 lg:mb-3">{prod.name}</span>
                    <span className="text-2xl lg:text-[34px] text-[#1A2077]" style={{ fontFamily: "'Elsie Swash Caps', serif" }}>{prod.price}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </motion.div>
  );
};

// items are imported from ./data/items

const CardItem = ({ 
  item, 
  i, 
  smoothProgress, 
  hoveredIndex, 
  setHoveredIndex, 
  activeCenterIndex,
  isFlat,
  onClick 
}: any) => {
  const R = 600; // Radius of the cylinder
  const spacing = 320; // Spacing in the flat row
  
  const baseAngle = i * (360 / items.length);
  // Center the row around 0
  const targetX = (i - (items.length - 1) / 2) * spacing;
  
  // Find nearest multiple of 360 to minimize spinning
  const targetRotateY = baseAngle > 180 ? 360 : 0;

  // Phase 1 (0 -> 0.4): Cylinder. 
  // Phase 2 (0.4 -> 0.6): Unravel to 2D Row.
  // Phase 3 (0.6 -> 1.0): Pan the row horizontally.
  
  const rotateY = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [baseAngle, baseAngle, targetRotateY, targetRotateY]);
  const z = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [R, R, 0, 0]);
  const x = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0, 0, targetX, targetX]);

  // Determine if this item is currently active (focused)
  const isActive = isFlat
    ? (hoveredIndex !== null ? hoveredIndex === i : activeCenterIndex === i)
    : false;

  const isDimmed = isFlat
    ? !isActive
    : false;

  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 w-0 h-0 ${isActive ? 'z-30' : 'z-10'}`}
      style={{ rotateY, transformStyle: "preserve-3d" }}
    >
      <motion.div
        style={{ x, z }}
        className="absolute top-0 left-0"
      >
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[230px] h-[320px] sm:w-[250px] sm:h-[350px] md:w-[270px] md:h-[370px] cursor-pointer"
          onMouseEnter={() => {
            if (isFlat && typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
              setHoveredIndex(i);
            }
          }}
          onMouseLeave={() => {
            if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
              setHoveredIndex(null);
            }
          }}
          onClick={onClick}
        >
          <div className={`w-full h-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isActive ? 'scale-110 md:scale-115 opacity-100 filter-none' : ''}
              ${isDimmed ? 'opacity-35 sm:opacity-45 scale-90 sm:scale-95 grayscale-[10%]' : ''}
              ${!isActive && !isDimmed ? 'opacity-100 scale-100' : ''}
          `}>
            <img 
              src={item.img} 
              alt={item.name} 
              className={`w-full h-full object-contain mix-blend-multiply transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive 
                  ? 'drop-shadow-[0_28px_56px_rgba(26,32,119,0.2)]' 
                  : 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)]'
              }`} 
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Carousel = ({ scrollYProgress, onSelectItem }: { scrollYProgress: any, onSelectItem: (item: any) => void }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeCenterIndex, setActiveCenterIndex] = useState(0);
  const [isFlat, setIsFlat] = useState(false);

  // Smooth scroll interpolation
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 50, mass: 0.5 }) as any;

  useMotionValueEvent(smoothProgress, "change", (latest: any) => {
    const flat = latest > 0.42;
    setIsFlat(flat);
    if (!flat && hoveredIndex !== null) {
      setHoveredIndex(null);
    }
  });

  const autoAngle = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    const p = smoothProgress.get();
    if (p < 0.01) {
      let nextAngle = autoAngle.get() - 12 * (delta / 1000); // 12 degrees per second
      if (nextAngle <= -360) {
        nextAngle += 360;
      }
      autoAngle.set(nextAngle);
    }
  });
  
  // Parent Transformations
  const parentRotateY = useTransform(() => {
    const p = smoothProgress.get();
    const start = autoAngle.get();
    // If we've idled past -180, target -720 to ensure enough travel distance for a satisfying scroll spin
    const target = start < -180 ? -720 : -360;
    
    if (p < 0.4) {
      const progressRatio = p / 0.4;
      return start * (1 - progressRatio) + target * progressRatio;
    }
    return target;
  });
  
  // Slight tilt for 3D depth, flattening out when unraveled
  const parentRotateX = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [-5, -5, 0, 0]);
  
  // Pan the entire scene to view all cards in the row
  const panStart = ((items.length - 1) / 2) * 320;
  const parentX = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0, 0, panStart, -panStart]); 

  // Calculate centered card index in the horizontal strip for mobile/touch or default view
  useMotionValueEvent(parentX, "change", (latestX: number) => {
    const rawIndex = ((items.length - 1) / 2) - (latestX / 320);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, Math.round(rawIndex)));
    setActiveCenterIndex(clampedIndex);
    if (hoveredIndex !== null) {
      setHoveredIndex(null);
    }
  });

  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeCenterIndex;
  const currentItem = items[displayIndex] || items[0];

  return (
    <>
      <div className="absolute inset-0 flex justify-center items-center scale-[0.74] sm:scale-[0.84] md:scale-100 origin-center translate-y-[38px] sm:translate-y-0 pt-0 sm:pt-16 md:pt-20" style={{ perspective: 1500 }}>
        <motion.div
          className="relative w-full h-full flex justify-center items-center"
          style={{
            rotateX: parentRotateX,
            rotateY: parentRotateY,
            x: parentX,
            transformStyle: "preserve-3d"
          }}
        >
          {items.map((item, i) => (
            <CardItem 
              key={i} 
              item={item} 
              i={i} 
              smoothProgress={smoothProgress} 
              hoveredIndex={hoveredIndex} 
              setHoveredIndex={setHoveredIndex} 
              activeCenterIndex={activeCenterIndex}
              isFlat={isFlat}
              onClick={() => onSelectItem(item)}
            />
          ))}
        </motion.div>
      </div>

      {/* Info Text (Only shown in flat row/strip phase, not when spinning in 3D cylinder) */}
      <AnimatePresence mode="wait">
        {isFlat && (
          <motion.div
            key={currentItem.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-[calc(50%+184px)] sm:top-[calc(50%+192px)] md:top-auto md:bottom-12 left-0 w-full text-center pointer-events-none z-50 px-4 flex flex-col items-center justify-center"
          >
            <h2 className="text-[14px] font-bold tracking-wider text-[#333333] uppercase mb-1.5 lg:mb-3 font-sans">
              {currentItem.name}
            </h2>
            <p 
              className="text-2xl lg:text-[34px] text-[#1A2077]"
              style={{ fontFamily: "'Elsie Swash Caps', serif" }}
            >
              {currentItem.price}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [role, setRole] = useState<'buyer' | 'artist'>('buyer');
  const [maskPosition, setMaskPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMaskPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div className="min-h-screen bg-white w-full flex flex-col items-center pt-24 overflow-x-hidden relative">
      {/* Mobile Title */}
      <h1 
        className="block lg:hidden text-center text-[56px] font-['Elsie_Swash_Caps'] text-[#1A2077] mt-2 mb-4 px-4 leading-[1.05] tracking-tight"
        style={{ fontFamily: "'Elsie Swash Caps', serif" }}
      >
        Contact us
      </h1>

      <div className="relative w-full flex justify-center mt-2 lg:mt-[80px]">
        {/* Desktop Background Text */}
        <div 
          className="hidden lg:flex absolute z-0 pointer-events-none w-full max-w-[1720px] px-6 md:px-[100px] justify-center items-center"
          style={{
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg viewBox="0 0 1000 250" className="w-full h-auto max-h-[500px]" preserveAspectRatio="xMidYMid meet">
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="central" 
              fill="#1A2077" 
              style={{ 
                fontFamily: "'Elsie Swash Caps', serif", 
                fontSize: '210px', 
                letterSpacing: '-0.01em' 
              }}
            >
              Contact us
            </text>
          </svg>
        </div>
        
        {/* Foreground Image Container */}
        <motion.div 
          className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[1000px] px-4 z-10 relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: customEase }}
        >
          <div 
            className="relative w-full cursor-crosshair touch-none"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            // For touch devices
            onTouchMove={(e) => {
              if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMaskPosition({
                  x: e.touches[0].clientX - rect.left,
                  y: e.touches[0].clientY - rect.top
                });
              }
            }}
            onTouchStart={(e) => {
              setIsHovering(true);
              if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMaskPosition({
                  x: e.touches[0].clientX - rect.left,
                  y: e.touches[0].clientY - rect.top
                });
              }
            }}
            onTouchEnd={() => setIsHovering(false)}
          >
            {/* Invisible spacer to maintain layout height matching the image's aspect ratio */}
            <img 
              src="/Contact Us img empty.png" 
              alt="spacer" 
              className="w-full h-auto opacity-0 pointer-events-none select-none"
            />
            
            {/* SVG overlay rendering both images and the interactive mask */}
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <filter id="liquidBrush" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="180" xChannelSelector="R" yChannelSelector="G" />
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="15" intercept="-6" />
                  </feComponentTransfer>
                </filter>
                <mask id="liquidMask">
                  <rect width="100%" height="100%" fill="white" />
                  <circle 
                    cx={maskPosition.x} 
                    cy={maskPosition.y} 
                    r={isHovering ? 135 : 0} 
                    fill="black" 
                    filter="url(#liquidBrush)" 
                    style={{ transition: 'r 0.3s ease-out' }}
                  />
                </mask>
              </defs>

              {/* Base Layer (Colored) */}
              <image 
                href="/Contact Us img.png" 
                width="100%" 
                height="100%" 
                preserveAspectRatio="xMidYMid meet" 
              />
              
              {/* Top Layer (Colorless/Empty) */}
              <image 
                href="/Contact Us img empty.png" 
                width="100%" 
                height="100%" 
                preserveAspectRatio="xMidYMid meet" 
                mask="url(#liquidMask)" 
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-[100px] z-20">
        <div className="w-full bg-[#F9FAFC] flex justify-center">
          <div className="w-full py-8 sm:py-12 lg:py-20 px-6 sm:px-8 lg:px-16">
            <form className="flex flex-col w-full text-[24px] lg:text-[48px] font-['Marcellus'] text-[#333333] leading-[1.3]" onSubmit={(e) => e.preventDefault()}>
              
              <div className="flex flex-col gap-5 lg:gap-[24px]">
                {/* Hello! My name is + input + I'm the buyer/artist */}
                <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-y-1 lg:gap-y-4 gap-x-4">
                  <span className="whitespace-nowrap">Hello! My name is</span>
                  <input 
                    type="text" 
                    placeholder="type here..." 
                    className="bg-transparent border-none outline-none text-[#1A2077] placeholder:text-[#C4C4C4] font-['Marcellus'] text-[24px] lg:text-[48px] w-full lg:w-[280px]" 
                  />
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:ml-auto mt-2 lg:mt-0">
                    <span className="whitespace-nowrap lg:mr-4">I’m the</span>
                    <div className="flex items-center gap-5 sm:gap-6">
                      <label className="flex items-center gap-2.5 cursor-pointer text-[#1A2077]" onClick={() => setRole('buyer')}>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full border-[2px] border-[#1A2077] flex items-center justify-center p-[2.5px] lg:p-[4px]">
                          {role === 'buyer' && <div className="w-full h-full bg-[#1A2077] rounded-full"></div>}
                        </div>
                        buyer
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-[#1A2077]" onClick={() => setRole('artist')}>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full border-[2px] border-[#1A2077] flex items-center justify-center p-[2.5px] lg:p-[4px]">
                          {role === 'artist' && <div className="w-full h-full bg-[#1A2077] rounded-full"></div>}
                        </div>
                        artist
                      </label>
                    </div>
                  </div>
                </div>

                {/* Looking for */}
                <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-y-1 lg:gap-y-4 gap-x-4">
                  <span className="whitespace-nowrap">,and I’m looking for</span>
                  <input 
                    type="text" 
                    placeholder="type here..." 
                    className="bg-transparent border-none outline-none text-[#1A2077] placeholder:text-[#C4C4C4] font-['Marcellus'] text-[24px] lg:text-[48px] w-full lg:min-w-[200px] lg:flex-1" 
                  />
                </div>

                {/* Get in touch */}
                <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-y-1 lg:gap-y-4 gap-x-4">
                  <span className="whitespace-nowrap">Get in touch with me at</span>
                  <input 
                    type="email" 
                    placeholder="type your email here..." 
                    className="bg-transparent border-none outline-none text-[#1A2077] placeholder:text-[#C4C4C4] font-['Marcellus'] text-[24px] lg:text-[48px] w-full lg:min-w-[300px] lg:flex-1" 
                  />
                </div>
              </div>

              {/* Bottom Actions: on mobile button is full width on top, disclaimer is centered underneath */}
              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mt-10 lg:mt-24 gap-6 lg:gap-8">
                <button type="submit" className="order-1 lg:order-2 font-sans bg-[#1A2077] text-white py-4 lg:py-[18px] px-8 lg:px-[80px] text-[14px] font-bold tracking-wider uppercase hover:bg-opacity-90 transition-colors w-full lg:w-auto text-center cursor-pointer">
                  SUBMIT
                </button>
                <p className="order-2 lg:order-1 font-sans text-[12px] md:text-[14px] text-[#333333] leading-relaxed text-center lg:text-left">
                  By clicking the button,<br className="hidden lg:block"/>
                  {" "}you accept <a href="#" className="font-bold underline text-[#1A2077]">Terms of Use</a> and <a href="#" className="font-bold underline text-[#1A2077]">Privacy Policy</a>.
                </p>
              </div>

            </form>
          </div>
        </div>

        <motion.div 
          className="text-center mt-24 lg:mt-[200px] max-w-[900px] mx-auto px-4 flex flex-col items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-16 h-[1px] bg-[#1A2077]/20 mb-8 md:mb-10"></div>
          <p className="font-['Marcellus'] text-[#333333] text-[24px] md:text-[44px] leading-[1.4]">
            Tell us a little about yourself, <br className="hidden md:block" />
            and we'll help you find <span className="font-['Herr_Von_Muellerhoff'] text-[40px] md:text-[76px] text-[#1A2077] px-2 relative top-1.5 md:top-4 leading-[0.5]">exactly</span> what you're looking for.
          </p>
          <div className="w-16 h-[1px] bg-[#1A2077]/20 mt-8 md:mt-10"></div>
        </motion.div>
      </div>
      
      <div className="w-full mt-16 md:mt-24 lg:mt-32">
        <GlobalFooter />
      </div>
    </div>
  );
};

const MainApp = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'collection' | 'story' | 'contact'>('home');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedItem]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'home' | 'collection' | 'story' | 'contact');
    setSelectedItem(null);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <GlobalHeader onNavigate={handleNavigate} currentPage={currentPage} />

      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'collection' && <CollectionPage onSelectItem={setSelectedItem} />}
      {currentPage === 'story' && <OurStoryPage onNavigate={handleNavigate} onSelectItem={setSelectedItem} />}

      <AnimatePresence>
        {selectedItem && (
          <ProductPage 
            item={selectedItem} 
            onBack={() => {
              setSelectedItem(null);
            }} 
            onNavigate={handleNavigate}
            onSelectItem={setSelectedItem}
          />
        )}
      </AnimatePresence>

      <div 
        ref={containerRef} 
        className="relative h-[700vh]"
        style={{ display: currentPage === 'home' ? 'block' : 'none' }}
      >
      {/* Sticky Viewport */}
      <main className="sticky top-0 h-screen w-full flex flex-col overflow-hidden pt-20 sm:pt-22 md:pt-24">
        
        {/* Main Content Area */}
        <div className="flex-1 w-full relative flex flex-col justify-center">
          
          {/* Center Typography (pointer-events-none so it doesn't block cards) */}
          <div className="absolute top-[9%] sm:top-[8%] md:top-[8%] left-0 w-full text-center px-4 z-10 pointer-events-none">
            <h1 className="text-4xl sm:text-5xl md:text-[5vw] lg:text-[6vw] xl:text-[6.5rem] font-serif leading-[1.05] tracking-tight">
              <AnimatedText text="Timeless Art Made Eternal" delay={0.1} className="md:flex-nowrap" />
            </h1>
            
            <motion.div 
              className="flex items-center justify-center gap-4 md:gap-8 mt-3.5 sm:mt-5 md:mt-12 text-[#333333]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1, ease: customEase }}
            >
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Tradition</span>
              <span className="w-1 h-1 rounded-full bg-[#333333]/40"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Artistry</span>
              <span className="w-1 h-1 rounded-full bg-[#333333]/40"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Elegance</span>
            </motion.div>
          </div>

          {/* 3D Carousel rotating behind/around the text */}
          <Carousel scrollYProgress={scrollYProgress} onSelectItem={setSelectedItem} />
          
        </div>

        {/* Footer */}
        <motion.footer 
          className="relative z-20 hidden md:flex items-center justify-between px-6 md:px-12 py-6 text-[10px] md:text-xs font-semibold tracking-widest uppercase mt-auto bg-gradient-to-t from-bg to-transparent text-[#2E2E2E]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, ease: customEase }}
        >
           <div className="flex gap-6 flex-1">
              <a href="#" className="hover:opacity-60 transition-opacity">INSTAGRAM</a>
              <a href="#" className="hover:opacity-60 transition-opacity">PINTEREST</a>
           </div>
           
           <div className="flex-1"></div>

           <div className="flex-1 flex justify-end opacity-50 normal-case tracking-normal text-xs font-medium">
              © 2026 LunarCraft. All rights reserved.
           </div>
        </motion.footer>
      </main>
    </div>
    </>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-bg min-h-screen text-navy font-sans selection:bg-navy selection:text-bg">
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && <MainApp />}
    </div>
  );
}
