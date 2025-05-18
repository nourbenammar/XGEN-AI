"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  CheckCircle, 
  Loader2, 
  Download, 
  RotateCw, 
  AlertCircle, 
  HelpCircle,
  FileText
} from "lucide-react";
import jsPDF from "jspdf";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const DashboardPage = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [backendResponse, setBackendResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selectedFile.type === "application/msword")
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid PDF or DOC file.");
      setFile(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (
      droppedFile &&
      (droppedFile.type === "application/pdf" ||
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        droppedFile.type === "application/msword")
    ) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please drop a valid PDF or DOC file.");
      setFile(null);
    }
  };

  const generateImprovedReport = async (data) => {
    const doc = new jsPDF();
    const { syllabus, enhancement } = data;
    const fileName = file?.name || "Unknown File";

    try {
      // Load the logo
      const img = new Image();
      img.src = "/esprit.png";

      const base64 = await new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = () => resolve(null);
      });

      if (base64) {
        doc.addImage(base64, "PNG", 15, 10, 35, 35);
      }

      let y = 50;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - margin * 2;

      // Title
      doc.setFontSize(28);
      doc.setTextColor(128, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Syllabus Improvement Report", margin, y, { align: "left" });
      y += 12;

      // Subtitle
      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      doc.text(`File: ${fileName}`, margin, y);
      y += 8;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
      y += 12;

      // Divider
      doc.setDrawColor(128, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      const addText = (text, x, yPos, options = {}) => {
        const { maxLines = 30, fontSize = 12, isListItem = false, isBold = false, color = [0, 0, 0] } = options;
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(color[0], color[1], color[2]);

        const splitText = doc.splitTextToSize(text, maxWidth - (isListItem ? 15 : 0));
        let newYPos = yPos;

        for (let i = 0; i < Math.min(splitText.length, maxLines); i++) {
          if (newYPos > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            newYPos = 20;
          }
          doc.text(
            (isListItem ? (i === 0 ? "• " : "  ") : "") + splitText[i],
            x + (isListItem && i > 0 ? 15 : 0),
            newYPos
          );
          newYPos += 7;
        }
        return newYPos + 5;
      };

      // Executive Summary
      doc.setFontSize(18);
      doc.setTextColor(128, 0, 0);
      doc.setFont("helvetica", "bold");
      y = addText("Executive Summary", margin, y, { fontSize: 18, isBold: true });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);

      const overallScore = enhancement?.scoring?.score || "N/A";
      const summaryText = `The syllabus achieved an overall score of ${overallScore}/100. Analysis revealed ` +
                         `${enhancement?.bloom_analysis?.missing_levels?.length || 0} missing Bloom's taxonomy levels and ` +
                         `${enhancement?.misalignments?.length || 0} misalignments between objectives and assessments.`;
      y = addText(summaryText, margin, y, { maxWidth: maxWidth - 10 });
      y += 10;

      // Scores Section
      doc.setFontSize(18);
      doc.setTextColor(128, 0, 0);
      doc.setFont("helvetica", "bold");
      y = addText("Evaluation Scores", margin, y, { fontSize: 18, isBold: true });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);

      const scoreWidth = 120;
      const scoreHeight = 15;
      const scoreX = margin + 70;

      // Overall Score
      doc.setTextColor(0, 0, 0);
      doc.text("Overall Score:", margin, y);
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(200, 200, 200);
      doc.rect(scoreX, y - 10, scoreWidth, scoreHeight, 'F');
      const scoreValue = enhancement?.scoring?.score || 0;
      doc.setFillColor(128, 0, 0);
      doc.rect(scoreX, y - 10, (scoreValue / 100) * scoreWidth, scoreHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(`${scoreValue}%`, scoreX + ((scoreValue / 100) * scoreWidth) / 2 - 5, y);
      y += 20;

      // Bloom Coverage
      doc.setTextColor(0, 0, 0);
      doc.text("Bloom Coverage:", margin, y);
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(200, 200, 200);
      doc.rect(scoreX, y - 10, scoreWidth, scoreHeight, 'F');
      const bloomValue = enhancement?.scoring?.bloom_coverage || 0;
      doc.setFillColor(165, 42, 42);
      doc.rect(scoreX, y - 10, (bloomValue / 100) * scoreWidth, scoreHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(`${bloomValue}%`, scoreX + ((bloomValue / 100) * scoreWidth) / 2 - 5, y);
      y += 20;

    

      // Learning Outcomes
      doc.addPage();
      y = 20;
      doc.setFontSize(18);
      doc.setTextColor(128, 0, 0);
      doc.setFont("helvetica", "bold");
      y = addText("Learning Outcomes Comparison", margin, y, { fontSize: 18, isBold: true });
      doc.setFont("helvetica", "normal");

      // Original Outcomes
      y = addText("Original Learning Outcomes:", margin, y, { fontSize: 14, isBold: true });
      const originalOutcomes = syllabus?.content?.objectives || [];
      if (originalOutcomes.length === 0) {
        y = addText("No objectives provided.", margin + 5, y);
      } else {
        originalOutcomes.forEach((item) => {
          y = addText(item, margin + 5, y, { isListItem: true });
        });
      }
      y += 10;

      // Improved Outcomes
      y = addText("Improved Learning Outcomes:", margin, y, { fontSize: 14, isBold: true, color: [128, 0, 0] });
      const improvedOutcomes = enhancement?.improved_outcomes || [];
      if (improvedOutcomes.length === 0) {
        y = addText("No improved outcomes generated.", margin + 5, y);
      } else {
        improvedOutcomes.forEach((item) => {
          y = addText(item, margin + 5, y, { isListItem: true, color: [128, 0, 0] });
        });
      }
      y += 15;

      // Bloom's Taxonomy Analysis
      doc.addPage();
      y = 20;
      doc.setFontSize(18);
      doc.setTextColor(128, 0, 0);
      doc.setFont("helvetica", "bold");
      y = addText("Bloom's Taxonomy Analysis", margin, y, { fontSize: 18, isBold: true });
      doc.setFont("helvetica", "normal");

      // Taxonomy Levels
      y = addText("Taxonomy Levels Coverage:", margin, y, { fontSize: 14, isBold: true });
      const allLevels = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];
      const foundLevels = enhancement?.bloom_analysis?.found_levels || [];

      allLevels.forEach((level) => {
        const isFound = foundLevels.includes(level);
        y = addText(
          `${level}: ${isFound ? "Present" : "Missing"}`,
          margin + 5,
          y,
          { fontSize: 12, color: isFound ? [40, 167, 69] : [220, 53, 69] }
        );
      });
      y += 10;

      // Missing Levels Explanation
      y = addText("Missing Levels Analysis:", margin, y, { fontSize: 14, isBold: true });
      const missingLevels = enhancement?.bloom_analysis?.missing_levels || [];
      if (missingLevels.length === 0) {
        y = addText("All Bloom's taxonomy levels covered.", margin + 5, y, { color: [40, 167, 69] });
      } else {
        missingLevels.forEach((level) => {
          y = addText(
            `${level}: Incorporate this cognitive level for better learning outcomes.`,
            margin + 5,
            y,
            { isListItem: true, color: [220, 53, 69] }
          );
        });
      }
      y += 15;

      // Misalignments and Recommendations
      doc.addPage();
      y = 20;
      doc.setFontSize(18);
      doc.setTextColor(128, 0, 0);
      doc.setFont("helvetica", "bold");
      y = addText("Misalignments and Recommendations", margin, y, { fontSize: 18, isBold: true });
      doc.setFont("helvetica", "normal");

      // Misalignments
      y = addText("Identified Misalignments:", margin, y, { fontSize: 14, isBold: true });
      const misalignments = enhancement?.misalignments || [];
      if (misalignments.length === 0) {
        y = addText("No misalignments detected.", margin + 5, y, { color: [40, 167, 69] });
      } else {
        misalignments.forEach((item) => {
          y = addText(item, margin + 5, y, { isListItem: true });
        });
      }
      y += 10;

      // Suggestions
      y = addText("Improvement Suggestions:", margin, y, { fontSize: 14, isBold: true });
      const suggestions = enhancement?.suggestions || [];
      if (suggestions.length === 0) {
        y = addText("No additional suggestions provided.", margin + 5, y);
      } else {
        suggestions.forEach((item, index) => {
          y = addText(`${index + 1}. ${item}`, margin + 5, y, { color: [0, 100, 0] });
        });
      }
      y += 15;

      // Conclusion
      doc.addPage();
      y = 20;
      doc.setFontSize(18);
      doc.setTextColor(128, 0, 0);
      doc.setFont("helvetica", "bold");
      y = addText("Conclusion and Next Steps", margin, y, { fontSize: 18, isBold: true });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      const conclusionText = "This report provides a comprehensive analysis of your syllabus. Implement the suggested improvements and re-analyze to track progress.";
      y = addText(conclusionText, margin, y, { fontSize: 12 });
      y += 10;

      // Prepare report content for display
      const content = `
Syllabus Improvement Report

File Processed: ${fileName}

Overall Score: ${enhancement?.scoring?.score || "N/A"}/100
Bloom Coverage: ${enhancement?.scoring?.bloom_coverage || "N/A"}%
Alignment Score: ${enhancement?.scoring?.alignment_score ? Math.round(enhancement.scoring.alignment_score * 100) : "N/A"}%
Completeness Score: ${enhancement?.scoring?.completeness_score ? Math.round(enhancement.scoring.completeness_score * 100) : "N/A"}%

Original Learning Outcomes:
${originalOutcomes.length === 0 ? "No objectives provided." : originalOutcomes.map((item) => `- ${item}`).join("\n")}

Improved Learning Outcomes:
${improvedOutcomes.length === 0 ? "No improved outcomes generated." : improvedOutcomes.map((item) => `- ${item}`).join("\n")}

Bloom's Taxonomy Analysis
- Found Levels: ${foundLevels.join(", ") || "N/A"}
- Missing Levels: ${missingLevels.join(", ") || "N/A"}

Misalignments:
${misalignments.length === 0 ? "No misalignments detected." : misalignments.map((item) => `- ${item}`).join("\n")}

Suggestions:
${suggestions.length === 0 ? "No suggestions provided." : suggestions.map((item) => `- ${item}`).join("\n")}
      `;

      setReportContent(content.trim());
      return doc;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/syllabus/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        if (data.error.includes("GROQ_API_KEY") || data.error.includes("Groq client")) {
          setError("The server is misconfigured. Please contact the administrator.");
        } else if (data.error.includes("No text")) {
          setError("The uploaded file contains no readable text. Please upload a valid syllabus file.");
        } else {
          setError(data.error || "An error occurred while processing the file.");
        }
        throw new Error(data.error);
      }

      setBackendResponse(data);
      await generateImprovedReport(data);
      setReportGenerated(true);
    } catch (error) {
      console.error("Error during file upload:", error);
      setError("Failed to process the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!backendResponse) {
      setError("No report data available to download.");
      return;
    }

    try {
      const pdf = await generateImprovedReport(backendResponse);
      const fileName = file?.name
        ? `syllabus_improvement_${file.name.replace(/\.[^/.]+$/, "")}.pdf`
        : "syllabus_improvement_report.pdf";
      pdf.save(fileName);
    } catch (error) {
      setError("Failed to download report. Please try again.");
      console.error(error);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset? All current data will be lost.")) {
      setFile(null);
      setReportGenerated(false);
      setReportContent("");
      setBackendResponse(null);
      setError(null);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#3b0000] via-[#4d0000] to-[#4e0000] px-4">
      {/* Help Button */}
      <Button 
        onClick={() => setShowInstructions(!showInstructions)}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
        aria-label="Show instructions"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>
      
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">How to Use the Syllabus Improvement Tool</h2>
                <Button 
                  onClick={() => setShowInstructions(false)}
                  variant="ghost" 
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <span className="sr-only">Close</span>
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Upload className="mr-2 h-5 w-5 text-red-700" />
                    Upload Your Syllabus
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload your syllabus document in either PDF or DOC format. You can click the upload area to browse your files or simply drag and drop your document directly onto the designated area.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Loader2 className="mr-2 h-5 w-5 text-red-700" />
                    Analysis Process
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Once you've uploaded your syllabus, click the "Analyze Syllabus" button. Our system will process your document, extracting learning objectives, assessments, and other key components. The analysis uses advanced AI to evaluate your syllabus against best practices in curriculum design.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-red-700" />
                    Understanding Your Results
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The analysis provides:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    <li><strong>Improved Learning Outcomes</strong> - Rewrites your existing outcomes using best practices and Bloom's taxonomy verbs</li>
                    <li><strong>Bloom's Taxonomy Analysis</strong> - Identifies which cognitive levels are present and missing</li>
                    <li><strong>Misalignments</strong> - Points out inconsistencies between objectives and assessments</li>
                    <li><strong>Scoring</strong> - Provides numerical evaluations across multiple dimensions</li>
                    <li><strong>Suggestions</strong> - Offers specific recommendations for improvement</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Download className="mr-2 h-5 w-5 text-red-700" />
                    Using Your Report
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    After reviewing your results, you can download a comprehensive PDF report. This report includes all analysis details and specific recommendations for improving your syllabus. Use these insights to refine your learning objectives, better align assessments, and ensure comprehensive coverage of cognitive skills.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-red-700" />
                    Best Practices for Syllabi
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    <li>Use action verbs from Bloom's taxonomy for learning outcomes</li>
                    <li>Ensure alignment between learning objectives and assessment methods</li>
                    <li>Include a variety of cognitive levels in your learning objectives</li>
                    <li>Make objectives measurable and specific</li>
                    <li>Create clear connections between course content and assessments</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white py-2 rounded-lg"
                >
                  Close Instructions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center pt-2 pb-10 space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-5xl font-extrabold leading-tight text-white drop-shadow-lg text-center">
            <span className="text-white">Syllabus</span> <span className="text-red-300">Improvement</span>
          </h1>
          <p className="text-white/80 text-xl text-center max-w-3xl">
            Upload your syllabus for AI-powered analysis and get actionable recommendations
          </p>
        </div>

        <Card className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-300 dark:border-gray-700 shadow-xl rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center space-y-1">
              <h2 className="text-center text-gray-800 dark:text-gray-200 text-2xl font-bold">
                Syllabus Analysis Tool
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                Upload your syllabus in PDF or DOC format for comprehensive evaluation and improvement suggestions
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {error && (
              <div className="flex items-center space-x-2 p-4 mb-6 bg-red-100 dark:bg-red-900/30 rounded-lg border-l-4 border-red-500">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {!reportGenerated ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div
                  className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
                    isDragging
                      ? "border-red-400 bg-red-100 dark:bg-red-900/30"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-full"
                    aria-label="Upload syllabus file"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      {file ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-16 h-16 text-green-500" />
                          <div className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-xs truncate">
                              {file.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-16 h-16 text-red-400 dark:text-red-500" />
                          <div className="space-y-2 text-center">
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                              Drop your syllabus here or click to browse
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Supports PDF, DOC, or DOCX files
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-describedby="file-upload-help"
                    />
                    <span id="file-upload-help" className="sr-only">
                      Upload a PDF or DOC file containing your syllabus
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={!file || isLoading}
                  className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white text-lg py-6 rounded-full shadow-2xl transition-transform transform hover:scale-105 uppercase flex items-center justify-center space-x-2 disabled:opacity-50"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing Your Syllabus...</span>
                    </>
                  ) : (
                    <span>Analyze Syllabus</span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col space-y-8">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                        Syllabus Improvement Report
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>File Processed:</strong> {file?.name || "Unknown File"}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        onClick={handleDownload}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md flex items-center space-x-2 px-4 py-2"
                        aria-label="Download report as PDF"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shadow-md flex items-center space-x-2 px-4 py-2"
                        aria-label="Reset form"
                      >
                        <RotateCw className="w-4 h-4" />
                        <span>New Analysis</span>
                      </Button>
                    </div>
                  </div>

                  {/* Evaluation Scores */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2">
                      Evaluation Scores
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <span className="w-40 text-sm text-gray-700 dark:text-gray-300">Overall Score:</span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-800 h-full rounded-full" 
                            style={{ width: `${backendResponse?.enhancement?.scoring?.score || 0}%` }}
                          ></div>
                        </div>
                        <span className="ml-4 text-sm text-gray-700 dark:text-gray-300">
                          {backendResponse?.enhancement?.scoring?.score || "N/A"}/100
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-40 text-sm text-gray-700 dark:text-gray-300">Bloom Coverage:</span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-600 h-full rounded-full" 
                            style={{ width: `${backendResponse?.enhancement?.scoring?.bloom_coverage || 0}%` }}
                          ></div>
                        </div>
                        <span className="ml-4 text-sm text-gray-700 dark:text-gray-300">
                          {backendResponse?.enhancement?.scoring?.bloom_coverage || "N/A"}%
                        </span>
                      </div>
                      
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-md mb-8">
                    <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      Executive Summary
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Your syllabus received an overall score of <strong>{backendResponse?.enhancement?.scoring?.score || "N/A"}/100</strong>. 
                      {backendResponse?.enhancement?.bloom_analysis?.missing_levels?.length > 0 ? 
                        ` We identified ${backendResponse?.enhancement?.bloom_analysis?.missing_levels?.length} missing Bloom's taxonomy levels` : 
                        " Your syllabus has excellent Bloom's taxonomy coverage"}
                      {backendResponse?.enhancement?.misalignments?.length > 0 ? 
                        ` and ${backendResponse?.enhancement?.misalignments?.length} misalignments between objectives and assessments.` : 
                        " and good alignment between objectives and assessments."}
                      {" Review the detailed analysis below for specific improvement recommendations."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                      <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Original Learning Outcomes
                      </h3>
                      {backendResponse?.syllabus?.content?.objectives?.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No objectives provided in the syllabus.
                        </p>
                      ) : (
                        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                          {backendResponse?.syllabus?.content?.objectives?.map((item, index) => (
                            <li key={index} className="mb-1">{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg shadow">
                      <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Improved Learning Outcomes
                      </h3>
                      {backendResponse?.enhancement?.improved_outcomes?.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No improved outcomes generated.
                        </p>
                      ) : (
                        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                          {backendResponse?.enhancement?.improved_outcomes?.map((item, index) => (
                            <li key={index} className="mb-1">{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <Collapsible className="mb-4">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-red-700" />
                        Bloom's Taxonomy Analysis
                      </h3>
                      <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Taxonomy Levels Coverage
                          </h4>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                            {["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"].map((level) => {
                              const isFound = backendResponse?.enhancement?.bloom_analysis?.found_levels?.includes(level);
                              return (
                                <div 
                                  key={level}
                                  className={`px-4 py-3 rounded-md text-white text-center text-base font-medium ${
                                    isFound ? 'bg-green-600' : 'bg-red-500'
                                  }`}
                                >
                                  {level}
                                  {isFound ? 
                                    <CheckCircle className="inline ml-2 w-5 h-5" /> : 
                                    <AlertCircle className="inline ml-2 w-5 h-5" />
                                  }
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Missing Levels
                          </h4>
                          {backendResponse?.enhancement?.bloom_analysis?.missing_levels?.length === 0 ? (
                            <p className="text-base text-green-600 dark:text-green-400 mt-1">
                              No missing levels - excellent coverage!
                            </p>
                          ) : (
                            <div className="space-y-2 mt-2">
                              {backendResponse?.enhancement?.bloom_analysis?.missing_levels?.map((level, index) => (
                                <div key={index} className="text-base bg-red-50 dark:bg-red-900/20 p-2 rounded border-l-2 border-red-500">
                                  <span className="font-medium">{level}:</span> This cognitive level should be incorporated 
                                  for comprehensive learning outcomes.
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible className="mb-4">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-700" />
                        Misalignments and Suggestions
                      </h3>
                      <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Identified Misalignments
                          </h4>
                          {backendResponse?.enhancement?.misalignments?.length === 0 ? (
                            <p className="text-base text-green-600 dark:text-green-400 mt-1">
                              No misalignments detected - excellent alignment between objectives and assessments!
                            </p>
                          ) : (
                            <ul className="list-disc pl-5 text-base text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                              {backendResponse?.enhancement?.misalignments?.map((item, index) => (
                                <li key={index} className="p-2 bg-red-50 dark:bg-red-900/10 rounded">{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Improvement Suggestions
                          </h4>
                          {backendResponse?.enhancement?.suggestions?.length === 0 ? (
                            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                              No additional suggestions provided.
                            </p>
                          ) : (
                            <ul className="mt-2 space-y-2">
                              {backendResponse?.enhancement?.suggestions?.map((item, index) => (
                                <li key={index} className="flex items-start p-2 bg-green-50 dark:bg-green-900/10 rounded text-base">
                                  <span className="bg-green-100 text-green-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-4 rounded-xl shadow-md flex items-center justify-center space-x-2"
                    aria-label="Download report as PDF"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF Report</span>
                  </Button>

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 py-4 rounded-xl shadow-md flex items-center justify-center space-x-2"
                    aria-label="Reset form"
                  >
                    <RotateCw className="w-5 h-5" />
                    <span>Analyze Another Syllabus</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;