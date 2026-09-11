"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const EscapeVisionIntro = () => {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-bold tracking-widest text-orange-600 uppercase mb-4">
            Our Philosophy
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
            Escape the Ordinary. <br />
            <span className="text-slate-500">Capture the Vision.</span>
          </h3>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-12">
            At Escape + , we believe that true travel is more than just sightseeing. 
            It is a deliberate shift in perspective. We curate journeys that challenge 
            your boundaries, immerse you in raw beauty, and leave you with a vision of 
            the world—and yourself—that you didn&apos;t have before.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-slate-100 pt-12">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Curated Depth</h4>
              <p className="text-sm text-slate-500">Beyond tourist trails into authentic experiences.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Conscious Travel</h4>
              <p className="text-sm text-slate-500">Respecting the lands and cultures we visit.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Lasting Vision</h4>
              <p className="text-sm text-slate-500">Memories that transform your future outlook.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};