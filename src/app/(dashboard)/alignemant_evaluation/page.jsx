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

  // Static Reinforcement Learning exam content based on provided example
  const staticExam = {
    title: "Reinforcement Learning - Final Exam",
    instructors: ["Nicolas Gast", "Panayotis Mertikopoulos"],
    date: "January 2026",
    academicYear: "2025-2026",
    duration: "2 hours",
    instructions: [
      "Please justify carefully your answers (try to be concise and precise).",
      "The grading scale is given as an indication.",
      "Use the provided answer sheets for all responses."
    ],
    sections: [
      {
        title: "Exercise 1: Multi-Armed Bandit (6 points)",
        questions: [
          {
            question: "Consider a 3-arm Gaussian bandit with means μ₁, μ₂, μ₃. You observe the following episode:\n" +
                     "Time: 0 1 2 3 4 5 6 7 8 9\n" +
                     "Choice: 0 1 2 0 1 2 0 1 2 0\n" +
                     "Reward: 1.2 0.8 0.5 1.1 0.9 0.4 1.3 0.7 0.6 1.0\n" +
                     "a) Express the expected regret at time t=10 as a function of the μᵢs.\n" +
                     "b) Using ε-greedy with ε=0.2, compute the probability of choosing each arm at time t=10.\n" +
                     "c) Using UCB with bonus 3 ln(t)/Nᵢ(t), where Nᵢ(t) is the number of times arm i was chosen before time t, determine the arm chosen at t=10 (ln(10) ≈ 2.3).",
            marks: 4,
            learningOutcomes: {
              outcomes: ["LO1", "LO2"],
              bloomLevel: "Understand, Apply",
              alignment: "Aligned",
              explanation: "This question assesses the understanding and application of multi-armed bandit algorithms, specifically ε-greedy and UCB, aligning with LO1 (understanding RL algorithms) and LO2 (applying bandit strategies)."
            }
          },
          {
            question: "For the ε-greedy and UCB policies above, compute limₜ→∞ Nᵢ(t)/t for each arm i. Explain how this reflects the regret performance difference between the two policies.",
            marks: 2,
            learningOutcomes: {
              outcomes: ["LO1", "LO3"],
              bloomLevel: "Analyze",
              alignment: "Aligned",
              explanation: "This question requires analyzing the long-term behavior of bandit algorithms and their impact on regret, aligning with LO1 (RL algorithm understanding) and LO3 (regret analysis)."
            }
          }
        ]
      },
      {
        title: "Exercise 2: Simplified Blackjack (14 points)",
        questions: [
          {
            question: "Consider a simplified Blackjack game with an infinite deck (cards 2-10, J, Q, K, A, each equally likely). Card values: 2-10 as shown, J/Q/K=10, A=11. Actions: 'hit' (draw card, no reward) or 'stay' (sum cards, earn 10 if sum is 16-21, 0 if sum=15, -10 if sum<15 or >21). Model as an MDP with states S={0,2,...,21,≥21,end}, discount factor γ=0.5.\n" +
                     "a) For state s=14, actions a∈{hit,stay}, compute rewards R(s,a) and transition probabilities P(s'|s,a) for s'∈S.",
            marks: 2,
            learningOutcomes: {
              outcomes: ["LO2", "LO4"],
              bloomLevel: "Apply",
              alignment: "Aligned",
              explanation: "This question tests the ability to model a problem as an MDP, aligning with LO2 (MDP modeling) and LO4 (probability calculations in RL)."
            }
          },
          {
            question: "Given an initial value function V₀(s) for s∈{12,...,21,≥21,end} (values: 12=2, 13=1, ..., 21=0, ≥21=-1, end=0):\n" +
                     "a) Compute the Q-table for γ=0.5.\n" +
                     "b) Perform one iteration of value iteration to compute V₁(s).\n" +
                     "c) Determine the optimal policy and justify.",
            marks: 4,
            learningOutcomes: {
              outcomes: ["LO2", "LO5"],
              bloomLevel: "Apply, Evaluate",
              alignment: "Aligned",
              explanation: "This question involves applying value iteration and evaluating optimal policies, aligning with LO2 (MDP solutions) and LO5 (policy optimization)."
            }
          },
          {
            question: "Using Q-learning with learning rate α=0.2, γ=0.5, and unknown transition probabilities:\n" +
                     "a) Write the Q-learning update equation and explain its mechanics.\n" +
                     "b) Given a Q-table and episode (s=14, a=hit, r=0, s'=20; s'=20, a=stay, r=10, s'=end), update the Q-table, showing only changed values.",
            marks: 4,
            learningOutcomes: {
              outcomes: ["LO1", "LO3"],
              bloomLevel: "Understand, Apply",
              alignment: "Aligned",
              explanation: "This question assesses understanding and application of Q-learning, aligning with LO1 (RL algorithms) and LO3 (model-free learning)."
            }
          },
          {
            question: "Modify the Blackjack game to include a dealer who draws cards after the player stays. The dealer wins (+10) if their score is strictly higher than the player's, losing otherwise (player gets +10 if sum≤21, -10 if >21).\n" +
                     "a) Describe an algorithm to compute the optimal policy assuming known card probabilities.\n" +
                     "b) Explain how to apply Q-learning if probabilities are unknown.",
            marks: 4,
            learningOutcomes: {
              outcomes: ["LO3", "LO5"],
              bloomLevel: "Analyze, Create",
              alignment: "Aligned",
              explanation: "This question requires designing and analyzing RL solutions for a two-player game, aligning with LO3 (model-free RL) and LO5 (policy design)."
            }
          }
        ]
      }
    ]
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(staticExam.title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Instructors: ${staticExam.instructors.join(", ")}`, 20, 30);
    doc.text(`Date: ${staticExam.date} (${staticExam.academicYear})`, 20, 40);
    doc.text(`Duration: ${staticExam.duration}`, 20, 50);
    
    let y = 60;
    doc.setFontSize(12);
    doc.text("Instructions:", 20, y);
    y += 10;
    staticExam.instructions.forEach((instruction, index) => {
      doc.text(`- ${instruction}`, 25, y);
      y += 10;
    });

    staticExam.sections.forEach((section, sectionIndex) => {
      y += 10;
      doc.setFontSize(14);
      doc.text(section.title, 20, y);
      y += 10;
      section.questions.forEach((question, qIndex) => {
        doc.setFontSize(12);
        const questionText = `Question ${qIndex + 1} (${question.marks} points): ${question.question}`;
        const lines = doc.splitTextToSize(questionText, 170);
        lines.forEach(line => {
          doc.text(line, 25, y);
          y += 7;
        });
        y += 5;
        doc.setFontSize(10);
        doc.text(`Learning Outcomes: ${question.learningOutcomes.outcomes.join(", ")}`, 30, y);
        doc.text(`Bloom Level: ${question.learningOutcomes.bloomLevel}`, 30, y + 5);
        doc.text(`Alignment: ${question.learningOutcomes.alignment}`, 30, y + 10);
        const explanationLines = doc.splitTextToSize(`Explanation: ${question.learningOutcomes.explanation}`, 160);
        explanationLines.forEach(line => {
          doc.text(line, 30, y + 15);
          y += 5;
        });
        y += 10;
      });
    });

    doc.save("Reinforcement_Learning_Exam.pdf");
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
      setExamGenerated(true);
    } catch (err) {
      setError("Error processing PDF: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
        <Card className="w-full max-w-4xl border shadow-md p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-700 mb-6 text-center">
              Evaluate Exam with Bloom's Taxonomy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="pt-4">
              <Button
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white text-lg rounded-lg shadow-md"
                onClick={handleProcessPDF}
                disabled={isProcessing || !pdfFile}
              >
                {isProcessing ? "Processing PDF..." : "Process Syllabus"}
              </Button>
            </div>

            {examGenerated && (
              <div className="border-2 border-red-500 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Generated Exam</h3>
                <Button
                  className="mb-4 bg-red-600 hover:bg-red-700 text-white"
                  onClick={generatePDF}
                >
                  Download Exam PDF
                </Button>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold">{staticExam.title}</h4>
                  <p><strong>Instructors:</strong> {staticExam.instructors.join(", ")}</p>
                  <p><strong>Date:</strong> {staticExam.date} ({staticExam.academicYear})</p>
                  <p><strong>Duration:</strong> {staticExam.duration}</p>
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
                          <p><strong>Question {qIndex + 1} ({question.marks} points):</strong> {question.question}</p>
                          <div className="ml-4 mt-2">
                            <p><strong>Learning Outcomes:</strong> {question.learningOutcomes.outcomes.join(", ")}</p>
                            <p><strong>Bloom Level:</strong> {question.learningOutcomes.bloomLevel}</p>
                            <p><strong>Alignment:</strong> {question.learningOutcomes.alignment}</p>
                            <p><strong>Explanation:</strong> {question.learningOutcomes.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}