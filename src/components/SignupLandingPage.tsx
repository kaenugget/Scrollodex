"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MultiStepSignupForm } from "@/components/MultiStepSignupForm";
import { AnimatedBackground } from "@/components/AnimatedBackground";

// Static asset paths for emoji images in public directory
const imgMemoji = "/assets-moji/08356205059d24549593d0b9a19cb1762abc8900.png";
const img2728 = "/assets-moji/d6b40c57af7b91ce62fe3d8218a57c792f4e52b8.png";
const img5 = "/assets-moji/18f3ede5ed062331e5fb62e6f9d5fbc8e4f5c6ac.png";
const img1020 = "/assets-moji/1273bdff1e02246ba2bc10e92c9ae54e27ecac5c.png";
const imgMemoji1 = "/assets-moji/7d8e6fc528bf327988694404fca08058031b575e.png";
const img2429 = "/assets-moji/175b568fdd31fff9ebc4eb30d2fd4b1a988fffc3.png";
const imgMemoji2 = "/assets-moji/8c98835dadb44f58c902e8b219525eadb42275c0.png";
const img1723 = "/assets-moji/c2fddacc152d57392b08ecccebbd50e1a6f2af8a.png";
const img585 = "/assets-moji/44faab3101d6e25090512693120c23866d347d02.png";
const img1 = "/assets-moji/637f9d8820279c93bb2cefb93af72472f431eb50.png";
const img263 = "/assets-moji/0f3142c26306857d8e70277ea1bb8f087bc38fd9.png";
const img3 = "/assets-moji/40eea2bdc979e8303cfe5ad670c718ab7cc6cd26.png";
const img564 = "/assets-moji/233a6fd519ce98178bfa9832ddd058403db1d3bb.png";
const img385 = "/assets-moji/2ae7077bc7abdb19b28ad47b8561f4b6154115ee.png";
const img4 = "/assets-moji/dfa1cae2fdb7e947b9b28b566d7285888111b66a.png";
const imgMemoji3 = "/assets-moji/fdee818f54b8c3fba3690e004d2a4967c796d17d.png";
const imgMemoji4 = "/assets-moji/96ca4f3c99225394e50df5e7a78773cc97a178c7.png";
const img6 = "/assets-moji/90d4316f95dfa58f20b98e74e9e8a295574e84a4.png";
const img7 = "/assets-moji/e6a83ff14ac76d1598087c994da84a379bd4b797.png";
// const imgRectangle1 = "/assets-moji/1967330d9961adf49d90841a7a35d8b513034ef9.png";
// const imgBackground = "/assets-moji/895ae4cd93b3ed20d216afcda2414d80547ae205.png";

// Memoji components with actual images and different animations
function Memoji({ 
  src, 
  bgColor, 
  left, 
  top, 
  animation,
  className = ""
}: { 
  src: string; 
  bgColor: string; 
  left: string; 
  top: string; 
  animation: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animate: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: any;
  };
  className?: string;
}) {
  return (
    <motion.div 
      className={`absolute ${bgColor} ${left} ${top} overflow-clip size-[110px] rounded-lg ${className}`}
      animate={animation.animate}
      transition={animation.transition}
    >
      <Image 
        alt="" 
        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
        src={src}
        width={110}
        height={110}
        unoptimized
      />
    </motion.div>
  );
}

// Desktop Hero Section with floating emojis
function DesktopHeroSection() {
  const desktopMemojiData = [
    { src: imgMemoji, bgColor: "bg-[#86b6a2]", left: "left-[10%]", top: "top-[20%]", animation: { animate: { rotate: [0, -5, 0], scale: [1, 1.05, 1] }, transition: { duration: 2.5, repeat: Infinity, repeatDelay: 1 } } },
    { src: img2728, bgColor: "bg-[#ef9880]", left: "left-[15%]", top: "top-[60%]", animation: { animate: { y: [0, -8, 0], scale: [1, 1.08, 1] }, transition: { duration: 1.8, repeat: Infinity, repeatDelay: 0.8 } } },
    { src: img5, bgColor: "bg-[#ada8d6]", left: "left-[25%]", top: "top-[40%]", animation: { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 1.5 } } },
    { src: img1020, bgColor: "bg-[#f2b1ac]", left: "left-[35%]", top: "top-[15%]", animation: { animate: { rotate: [0, 8, 0, -8, 0] }, transition: { duration: 3, repeat: Infinity, repeatDelay: 0.5 } } },
    { src: imgMemoji1, bgColor: "bg-[#e2e3e5]", left: "left-[45%]", top: "top-[70%]", animation: { animate: { x: [0, -3, 3, -3, 0], rotate: [0, -2, 2, -2, 0] }, transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 } } },
    { src: img2429, bgColor: "bg-[#b8ee6b]", left: "left-[55%]", top: "top-[30%]", animation: { animate: { rotate: [0, 5, -5, 0] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } } },
    { src: imgMemoji2, bgColor: "bg-[#b8ee6b]", left: "left-[65%]", top: "top-[55%]", animation: { animate: { y: [0, -10, 0] }, transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1 } } },
    { src: img1723, bgColor: "bg-[#abc5de]", left: "left-[75%]", top: "top-[25%]", animation: { animate: { scale: [1, 1.06, 1], rotate: [0, -3, 0] }, transition: { duration: 2.2, repeat: Infinity, repeatDelay: 1.2 } } },
    { src: img585, bgColor: "bg-[#b4d1c4]", left: "left-[85%]", top: "top-[65%]", animation: { animate: { x: [0, -5, 5, 0] }, transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } } },
  ];

  return (
    <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
      {desktopMemojiData.map((memoji, index) => (
        <Memoji
          key={index}
          src={memoji.src}
          bgColor={memoji.bgColor}
          left={memoji.left}
          top={memoji.top}
          animation={memoji.animation}
        />
      ))}
    </div>
  );
}

// Mobile Grid Section (compact for mobile)
function MobileGridSection() {
  const mobileMemojiData = [
    // Row 1
    { src: imgMemoji, bgColor: "bg-[#86b6a2]", left: "left-[110px]", top: "top-0", animation: { animate: { rotate: [0, -5, 0], scale: [1, 1.05, 1] }, transition: { duration: 2.5, repeat: Infinity, repeatDelay: 1 } } },
    { src: img2728, bgColor: "bg-[#ef9880]", left: "left-[110px]", top: "top-[110px]", animation: { animate: { y: [0, -8, 0], scale: [1, 1.08, 1] }, transition: { duration: 1.8, repeat: Infinity, repeatDelay: 0.8 } } },
    { src: img5, bgColor: "bg-[#ada8d6]", left: "left-[110px]", top: "top-[330px]", animation: { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 1.5 } } },
    { src: img1020, bgColor: "bg-[#f2b1ac]", left: "left-[110px]", top: "top-[220px]", animation: { animate: { rotate: [0, 8, 0, -8, 0] }, transition: { duration: 3, repeat: Infinity, repeatDelay: 0.5 } } },
    { src: imgMemoji1, bgColor: "bg-[#e2e3e5]", left: "left-[110px]", top: "top-[440px]", animation: { animate: { x: [0, -3, 3, -3, 0], rotate: [0, -2, 2, -2, 0] }, transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 } } },
    
    // Row 2
    { src: img2429, bgColor: "bg-[#b8ee6b]", left: "left-0", top: "top-[110px]", animation: { animate: { rotate: [0, 5, -5, 0] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } } },
    { src: imgMemoji2, bgColor: "bg-[#b8ee6b]", left: "left-0", top: "top-[330px]", animation: { animate: { y: [0, -10, 0] }, transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1 } } },
    { src: img1723, bgColor: "bg-[#abc5de]", left: "left-0", top: "top-[220px]", animation: { animate: { scale: [1, 1.06, 1], rotate: [0, -3, 0] }, transition: { duration: 2.2, repeat: Infinity, repeatDelay: 1.2 } } },
    { src: img585, bgColor: "bg-[#b4d1c4]", left: "left-0", top: "top-[440px]", animation: { animate: { x: [0, -5, 5, 0] }, transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } } },
    { src: img1, bgColor: "bg-[#eab0e6]", left: "left-[220px]", top: "top-0", animation: { animate: { rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 0.8 } } },
    
    // Row 3
    { src: img263, bgColor: "bg-[#eb6c8f]", left: "left-[220px]", top: "top-[110px]", animation: { animate: { scale: [1, 1.08, 1] }, transition: { duration: 1.6, repeat: Infinity, repeatDelay: 1.4 } } },
    { src: img3, bgColor: "bg-[#fabca6]", left: "left-[220px]", top: "top-[330px]", animation: { animate: { rotate: [0, -10, 10, 0], y: [0, -6, 0] }, transition: { duration: 2.4, repeat: Infinity, repeatDelay: 1 } } },
    { src: img564, bgColor: "bg-[#ada8d6]", left: "left-[220px]", top: "top-[220px]", animation: { animate: { y: [0, -7, 0, -7, 0] }, transition: { duration: 2.8, repeat: Infinity, repeatDelay: 0.6 } } },
    { src: img385, bgColor: "bg-[#abc5de]", left: "left-[220px]", top: "top-[440px]", animation: { animate: { rotate: [0, 15, -15, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } } },
    { src: img4, bgColor: "bg-[#b788f8]", left: "left-[330px]", top: "top-0", animation: { animate: { rotate: [0, 360] }, transition: { duration: 8, repeat: Infinity, ease: "linear" } } },
    
    // Row 4
    { src: imgMemoji3, bgColor: "bg-[#ed7b34]", left: "left-[330px]", top: "top-[110px]", animation: { animate: { rotate: [0, 6, -6, 0], x: [0, 3, -3, 0] }, transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } } },
    { src: imgMemoji4, bgColor: "bg-[#b4d1c4]", left: "left-[330px]", top: "top-[330px]", animation: { animate: { scale: [1, 1.12, 1] }, transition: { duration: 1.4, repeat: Infinity, repeatDelay: 1.6 } } },
    { src: img6, bgColor: "bg-[#e8b747]", left: "left-[330px]", top: "top-[220px]", animation: { animate: { scale: [1, 1.15, 1], y: [0, -8, 0] }, transition: { duration: 1.2, repeat: Infinity, repeatDelay: 2 } } },
    { src: img7, bgColor: "bg-[#d4abde]", left: "left-[330px]", top: "top-[440px]", animation: { animate: { y: [0, -12, 0], rotate: [0, 3, 0, -3, 0] }, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } } },
  ];

  return (
    <div className="lg:hidden relative w-[440px] h-[550px] mx-auto sm:w-[90%] sm:max-w-[400px] mt-8 mb-8">
      {mobileMemojiData.map((memoji, index) => (
        <Memoji
          key={index}
          src={memoji.src}
          bgColor={memoji.bgColor}
          left={memoji.left}
          top={memoji.top}
          animation={memoji.animation}
        />
      ))}
    </div>
  );
}

export function SignupLandingPage() {
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupSuccess = () => {
    // Use window.location.href to force a full page reload
    // This ensures the authentication state is properly synchronized
    window.location.href = "/";
  };

  return (
    <div className="scrollodex-bg min-h-screen flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 lg:p-8">
      <AnimatedBackground />
      
      {/* Desktop Hero Section */}
      <DesktopHeroSection />
      
      {/* Mobile Grid Section */}
      <MobileGridSection />

      {/* Content Section */}
      <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-16 z-50">
        {/* Left Side - Hero Content */}
        <div className="flex-1 text-center lg:text-left lg:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold scrollodex-text-white-bold scrollodex-text-animate mb-6">
              Scrollodex
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl scrollodex-text-white mb-8 lg:mb-12">
              Explore Your Circle Like Never Before.
            </p>
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="space-y-4 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="scrollodex-text-white">AI-powered contact management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="scrollodex-text-white">Personalized relationship insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="scrollodex-text-white">Smart networking made simple</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Signup Form */}
        <motion.div 
          className="w-full lg:w-auto lg:min-w-[480px] z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <div className="scrollodex-card scrollodex-card-large">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h2 className="text-2xl font-bold scrollodex-text-dark mb-2">
                Join Scrollodex
              </h2>
              <p className="scrollodex-text-gray">
                Create your account and start building meaningful connections
              </p>
            </div>
            
            <MultiStepSignupForm 
              onSuccess={handleSignupSuccess}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
