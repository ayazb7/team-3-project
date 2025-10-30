import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Volume2, ChevronLeft, CheckCircle2, XCircle, Flag, Trophy, Home } from "lucide-react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col gap-5 w-full p-4 sm:p-6 md:p-10 h-full">
      <div className="h-4 sm:h-6 bg-gray-300 rounded w-1/4"></div>
      <div className="h-6 sm:h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="h-48 bg-gray-300 rounded w-full min-h-1/2"></div>
    </div>
  );
};

export default function Quiz() {
  const [quizData, setQuizData] = useState(null);
  const [tutorialData, setTutorialData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [speakingText, setSpeakingText] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [courseTutorials, setCourseTutorials] = useState([]);
  const { courseId, tutorialId, quizId } = useParams();
  const { api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await api.get(`/quizzes/${quizId}/full`);
        const tutorialRes = await api.get(`/courses/${courseId}/tutorials/${tutorialId}`);
        const courseRes = await api.get(`/courses/${courseId}`);
        const tutorialsRes = await api.get(`/courses/${courseId}/tutorials`);

        const clonedQuizData = JSON.parse(JSON.stringify(quizRes.data));
        
        clonedQuizData.questions.forEach((question) => {
          question.options = question.options.map((option, index) => ({
            ...option,
            _originalIndex: index,
          }));
        });

        setQuizData(clonedQuizData);
        setTutorialData(tutorialRes.data);
        setCourseData(courseRes.data);
        setCourseTutorials(tutorialsRes.data);
        console.log("Quiz data fetched successfully", clonedQuizData);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (api) {
      fetchData();
    }
  }, [courseId, tutorialId, quizId, api]);

  useEffect(() => {
    const savedAnswer = questionAnswers[currentQuestionIndex];
    if (savedAnswer) {
      setSelectedOptionId(savedAnswer.selectedOptionId);
      setAnswerFeedback(savedAnswer.answerFeedback);
    } else {
      setSelectedOptionId(null);
      setAnswerFeedback(null);
    }
  }, [currentQuestionIndex, questionAnswers]);

  const handleSubmitAnswer = async () => {
    if (!selectedOptionId) return;

    const currentQuestion = quizData?.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(
        `/quizzes/${quizId}/questions/${currentQuestion.id}/answer`,
        { selected_option_id: selectedOptionId }
      );

      const feedback = {
        isCorrect: response.data.is_correct,
        correctOptionId: response.data.correct_option_id,
      };

      setAnswerFeedback(feedback);

      setQuestionAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: {
          selectedOptionId,
          answerFeedback: feedback,
        },
      }));
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinishQuiz = async () => {
    const totalQuestions = quizData?.questions?.length || 0;
    const answeredCount = Object.keys(questionAnswers).length;
    
    if (answeredCount < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions before finishing the quiz.`);
      return;
    }

    setIsSubmittingQuiz(true);
    try {
      const answers = quizData.questions.map((question, index) => {
        const savedAnswer = questionAnswers[index];
        return {
          question_id: question.id,
          selected_option_id: savedAnswer?.selectedOptionId,
        };
      });

      const response = await api.post(`/quizzes/${quizId}/submit`, {
        answers: answers,
      });

      setQuizResults(response.data);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const getNextTutorial = () => {
    const currentIndex = courseTutorials.findIndex((t) => t.id === parseInt(tutorialId));
    if (currentIndex < courseTutorials.length - 1) {
      return courseTutorials[currentIndex + 1];
    }
    return null;
  };

  const handleNextTutorial = () => {
    const nextTutorial = getNextTutorial();
    if (nextTutorial) {
      navigate(`/dashboard/course/${courseId}/learning/${nextTutorial.id}`);
    } else {
      navigate(`/dashboard/course/${courseId}`);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index);
  };

  const speakText = (text) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.lang.includes('en') && voice.localService
    ) || voices.find((voice) => voice.lang.includes('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setSpeakingText(text);
    };

    utterance.onend = () => {
      setSpeakingText(null);
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setSpeakingText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
    }
  };

  const handleSpeakerClick = (e, text) => {
    e.stopPropagation();
    
    if (speakingText === text) {
      stopSpeaking();
    } else {
      speakText(text);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (quizResults) {
    const score = quizResults.score;
    const correctAnswers = quizResults.correct_answers;
    const totalQuestions = quizResults.total_questions;
    const percentage = Math.round(score);
    const nextTutorial = getNextTutorial();
    const isPassing = score >= 70; 

    return (
      <div className="relative flex flex-col justify-center items-center h-full w-full p-4 sm:p-6 md:p-10 gap-4 sm:gap-5 text-foreground !text-start overflow-scroll bg-gray-50">
        {/* Results Card */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-8 flex flex-col items-center gap-4 sm:gap-6">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center ${
            isPassing ? "bg-green-100" : "bg-orange-100"
          }`}>
            <Trophy className={`w-10 h-10 sm:w-12 sm:h-12 ${
              isPassing ? "text-green-600" : "text-orange-600"
            }`} />
          </div>

          {/* Score Display */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <div className={`text-5xl sm:text-6xl font-bold mb-2 ${
              isPassing ? "text-green-600" : "text-orange-600"
            }`}>
              {percentage}%
            </div>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              You scored {correctAnswers} out of {totalQuestions} questions correctly
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md px-2">
            <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isPassing ? "bg-green-500" : "bg-orange-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Result Message */}
          <div className={`p-3 sm:p-4 rounded-lg w-full text-center ${
            isPassing 
              ? "bg-green-50 border border-green-200" 
              : "bg-orange-50 border border-orange-200"
          }`}>
            <p className={`text-sm sm:text-base font-medium ${
              isPassing ? "text-green-800" : "text-orange-800"
            }`}>
              {isPassing 
                ? "Congratulations! You passed the quiz!" 
                : "Good effort! Review the material and try again."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-sm sm:text-base"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            {nextTutorial ? (
              <button
                onClick={handleNextTutorial}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
              >
                <span>Next Tutorial</span>
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
              </button>
            ) : (
              <button
                onClick={() => navigate(`/dashboard/course/${courseId}`)}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
              >
                <span>Back to Course</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData?.questions[currentQuestionIndex];
  const totalQuestions = quizData?.questions?.length || 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasFeedback = answerFeedback !== null;

  return (
    <div className="relative flex flex-col justify-start items-start h-full w-full p-4 sm:p-6 md:p-10 gap-2 sm:gap-3 text-foreground !text-start overflow-scroll bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav 
        className="flex flex-row gap-1 sm:gap-2 text-gray-700 text-xs sm:text-base overflow-x-auto w-full scrollbar-hide pb-1 -mx-4 sm:-mx-6 md:-mx-10 px-4 sm:px-6 md:px-10" 
        aria-label="Breadcrumb"
      >
        <Link 
          to="/dashboard" 
          className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded whitespace-nowrap flex-shrink-0"
        >
          Dashboard
        </Link>
        <span className="text-gray-500 flex-shrink-0" aria-hidden="true">/</span>
        <Link
          to={`/dashboard/course/${courseData?.id}`}
          className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded truncate max-w-[100px] sm:max-w-none"
          title={courseData?.name || "Course"}
        >
          {courseData?.name || "Course"}
        </Link>
        <span className="text-gray-500 flex-shrink-0" aria-hidden="true">/</span>
        <Link
          to={`/dashboard/course/${courseId}/learning/${tutorialId}`}
          className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded truncate max-w-[80px] sm:max-w-none"
          title={tutorialData?.category || "Tutorial"}
        >
          {tutorialData?.category || "Tutorial"}
        </Link>
        <span className="text-gray-500 flex-shrink-0" aria-hidden="true">/</span>
        <span className="text-gray-900 truncate max-w-[120px] sm:max-w-none" aria-current="page" title={quizData?.title || "Quiz"}>
          {quizData?.title || "Quiz"}
        </span>
      </nav>

      {/* Quiz Content */}
      <div className="w-full flex-grow flex flex-col bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 max-w-4xl">
        {/* Question Number */}
        <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4" aria-live="polite">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>

        {/* Question Text */}
        <div className="flex items-start gap-2 sm:gap-3 mb-6 sm:mb-8">
          <h2 id="question-text" className="flex-1 text-lg sm:text-xl font-semibold text-gray-900 leading-relaxed">
            {currentQuestion?.question_text}
          </h2>
          {/* TTS Button for Question */}
          <button
            type="button"
            onClick={(e) => handleSpeakerClick(e, currentQuestion?.question_text)}
            className={`p-2 sm:p-2.5 rounded-md transition-colors flex-shrink-0 touch-manipulation ${
              speakingText === currentQuestion?.question_text
                ? "bg-blue-200 hover:bg-blue-300 active:bg-blue-400"
                : "hover:bg-gray-200 active:bg-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            aria-label="Read question aloud"
            title={speakingText === currentQuestion?.question_text ? "Stop reading" : "Read aloud"}
          >
            <Volume2 className={`w-5 h-5 sm:w-5 sm:h-5 ${
              speakingText === currentQuestion?.question_text
                ? "text-blue-600"
                : "text-gray-600"
            }`} />
          </button>
        </div>

        {/* Answer Options */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8" role="radiogroup" aria-labelledby="question-text">
          {currentQuestion?.options
            ?.slice() 
            .sort((a, b) => {
              if (a._originalIndex !== undefined && b._originalIndex !== undefined) {
                return a._originalIndex - b._originalIndex;
              }
              return a.id - b.id;
            })
            .map((option, index) => {
            const optionLabel = getOptionLabel(index);
            const isSelected = selectedOptionId === option.id;
            const isCorrect = hasFeedback && answerFeedback.correctOptionId === option.id;
            const isIncorrect = hasFeedback && isSelected && !answerFeedback.isCorrect;

            return (
              <div
                key={option.id}
                className={`
                  relative flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation
                  ${isSelected && !hasFeedback ? "border-blue-500 bg-blue-50" : ""}
                  ${isCorrect && hasFeedback ? "border-green-500 bg-green-50" : ""}
                  ${isIncorrect ? "border-red-500 bg-red-50" : ""}
                  ${!hasFeedback && !isSelected ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100" : ""}
                  ${hasFeedback && !isSelected && !isCorrect ? "border-gray-200 bg-white" : ""}
                `}
              >
                <input
                  type="radio"
                  id={`option-${option.id}`}
                  name="quiz-option"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => !hasFeedback && setSelectedOptionId(option.id)}
                  disabled={hasFeedback}
                  className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                  aria-label={`Option ${optionLabel}: ${option.text}`}
                />

                {/* Option Label */}
                <label
                  htmlFor={`option-${option.id}`}
                  className="flex-1 text-sm sm:text-base text-gray-900 cursor-pointer select-none font-medium pr-2"
                >
                  <span className="font-semibold mr-1 sm:mr-2">{optionLabel}.</span>
                  {option.text}
                </label>

                {hasFeedback && (
                  <div className="flex items-center flex-shrink-0">
                    {isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" aria-label="Correct answer" />
                    )}
                    {isIncorrect && (
                      <XCircle className="w-5 h-5 text-red-600" aria-label="Incorrect answer" />
                    )}
                  </div>
                )}

                {/* TTS Audio Button */}
                <button
                  type="button"
                  onClick={(e) => handleSpeakerClick(e, option.text)}
                  className={`p-2 rounded-md transition-colors flex-shrink-0 touch-manipulation ${
                    speakingText === option.text
                      ? "bg-blue-200 hover:bg-blue-300 active:bg-blue-400"
                      : "hover:bg-gray-200 active:bg-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  aria-label={`Read option ${optionLabel} aloud`}
                  title={speakingText === option.text ? "Stop reading" : "Read aloud"}
                >
                  <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    speakingText === option.text
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Feedback Message */}
        {hasFeedback && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg ${
              answerFeedback.isCorrect
                ? "bg-green-100 border border-green-300"
                : "bg-red-100 border border-red-300"
            }`}
            role="alert"
            aria-live="polite"
          >
            <p
              className={`text-sm sm:text-base font-medium ${
                answerFeedback.isCorrect ? "text-green-800" : "text-red-800"
              }`}
            >
              {answerFeedback.isCorrect
                ? "Correct! Well done."
                : "Incorrect. Please review the question and try again."}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mt-auto pt-4 sm:pt-6 border-t border-gray-200">
          {/* Flag Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors touch-manipulation sm:flex-shrink-0"
            aria-label="Flag this question for review"
          >
            <Flag className="w-4 h-4" />
            <span>Flag</span>
          </button>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:bg-white touch-manipulation"
              aria-label="Previous question"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {!hasFeedback ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId || isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 active:from-purple-700 active:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md touch-manipulation"
                aria-label="Submit answer"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={isLastQuestion ? handleFinishQuiz : handleNextQuestion}
                disabled={!hasFeedback || isSubmittingQuiz}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 active:from-purple-700 active:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md touch-manipulation"
                aria-label={isLastQuestion ? "Finish quiz" : "Next question"}
              >
                {isSubmittingQuiz ? "Submitting..." : isLastQuestion ? "Finish Quiz" : "Next"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}