import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { items, Item } from '../data/items';
import { GlobalFooter } from './GlobalFooter';

interface CollectionPageProps {
  onSelectItem: (item: Item) => void;
}

type SortOption = 'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'NAME_ASC';

interface GridCellProduct {
  id: string;
  type: 'product';
  item: Item;
}

interface GridCellEditorial {
  id: string;
  type: 'editorial';
  img: string;
  alt: string;
}

interface GridCellEmpty {
  id: string;
  type: 'empty';
}

type GridCell = GridCellProduct | GridCellEditorial | GridCellEmpty;

export const CollectionPage: React.FC<CollectionPageProps> = ({ onSelectItem }) => {
  const [sortBy, setSortBy] = useState<SortOption>('FEATURED');
  const [author, setAuthor] = useState<string>('ALL');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (authorRef.current && !authorRef.current.contains(e.target as Node)) {
        setIsAuthorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortLabelMap: Record<SortOption, string> = {
    FEATURED: 'FEATURED',
    PRICE_ASC: 'PRICE: LOW TO HIGH',
    PRICE_DESC: 'PRICE: HIGH TO LOW',
    NAME_ASC: 'NAME: A - Z'
  };

  const getPriceValue = (priceStr: string): number => {
    if (priceStr.toLowerCase().includes('sold')) return 9999999;
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Base curated 16-slot editorial grid matching the design:
  // Row 1: YUMI (0), Empty, ZENYA (1), ELYSIA (2)
  // Row 2: LIORA (3), SOLARA (4), girl 2.1 photo, LYRA (5)
  // Row 3: girl 2.2 photo, ISLA (6), Empty, SERAPH (7)
  // Row 4: AZURA (8), ARIYA (9), MIRA (10), Empty
  const displayedGrid = useMemo<GridCell[]>(() => {
    if (sortBy === 'FEATURED' && author === 'ALL') {
      return [
        // Row 1
        { id: 'cell-1', type: 'product', item: items[0] },
        { id: 'cell-2', type: 'empty' },
        { id: 'cell-3', type: 'product', item: items[1] },
        { id: 'cell-4', type: 'product', item: items[2] },

        // Row 2
        { id: 'cell-5', type: 'product', item: items[3] },
        { id: 'cell-6', type: 'product', item: items[4] },
        { id: 'cell-7', type: 'editorial', img: '/girl 2.1.png', alt: 'Porcelain Figurine with Model' },
        { id: 'cell-8', type: 'product', item: items[5] },

        // Row 3
        { id: 'cell-9', type: 'editorial', img: '/girl 2.2.png', alt: 'Porcelain Art with Model' },
        { id: 'cell-10', type: 'product', item: items[6] },
        { id: 'cell-11', type: 'empty' },
        { id: 'cell-12', type: 'product', item: items[7] },

        // Row 4
        { id: 'cell-13', type: 'product', item: items[8] },
        { id: 'cell-14', type: 'product', item: items[9] },
        { id: 'cell-15', type: 'product', item: items[10] },
        { id: 'cell-16', type: 'empty' },
      ];
    }

    // When sorted or filtered:
    let filtered = [...items];
    if (author !== 'ALL') {
      filtered = filtered.filter(it => it.author.toLowerCase() === author.toLowerCase());
    }

    if (sortBy === 'PRICE_ASC') {
      filtered.sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price));
    } else if (sortBy === 'PRICE_DESC') {
      filtered.sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price));
    } else if (sortBy === 'NAME_ASC') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Place into 16 grid cells with photos preserved
    const cells: GridCell[] = [];
    let pIdx = 0;
    for (let i = 0; i < 16; i++) {
      if (i === 6) {
        cells.push({ id: `cell-${i}`, type: 'editorial', img: '/girl 2.1.png', alt: 'Porcelain Figurine with Model' });
      } else if (i === 8) {
        cells.push({ id: `cell-${i}`, type: 'editorial', img: '/girl 2.2.png', alt: 'Porcelain Art with Model' });
      } else if (i === 1 || i === 10 || i === 15) {
        cells.push({ id: `cell-${i}`, type: 'empty' });
      } else if (pIdx < filtered.length) {
        cells.push({ id: `cell-${i}`, type: 'product', item: filtered[pIdx++] });
      }
    }
    return cells;
  }, [sortBy, author]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    setToastMessage("All 18 exclusive works from this collection are currently shown");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#333333] flex flex-col selection:bg-[#1A2077] selection:text-white pt-24 md:pt-32">
      {/* Title & Filters */}
      <section className="max-w-[1720px] mx-auto px-6 md:px-12 text-center pt-8 md:pt-14 pb-4">
        {/* Title with badge 18 */}
        <div className="relative inline-block">
          <h1 
            className="text-[56px] sm:text-[84px] md:text-[104px] lg:text-[124px] text-[#1A2077] leading-[0.9] tracking-tight select-none"
            style={{ fontFamily: "'Elsie Swash Caps', serif" }}
          >
            Collection
          </h1>
          <span 
            className="absolute -top-1 md:-top-2 -right-6 md:-right-8 text-[14px] md:text-[18px] font-semibold text-[#1A2077] select-none"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            18
          </span>
        </div>

        {/* Filters: SORT BY & AUTHOR */}
        <div className="flex items-center justify-center gap-8 md:gap-14 mt-8 md:mt-10">
          {/* SORT BY */}
          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsAuthorOpen(false);
              }}
              className="font-sans flex items-center gap-1.5 text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase text-[#1A2077] hover:opacity-60 transition-opacity"
            >
              <span>SORT BY:</span>
              <span className="font-semibold">{sortLabelMap[sortBy]}</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans absolute top-full left-1/2 -translate-x-1/2 mt-3 py-2 bg-white border border-[#1A2077]/15 shadow-xl z-50 min-w-[210px] text-left"
                >
                  {(['FEATURED', 'PRICE_ASC', 'PRICE_DESC', 'NAME_ASC'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSortBy(opt);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                        sortBy === opt ? 'bg-[#1A2077]/5 text-[#1A2077]' : 'text-[#333] hover:bg-gray-50'
                      }`}
                    >
                      {sortLabelMap[opt]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AUTHOR */}
          <div ref={authorRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsAuthorOpen(!isAuthorOpen);
                setIsSortOpen(false);
              }}
              className="font-sans flex items-center gap-1.5 text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase text-[#1A2077] hover:opacity-60 transition-opacity"
            >
              <span>AUTHOR:</span>
              <span className="font-semibold">{author}</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${isAuthorOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isAuthorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans absolute top-full left-1/2 -translate-x-1/2 mt-3 py-2 bg-white border border-[#1A2077]/15 shadow-xl z-50 min-w-[190px] text-left"
                >
                  {['ALL', 'Hiroshi Takahashi'].map((aut) => (
                    <button
                      key={aut}
                      type="button"
                      onClick={() => {
                        setAuthor(aut);
                        setIsAuthorOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                        author === aut ? 'bg-[#1A2077]/5 text-[#1A2077]' : 'text-[#333] hover:bg-gray-50'
                      }`}
                    >
                      {aut}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-[1720px] mx-auto px-6 md:px-12 mt-12 md:mt-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-14 lg:gap-y-20">
          {displayedGrid.map((cell, idx) => {
            // Negative space slot for high-end editorial rhythm
            if (cell.type === 'empty') {
              return <div key={cell.id || idx} className="hidden lg:block w-full" aria-hidden="true" />;
            }

            const staggerDelay = (idx % 4) * 0.12;

            // Editorial fashion campaign card (fits exact card aspect ratio, no borders or frames)
            if (cell.type === 'editorial') {
              return (
                <motion.div
                  key={cell.id || idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.9, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex flex-col group cursor-default transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                >
                  <div className="w-full aspect-[814/1160] overflow-hidden relative bg-[#F4F5F7]">
                    <motion.div
                      initial={{ scale: 1.12 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 1.2, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full"
                    >
                      <img
                        src={cell.img}
                        alt={cell.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none"
                      />
                    </motion.div>

                    {/* Luxury White Curtain Reveal Layer */}
                    <motion.div
                      initial={{ scaleY: 1 }}
                      whileInView={{ scaleY: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.85, delay: staggerDelay, ease: [0.76, 0, 0.24, 1] }}
                      style={{ transformOrigin: "top" }}
                      className="absolute inset-0 bg-white pointer-events-none z-10"
                    />
                  </div>
                </motion.div>
              );
            }

            // Product figurine card (image has its own background, no padding or wrapper frames)
            const item = cell.item;
            if (!item) return null;

            return (
              <motion.div
                key={item.name + idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectItem(item)}
                className="w-full flex flex-col group cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2"
              >
                {/* Product Image with Curtain Unveil & Cinematic Settle */}
                <div className="w-full aspect-[814/1160] overflow-hidden relative bg-[#F4F5F7]">
                  <motion.div
                    initial={{ scale: 1.12 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 1.2, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none"
                    />
                  </motion.div>

                  {/* Luxury White Curtain Reveal Layer */}
                  <motion.div
                    initial={{ scaleY: 1 }}
                    whileInView={{ scaleY: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.85, delay: staggerDelay, ease: [0.76, 0, 0.24, 1] }}
                    style={{ transformOrigin: "top" }}
                    className="absolute inset-0 bg-white pointer-events-none z-10"
                  />
                </div>

                {/* Figurine Name & Price: Staggered Slide Up */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: staggerDelay + 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center mt-5 text-center"
                >
                  <span className="font-sans font-bold text-[14px] tracking-wider text-[#333333] uppercase mb-1.5 lg:mb-3 group-hover:opacity-75 transition-opacity">
                    {item.name}
                  </span>
                  <span
                    className="text-2xl lg:text-[34px] text-[#1A2077] leading-none"
                    style={{ fontFamily: "'Elsie Swash Caps', serif" }}
                  >
                    {item.price}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Pagination / Controls */}
        <div className="mt-20 lg:mt-32 mb-16 lg:mb-24 flex flex-col items-center relative w-full">
          <div className="flex flex-col items-center">
            <span
              className="text-2xl md:text-3xl text-[#1A2077] tracking-wider"
              style={{ fontFamily: "'Elsie Swash Caps', serif" }}
            >
              1 <span className="text-[#1A2077]/40 text-lg font-sans font-light">/</span> 2
            </span>
            <button
              type="button"
              onClick={handleLoadMore}
              className="font-sans mt-3 text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#1A2077] hover:opacity-60 transition-opacity cursor-pointer"
            >
              LOAD MORE
            </button>
          </div>

          <button
            type="button"
            onClick={handleBackToTop}
            className="font-sans mt-8 lg:mt-0 lg:absolute right-0 bottom-1 text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#1A2077] hover:opacity-60 transition-opacity cursor-pointer"
          >
            BACK TO TOP
          </button>
        </div>

        {/* Floating toast notification for load more */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="font-sans fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1A2077] text-white px-6 py-3.5 text-xs font-bold tracking-widest uppercase shadow-2xl"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
};
