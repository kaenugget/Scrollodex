"use client";

import { SignIn, SignUp } from '@clerk/nextjs';

interface ClerkAuthProps {
  onSuccess?: () => void;
}

export function ClerkAuth({ onSuccess: _onSuccess }: ClerkAuthProps) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-400 mb-2">
          Welcome to Scrollodex
        </h2>
        <p className="text-gray-400">
          Sign in with your preferred method
        </p>
      </div>
      
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white',
            card: 'bg-gray-900 border-gray-700',
            headerTitle: 'text-green-400',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton: 'border-gray-600 hover:bg-gray-800',
            formFieldInput: 'bg-gray-800 border-gray-600 text-white',
            formFieldLabel: 'text-gray-300',
            footerActionLink: 'text-green-400 hover:text-green-300',
            identityPreviewText: 'text-gray-300',
            formResendCodeLink: 'text-green-400 hover:text-green-300',
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
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-400 mb-2">
          Join Scrollodex
        </h2>
        <p className="text-gray-400">
          Create your account to get started
        </p>
      </div>
      
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white',
            card: 'bg-gray-900 border-gray-700',
            headerTitle: 'text-green-400',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton: 'border-gray-600 hover:bg-gray-800',
            formFieldInput: 'bg-gray-800 border-gray-600 text-white',
            formFieldLabel: 'text-gray-300',
            footerActionLink: 'text-green-400 hover:text-green-300',
            identityPreviewText: 'text-gray-300',
            formResendCodeLink: 'text-green-400 hover:text-green-300',
          }
        }}
        redirectUrl="/"
        afterSignUpUrl="/"
      />
    </div>
  );
}
