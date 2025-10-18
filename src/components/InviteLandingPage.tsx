"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "../../convex/_generated/api";

interface InviteLandingPageProps {
  shareId: string;
}

export function InviteLandingPage({ shareId }: InviteLandingPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user by share token to determine the inviter's name
  const inviterUser = useQuery(api.social.getUserByShareToken, { 
    shareToken: shareId 
  });

  useEffect(() => {
    // Set loading to false after we've attempted to fetch the user
    setIsLoading(false);
  }, [inviterUser]);

  const handleAcceptInvite = () => {
    // Redirect to signup page
    router.push("/signup");
  };

  // Get the inviter's name, defaulting to "Chen Chen" if not found
  const inviterName = inviterUser?.displayName || "Chen Chen";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-red-800 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.h1 
        className="text-white text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Invitation
      </motion.h1>

      {/* Central Graphic - Egg with Confetti */}
      <div className="relative mb-8">
        {/* Animated Confetti pieces */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Yellow confetti */}
          <motion.div 
            className="absolute top-4 left-8 w-2 h-2 bg-yellow-300"
            animate={{
              rotate: [45, 405, 45],
              y: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-12 right-6 w-1.5 h-1.5 bg-yellow-300"
            animate={{
              rotate: [12, 372, 12],
              x: [0, 5, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div 
            className="absolute bottom-8 left-4 w-2 h-1 bg-yellow-300"
            animate={{
              rotate: [-45, 315, -45],
              y: [0, 8, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute bottom-4 right-8 w-1 h-2 bg-yellow-300"
            animate={{
              rotate: [12, 372, 12],
              x: [0, -3, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }}
          />
          
          {/* Pink confetti */}
          <motion.div 
            className="absolute top-8 right-4 w-1.5 h-1.5 bg-pink-300"
            animate={{
              rotate: [45, 405, 45],
              y: [0, -8, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          />
          <motion.div 
            className="absolute top-16 left-6 w-2 h-1 bg-pink-300"
            animate={{
              rotate: [-12, 348, -12],
              x: [0, -5, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            }}
          />
          <motion.div 
            className="absolute bottom-12 right-2 w-1 h-1.5 bg-pink-300"
            animate={{
              rotate: [45, 405, 45],
              y: [0, 6, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 2.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6
            }}
          />
          
          {/* Swirling ribbons */}
          <motion.div 
            className="absolute top-6 left-12 w-8 h-0.5 bg-yellow-300 rounded-full"
            animate={{
              rotate: [12, 372, 12],
              scaleX: [1, 1.2, 1],
              scaleY: [1, 0.8, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-6 right-12 w-6 h-0.5 bg-yellow-300 rounded-full"
            animate={{
              rotate: [-12, 348, -12],
              scaleX: [1, 0.8, 1],
              scaleY: [1, 1.2, 1]
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7
            }}
          />
        </div>

        {/* Egg Image with subtle animation */}
        <motion.div 
          className="relative w-32 h-40 mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img 
            src="/egg.png" 
            alt="Decorated Easter egg" 
            className="w-full h-full object-contain"
            animate={{
              y: [0, -5, 0],
              rotate: [0, 1, -1, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Main Message */}
      <div className="text-center mb-8 px-4">
        <p className="text-white text-lg leading-relaxed">
          {inviterName} just sent you a secret gift! Want to hatch it together? 🥚✨
        </p>
      </div>

      {/* Accept Button */}
      <motion.button
        onClick={handleAcceptInvite}
        className="w-full max-w-xs bg-white text-black font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        whileTap={{ scale: 0.95 }}
      >
        Accept
      </motion.button>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )}
    </div>
  );
}
