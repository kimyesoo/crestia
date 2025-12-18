"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Users, Sparkles, Fingerprint } from "lucide-react";
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

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 z-20"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section className="relative py-24 md:py-40 z-10 bg-gradient-to-b from-black to-zinc-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<Fingerprint className="w-8 h-8 text-gold-500" />}
              title={t('About.identityTitle')}
              description={t('About.identityDesc')}
              delay={0.1}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-gold-500" />}
              title={t('About.pedigreeTitle')}
              description={t('About.pedigreeDesc')}
              delay={0.3}
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-gold-500" />}
              title={t('About.marketTitle')}
              description={t('About.marketDesc')}
              delay={0.5}
            />
          </motion.div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="relative py-20 z-10 overflow-hidden bg-zinc-950/80 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="font-display text-3xl md:text-5xl text-white mb-4">{t('Showcase.title')}</h2>
          <p className="text-zinc-500 font-serif italic">{t('Showcase.subtitle')}</p>
        </div>

        {/* Marquee Effect */}
        <div className="flex gap-8 animate-marquee whitespace-nowrap px-4">
          {[1, 2, 3, 4, 1, 2, 3, 4].map((i, index) => (
            <div
              key={index}
              className="w-[300px] h-[400px] bg-zinc-900/50 rounded-lg overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105 shrink-0 relative group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
              {/* Inner Pattern for "Unrevealed" Feeling */}
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black opacity-50" />

              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-gold-500 text-xs tracking-widest uppercase mb-1">{t('Showcase.cardLabel')}</p>
                <h3 className="text-2xl font-serif text-white group-hover:text-gold-400 transition-colors">{t('Showcase.specimen')} #{i * 92}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 hover:border-gold-500/30 transition-all duration-500 group shadow-lg"
    >
      <div className="mb-6 p-4 rounded-full bg-black/50 w-fit border border-white/10 group-hover:border-gold-500/50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-serif text-white mb-3 group-hover:text-gold-400 transition-colors">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm font-light">
        {description}
      </p>
    </motion.div>
  );
}
