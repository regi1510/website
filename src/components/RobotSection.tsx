import React from 'react';
import { SplineScene } from "@/components/ui/spline";
import { ArrowRight, Cpu, Network, Zap } from 'lucide-react';
import ScrambleText from "@/components/ui/scramble-text";

export default function RobotSection() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-black border-y border-white/10">
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
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4 text-[#E5FF00] animate-pulse">
            <Cpu size={20} />
            <span className="font-mono tracking-widest uppercase text-xs">Autonomous Systems</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
            <ScrambleText text="AUTONOMOUS" className="block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-white">FACILITY MGMT</span>
          </h2>
          
          <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed max-w-md">
            Self-regulating building systems that predict maintenance needs and optimize energy consumption automatically. 
            Reduce overhead and eliminate downtime with our AI-driven infrastructure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:border-[#00F0FF] transition-colors group cursor-pointer">
              <Network className="text-[#00F0FF] mb-3 group-hover:scale-110 transition-transform" size={24} />
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00F0FF] transition-colors">Neural Grids</h3>
              <p className="text-xs text-gray-400">Self-healing electrical networks that prevent outages before they happen.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:border-[#E5FF00] transition-colors group cursor-pointer">
              <Zap className="text-[#E5FF00] mb-3 group-hover:scale-110 transition-transform" size={24} />
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#E5FF00] transition-colors">Load Balancing</h3>
              <p className="text-xs text-gray-400">AI-driven distribution for maximum efficiency and reduced costs.</p>
            </div>
          </div>

          <button className="group flex items-center gap-3 px-6 py-3 bg-[#00F0FF] text-black font-bold tracking-widest uppercase hover:bg-white transition-colors clip-path-slant text-sm" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)' }}>
            Explore Automation <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
