import React from 'react';
import { SplineScene } from "@/components/ui/spline";
import { ArrowRight, Cpu, Network, Zap } from 'lucide-react';
import ScrambleText from "@/components/ui/scramble-text";

export default function RobotSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black border-y border-white/10">
      {/* Background Spline */}
      <div className="absolute inset-0 z-0">
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none"></div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full container mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6 text-[#E5FF00] animate-pulse">
            <Cpu size={24} />
            <span className="font-mono tracking-widest uppercase">Autonomous Systems</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            <ScrambleText text="AUTONOMOUS" className="block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-white">FACILITY MGMT</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
            Self-regulating building systems that predict maintenance needs and optimize energy consumption automatically. 
            Reduce overhead and eliminate downtime with our AI-driven infrastructure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl hover:border-[#00F0FF] transition-colors group cursor-pointer">
              <Network className="text-[#00F0FF] mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">Neural Grids</h3>
              <p className="text-sm text-gray-400">Self-healing electrical networks that prevent outages before they happen.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl hover:border-[#E5FF00] transition-colors group cursor-pointer">
              <Zap className="text-[#E5FF00] mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E5FF00] transition-colors">Load Balancing</h3>
              <p className="text-sm text-gray-400">AI-driven distribution for maximum efficiency and reduced costs.</p>
            </div>
          </div>

          <button className="group flex items-center gap-4 px-8 py-4 bg-[#00F0FF] text-black font-bold tracking-widest uppercase hover:bg-white transition-colors clip-path-slant" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)' }}>
            Explore Automation <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
