import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Ijgcx-Ji5/";
const CONFIDENCE_THRESHOLD = 0.95;
const NEUTRAL_THRESHOLD = 0.7;
const HOLD_DURATION_FRAMES = 60; // ~2 seconds at 30fps

const Learning = () => {
  // State
  const [tutorialData, setTutorialData] = useState();
  const [courseData, setCourseData] = useState();
  const [videoEnded, setVideoEnded] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [detectedGesture, setDetectedGesture] = useState("");
  const [pendingFeedback, setPendingFeedback] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  
  const { id } = useParams();
  const { accessToken } = useAuth();
  
  // Refs
  const webcamContainerRef = useRef(null);
  const labelContainerRef = useRef(null);
  const modelRef = useRef(null);
  const webcamRef = useRef(null);
  const maxPredictionsRef = useRef(0);
  const animationFrameRef = useRef(null);
  const detectionCountRef = useRef({ positive: 0, negative: 0 });

  // Fetch tutorial and course data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorialRes, courseRes] = await Promise.all([
          axios.get(`http://localhost:5000/courses/${id}/tutorials`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`http://localhost:5000/courses/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);
        
        setTutorialData(tutorialRes.data[0]);
        setCourseData(courseRes.data);
        console.log("Data fetched successfully", tutorialRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id, accessToken]);

  // Load Teachable Machine scripts
  useEffect(() => {
    const loadScripts = async () => {
      if (window.tmImage) return;

      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js");
      } catch (err) {
        console.error("Error loading scripts:", err);
      }
    };

    loadScripts();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopWebcam();
  }, []);

  // Initialize Teachable Machine
  const initTeachableMachine = async () => {
    try {
      const modelURL = `${MODEL_URL}model.json`;
      const metadataURL = `${MODEL_URL}metadata.json`;

      modelRef.current = await window.tmImage.load(modelURL, metadataURL);
      maxPredictionsRef.current = modelRef.current.getTotalClasses();

      webcamRef.current = new window.tmImage.Webcam(300, 300, true);
      await webcamRef.current.setup();
      await webcamRef.current.play();
      
      window.requestAnimationFrame(loop);

      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = "";
        webcamContainerRef.current.appendChild(webcamRef.current.canvas);
      }

      if (labelContainerRef.current) {
        labelContainerRef.current.innerHTML = "";
        for (let i = 0; i < maxPredictionsRef.current; i++) {
          labelContainerRef.current.appendChild(document.createElement("div"));
        }
      }
    } catch (err) {
      console.error("Error initializing Teachable Machine:", err);
      alert("Error starting webcam. Please make sure you've granted camera permissions.");
    }
  };

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update();
      await predict();
      animationFrameRef.current = window.requestAnimationFrame(loop);
    }
  };

  const predict = async () => {
    if (!modelRef.current || !webcamRef.current) return;

    const prediction = await modelRef.current.predict(webcamRef.current.canvas);
    
    // Update label display
    prediction.forEach((pred, i) => {
      const classPrediction = `${pred.className}: ${pred.probability.toFixed(2)}`;
      if (labelContainerRef.current?.childNodes[i]) {
        labelContainerRef.current.childNodes[i].innerHTML = classPrediction;
      }
    });

    // Check for neutral state
    const isNeutral = prediction.some(pred => {
      const className = pred.className.toLowerCase();
      return pred.probability > NEUTRAL_THRESHOLD && 
             (className === "neutral" || className.includes("neutral") || className.includes("nothing"));
    });

    if (isNeutral) {
      updateProgress();
      return;
    }

    // Check for gestures
    const gesture = prediction.find(pred => {
      if (pred.probability <= CONFIDENCE_THRESHOLD) return false;
      const className = pred.className.toLowerCase();
      return className === "thumbs up" || className === "thumbsup" || 
             className === "thumbs down" || className === "thumbsdown";
    });

    if (gesture) {
      const gestureType = gesture.className.toLowerCase().includes("up") ? "positive" : "negative";
      handleGestureDetection(gestureType);
    } else {
      updateProgress();
    }
  };

  const handleGestureDetection = (gestureType) => {
    detectionCountRef.current[gestureType]++;
    
    const otherType = gestureType === "positive" ? "negative" : "positive";
    detectionCountRef.current[otherType] = 0;

    const progress = Math.min((detectionCountRef.current[gestureType] / HOLD_DURATION_FRAMES) * 100, 100);
    setHoldProgress(progress);

    if (detectionCountRef.current[gestureType] >= HOLD_DURATION_FRAMES) {
      setDetectedGesture(gestureType === "positive" ? "thumbs_up" : "thumbs_down");
      setPendingFeedback(gestureType);
      stopWebcam();
      resetDetectionCount();
    }
  };

  const updateProgress = () => {
    if (detectionCountRef.current.positive > 0 || detectionCountRef.current.negative > 0) {
      const currentGestureType = detectionCountRef.current.positive > 0 ? "positive" : "negative";
      const progress = Math.min((detectionCountRef.current[currentGestureType] / HOLD_DURATION_FRAMES) * 100, 100);
      setHoldProgress(progress);
    } else {
      setHoldProgress(0);
    }
  };

  const resetDetectionCount = () => {
    detectionCountRef.current = { positive: 0, negative: 0 };
    setHoldProgress(0);
  };

  const stopWebcam = () => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    if (webcamRef.current) {
      webcamRef.current.stop();
    }
  };

  const handleFeedback = (type) => {
    if (feedback) return;
    
    setFeedback(type);
    setPendingFeedback(null);
    stopWebcam();
    console.log("Feedback submitted:", type);
  };

  const cancelFeedback = () => {
    setPendingFeedback(null);
    setDetectedGesture("");
    resetDetectionCount();
    if (webcamRef.current) {
      initTeachableMachine();
    }
  };

  return (
    <div className="flex flex-col justify-start items-start h-full w-full p-10 gap-5 text-sidebar-foreground !text-start">
      <p>Dashboard / {courseData?.name} /</p>
      
      <div className="flex flex-col gap-2">
        <p className="text-black text-xl font-bold">{tutorialData?.title}</p>
        <p>{tutorialData?.description}</p>
      </div>
      
      <div className="w-full h-96">
        <iframe
          src="https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb"
          loading="lazy"
          title="Synthesia video player"
          allow="encrypted-media; fullscreen;"
          className="w-full h-full"
        />
      </div>

      {!videoEnded && (
        <button
          onClick={() => setVideoEnded(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          I finished watching - Give Feedback
        </button>
      )}

      {videoEnded && !feedback && !pendingFeedback && (
        <div className="w-full flex flex-col items-center gap-6 p-8 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-bold text-black">How was this tutorial?</h3>
          
          <div className="flex gap-6">
            <button
              onClick={() => handleFeedback("positive")}
              className="flex flex-col items-center gap-2 p-6 bg-white rounded-lg shadow hover:shadow-lg transition-all"
            >
              <ThumbsUp className="w-12 h-12 text-green-600" />
              <span className="text-lg font-medium">Helpful</span>
            </button>
            <button
              onClick={() => handleFeedback("negative")}
              className="flex flex-col items-center gap-2 p-6 bg-white rounded-lg shadow hover:shadow-lg transition-all"
            >
              <ThumbsDown className="w-12 h-12 text-red-600" />
              <span className="text-lg font-medium">Not Helpful</span>
            </button>
          </div>

          <div className="text-center w-full">
            <p className="text-gray-600 mb-4">Or use gesture recognition:</p>
            <button
              onClick={initTeachableMachine}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
            >
              Start Gesture Recognition
            </button>
            
            <div ref={webcamContainerRef} className="flex justify-center mb-4"></div>
            
            {holdProgress > 0 && (
              <div className="w-full max-w-md mx-auto mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Hold gesture...</span>
                  <span className="text-sm font-medium text-blue-600">{Math.round(holdProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-100"
                    style={{ width: `${holdProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            <div ref={labelContainerRef} className="text-left max-w-md mx-auto"></div>
            
            {detectedGesture && (
              <p className="text-lg font-medium text-green-600 mt-4">
                Detected: {detectedGesture.replace("_", " ")}!
              </p>
            )}
          </div>
        </div>
      )}

      {pendingFeedback && (
        <div className="w-full flex flex-col items-center gap-6 p-8 bg-blue-50 rounded-lg border-2 border-blue-300">
          <h3 className="text-2xl font-bold text-black">Confirm Your Feedback</h3>
          <p className="text-lg">
            You showed: <span className="font-bold text-blue-600">{detectedGesture.replace("_", " ")}</span>
          </p>
          <p className="text-gray-600">
            Is this correct? The tutorial was {pendingFeedback === "positive" ? "helpful" : "not helpful"}?
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => handleFeedback(pendingFeedback)}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Yes, Confirm
            </button>
            <button
              onClick={cancelFeedback}
              className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
            >
              No, Try Again
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="w-full flex flex-col items-center gap-4 p-8 bg-green-50 rounded-lg">
          <h3 className="text-2xl font-bold text-green-800">Thank you for your feedback!</h3>
          <p className="text-gray-600">
            Your {feedback === "positive" ? "positive" : "negative"} feedback helps us improve.
          </p>
        </div>
      )}
    </div>
  );
};

export default Learning;