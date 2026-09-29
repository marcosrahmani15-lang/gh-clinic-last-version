'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Testimonial } from '@/lib/clinicData';

interface TestimonialsProps {
  testimonials: Testimonial[];
  onOpenBooking: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  onOpenBooking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-[#FAF8F5] dark:bg-[#0C0A09] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-900/90 border border-[#E5D4CB] dark:border-stone-800 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6B55] dark:text-[#DFBA9D]">
              Expériences & Avis Vérifiés
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] dark:text-[#FAF8F5] tracking-tight">
            La Voix de Nos Patientes
          </h2>

          <p className="text-stone-600 dark:text-stone-300 font-light text-base sm:text-lg leading-relaxed">
            La plus belle reconnaissance de notre travail réside dans la confiance et le sourire de nos patientes à Khemis Miliana et à travers toute l’Algérie.
          </p>

          {/* Rating Summary Pill */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-[#181513] border border-[#E5D4CB] dark:border-stone-800 shadow-xs mt-2">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
              4.9 / 5.0 • <span className="font-normal text-stone-500 dark:text-stone-400">Excellence Recommandée</span>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel & Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((t, index) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#181513] border border-[#E5D4CB]/80 dark:border-stone-800 hover:border-[#C5A089] dark:hover:border-[#DFBA9D]/50 hover:shadow-xl dark:hover:shadow-stone-950/60 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* 5 Stars and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {t.date}
                  </span>
                </div>

                {/* Treatment Tag */}
                <div className="inline-block px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/70 text-[#9E2A50] dark:text-pink-300 text-[11px] font-medium border border-pink-100 dark:border-pink-900/50">
                  {t.treatment}
                </div>

                {/* Review Text */}
                <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-light leading-relaxed italic">
                  « {t.comment} »
                </p>
              </div>

              {/* Patient Info */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {t.patientName}
                  </div>
                  <div className="text-[11px] text-stone-400 font-light">
                    {t.city}
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center" title="Avis patiente vérifiée">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="text-center">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] hover:from-[#d6ad8d] hover:to-[#8c5943] text-white font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Rejoindre nos patientes satisfaites</span>
          </button>
        </div>

      </div>
    </section>
  );
};
