"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Camera, ArrowLeft, ArrowRight, Check } from "lucide-react";
export function MultiStepSignupForm({ onSuccess, isLoading, setIsLoading }) {
    const [currentStep, setCurrentStep] = useState("selfie");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selfieFile, setSelfieFile] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [error, setError] = useState("");
    const [isVideoReady, setIsVideoReady] = useState(false);
    const { signUp } = useAuth();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const steps = ["selfie", "name", "credentials"];
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
        }
        catch (error) {
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
                        }
                        else {
                            console.error('Failed to create blob from canvas');
                            setError("Failed to capture photo. Please try again.");
                        }
                    }, "image/jpeg", 0.8);
                }
                else {
                    // Fallback for browsers that don't support toBlob
                    try {
                        const dataURL = canvas.toDataURL("image/jpeg", 0.8);
                        const response = await fetch(dataURL);
                        const blob = await response.blob();
                        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                        setSelfieFile(file);
                        setSelfiePreview(dataURL);
                        stopCamera();
                    }
                    catch (fallbackError) {
                        console.error('Fallback capture failed:', fallbackError);
                        setError("Failed to capture photo. Please try again.");
                    }
                }
            }
            else {
                console.error('Video not ready for capture:', {
                    videoWidth: video.videoWidth,
                    videoHeight: video.videoHeight,
                    readyState: video.readyState
                });
                setError("Camera not ready. Please wait a moment and try again.");
            }
        }
        else {
            console.error('Video or canvas ref not available');
            setError("Camera not available. Please try again.");
        }
    };
    const retakeSelfie = () => {
        setSelfieFile(null);
        setSelfiePreview(null);
        startCamera();
    };
    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }
        try {
            let selfieFileId;
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
            await signUp(email, `${firstName} ${lastName}`.trim(), password, firstName, lastName, selfieFileId);
            onSuccess?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Sign up failed");
        }
        finally {
            setIsLoading(false);
        }
    };
    const renderStepContent = () => {
        switch (currentStep) {
            case "selfie":
                return (<div className="space-y-4">
            {!selfiePreview ? (<div className="text-center">
                <div className="mb-4">
                  <Camera className="w-16 h-16 text-green-400 mx-auto mb-2"/>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Take a Selfie</h3>
                  <p className="text-gray-400 text-sm">
                    We&apos;ll use this photo for your profile
                  </p>
                </div>
                
                {!stream ? (<div>
                    <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700 text-white">
                      <Camera className="w-4 h-4 mr-2"/>
                      Start Camera
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Stream state: {stream ? 'active' : 'inactive'}</p>
                  </div>) : (<div className="space-y-4">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-sm mx-auto rounded-lg"/>
                    <canvas ref={canvasRef} className="hidden"/>
                    <p className="text-xs text-gray-500 text-center">
                      Video ready: {isVideoReady ? 'Yes' : 'No'} | 
                      Stream active: {stream ? 'Yes' : 'No'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={captureSelfie} disabled={!isVideoReady} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                        <Camera className="w-4 h-4 mr-2"/>
                        {isVideoReady ? "Capture" : "Loading..."}
                      </Button>
                      {!isVideoReady && (<Button onClick={captureSelfie} variant="outline" className="border-yellow-600 text-yellow-300 hover:bg-yellow-800">
                          <Camera className="w-4 h-4 mr-2"/>
                          Try Capture
                        </Button>)}
                      <Button onClick={stopCamera} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        Cancel
                      </Button>
                    </div>
                  </div>)}
              </div>) : (<div className="text-center">
                <div className="mb-4">
                  <img src={selfiePreview} alt="Selfie preview" className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-green-400"/>
                  <p className="text-gray-400 text-sm mt-2">
                    Great! This will be your profile photo
                  </p>
                </div>
                <Button onClick={retakeSelfie} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Camera className="w-4 h-4 mr-2"/>
                  Retake Photo
                </Button>
              </div>)}
          </div>);
            case "name":
                return (<div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-gray-300">
                First Name
              </label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Enter your first name"/>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-gray-300">
                Last Name
              </label>
              <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Enter your last name"/>
            </div>
          </div>);
            case "credentials":
                return (<div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email Address
              </label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Enter your email address"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Create a password"/>
            </div>
          </div>);
            default:
                return null;
        }
    };
    const canProceed = () => {
        switch (currentStep) {
            case "selfie":
                return selfieFile !== null;
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
            case "name":
                return "Let's start with your name";
            case "credentials":
                return "We'll use this to sign you in";
            default:
                return "";
        }
    };
    return (<Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {steps.map((step, index) => (<div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStepIndex
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-400"}`}>
                {index < currentStepIndex ? (<Check className="w-4 h-4"/>) : (index + 1)}
              </div>))}
          </div>
          <div className="text-sm text-gray-400">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>
        
        <CardTitle className="text-green-400 text-xl">{getStepTitle()}</CardTitle>
        <CardDescription className="text-gray-400">
          {getStepDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}

          {error && (<div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3 mt-4">
              {error}
            </div>)}

          <div className="flex justify-between mt-6">
            <Button type="button" onClick={handlePrevious} disabled={currentStepIndex === 0} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Previous
            </Button>

            {currentStepIndex === steps.length - 1 ? (<Button type="button" onClick={handleSubmit} disabled={!canProceed() || isLoading} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>) : (<Button type="button" onClick={handleNext} disabled={!canProceed()} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                Next
                <ArrowRight className="w-4 h-4 ml-2"/>
              </Button>)}
          </div>
        </form>
      </CardContent>
    </Card>);
}
//# sourceMappingURL=MultiStepSignupForm.js.map