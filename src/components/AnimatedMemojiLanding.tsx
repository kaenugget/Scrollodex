"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { LoginForm, SignUpForm } from "@/components/AuthForms";
import { MultiStepSignupForm } from "@/components/MultiStepSignupForm";

// Memoji components with different animations
function Memoji({ 
  emoji, 
  bgColor, 
  left, 
  top, 
  animation,
  className = ""
}: { 
  emoji: string; 
  bgColor: string; 
  left: string; 
  top: string; 
  animation: any;
  className?: string;
}) {
  return (
    <motion.div 
      className={`absolute ${bgColor} ${left} ${top} overflow-clip size-[80px] lg:size-[110px] rounded-lg flex items-center justify-center text-4xl lg:text-6xl ${className}`}
      animate={animation.animate}
      transition={animation.transition}
    >
      {emoji}
    </motion.div>
  );
}

// Desktop Hero Section with sparse memojis
function DesktopHeroSection() {
  const desktopMemojiData = [
    { emoji: "😊", bgColor: "bg-green-300", left: "left-[10%]", top: "top-[20%]", animation: { animate: { rotate: [0, -5, 0], scale: [1, 1.05, 1] }, transition: { duration: 2.5, repeat: Infinity, repeatDelay: 1 } } },
    { emoji: "👍", bgColor: "bg-green-400", left: "left-[15%]", top: "top-[60%]", animation: { animate: { y: [0, -8, 0], scale: [1, 1.08, 1] }, transition: { duration: 1.8, repeat: Infinity, repeatDelay: 0.8 } } },
    { emoji: "😮", bgColor: "bg-purple-300", left: "left-[25%]", top: "top-[40%]", animation: { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 1.5 } } },
    { emoji: "😄", bgColor: "bg-pink-300", left: "left-[35%]", top: "top-[15%]", animation: { animate: { rotate: [0, 8, 0, -8, 0] }, transition: { duration: 3, repeat: Infinity, repeatDelay: 0.5 } } },
    { emoji: "🤪", bgColor: "bg-gray-300", left: "left-[45%]", top: "top-[70%]", animation: { animate: { x: [0, -3, 3, -3, 0], rotate: [0, -2, 2, -2, 0] }, transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 } } },
    { emoji: "😎", bgColor: "bg-green-300", left: "left-[55%]", top: "top-[30%]", animation: { animate: { rotate: [0, 5, -5, 0] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } } },
    { emoji: "😍", bgColor: "bg-green-400", left: "left-[65%]", top: "top-[55%]", animation: { animate: { y: [0, -10, 0] }, transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1 } } },
    { emoji: "😘", bgColor: "bg-blue-300", left: "left-[75%]", top: "top-[25%]", animation: { animate: { scale: [1, 1.06, 1], rotate: [0, -3, 0] }, transition: { duration: 2.2, repeat: Infinity, repeatDelay: 1.2 } } },
    { emoji: "🤔", bgColor: "bg-green-200", left: "left-[85%]", top: "top-[65%]", animation: { animate: { x: [0, -5, 5, 0] }, transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } } },
  ];

  return (
    <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
      {desktopMemojiData.map((memoji, index) => (
        <Memoji
          key={index}
          emoji={memoji.emoji}
          bgColor={memoji.bgColor}
          left={memoji.left}
          top={memoji.top}
          animation={memoji.animation}
        />
      ))}
    </div>
  );
}

// Background component
function BackgroundSection() {
  return (
    <div className="absolute h-[500px] left-0 top-[550px] w-full bg-gradient-to-b from-purple-900 to-purple-800 sm:hidden" />
  );
}

// Take a Photo button component
function TakePhotoButton({ onTakePhoto }: { onTakePhoto: () => void }) {
  return (
    <div className="absolute left-[27px] top-[828px] sm:left-4 sm:right-4 sm:w-auto z-50 sm:relative sm:top-auto sm:mt-6">
      <motion.button 
        className="bg-gradient-to-r from-pink-500 to-purple-600 h-[76px] rounded-[20px] w-[387px] sm:w-full sm:max-w-md sm:mx-auto flex items-center justify-center shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onTakePhoto}
      >
        <p className="font-bold text-[24px] text-white sm:text-[20px]">
          ✨ Create Account with AI Avatar
        </p>
      </motion.button>
    </div>
  );
}

// Auth overlay component
function AuthOverlay({ 
  showAuth, 
  setShowAuth, 
  onAuthSuccess 
}: { 
  showAuth: "login" | "signup" | "multi-step-signup" | null;
  setShowAuth: (auth: "login" | "signup" | "multi-step-signup" | null) => void;
  onAuthSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!showAuth) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {showAuth === "login" ? (
          <LoginForm onSuccess={onAuthSuccess} />
        ) : showAuth === "signup" ? (
          <SignUpForm onSuccess={onAuthSuccess} />
        ) : showAuth === "multi-step-signup" ? (
          <MultiStepSignupForm 
            onSuccess={onAuthSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : null}
        
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAuth(null)}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnimatedMemojiLanding() {
  const [showAuth, setShowAuth] = useState<"login" | "signup" | "multi-step-signup" | null>(null);

  const handleTakePhoto = () => {
    // Open the multi-step signup form with memoji generation
    setShowAuth("multi-step-signup");
  };

  const handleAuthSuccess = () => {
    setShowAuth(null);
    // The page will automatically redirect to the main app
  };

  // Define the condensed mobile grid of Memojis with their positions, colors, and animations
  const memojiData = [
    // Row 1 - condensed
    { emoji: "😊", bgColor: "bg-green-300", left: "left-[80px]", top: "top-0", animation: { animate: { rotate: [0, -5, 0], scale: [1, 1.05, 1] }, transition: { duration: 2.5, repeat: Infinity, repeatDelay: 1 } } },
    { emoji: "👍", bgColor: "bg-green-400", left: "left-[80px]", top: "top-[120px]", animation: { animate: { y: [0, -8, 0], scale: [1, 1.08, 1] }, transition: { duration: 1.8, repeat: Infinity, repeatDelay: 0.8 } } },
    { emoji: "😮", bgColor: "bg-purple-300", left: "left-[80px]", top: "top-[240px]", animation: { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 1.5 } } },
    { emoji: "😄", bgColor: "bg-pink-300", left: "left-[80px]", top: "top-[360px]", animation: { animate: { rotate: [0, 8, 0, -8, 0] }, transition: { duration: 3, repeat: Infinity, repeatDelay: 0.5 } } },
    
    // Row 2 - condensed
    { emoji: "😎", bgColor: "bg-green-300", left: "left-0", top: "top-[60px]", animation: { animate: { rotate: [0, 5, -5, 0] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } } },
    { emoji: "😍", bgColor: "bg-green-400", left: "left-0", top: "top-[180px]", animation: { animate: { y: [0, -10, 0] }, transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1 } } },
    { emoji: "😘", bgColor: "bg-blue-300", left: "left-0", top: "top-[300px]", animation: { animate: { scale: [1, 1.06, 1], rotate: [0, -3, 0] }, transition: { duration: 2.2, repeat: Infinity, repeatDelay: 1.2 } } },
    { emoji: "🤔", bgColor: "bg-green-200", left: "left-0", top: "top-[420px]", animation: { animate: { x: [0, -5, 5, 0] }, transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } } },
    
    // Row 3 - condensed
    { emoji: "😳", bgColor: "bg-pink-400", left: "left-[160px]", top: "top-[60px]", animation: { animate: { scale: [1, 1.08, 1] }, transition: { duration: 1.6, repeat: Infinity, repeatDelay: 1.4 } } },
    { emoji: "😂", bgColor: "bg-orange-300", left: "left-[160px]", top: "top-[180px]", animation: { animate: { rotate: [0, -10, 10, 0], y: [0, -6, 0] }, transition: { duration: 2.4, repeat: Infinity, repeatDelay: 1 } } },
    { emoji: "🤓", bgColor: "bg-purple-300", left: "left-[160px]", top: "top-[300px]", animation: { animate: { y: [0, -7, 0, -7, 0] }, transition: { duration: 2.8, repeat: Infinity, repeatDelay: 0.6 } } },
    { emoji: "👋", bgColor: "bg-blue-300", left: "left-[160px]", top: "top-[420px]", animation: { animate: { rotate: [0, 15, -15, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } } },
  ];

  return (
    <div className="relative rounded-[2px] size-full min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-pink-800/90 to-purple-900/90 rounded-[2px]" />
      
      <div className="overflow-clip relative rounded-[inherit] size-full flex flex-col sm:justify-center sm:items-center">
        {/* Desktop Hero Section */}
        <DesktopHeroSection />
        
        {/* Mobile Memoji Grid */}
        <div className="relative w-[240px] h-[480px] mx-auto sm:w-[90%] sm:max-w-[300px] mt-8 lg:hidden">
          {memojiData.map((memoji, index) => (
            <Memoji
              key={index}
              emoji={memoji.emoji}
              bgColor={memoji.bgColor}
              left={memoji.left}
              top={memoji.top}
              animation={memoji.animation}
            />
          ))}
        </div>

        {/* Title and Description */}
        <div className="absolute left-[27px] top-[581px] sm:left-4 sm:right-4 sm:text-center z-50 sm:relative sm:top-auto sm:mt-8">
          <motion.p 
            className="font-bold text-[48px] text-white sm:text-[36px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Scrollodex
          </motion.p>
          <motion.p 
            className="text-[32px] text-white mt-4 w-[387px] sm:w-full sm:text-[24px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Explore Your Circle Like Never Before.
          </motion.p>
        </div>

        {/* Background Section */}
        <BackgroundSection />
        
        {/* Take a Photo Button */}
        <TakePhotoButton onTakePhoto={handleTakePhoto} />
        
        {/* Auth Section */}
        <div className="absolute left-[27px] top-[920px] space-y-4 w-[387px] sm:w-full sm:left-4 sm:right-4 sm:max-w-md sm:mx-auto z-50 sm:relative sm:top-auto sm:mt-8 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="text-center mb-6"
          >
            <h3 className="text-white text-xl font-semibold mb-2">Ready to Get Started?</h3>
            <p className="text-white/80 text-sm">Create your account with AI-powered avatar generation</p>
          </motion.div>
          
          <motion.button
            onClick={() => setShowAuth("multi-step-signup")}
            className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            ✨ Create Account with AI Avatar
          </motion.button>
          
          <motion.button
            onClick={() => setShowAuth("login")}
            className="w-full px-6 py-4 border-2 border-pink-400 text-pink-400 font-semibold rounded-xl hover:bg-pink-400 hover:text-white transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            🔑 Sign In
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-white/60 text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Auth Overlay */}
      <AuthOverlay 
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        onAuthSuccess={handleAuthSuccess}
      />
      
      {/* Border */}
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}
