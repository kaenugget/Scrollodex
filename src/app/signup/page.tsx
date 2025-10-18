"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MultiStepSignupForm } from "@/components/MultiStepSignupForm";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupSuccess = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">
            Join Scrollodex
          </h1>
          <p className="text-gray-400">
            Create your account to start managing your contacts
          </p>
        </div>
        
        <MultiStepSignupForm 
          onSuccess={handleSignupSuccess}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
}



