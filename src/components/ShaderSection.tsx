import React from 'react';
import { ShaderAnimation } from "@/components/ui/shader-lines";
import { ArrowRight, BarChart3, ShieldCheck, Wifi } from 'lucide-react';
import ScrambleText from "@/components/ui/scramble-text";

export default function ShaderSection() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-black border-y border-white/10">
      {/* Background Shader */}
      <div className="absolute inset-0 z-0 opacity-60">
        <ShaderAnimation />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full container mx-auto px-6 flex flex-col items-center justify-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse"></div>
          <span className="text-[10px] font-mono text-[#00F0FF] tracking-widest uppercase">Live Data Stream Active</span>
        </div>

        <h2 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter mix-blend-overlay">
          <ScrambleText text="DATA-DRIVEN" className="block" />
          <span className="text-[#E5FF00]">RELIABILITY</span>
        </h2>

        <p className="text-base md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
          Leverage real-time analytics to monitor power quality, load distribution, and system health from a single dashboard.
          We engineer systems for 99.999% uptime in mission-critical environments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
          {[
            { icon: ShieldCheck, title: "Cyber-Secure", desc: "Military-grade encryption for all smart-home and industrial nodes." },
            { icon: Wifi, title: "IoT Integration", desc: "Seamless connectivity for thousands of devices with zero latency." },
            { icon: BarChart3, title: "Real-Time Analytics", desc: "Monitor consumption, predict spikes, and optimize efficiency instantly." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:border-[#00F0FF]/50 transition-all hover:-translate-y-2 cursor-pointer group">
              <item.icon className="text-[#00F0FF] mb-4 group-hover:text-[#E5FF00] transition-colors" size={32} />
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <button className="px-8 py-3 border border-white/20 text-white font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-all text-xs md:text-sm">
          View Technical Specs
        </button>

      </div>
    </section>
  );
}
