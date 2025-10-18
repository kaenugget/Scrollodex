"use client";

import { SignIn, SignUp } from '@clerk/nextjs';

interface ClerkAuthProps {
  onSuccess?: () => void;
}

export function ClerkAuth({ onSuccess: _onSuccess }: ClerkAuthProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-400 mb-3 font-pixel">
          Welcome to Scrollodex
        </h2>
        <p className="text-neutral-400 text-lg">
          Sign in with your preferred method
        </p>
      </div>
      
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg',
            card: 'bg-neutral-800 border-neutral-700 rounded-xl shadow-2xl',
            headerTitle: 'text-green-400 text-2xl font-bold',
            headerSubtitle: 'text-neutral-400 text-base',
            socialButtonsBlockButton: 'border-neutral-600 hover:bg-neutral-700 text-neutral-200 font-medium py-3 px-4 rounded-lg transition-all duration-200',
            formFieldInput: 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-green-400 focus:ring-green-400 py-3 px-4 rounded-lg',
            formFieldLabel: 'text-neutral-300 font-medium',
            footerActionLink: 'text-green-400 hover:text-green-300 font-medium transition-colors duration-200',
            identityPreviewText: 'text-neutral-300',
            formResendCodeLink: 'text-green-400 hover:text-green-300 font-medium transition-colors duration-200',
            formHeaderTitle: 'text-green-400 text-xl font-bold',
            formHeaderSubtitle: 'text-neutral-400',
            dividerLine: 'bg-neutral-600',
            dividerText: 'text-neutral-400',
            formFieldSuccessText: 'text-green-400',
            formFieldErrorText: 'text-red-400',
          }
        }}
        redirectUrl="/"
        afterSignInUrl="/"
      />
    </div>
  );
}

export function ClerkSignUp({ onSuccess: _onSuccess }: ClerkAuthProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-400 mb-3 font-pixel">
          Join Scrollodex
        </h2>
        <p className="text-neutral-400 text-lg">
          Create your account to get started
        </p>
      </div>
      
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg',
            card: 'bg-neutral-800 border-neutral-700 rounded-xl shadow-2xl',
            headerTitle: 'text-green-400 text-2xl font-bold',
            headerSubtitle: 'text-neutral-400 text-base',
            socialButtonsBlockButton: 'border-neutral-600 hover:bg-neutral-700 text-neutral-200 font-medium py-3 px-4 rounded-lg transition-all duration-200',
            formFieldInput: 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-green-400 focus:ring-green-400 py-3 px-4 rounded-lg',
            formFieldLabel: 'text-neutral-300 font-medium',
            footerActionLink: 'text-green-400 hover:text-green-300 font-medium transition-colors duration-200',
            identityPreviewText: 'text-neutral-300',
            formResendCodeLink: 'text-green-400 hover:text-green-300 font-medium transition-colors duration-200',
            formHeaderTitle: 'text-green-400 text-xl font-bold',
            formHeaderSubtitle: 'text-neutral-400',
            dividerLine: 'bg-neutral-600',
            dividerText: 'text-neutral-400',
            formFieldSuccessText: 'text-green-400',
            formFieldErrorText: 'text-red-400',
          }
        }}
        redirectUrl="/"
        afterSignUpUrl="/"
      />
    </div>
  );
}
