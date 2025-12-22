"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const t = useTranslations();

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-gold-500/30 font-sans">

      {/* HERO SECTION CONTAINER */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">

        {/* [1] Background Image Area */}
        <div className="absolute inset-0 h-full w-full z-0">
          <Image
            src="/hero-gecko.jpg"
            alt="Mystic Background"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="opacity-100"
          />
          {/* [2] Overlay: 50% opacity, No Blur (Maintained) */}
          <div className="absolute inset-0 bg-black/50 z-10" />

          {/* [3] Atmospheric Glow */}
          <div className="absolute inset-0 z-10 bg-gradient-radial from-transparent via-black/20 to-black/80 opacity-60" />
        </div>

        {/* [4] Central Content Area */}
        <motion.div
          style={{ y: y1, opacity }}
          className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto"
        >
          {/* Main Headings */}
          <div className="relative mb-2">
            {/* Glowing orb behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 bg-gold-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Main Title: CRESTIA */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative font-serif text-6xl md:text-9xl font-bold tracking-[0.2em] bg-gradient-to-r from-[#FBF5b7] via-[#D4AF37] to-[#aa771c] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] ml-4"
            >
              {t('Hero.title')}
            </motion.h1>
          </div>

          {/* Subtitle: The Mystic Lineage */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-sm md:text-xl text-[#D4AF37]/80 tracking-[0.3em] font-light uppercase mb-10"
          >
            {t('Hero.subtitle')}
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild className="h-auto px-8 py-4 bg-transparent border border-gold-500/50 text-gold-500 rounded-full text-sm md:text-base font-bold tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] group">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="relative z-10">{t('Hero.button')}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>


        {/* --- [NEW] Hero Text Section --- */}
        {/* Visibility Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

        {/* Text Content */}
        <div className="absolute bottom-[18%] left-0 w-full flex flex-col items-center text-center z-20 px-4">

          {/* Main Title */}
          <h2 className="text-[#D4AF37] font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] drop-shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase">
            The Global Standard of Lineage
          </h2>

          {/* Sub Description */}
          <p className="mt-4 text-zinc-300 font-sans text-sm md:text-base opacity-90 leading-relaxed max-w-2xl drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            검증된 ID 카드 발급부터 투명한 이력 추적까지.<br className="hidden md:block" />
            신뢰할 수 있는 거래와 관리는 크레스티아에서 시작됩니다.
          </p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 z-20"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* 2. Service Shortcut Section */}
      <section className="py-20 bg-zinc-900 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h3 className="text-[#D4AF37] font-serif text-2xl mb-8 tracking-widest text-center">CRESTIA UTILITIES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Registration Helper */}
            <Link href="/registration-helper" className="group p-8 border border-zinc-700 bg-black hover:border-[#D4AF37] transition-all duration-300 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <div className="relative z-10">
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📄</div>
                <h4 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-3">신고 서류 원클릭 완성</h4>
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300">
                  복잡한 양도/양수/보관 신고, <br />
                  엑셀만 넣으면 1초 만에 서식이 만들어집니다.
                </p>
              </div>
            </Link>

            {/* Card 2: ID Card Generator */}
            <Link href="/card" className="group p-8 border border-zinc-700 bg-black hover:border-[#D4AF37] transition-all duration-300 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <div className="relative z-10">
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">💳</div>
                <h4 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-3">디지털 ID 카드 발급</h4>
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300">
                  내 개체의 가치를 증명하는 <br />
                  고품격 ID 카드와 혈통서를 발급받으세요.
                </p>
              </div>
            </Link>

            {/* Card 3: Community */}
            <Link href="/community" className="group p-8 border border-zinc-700 bg-black hover:border-[#D4AF37] transition-all duration-300 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <div className="relative z-10">
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">💬</div>
                <h4 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-3">브리더 라운지</h4>
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300">
                  사육 노하우 공유부터 모프 질문까지, <br />
                  브리더들과 자유롭게 소통하세요.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Trending Now (Community) */}
      <section className="py-20 bg-black relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-white font-serif text-3xl mb-2">TRENDING NOW</h3>
              <p className="text-zinc-500">커뮤니티에서 가장 뜨거운 이야기</p>
            </div>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:border-white">
              <Link href="/community">더보기</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "이번에 해칭한 릴리입니다", author: "GeckoLover", likes: 24, comments: 8, tag: "Hatching" },
              { title: "신고 서류 작성 질문있어요", author: "Newbie01", likes: 12, comments: 15, tag: "Q&A" },
              { title: "아잔틱 라인업 정리해봅니다", author: "BreederPro", likes: 56, comments: 23, tag: "Info" },
              { title: "서울 파충류 박람회 후기", author: "ReptileFan", likes: 34, comments: 5, tag: "Review" },
            ].map((post, i) => (
              <Link href="/community" key={i} className="group bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg hover:border-[#D4AF37]/50 hover:bg-zinc-900 transition-all duration-300">
                <div className="text-xs text-[#D4AF37] mb-3 px-2 py-1 bg-[#D4AF37]/10 w-fit rounded">{post.tag}</div>
                <h4 className="text-white font-medium text-lg mb-4 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center justify-between text-zinc-500 text-sm mt-auto">
                  <span>{post.author}</span>
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1">♥ {post.likes}</span>
                    <span className="flex items-center gap-1">🗨 {post.comments}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Geckos (Showcase) */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-[#D4AF37] font-serif text-4xl mb-4">FEATURED GECKOS</h3>
            <p className="text-zinc-400">브리더들의 자부심이 담긴 쇼케이스</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="relative aspect-square group overflow-hidden rounded-xl bg-zinc-900">
                {/* Placeholder for images - In production this would be next/image */}
                <div className="absolute inset-0 bg-zinc-800 animate-pulse group-hover:animate-none transition-all" />
                <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-serif text-4xl opacity-20 group-hover:opacity-10 transition-opacity">
                  #{item}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-[#D4AF37] text-xs font-bold tracking-widest mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">LILLY WHITE</p>
                  <p className="text-white font-serif transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">My Precious #{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-8 py-6 text-lg tracking-widest transition-all duration-500">
              <Link href="/showcase">VIEW ALL GALLERY</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


