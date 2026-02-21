import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Shield, Cpu, Activity, Globe, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import AnimatedHeroDemo from '@/components/AnimatedHeroDemo';
import RobotSection from '@/components/RobotSection';
import ShaderSection from '@/components/ShaderSection';
import ScrambleText from "@/components/ui/scramble-text";

gsap.registerPlugin(ScrollTrigger);

// --- Constants & Config ---
const COLORS = {
  background: '#050505',
  cyan: 0x00F0FF,
  yellow: 0xE5FF00,
  darkMetal: 0x111111,
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Three.js & GSAP Setup ---
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Fog for depth
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- Objects ---

    // 1. The Core (Icosahedron)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.darkMetal,
      roughness: 0.2,
      metalness: 0.9,
      flatShading: true,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // 2. Wireframe Overlay (Glowing Cyan)
    const wireframeGeometry = new THREE.WireframeGeometry(coreGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: COLORS.cyan, transparent: true, opacity: 0.3 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    // Scale slightly up to avoid z-fighting
    wireframe.scale.set(1.01, 1.01, 1.01);
    core.add(wireframe);

    // 3. Inner Pulse (Glowing Yellow)
    const innerGeometry = new THREE.IcosahedronGeometry(0.8, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.yellow,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    core.add(innerCore);

    // 4. Floating Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 400;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15; // Spread out
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // 5. Orbital Rings
    const ringGeometry = new THREE.TorusGeometry(2.2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: COLORS.cyan, transparent: true, opacity: 0.2 });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    
    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 4;
    
    scene.add(ring1);
    scene.add(ring2);


    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(COLORS.cyan, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(COLORS.yellow, 1, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const rimLight = new THREE.SpotLight(0xffffff, 5);
    rimLight.position.set(-5, 5, -5);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);


    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const time = clock.getElapsedTime();

      // Rotate Core
      core.rotation.y = time * 0.1;
      core.rotation.x = Math.sin(time * 0.2) * 0.1;

      // Pulse Inner Core
      const pulse = Math.sin(time * 3) * 0.1 + 1;
      innerCore.scale.set(pulse, pulse, pulse);
      pointLight.intensity = (Math.sin(time * 4) * 0.5 + 1.5) * 2; // Flicker effect

      // Rotate Rings
      ring1.rotation.z = time * 0.2;
      ring2.rotation.z = -time * 0.15;
      
      // Float Particles
      particles.rotation.y = time * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();


    // --- ScrollTrigger Animation ---
    
    // Create a timeline that spans the entire scroll height
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // Camera Moves - Adjusted for new layout
    // 1. Hero (AnimatedHeroDemo) - Camera stays put or slow drift
    tl.to(camera.position, { z: 5, duration: 1 }, 0);

    // 2. About -> Robot Section
    tl.to(camera.position, { z: 3, y: 1, x: 2, duration: 2 }, 1);
    tl.to(core.rotation, { y: Math.PI, duration: 2 }, 1);

    // 3. Robot -> Commercial
    tl.to(camera.position, { z: 0, x: 4, y: 0, duration: 2 }, 3);
    
    // 4. Commercial -> Shader Section
    tl.to(camera.position, { x: 0, y: 4, z: 2, duration: 2 }, 5);
    tl.to(camera.lookAt, { x: 0, y: 0, z: 0, duration: 0.1 }, 5);

    // 5. Shader -> Industrial
    tl.to(camera.position, { x: -2, y: -1, z: 2, duration: 2 }, 7);

    // 6. Industrial -> Lighting
    tl.to(camera.position, { x: 0, y: 0, z: 5, duration: 2 }, 9);

    // 7. Lighting -> Renewable
    tl.to(camera.position, { x: -4, y: 2, z: 0, duration: 2 }, 11);

    // 8. Renewable -> Safety
    tl.to(camera.position, { x: 0, y: -3, z: 3, duration: 2 }, 13);

    // 9. Safety -> Process
    tl.to(camera.position, { z: 1.5, duration: 2 }, 15);

    // 10. Process -> Contact
    tl.to(camera.position, { z: 4, y: 0, x: 0, duration: 2 }, 17);


    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
    };
  }, []);

  // --- UI Animation (Reveal on Scroll) ---
  useEffect(() => {
    const sections = document.querySelectorAll('.section-content');
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-[#00F0FF] selection:text-black">
      
      {/* 3D Canvas Background (Base Layer) */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Radial Gradient Overlay */}
      <div className="fixed top-0 left-0 w-full h-full z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] pointer-events-none opacity-80 mix-blend-multiply"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
          <Zap className="text-[#E5FF00] fill-[#E5FF00]" size={24} />
          <span>VOLTAIC<span className="text-[#00F0FF]">PRIME</span></span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase text-gray-400">
          <a href="#about" className="hover:text-[#00F0FF] transition-colors hover:underline underline-offset-4">Philosophy</a>
          <a href="#robotics" className="hover:text-[#00F0FF] transition-colors hover:underline underline-offset-4">Robotics</a>
          <a href="#commercial" className="hover:text-[#00F0FF] transition-colors hover:underline underline-offset-4">Commercial</a>
          <a href="#contact" className="hover:text-[#E5FF00] transition-colors text-white hover:underline underline-offset-4">Contact</a>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-2xl font-bold uppercase tracking-widest">
          <a href="#about" onClick={() => setIsMenuOpen(false)}>Philosophy</a>
          <a href="#robotics" onClick={() => setIsMenuOpen(false)}>Robotics</a>
          <a href="#commercial" onClick={() => setIsMenuOpen(false)}>Commercial</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-[#E5FF00]">Contact</a>
        </div>
      )}

      {/* Main Scroll Container */}
      <div ref={scrollContainerRef} className="relative z-10 w-full">
        
        {/* 1. New Hero Section (Animated Shader) */}
        <section id="hero" className="w-full">
          <AnimatedHeroDemo />
        </section>

        {/* 2. About Section */}
        <section id="about" className="min-h-screen w-full flex items-center px-6 md:px-24">
          <div className="section-content max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="text-[#E5FF00]" size={32} />
              <h3 className="text-xl font-mono text-[#E5FF00]">01 // OUR CORE MISSION</h3>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              EMPOWERING INFRASTRUCTURE WITH <span className="text-[#00F0FF]">INTELLIGENT ENERGY.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-[#00F0FF]/30 pl-6">
              We engineer the central nervous system of your facility. From ultra-efficient high-voltage distribution to adaptive smart-grid logic, we ensure your operations never miss a beat.
            </p>
          </div>
        </section>

        {/* 3. New Robot Section */}
        <div id="robotics">
          <RobotSection />
        </div>

        {/* 4. Commercial Spaces */}
        <section id="commercial" className="min-h-screen w-full flex items-center justify-center px-6">
          <div className="section-content w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
               {/* Placeholder for 3D interaction space */}
               <div className="h-64 md:h-96 w-full border border-[#E5FF00]/20 rounded-xl relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[#E5FF00]/5 group-hover:bg-[#E5FF00]/10 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 left-4 font-mono text-[#E5FF00] text-xs">
                    STATUS: OPERATIONAL<br/>LOAD: 84%
                  </div>
               </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-4 mb-6">
                <Activity className="text-[#00F0FF]" size={32} />
                <h3 className="text-xl font-mono text-[#00F0FF]">03 // ENTERPRISE SOLUTIONS</h3>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                ZERO-DOWNTIME<br/>POWER ARCHITECTURE
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                For data centers, corporate HQs, and retail giants where failure is not an option. We build redundant, fail-safe electrical ecosystems designed for 24/7 reliability.
              </p>
              <button className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/20 hover:bg-[#00F0FF] hover:text-black hover:border-[#00F0FF] transition-all duration-300 rounded-full font-bold tracking-widest uppercase">
                SCHEDULE SITE AUDIT <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
          </div>
        </section>

        {/* 5. New Shader Section */}
        <div id="engineering">
          <ShaderSection />
        </div>

        {/* 6. Industrial */}
        <section id="industrial" className="min-h-screen w-full flex items-center px-6 md:px-24 bg-black/20 backdrop-blur-sm">
          <div className="section-content max-w-3xl">
             <h3 className="text-xl font-mono text-gray-500 mb-4">04 // HEAVY INDUSTRY</h3>
             <h2 className="text-6xl md:text-8xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-800">
               GIGAWATT-SCALE<br/>ENGINEERING
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: '3-PHASE', desc: '480V High-Capacity Distribution' },
                  { title: 'MOTORS', desc: 'Soft Start & VFD Integration' },
                  { title: 'SAFETY', desc: 'Arc Flash Mitigation & Compliance' }
                ].map((item, i) => (
                  <div key={i} className="p-6 border-t border-gray-800 hover:border-[#E5FF00] transition-colors group cursor-pointer">
                    <h4 className="text-2xl font-bold mb-2 group-hover:text-[#E5FF00] transition-colors">{item.title}</h4>
                    <p className="text-gray-500 font-mono text-sm">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 7. Smart Lighting */}
        <section id="lighting" className="min-h-screen w-full flex items-center justify-center px-6 text-center">
          <div className="section-content max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-thin mb-8 tracking-tighter">
              HUMAN-CENTRIC <span className="font-bold text-[#00F0FF] glow-text">LIGHTING</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Boost productivity and reduce costs with AI-driven lighting systems that adapt to occupancy, daylight, and circadian rhythms.
            </p>
            <div className="flex justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#00F0FF] blur-xl opacity-50 animate-pulse"></div>
              <div className="w-16 h-16 rounded-full bg-[#E5FF00] blur-xl opacity-50 animate-pulse delay-75"></div>
              <div className="w-16 h-16 rounded-full bg-white blur-xl opacity-50 animate-pulse delay-150"></div>
            </div>
          </div>
        </section>

        {/* 8. Renewable */}
        <section id="renewable" className="min-h-screen w-full flex items-center px-6 md:px-24">
          <div className="section-content max-w-2xl ml-auto text-right">
            <h3 className="text-xl font-mono text-[#00F0FF] mb-4">06 // ENERGY INDEPENDENCE</h3>
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              OFF-GRID<br/>CAPABILITY
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Reduce operational costs and carbon footprint. We integrate industrial-grade solar arrays and battery storage to give you power autonomy.
            </p>
            <div className="inline-flex flex-col gap-2 items-end font-mono text-xs text-[#00F0FF]">
              <span>PV INPUT: ACTIVE</span>
              <span>GRID STATUS: SYNCED</span>
              <span>BATTERY: 98%</span>
            </div>
          </div>
        </section>

        {/* 9. Safety */}
        <section id="safety" className="min-h-screen w-full flex items-center justify-center px-6 bg-[#111]/50">
          <div className="section-content text-center">
            <Shield className="mx-auto text-white mb-8" size={64} />
            <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-widest">
              MILITARY-GRADE<br/>COMPLIANCE
            </h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8">
              {['ISO 9001', 'NEC 2024', 'OSHA 30', 'LEED GOLD'].map((badge) => (
                <div key={badge} className="px-6 py-3 border border-white/20 rounded-lg font-mono text-sm hover:bg-white hover:text-black transition-colors cursor-default">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Process */}
        <section id="process" className="min-h-screen w-full flex items-center px-6 md:px-24">
          <div className="section-content w-full">
            <h2 className="text-5xl md:text-7xl font-bold mb-16 text-center md:text-left">EXECUTION PROTOCOL</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'SURVEY', text: 'Site analysis & load calculation.' },
                { step: '02', title: 'DESIGN', text: 'CAD schematics & lighting plots.' },
                { step: '03', title: 'DEPLOY', text: 'Rough-in & precision wiring.' },
                { step: '04', title: 'ACTIVATE', text: 'Testing, programming & handover.' },
              ].map((item) => (
                <div key={item.step} className="relative p-8 border-l border-gray-800 hover:border-[#00F0FF] transition-colors group cursor-pointer">
                  <span className="absolute -left-3 top-8 w-6 h-6 bg-[#050505] border border-gray-800 group-hover:border-[#00F0FF] rounded-full flex items-center justify-center text-[10px] text-gray-500 group-hover:text-[#00F0FF]">
                    {item.step}
                  </span>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-[#00F0FF] transition-colors">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Contact */}
        <section id="contact" className="min-h-screen w-full flex items-center justify-center px-6">
          <div className="section-content w-full max-w-4xl bg-[#111] border border-white/10 p-8 md:p-16 rounded-3xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00F0FF] via-[#E5FF00] to-[#00F0FF]"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">START YOUR<br/>PROJECT</h2>
                <p className="text-gray-400 mb-8">
                  Ready to upgrade your infrastructure? Dispatch a request to our engineering team.
                </p>
                <div className="space-y-4 font-mono text-sm text-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-[#E5FF00] rounded-full animate-pulse"></div>
                    <span>Tirana, Albania HQ</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse"></div>
                    <span>+355 4 222 3333</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>dispatch@voltaicprime.al</span>
                  </div>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-mono text-[#00F0FF] mb-2 uppercase">Identity</label>
                  <input type="text" className="w-full bg-black/50 border border-white/20 p-4 rounded-lg focus:outline-none focus:border-[#00F0FF] text-white transition-colors" placeholder="NAME / ORG" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#00F0FF] mb-2 uppercase">Coordinates</label>
                  <input type="email" className="w-full bg-black/50 border border-white/20 p-4 rounded-lg focus:outline-none focus:border-[#00F0FF] text-white transition-colors" placeholder="EMAIL ADDRESS" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#00F0FF] mb-2 uppercase">Transmission</label>
                  <textarea rows={4} className="w-full bg-black/50 border border-white/20 p-4 rounded-lg focus:outline-none focus:border-[#00F0FF] text-white transition-colors" placeholder="PROJECT DETAILS"></textarea>
                </div>
                <button className="w-full bg-[#00F0FF] text-black font-bold py-4 rounded-lg hover:bg-[#E5FF00] transition-colors uppercase tracking-widest">
                  REQUEST PROPOSAL
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600 text-xs font-mono uppercase tracking-widest border-t border-white/5">
          <p>&copy; 2026 Voltaic Prime Systems. All Systems Nominal.</p>
        </footer>

      </div>
    </div>
  );
}
