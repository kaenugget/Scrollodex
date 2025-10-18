"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LoginForm, SignUpForm } from "@/components/AuthForms";
import { ClerkAuth, ClerkSignUp } from "@/components/ClerkAuth";
// Memoji components with different animations
function Memoji({ emoji, bgColor, left, top, animation }) {
    return (<motion.div className={`absolute ${bgColor} ${left} ${top} overflow-clip size-[110px] rounded-lg flex items-center justify-center text-6xl`} animate={animation.animate} transition={animation.transition}>
      {emoji}
    </motion.div>);
}
// Background component
function BackgroundSection() {
    return (<div className="absolute h-[406px] left-0 top-[550px] w-full bg-gradient-to-b from-purple-900 to-purple-800"/>);
}
// Take a Photo button component
function TakePhotoButton({ onTakePhoto }) {
    return (<div className="absolute left-[27px] top-[828px]">
      <motion.button className="absolute bg-white h-[76px] left-[27px] rounded-[20px] w-[387px] flex items-center justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onTakePhoto}>
        <p className="font-bold text-[24px] text-[#1f0f26]">
          Take a Photo
        </p>
      </motion.button>
    </div>);
}
// Auth overlay component
function AuthOverlay({ showAuth, setShowAuth, onAuthSuccess }) {
    if (!showAuth)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {showAuth === "login" ? (<LoginForm onSuccess={onAuthSuccess}/>) : showAuth === "signup" ? (<SignUpForm onSuccess={onAuthSuccess}/>) : showAuth === "clerk-login" ? (<ClerkAuth onSuccess={onAuthSuccess}/>) : showAuth === "clerk-signup" ? (<ClerkSignUp onSuccess={onAuthSuccess}/>) : null}
        
        <div className="text-center mt-4">
          <button onClick={() => setShowAuth(null)} className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 mx-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>);
}
export default function AnimatedMemojiLanding() {
    const [showAuth, setShowAuth] = useState(null);
    const handleTakePhoto = () => {
        // Navigate to camera or photo upload
        window.location.href = '/profile';
    };
    const handleAuthSuccess = () => {
        setShowAuth(null);
        // The page will automatically redirect to the main app
    };
    // Define the grid of Memojis with their positions, colors, and animations
    const memojiData = [
        // Row 1
        { emoji: "😊", bgColor: "bg-green-300", left: "left-[110px]", top: "top-0", animation: { animate: { rotate: [0, -5, 0], scale: [1, 1.05, 1] }, transition: { duration: 2.5, repeat: Infinity, repeatDelay: 1 } } },
        { emoji: "👍", bgColor: "bg-green-400", left: "left-[110px]", top: "top-[110px]", animation: { animate: { y: [0, -8, 0], scale: [1, 1.08, 1] }, transition: { duration: 1.8, repeat: Infinity, repeatDelay: 0.8 } } },
        { emoji: "😮", bgColor: "bg-purple-300", left: "left-[110px]", top: "top-[330px]", animation: { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 1.5 } } },
        { emoji: "😄", bgColor: "bg-pink-300", left: "left-[110px]", top: "top-[220px]", animation: { animate: { rotate: [0, 8, 0, -8, 0] }, transition: { duration: 3, repeat: Infinity, repeatDelay: 0.5 } } },
        { emoji: "🤪", bgColor: "bg-gray-300", left: "left-[110px]", top: "top-[440px]", animation: { animate: { x: [0, -3, 3, -3, 0], rotate: [0, -2, 2, -2, 0] }, transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 } } },
        // Row 2
        { emoji: "😎", bgColor: "bg-green-300", left: "left-0", top: "top-[110px]", animation: { animate: { rotate: [0, 5, -5, 0] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } } },
        { emoji: "😍", bgColor: "bg-green-400", left: "left-0", top: "top-[330px]", animation: { animate: { y: [0, -10, 0] }, transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1 } } },
        { emoji: "😘", bgColor: "bg-blue-300", left: "left-0", top: "top-[220px]", animation: { animate: { scale: [1, 1.06, 1], rotate: [0, -3, 0] }, transition: { duration: 2.2, repeat: Infinity, repeatDelay: 1.2 } } },
        { emoji: "🤔", bgColor: "bg-green-200", left: "left-0", top: "top-[440px]", animation: { animate: { x: [0, -5, 5, 0] }, transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } } },
        { emoji: "😜", bgColor: "bg-purple-200", left: "left-[220px]", top: "top-0", animation: { animate: { rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 0.8 } } },
        // Row 3
        { emoji: "😳", bgColor: "bg-pink-400", left: "left-[220px]", top: "top-[110px]", animation: { animate: { scale: [1, 1.08, 1] }, transition: { duration: 1.6, repeat: Infinity, repeatDelay: 1.4 } } },
        { emoji: "😂", bgColor: "bg-orange-300", left: "left-[220px]", top: "top-[330px]", animation: { animate: { rotate: [0, -10, 10, 0], y: [0, -6, 0] }, transition: { duration: 2.4, repeat: Infinity, repeatDelay: 1 } } },
        { emoji: "🤓", bgColor: "bg-purple-300", left: "left-[220px]", top: "top-[220px]", animation: { animate: { y: [0, -7, 0, -7, 0] }, transition: { duration: 2.8, repeat: Infinity, repeatDelay: 0.6 } } },
        { emoji: "👋", bgColor: "bg-blue-300", left: "left-[220px]", top: "top-[440px]", animation: { animate: { rotate: [0, 15, -15, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } } },
        { emoji: "🎉", bgColor: "bg-purple-400", left: "left-[330px]", top: "top-0", animation: { animate: { rotate: [0, 360] }, transition: { duration: 8, repeat: Infinity, ease: "linear" } } },
        // Row 4
        { emoji: "😏", bgColor: "bg-orange-400", left: "left-[330px]", top: "top-[110px]", animation: { animate: { rotate: [0, 6, -6, 0], x: [0, 3, -3, 0] }, transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } } },
        { emoji: "😁", bgColor: "bg-green-200", left: "left-[330px]", top: "top-[330px]", animation: { animate: { scale: [1, 1.12, 1] }, transition: { duration: 1.4, repeat: Infinity, repeatDelay: 1.6 } } },
        { emoji: "👍", bgColor: "bg-yellow-400", left: "left-[330px]", top: "top-[220px]", animation: { animate: { scale: [1, 1.15, 1], y: [0, -8, 0] }, transition: { duration: 1.2, repeat: Infinity, repeatDelay: 2 } } },
        { emoji: "😌", bgColor: "bg-purple-200", left: "left-[330px]", top: "top-[440px]", animation: { animate: { y: [0, -12, 0], rotate: [0, 3, 0, -3, 0] }, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } } },
    ];
    return (<div className="relative rounded-[2px] size-full min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-[2px]"/>
      
      <div className="overflow-clip relative rounded-[inherit] size-full">
        {/* Memoji Grid */}
        <div className="relative w-[440px] h-[550px] mx-auto">
          {memojiData.map((memoji, index) => (<Memoji key={index} emoji={memoji.emoji} bgColor={memoji.bgColor} left={memoji.left} top={memoji.top} animation={memoji.animation}/>))}
        </div>

        {/* Title and Description */}
        <div className="absolute left-[27px] top-[581px]">
          <motion.p className="font-bold text-[48px] text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            Scrollodex
          </motion.p>
          <motion.p className="text-[32px] text-white mt-4 w-[387px]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}>
            Explore Your Circle Like Never Before.
          </motion.p>
        </div>

        {/* Background Section */}
        <BackgroundSection />
        
        {/* Take a Photo Button */}
        <TakePhotoButton onTakePhoto={handleTakePhoto}/>
        
        {/* Auth Buttons */}
        <div className="absolute left-[27px] top-[920px] space-y-3">
          <motion.button onClick={() => setShowAuth("clerk-signup")} className="w-[387px] px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Get Started (with Google, GitHub, etc.)
          </motion.button>
          <motion.button onClick={() => setShowAuth("clerk-login")} className="w-[387px] px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Sign In (with Google, GitHub, etc.)
          </motion.button>
          <motion.button onClick={() => setShowAuth("signup")} className="w-[387px] px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Create Account with Email
          </motion.button>
        </div>
      </div>
      
      {/* Auth Overlay */}
      <AuthOverlay showAuth={showAuth} setShowAuth={setShowAuth} onAuthSuccess={handleAuthSuccess}/>
      
      {/* Border */}
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[2px]"/>
    </div>);
}
//# sourceMappingURL=AnimatedMemojiLanding.js.map