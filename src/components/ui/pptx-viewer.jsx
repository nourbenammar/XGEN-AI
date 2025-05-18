"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ImageIcon,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { courseGeneratorAPI } from "@/services/api";

export function PowerPointViewer({ courseId, filePath, onDownload }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchSlides();
    console.log("PowerPoint viewer initialized for:", filePath);
  }, [courseId, filePath]);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      console.log("Fetching slides for:", courseId, filePath);
      const data = await courseGeneratorAPI.getCourseSlides(courseId, filePath);
      console.log("Slides data received:", data);

      // Check for errors in the response
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.slides && data.slides.length > 0) {
        setSlides(data.slides);
        setError(null);
      } else {
        console.warn("No slides found in response:", data);
        setError("No slides found in the presentation.");
        setSlides([]);
      }
    } catch (err) {
      console.error("Failed to load slides:", err);
      setError(`Failed to load slide content: ${err.message}`);
      setSlides([]);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    fetchSlides();
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const renderSlideContent = (content) => {
    if (!content || content.length === 0) {
      return <p className="text-slate-500 italic">No content in this slide</p>;
    }

    return (
      <ul className="space-y-3">
        {content.map((item, i) => {
          if (!item || !item.text) return null;

          // Get text style
          const textStyle = {};
          if (item.style) {
            if (item.style.bold) textStyle.fontWeight = 600;
            if (item.style.italic) textStyle.fontStyle = "italic";
            if (item.style.color) textStyle.color = item.style.color;
            if (item.style.size) {
              // Cap the font size to prevent overflow issues
              const size = Math.min(item.style.size, 24);
              textStyle.fontSize = `${size}px`;
            }
          }

          // Add indentation based on level
          const paddingLeft = item.level > 0 ? `${item.level * 1.5}rem` : "0";

          return (
            <li key={i} className="flex items-start" style={{ paddingLeft }}>
              {item.bullet || item.level > 0 ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-3 mt-2 flex-shrink-0"></div>
                  <div className="text-lg leading-normal" style={textStyle}>
                    {item.text}
                  </div>
                </>
              ) : (
                <div className="text-lg leading-normal" style={textStyle}>
                  {item.text}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderSlide = (slide) => {
    if (!slide) {
      return (
        <div className="bg-white p-10 rounded-lg border border-slate-200 h-full flex items-center justify-center">
          <p className="text-slate-400">Slide not available</p>
        </div>
      );
    }

    // Handle background styling
    const getBackgroundStyle = () => {
      if (!slide.background) return { backgroundColor: "#FFFFFF" };

      if (
        slide.background.type === "gradient" &&
        slide.background.gradient &&
        slide.background.gradient.length >= 2
      ) {
        // Sort gradient stops by position
        const sortedStops = [...slide.background.gradient].sort(
          (a, b) => a.position - b.position
        );
        return {
          background: `linear-gradient(135deg, ${sortedStops
            .map((stop) => stop.color)
            .join(", ")})`,
        };
      }

      return {
        backgroundColor: slide.background.color || "#FFFFFF",
      };
    };

    // Render based on slide type
    switch (slide.slide_type) {
      case "title":
        return (
          <div
            className="p-10 rounded-lg h-full flex flex-col justify-center items-center"
            style={getBackgroundStyle()}
          >
            <h1 className="text-4xl font-bold text-center mb-8">
              {slide.title}
            </h1>
            <div className="space-y-4">
              {slide.content &&
                slide.content.map((item, index) => (
                  <p key={index} className="text-2xl text-center">
                    {item.text}
                  </p>
                ))}
            </div>
            {slide.image && (
              <div className="mt-8">
                <img src={slide.image} alt="Slide image" className="max-h-64" />
              </div>
            )}
          </div>
        );

      case "section":
        return (
          <div
            className="p-10 rounded-lg h-full flex flex-col justify-center items-center"
            style={getBackgroundStyle()}
          >
            <h2 className="text-4xl font-bold text-center text-slate-800">
              {slide.title}
            </h2>
            <div className="mt-8 max-w-2xl">
              {renderSlideContent(slide.content)}
            </div>
            {slide.image && (
              <div className="mt-8">
                <img src={slide.image} alt="Slide image" className="max-h-64" />
              </div>
            )}
          </div>
        );

      default: // content slides
        return (
          <div
            className="p-10 rounded-lg border border-slate-200 h-full flex flex-col"
            style={getBackgroundStyle()}
          >
            {/* Only render the title once */}
            <h2 className="text-3xl font-semibold mb-6 text-slate-800">
              {slide.title}
            </h2>

            {/* Content with scrolling for overflow */}
            <div className="overflow-auto flex-grow">
              {renderSlideContent(slide.content)}
            </div>

            {slide.image && (
              <div className="mt-6 flex justify-center">
                <img src={slide.image} alt="Slide image" className="max-h-48" />
              </div>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-12">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin mb-4" />
        <p className="text-slate-500">Loading presentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-slate-700 font-semibold text-lg mb-2">
          Error Loading Presentation
        </p>
        <p className="text-slate-500 mb-6 text-center max-w-md">{error}</p>
        <div className="space-x-3">
          {retrying ? (
            <Button disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Retrying...
            </Button>
          ) : (
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          )}
          <Button onClick={onDownload} className="bg-red-500 hover:bg-red-600">
            <Download className="h-4 w-4 mr-2" /> Download Full Presentation
          </Button>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-12">
        <ImageIcon className="h-16 w-16 text-slate-300 mb-4" />
        <p className="text-slate-500 mb-4">
          No slides available in this presentation
        </p>
        <div className="space-x-3">
          {retrying ? (
            <Button disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Retrying...
            </Button>
          ) : (
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          )}
          <Button onClick={onDownload} className="bg-red-500 hover:bg-red-600">
            <Download className="h-4 w-4 mr-2" /> Download Full Presentation
          </Button>
        </div>
      </div>
    );
  }

  const totalSlides = slides.length;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="mb-4 text-center">
        <Button onClick={onDownload} className="bg-red-500 hover:bg-red-600">
          <Download className="h-4 w-4 mr-2" /> Download Presentation
        </Button>
      </div>

      {/* Slide container with adjusted height to fill available space */}
      <div className="w-full max-w-4xl aspect-[16/9] bg-white shadow-md rounded-lg overflow-hidden mb-4 flex-grow">
        {renderSlide(slides[currentSlide])}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between w-full max-w-4xl py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>

        <div className="text-sm text-slate-500">
          Slide {currentSlide + 1} of {totalSlides}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className="flex items-center"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
