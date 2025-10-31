import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThumbsUp, ThumbsDown, CheckCircle, ChevronRight } from "lucide-react";

const RenderOption = ({ label, onClick, roundDirection, className }) => {
  return (
    <span
      className={`hover:bg-gray-300 cursor-pointer h-full w-full flex justify-center items-center ${
        roundDirection === "left" ? "rounded-tl-lg" : "rounded-tr-lg"
      } ${className}`}
      onClick={onClick}
    >
      <p>{label}</p>
    </span>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col gap-5 w-full p-10 h-full">
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="h-48 bg-gray-300 rounded w-full min-h-1/2"></div>
    </div>
  );
};

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Ijgcx-Ji5/";
const CONFIDENCE_THRESHOLD = 0.85;
const NEUTRAL_THRESHOLD = 0.7;
const HOLD_DURATION_FRAMES = 60; // ~2 seconds at 30fps

const Learning = () => {
  // State
  const [tutorialData, setTutorialData] = useState();
  const [courseData, setCourseData] = useState();
  const [quizzes, setQuizzes] = useState([]);
  const [allTutorials, setAllTutorials] = useState([]);
  const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [detectedGesture, setDetectedGesture] = useState("");
  const [pendingFeedback, setPendingFeedback] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [completingTutorial, setCompletingTutorial] = useState(false);
  const { courseId, tutorialId } = useParams();
  const { api } = useAuth();
  const [hasPopup, setHasPopup] = useState(false);
  const navigate = useNavigate();

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
      if (!api) return;

      try {
        const tutorialRes = await api.get(`/courses/${courseId}/tutorials/${tutorialId}`);
        const courseRes = await api.get(`/courses/${courseId}`);
        const quizzesRes = await api.get(`/tutorials/${tutorialId}/quizzes`);
        const allTutorialsRes = await api.get(`/courses/${courseId}/tutorials`);

        setTutorialData(tutorialRes.data);
        setCourseData(courseRes.data);
        setQuizzes(quizzesRes.data);
        setAllTutorials(allTutorialsRes.data);

        // Find current tutorial index
        const currentIndex = allTutorialsRes.data.findIndex(
          (t) => t.id === parseInt(tutorialId)
        );
        setCurrentTutorialIndex(currentIndex);

        // Check if tutorial is already completed and if quiz is done
        setIsCompleted(tutorialRes.data.is_completed || false);
        setHasCompletedQuiz(tutorialRes.data.has_completed_quiz || false);

        console.log("Data fetched successfully", tutorialRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, tutorialId, api]);

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
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"
        );
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
      alert(
        "Error starting webcam. Please make sure you've granted camera permissions."
      );
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
      const classPrediction = `${pred.className}: ${pred.probability.toFixed(
        2
      )}`;
      if (labelContainerRef.current?.childNodes[i]) {
        labelContainerRef.current.childNodes[i].innerHTML = classPrediction;
      }
    });

    // Check for neutral state
    const isNeutral = prediction.some((pred) => {
      const className = pred.className.toLowerCase();
      return (
        pred.probability > NEUTRAL_THRESHOLD &&
        (className === "neutral" ||
          className.includes("neutral") ||
          className.includes("nothing"))
      );
    });

    if (isNeutral) {
      updateProgress();
      return;
    }

    // Check for gestures
    const gesture = prediction.find((pred) => {
      if (pred.probability <= CONFIDENCE_THRESHOLD) return false;
      const className = pred.className.toLowerCase();
      return (
        className === "thumbs up" ||
        className === "thumbsup" ||
        className === "thumbs down" ||
        className === "thumbsdown"
      );
    });

    if (gesture) {
      const gestureType = gesture.className.toLowerCase().includes("up")
        ? "positive"
        : "negative";
      handleGestureDetection(gestureType);
    } else {
      updateProgress();
    }
  };

  const handleGestureDetection = (gestureType) => {
    detectionCountRef.current[gestureType]++;

    const otherType = gestureType === "positive" ? "negative" : "positive";
    detectionCountRef.current[otherType] = 0;

    const progress = Math.min(
      (detectionCountRef.current[gestureType] / HOLD_DURATION_FRAMES) * 100,
      100
    );
    setHoldProgress(progress);

    if (detectionCountRef.current[gestureType] >= HOLD_DURATION_FRAMES) {
      setDetectedGesture(
        gestureType === "positive" ? "thumbs_up" : "thumbs_down"
      );
      setPendingFeedback(gestureType);
      stopWebcam();
      resetDetectionCount();
    }
  };

  const updateProgress = () => {
    if (
      detectionCountRef.current.positive > 0 ||
      detectionCountRef.current.negative > 0
    ) {
      const currentGestureType =
        detectionCountRef.current.positive > 0 ? "positive" : "negative";
      const progress = Math.min(
        (detectionCountRef.current[currentGestureType] / HOLD_DURATION_FRAMES) *
          100,
        100
      );
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

  const markAsCompleted = async () => {
    if (completingTutorial || isCompleted) return;

    setCompletingTutorial(true);

    try {
      const response = await api.post(
        `/tutorials/${tutorialId}/complete`,
        {}
      );

      setIsCompleted(true);
      console.log("Tutorial marked as completed", response.data);

      try {
        const nextStepRes = await api.get(`/courses/${courseId}/next-step`);
        const nextStep = nextStepRes.data;

        console.log("Next step after completion:", nextStep);

        if (nextStep.type === 'tutorial') {
          navigate(`/dashboard/course/${courseId}/learning/${nextStep.tutorial_id}`);
        } else if (nextStep.type === 'quiz') {
          navigate(`/dashboard/course/${courseId}/learning/${nextStep.tutorial_id}/quiz/${nextStep.quiz_id}`);
        } else if (nextStep.type === 'completed') {
          navigate(`/dashboard/course/${courseId}`);
        }
      } catch (navError) {
        console.error("Error getting next step:", navError);
        const hasNextTutorial = currentTutorialIndex < allTutorials.length - 1;
        if (hasNextTutorial) {
          const nextTutorial = allTutorials[currentTutorialIndex + 1];
          navigate(`/dashboard/course/${courseId}/learning/${nextTutorial.id}`);
        } else {
          navigate(`/dashboard/course/${courseId}`);
        }
      }

    } catch (error) {
      console.error("Error marking tutorial as completed:", error);
      alert("Failed to mark tutorial as completed. Please try again.");
    } finally {
      setCompletingTutorial(false);
    }
  };

  const goToNextTutorial = () => {
    if (currentTutorialIndex < allTutorials.length - 1) {
      const nextTutorial = allTutorials[currentTutorialIndex + 1];
      navigate(`/dashboard/course/${courseId}/learning/${nextTutorial.id}`);
    }
  };

  const goToPreviousTutorial = () => {
    if (currentTutorialIndex > 0) {
      const previousTutorial = allTutorials[currentTutorialIndex - 1];
      navigate(`/dashboard/course/${courseId}/learning/${previousTutorial.id}`);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="relative flex flex-col justify-start items-start h-full w-full p-10 gap-5 text-foreground !text-start overflow-scroll">
      <div className="flex flex-row gap-2 text-gray-700">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Dashboard
        </Link>
        <span className="text-gray-500">/</span>
        <Link
          to={`/dashboard/course/${courseData?.id}`}
          className="text-blue-500 hover:underline"
        >
          {courseData?.name || "Course"}
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-900">
          {tutorialData?.category || "Tutorial"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <p className="text-black text-xl font-bold">{tutorialData?.title}</p>
            {isCompleted && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Completed
              </span>
            )}
          </div>
          {allTutorials.length > 1 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 px-2">
              <span>
                Tutorial {currentTutorialIndex + 1} of {allTutorials.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {!isCompleted && (
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-row min-w-full justify-between items-center gap-4">
            {!hasCompletedQuiz && quizzes.length > 0 ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Please complete the quiz before marking this tutorial as completed.</span>
              </div>
            ) : (
              <div></div>
            )}
            <div className="flex gap-3 ml-auto">
              {quizzes.length > 0 && (
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/course/${courseId}/learning/${tutorialId}/quiz/${quizzes[0].id}`
                    )
                  }
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    hasCompletedQuiz
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {hasCompletedQuiz ? "Retake Quiz" : "Start Quiz"}
                </button>
              )}
              <button
                onClick={markAsCompleted}
                disabled={completingTutorial || !hasCompletedQuiz}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  completingTutorial
                    ? "bg-blue-400 text-white cursor-wait"
                    : !hasCompletedQuiz
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                title={!hasCompletedQuiz ? "Complete the quiz first" : ""}
              >
                {completingTutorial ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark as Completed
                  </>
                )}
              </button>
              {!videoEnded && (
                <button
                  onClick={() => {
                    setVideoEnded(true);
                    setHasPopup(true);
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Give Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Navigation */}
      {allTutorials.length > 1 && (
        <div className="flex justify-between items-center w-full pt-4 border-t border-gray-200">
          <button
            onClick={goToPreviousTutorial}
            disabled={currentTutorialIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentTutorialIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Previous Tutorial
          </button>
          <button
            onClick={goToNextTutorial}
            disabled={currentTutorialIndex === allTutorials.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentTutorialIndex === allTutorials.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            Next Tutorial
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="w-full h-1/2 shrink-0">
        <iframe
          src={tutorialData?.video_url}
          loading="lazy"
          allow="encrypted-media; fullscreen;"
          className="w-full h-full rounded-lg"
        ></iframe>
      </div>

      {videoEnded && !feedback && !pendingFeedback && hasPopup && (
        <div className="absolute z-100 w-1/2 border-2 bg-opacity-50 m-auto top-1/2 -translate-y-1/2 left-0 right-0 flex flex-col items-center gap-6 p-8 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-bold text-black">
            How was this tutorial?
          </h3>

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

            <div
              ref={webcamContainerRef}
              className="flex justify-center mb-4"
            ></div>

            {holdProgress > 0 && (
              <div className="w-full max-w-md mx-auto mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Hold gesture...
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(holdProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-100"
                    style={{ width: `${holdProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div
              ref={labelContainerRef}
              className="text-left max-w-md mx-auto"
            ></div>

            {detectedGesture && (
              <p className="text-lg font-medium text-green-600 mt-4">
                Detected: {detectedGesture.replace("_", " ")}!
              </p>
            )}
          </div>
        </div>
      )}

      {pendingFeedback && hasPopup && (
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 m-auto w-1/2 flex flex-col items-center gap-6 p-8 bg-blue-50 rounded-lg border-2 border-blue-300">
          <h3 className="text-2xl font-bold text-black">
            Confirm Your Feedback
          </h3>
          <p className="text-lg">
            You showed:{" "}
            <span className="font-bold text-blue-600">
              {detectedGesture.replace("_", " ")}
            </span>
          </p>
          <p className="text-gray-600">
            Is this correct? The tutorial was{" "}
            {pendingFeedback === "positive" ? "helpful" : "not helpful"}?
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

      {feedback && hasPopup && (
        <div
          className="absolute m-auto top-1/2 -translate-y-1/2 w-1/2 left-0 right-0 border-2 flex flex-col items-center gap-4 p-8 bg-green-50 rounded-lg"
          onClick={() => setHasPopup(false)}
        >
          <h3 className="text-2xl font-bold text-green-800">
            Thank you for your feedback!
          </h3>
          <p className="text-gray-600">
            Your {feedback === "positive" ? "positive" : "negative"} feedback
            helps us improve.
          </p>
          <p>Click to remove this popup.</p>
        </div>
      )}

      <div className="w-full flex-grow h-auto flex flex-col bg-gray-200 rounded-lg">
        <div className="grid grid-cols-2 text-center items-center h-10 divide-x divide-gray-400 shadow-lg shrink-0">
          <RenderOption
            label="Overview"
            roundDirection="left"
            onClick={() => setActiveTab(0)}
            className={`${activeTab == 0 ? "bg-gray-300 text-black" : ""}`}
          />
          <RenderOption
            label="Transcript"
            roundDirection="right"
            onClick={() => setActiveTab(1)}
            className={`${activeTab == 1 ? "bg-gray-300 text-black" : ""}`}
          />
        </div>
        <div
          className={`${
            activeTab === 0 ? "flex" : "hidden"
          } flex-col w-full h-full p-5 gap-3 text-black`}
        >
          <p className="font-bold">Description</p>
          <p>{tutorialData?.description}</p>
          <p className="font-bold">Tutorial Category</p>
          <p>{tutorialData?.category}</p>
          <div className="mt-auto flex flex-row gap-2">
            <p className="font-bold">Created at: </p>
            {tutorialData?.created_at || "Unknown"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;