"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

const evolutionData = [
  {
    id: 1,
    year: "Antiquity",
    title: "Ancient Wisdom",
    description: "Centuries ago, the foundations of modern medicine were laid. Visionaries like Sushruta pioneered complex surgical procedures, while Ayurvedic scholars documented the healing properties of thousands of medicinal plants. True healthcare began with an intimate understanding of nature and the human body.",
    image: "/evolution/1.jpg"
  },
  {
    id: 2,
    year: "Classical Era",
    title: "Classical Systems",
    description: "As civilizations grew, so did our systematic approach to healing. Classical texts compiled rigorous diagnostic methods, herbal formulations, and ethical codes for physicians. The shift from mystic healing to structured, evidence-based observation marked a turning point in human survival.",
    image: "/evolution/2.jpg"
  },
  {
    id: 3,
    year: "20th Century",
    title: "The Scientific Revolution",
    description: "The 20th century introduced unprecedented breakthroughs. Laboratories replaced apothecary shops. The microscope, antibiotics, and structured medical universities transformed healthcare into a rigorous science, drastically increasing life expectancy and curing previously fatal diseases.",
    image: "/evolution/3.jpg"
  },
  {
    id: 4,
    year: "Early 21st Century",
    title: "Digital Infrastructure",
    description: "Today, medicine is deeply integrated with digital infrastructure. Electronic health records, telemedicine, and global health networks allow for rapid diagnosis and cross-border collaboration. Healthcare is no longer localized; it is a globally connected ecosystem.",
    image: "/evolution/4.jpg"
  },
  {
    id: 5,
    year: "Present Day",
    title: "The AI Era",
    description: "We are now stepping into the era of Artificial Intelligence. CARE360 represents this pinnacle, where predictive algorithms, digital twin simulations, and machine learning models analyze complex health data instantly. The future of medicine is proactive, precise, and profoundly intelligent.",
    image: "/evolution/5.jpg"
  }
];

const EvolutionCard = ({ data, index, total }: { data: typeof evolutionData[0], index: number, total: number }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Scale down slightly as it goes up, to give depth
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.5]);

  return (
    <div 
      ref={containerRef}
      className="sticky top-0 min-h-screen md:h-screen w-full flex flex-col md:flex-row items-center justify-between overflow-hidden bg-white"
      style={{
        zIndex: index * 10,
        boxShadow: index > 0 ? "0 -20px 40px rgba(0,0,0,0.1)" : "none" // Creates drop shadow over previous section
      }}
    >
      <motion.div 
        style={{ scale, opacity }}
        className="w-full h-full flex flex-col md:flex-row origin-top"
      >
        {/* Left Side: Text */}
        <div className="w-full md:w-[45%] h-auto md:h-full flex flex-col justify-center px-6 py-8 sm:px-12 md:px-20 lg:px-32 bg-white relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-black/40 mb-2 sm:mb-4 block">
              {data.year}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-black mb-4 sm:mb-8 leading-[1.15]">
              {data.title}
            </h2>
            <p className="text-sm sm:text-base md:text-xl leading-relaxed text-black/70 font-light">
              {data.description}
            </p>
          </motion.div>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-[55%] h-auto md:h-full relative flex items-center justify-center bg-white px-6 pb-8 md:p-20 lg:p-32">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full aspect-16/10 sm:aspect-4/3 md:aspect-4/5 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-xl md:shadow-2xl border border-black/5 max-h-[35vh] md:max-h-none"
          >
            <img 
              src={data.image} 
              alt={data.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export function MedicalEvolutionSection() {
  return (
    <section className="relative w-full bg-white pb-[10vh]">
      {/* Intro Header before stacking begins */}
      <div className="h-[40vh] w-full flex items-center justify-center bg-white relative z-10">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black/80 text-center px-6">
          The Journey of Healing
        </h2>
      </div>

      {evolutionData.map((data, index) => (
        <EvolutionCard 
          key={data.id} 
          data={data} 
          index={index} 
          total={evolutionData.length} 
        />
      ))}
    </section>
  );
}
