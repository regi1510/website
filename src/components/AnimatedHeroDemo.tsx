import Hero from "@/components/ui/animated-shader-hero";
import ScrambleText from "@/components/ui/scramble-text";

const AnimatedHeroDemo: React.FC = () => {
  const handlePrimaryClick = () => {
    console.log('Initiate Sequence clicked');
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSecondaryClick = () => {
    console.log('System Bypass clicked');
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-screen">
      <Hero
        trustBadge={{
          text: "SYSTEM STATUS: OPTIMAL // READY FOR DEPLOYMENT",
          icons: ["⚡", "🔋", "🌐"]
        }}
        headline={{
          line1: "POWERING THE",
          line2: "NEXT ERA"
        }}
        subtitle="The premier electrical contractor for forward-thinking enterprises. We deliver scalable, smart, and sustainable power solutions that drive business growth."
        buttons={{
          primary: {
            text: "GET A QUOTE",
            onClick: handlePrimaryClick
          },
          secondary: {
            text: "OUR SERVICES",
            onClick: handleSecondaryClick
          }
        }}
        className="font-sans"
      />
    </div>
  );
};

export default AnimatedHeroDemo;
