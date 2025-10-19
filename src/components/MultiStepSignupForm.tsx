"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Camera, ArrowLeft, ArrowRight, Check } from "lucide-react";

interface MultiStepSignupFormProps {
  onSuccess?: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

type SignupStep = "selfie" | "avatar" | "name" | "credentials";

export function MultiStepSignupForm({ onSuccess, isLoading, setIsLoading }: MultiStepSignupFormProps) {
  const [currentStep, setCurrentStep] = useState<SignupStep>("selfie");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFileId, setAvatarFileId] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  const { signUp } = useAuth();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const steps: SignupStep[] = ["selfie", "avatar", "name", "credentials"];
  const currentStepIndex = steps.indexOf(currentStep);

  // Handle video setup when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Setting up video element with stream');
      videoRef.current.srcObject = stream;
      
      // Safari-compatible video ready detection
      const checkVideoReady = () => {
        if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
          console.log('Video ready:', {
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight,
            readyState: videoRef.current.readyState
          });
          setIsVideoReady(true);
          return true;
        }
        return false;
      };
      
      // Try multiple events for Safari compatibility
      videoRef.current.onloadedmetadata = checkVideoReady;
      videoRef.current.oncanplay = checkVideoReady;
      videoRef.current.onloadeddata = checkVideoReady;
      
      // Fallback timeout for Safari
      setTimeout(() => {
        if (!isVideoReady && checkVideoReady()) {
          console.log('Video ready via timeout fallback');
        }
      }, 2000);
      
      // Additional check after a short delay
      setTimeout(checkVideoReady, 500);
    }
  }, [stream, isVideoReady]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
      setError("");
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
      setError("");
    }
  };

  const startCamera = async () => {
    console.log('Starting camera...');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      console.log('Media stream obtained:', mediaStream);
      setStream(mediaStream);
      console.log('Stream state set - video setup will happen in useEffect');
    } catch (error) {
      console.error('Camera access error:', error);
      setError("Could not access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsVideoReady(false);
    }
  };

  const captureSelfie = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");
      
      // More lenient check for Safari - try to capture even if dimensions aren't perfect
      if (context && video.videoWidth >= 0 && video.videoHeight >= 0) {
        // Use video dimensions or fallback to reasonable defaults for Safari
        const width = video.videoWidth > 0 ? video.videoWidth : 640;
        const height = video.videoHeight > 0 ? video.videoHeight : 480;
        
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        
        // Use toBlob with fallback for Safari compatibility
        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
              setSelfieFile(file);
              setSelfiePreview(URL.createObjectURL(blob));
              stopCamera();
              // Automatically proceed to avatar step
              setTimeout(() => {
                setCurrentStep("avatar");
              }, 500);
            } else {
              console.error('Failed to create blob from canvas');
              setError("Failed to capture photo. Please try again.");
            }
          }, "image/jpeg", 0.8);
        } else {
          // Fallback for browsers that don't support toBlob
          try {
            const dataURL = canvas.toDataURL("image/jpeg", 0.8);
            const response = await fetch(dataURL);
            const blob = await response.blob();
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            setSelfieFile(file);
            setSelfiePreview(dataURL);
            stopCamera();
            // Automatically proceed to avatar step
            setTimeout(() => {
              setCurrentStep("avatar");
            }, 500);
          } catch (fallbackError) {
            console.error('Fallback capture failed:', fallbackError);
            setError("Failed to capture photo. Please try again.");
          }
        }
      } else {
        console.error('Video not ready for capture:', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState
        });
        setError("Camera not ready. Please wait a moment and try again.");
      }
    } else {
      console.error('Video or canvas ref not available');
      setError("Camera not available. Please try again.");
    }
  };

  const retakeSelfie = () => {
    setSelfieFile(null);
    setSelfiePreview(null);
    setAvatarUrl(null);
    setAvatarFileId(null);
    startCamera();
  };

  const generateAvatar = async () => {
    if (!selfieFile) return;
    
    setIsGeneratingAvatar(true);
    setError("");
    
    try {
      console.log('Starting avatar generation with gpt-image-1...');
      
      // Generate avatar using gpt-image-1 with direct image editing
      console.log('Sending selfie to gpt-image-1 for avatar generation...');
      console.log('Selfie file details:', {
        name: selfieFile.name,
        size: selfieFile.size,
        type: selfieFile.type
      });
      
      // Use the edits endpoint with proper FormData for gpt-image-1
      const formData = new FormData();
      formData.append('image', selfieFile);
      formData.append('prompt', 'Transform this selfie into a cute memoji-style avatar with transparent background, kawaii style, digital art');
      formData.append('model', 'gpt-image-1');
      formData.append('n', '1');
      formData.append('size', '1024x1024');
      
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const openaiResponse = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      console.log('API Response status:', openaiResponse.status);
      console.log('API Response headers:', Object.fromEntries(openaiResponse.headers.entries()));

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json();
        console.log('OpenAI API response:', openaiData);
        
        // Try different possible response structures
        let generatedAvatarUrl = null;
        
        if (openaiData.data && openaiData.data[0]) {
          const imageData = openaiData.data[0];
          
          // Check for URL format
          if (imageData.url) {
            generatedAvatarUrl = imageData.url;
          }
          // Check for base64 format (gpt-image-1 returns this)
          else if (imageData.b64_json) {
            console.log('Found base64 image data, converting to data URL...');
            generatedAvatarUrl = `data:image/png;base64,${imageData.b64_json}`;
          }
        } else if (openaiData.url) {
          generatedAvatarUrl = openaiData.url;
        } else if (openaiData.image_url) {
          generatedAvatarUrl = openaiData.image_url;
        } else if (openaiData.images && openaiData.images[0] && openaiData.images[0].url) {
          generatedAvatarUrl = openaiData.images[0].url;
        }
        
        console.log('Extracted avatar URL:', generatedAvatarUrl);
        
        if (generatedAvatarUrl) {
          // If it's a base64 data URL, convert to file and upload to Convex storage
          if (generatedAvatarUrl.startsWith('data:image/')) {
            try {
              console.log('Converting base64 avatar to file and uploading to Convex storage...');
              
              // Convert data URL to blob
              const response = await fetch(generatedAvatarUrl);
              const blob = await response.blob();
              const avatarFile = new File([blob], "avatar.png", { type: "image/png" });
              
              // Upload to Convex storage
              const uploadUrl = await generateUploadUrl();
              const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: { 'Content-Type': avatarFile.type },
                body: avatarFile,
              });
              
              if (!uploadResponse.ok) {
                throw new Error('Avatar upload failed');
              }
              
              const { storageId } = await uploadResponse.json();
              console.log('Avatar uploaded to Convex storage with ID:', storageId);
              
              // Store the storage ID instead of the data URL
              setAvatarFileId(storageId);
              // Keep the data URL for immediate display
              setAvatarUrl(generatedAvatarUrl);
              
              // Automatically proceed to name step after avatar generation
              setTimeout(() => {
                setCurrentStep("name");
              }, 1000);
            } catch (uploadError) {
              console.error('Avatar upload error:', uploadError);
              // Don't store base64 data URL - it will cause size errors
              // Just show error and let user proceed without avatar
              setError('Avatar upload failed, but you can continue without it');
              setTimeout(() => {
                setCurrentStep("name");
              }, 1000);
            }
          } else {
            // It's already a regular URL, store it directly
            setAvatarUrl(generatedAvatarUrl);
            setTimeout(() => {
              setCurrentStep("name");
            }, 1000);
          }
        } else {
          console.error('No URL found in response:', openaiData);
          throw new Error('Avatar generation failed - no URL returned');
        }
      } else {
        const errorData = await openaiResponse.json();
        console.error('OpenAI API error response:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Failed to generate avatar'}`);
      }
    } catch (err) {
      console.error('Avatar generation error:', err);
      setError(err instanceof Error ? err.message : "Failed to generate avatar");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // Auto-start avatar generation when avatar step is shown
  useEffect(() => {
    if (currentStep === "avatar" && selfieFile && !avatarUrl && !isGeneratingAvatar) {
      generateAvatar();
    }
  }, [currentStep]); // Only depend on currentStep to prevent infinite loops

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      let selfieFileId: string | undefined;

      // Upload selfie if provided
      if (selfieFile) {
        const uploadUrl = await generateUploadUrl();
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': selfieFile.type },
          body: selfieFile,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Selfie upload failed');
        }
        
        const { storageId } = await uploadResponse.json();
        selfieFileId = storageId;
      }

      // Only pass avatarUrl if it's not a base64 data URL (to avoid size limits)
      const safeAvatarUrl = avatarUrl && !avatarUrl.startsWith('data:image/') ? avatarUrl : undefined;
      
      console.log('Signup data:', {
        email,
        displayName: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        selfieFileId,
        avatarUrl: safeAvatarUrl,
        avatarFileId,
        avatarUrlSize: avatarUrl ? avatarUrl.length : 0,
        isBase64: avatarUrl ? avatarUrl.startsWith('data:image/') : false,
        originalAvatarUrl: avatarUrl,
        safeAvatarUrl: safeAvatarUrl
      });
      
      await signUp(email, `${firstName} ${lastName}`.trim(), password, firstName, lastName, selfieFileId, safeAvatarUrl, avatarFileId || undefined);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "selfie":
        return (
          <div className="space-y-4">
            {!selfiePreview ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold scrollodex-text-dark mb-2">Take a Selfie</h3>
                  <p className="scrollodex-text-gray text-sm">
                    We&apos;ll use this photo for your profile
                  </p>
                </div>
                
                {!stream ? (
                  <div>
                    <Button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Stream state: {stream ? 'active' : 'inactive'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-w-sm mx-auto rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <p className="text-xs text-gray-500 text-center">
                      Video ready: {isVideoReady ? 'Yes' : 'No'} | 
                      Stream active: {stream ? 'Yes' : 'No'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={captureSelfie}
                        disabled={!isVideoReady}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {isVideoReady ? "Capture" : "Loading..."}
                      </Button>
                      {!isVideoReady && (
                        <Button
                          onClick={captureSelfie}
                          variant="outline"
                          className="border-yellow-600 text-yellow-300 hover:bg-yellow-800"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Try Capture
                        </Button>
                      )}
                      <Button
                        onClick={stopCamera}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={selfiePreview}
                      alt="Selfie preview"
                      className="w-full h-full rounded-full object-cover border-4 border-gradient-to-r from-purple-500 to-pink-500"
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-purple-500 to-pink-500"></div>
                  </div>
                  <p className="scrollodex-text-gray text-sm mt-3">
                    Great! This will be your profile photo
                  </p>
                </div>
                <Button
                  onClick={retakeSelfie}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Retake Photo
                </Button>
              </div>
            )}
          </div>
        );

      case "avatar":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-4">
                {/* Shimmering selfie effect */}
                <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden">
                  <img
                    src={selfiePreview || ""}
                    alt="Selfie"
                    className="w-full h-full object-cover"
                  />
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-orange-400/30 via-pink-400/30 to-purple-400/30 animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2 mt-4">
                  ✨ Generating your 3D twin...
                </h3>
                <p className="text-gray-400 text-sm">
                  Creating your personalized memoji avatar
                </p>
              </div>
              
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
                  {error}
                </div>
              )}
            </div>
          </div>
        );

      case "name":
        return (
          <div className="space-y-4">
            {/* Show generated avatar */}
            {avatarUrl && (
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-green-400">
                  <img
                    src={avatarUrl}
                    alt="Generated Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Your personalized avatar is ready!
                </p>
              </div>
            )}
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2 scrollodex-text-dark">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2 scrollodex-text-dark">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Enter your last name"
              />
            </div>
          </div>
        );

      case "credentials":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 scrollodex-text-dark">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 scrollodex-text-dark">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Create a password"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "selfie":
        return selfieFile !== null;
      case "avatar":
        return true; // Avatar step auto-proceeds, no manual validation needed
      case "name":
        const nameValid = firstName.trim() && lastName.trim();
        console.log('Name validation:', { firstName: firstName.trim(), lastName: lastName.trim(), valid: nameValid });
        return nameValid;
      case "credentials":
        return email.trim() && email.includes("@") && password.length >= 6;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "selfie":
        return "Take a selfie";
      case "avatar":
        return "Generating your avatar";
      case "name":
        return "What's your name?";
      case "credentials":
        return "Create your account";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "selfie":
        return "This will be your profile photo";
      case "avatar":
        return "Creating your personalized memoji";
      case "name":
        return "Let's start with your name";
      case "credentials":
        return "We'll use this to sign you in";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  index <= currentStepIndex
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStepIndex ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                  index < currentStepIndex ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold scrollodex-text-dark mb-2">{getStepTitle()}</h3>
          <p className="scrollodex-text-gray text-sm">
            {getStepDescription()}
          </p>
        </div>
      </div>
      
      {/* Form Content */}
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}

        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep !== "avatar" && (
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 px-6 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}

          {currentStepIndex === steps.length - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          ) : currentStep !== "avatar" ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
