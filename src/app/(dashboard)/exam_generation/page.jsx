"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import jsPDF from "jspdf";

export default function CreateExamPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [examGenerated, setExamGenerated] = useState(false);

  // Static Reinforcement Learning exam content (20 marks, 10 questions)
  const staticExam = {
    title: "Reinforcement Learning - Final Exam",
    courseCode: "RL501",
    date: "June 20, 2025",
    duration: "1.5 hours",
    totalMarks: 20,
    instructions: [
      "Answer all questions clearly and concisely.",
      "Show your work for partial credit where applicable.",
      "Calculators are allowed; no internet-enabled devices.",
      "Use the provided answer sheets for all responses."
    ],
    sections: [
      {
        title: "Multiple Choice (8 marks)",
        questions: [
          {
            question: "What is the primary goal of a reinforcement learning agent?",
            options: [
              "Minimize actions",
              "Maximize cumulative reward",
              "Minimize exploration",
              "Maximize states"
            ],
            marks: 2
          },
          {
            question: "What does Q-learning estimate?",
            options: [
              "State transitions",
              "Action-value function",
              "Reward function",
              "Policy gradient"
            ],
            marks: 2
          },
          {
            question: "Which method uses temporal difference learning?",
            options: [
              "Monte Carlo",
              "Q-learning",
              "Gradient Descent",
              "Dynamic Programming"
            ],
            marks: 2
          },
          {
            question: "What is an MDP?",
            options: [
              "Markov Decision Process",
              "Multi-Decision Policy",
              "Markov Data Process",
              "Multi-Directional Path"
            ],
            marks: 2
          }
        ]
      },
      {
        title: "Short Answer (8 marks)",
        questions: [
          {
            question: "Define the exploration-exploitation tradeoff.",
            marks: 2
          },
          {
            question: "What is the role of the discount factor in RL?",
            marks: 2
          },
          {
            question: "Explain the term 'policy' in RL.",
            marks: 2
          },
          {
            question: "What is the difference between on-policy and off-policy learning?",
            marks: 2
          }
        ]
      },
      {
        title: "Problem Solving (4 marks)",
        questions: [
          {
            question: "Write the Bellman equation for the value function in an MDP.",
            marks: 2
          },
          {
            question: "Outline a simple Q-learning update rule in pseudocode.",
            marks: 2
          }
        ]
      }
    ]
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
        setError(null);
      } else {
        setError("Please upload a valid PDF file.");
        setPdfFile(null);
      }
    }
  };

  const handleProcessPDF = async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Basic validation (jsPDF is not used for reading, just ensure file is selected)
      setExamGenerated(true); // Trigger exam display
    } catch (err) {
      setError("Error processing PDF: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 p-6">

      {/* Form */}
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
        <Card className="w-full max-w-4xl border shadow-md p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-700 mb-6 text-center">
              Create Exam from Syllabus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PDF Upload */}
            <div className="border-2 border-red-500 rounded-lg p-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Upload Syllabus PDF
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Process Button */}
            <div className="pt-4">
              <Button
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white text-lg rounded-lg shadow-md"
                onClick={handleProcessPDF}
                disabled={isProcessing || !pdfFile}
              >
                {isProcessing ? "Processing PDF..." : "Process Syllabus"}
              </Button>
            </div>

            {/* Display Static Exam */}
            {examGenerated && (
              <div className="border-2 border-red-500 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Generated Exam</h3>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold">{staticExam.title}</h4>
                  <p><strong>Course Code:</strong> {staticExam.courseCode}</p>
                  <p><strong>Date:</strong> {staticExam.date}</p>
                  <p><strong>Duration:</strong> {staticExam.duration}</p>
                  <p><strong>Total Marks:</strong> {staticExam.totalMarks}</p>
                  <div>
                    <strong>Instructions:</strong>
                    <ul className="list-disc pl-5">
                      {staticExam.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                  {staticExam.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mt-4">
                      <h5 className="text-lg font-semibold">{section.title}</h5>
                      {section.questions.map((question, qIndex) => (
                        <div key={qIndex} className="mt-2">
                          <p><strong>Question {qIndex + 1} ({question.marks} marks):</strong> {question.question}</p>
                          {question.options && (
                            <ul className="list-disc pl-5">
                              {question.options.map((option, oIndex) => (
                                <li key={oIndex}>{option}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}