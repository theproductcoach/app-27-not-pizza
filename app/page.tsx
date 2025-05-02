"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CameraCapture from "../components/CameraCapture";
import ReactConfetti from "react-confetti";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    isPizza: boolean;
    url: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Listen for window resize and set size for confetti
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      // Set initial size
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Update on resize
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleSubmit = async () => {
    if (!image) return;

    setIsUploading(true);
    setError(null);

    try {
      // Convert the base64 data URL to a Blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      // Upload to our API
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      // Now analyze the image with OpenAI
      setIsAnalyzing(true);
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: uploadData.url }),
      });

      const analyzeData = await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        throw new Error(analyzeData.error || "Failed to analyze image");
      }

      // Set the result with the real analysis
      setResult({
        isPizza: analyzeData.isPizza,
        url: uploadData.url,
      });
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try again.");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  // Render the result screen if we have a result
  if (result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `url('/bg-hero.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Confetti animation for pizza success */}
        {result.isPizza && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
            colors={["#f44336", "#e53935", "#ff7043", "#ffeb3b", "#4caf50"]}
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2vh",
          }}
        >
          <h1
            style={{
              fontSize: "2.8rem",
              fontWeight: "900",
              color: result.isPizza ? "#4caf50" : "#f44336",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "12px 28px",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              textTransform: "uppercase",
              letterSpacing: "2px",
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              marginBottom: "0.5vh",
            }}
          >
            {result.isPizza ? "Pizza!" : "Not pizza!"}
          </h1>

          {/* Pizza icon with appropriate styling */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: result.isPizza
                ? "rgba(76, 175, 80, 0.2)"
                : "rgba(244, 67, 54, 0.2)",
              border: `4px solid ${result.isPizza ? "#4caf50" : "#f44336"}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              margin: "0.5vh 0",
              overflow: "hidden",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                src="/cartoon_pizza.png"
                alt="Pizza"
                fill
                style={{
                  objectFit: "contain",
                  opacity: result.isPizza ? 1 : 0.7,
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* X overlay for "Not Pizza" */}
            {!result.isPizza && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "80%",
                    height: "80%",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "100%",
                      height: "6px",
                      background: "#f44336",
                      borderRadius: "3px",
                      transform: "translate(-50%, -50%) rotate(45deg)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "100%",
                      height: "6px",
                      background: "#f44336",
                      borderRadius: "3px",
                      transform: "translate(-50%, -50%) rotate(-45deg)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              marginTop: "0.5vh",
              position: "relative",
              width: 300,
              height: 300,
            }}
          >
            <Image
              src={result.url}
              alt="Analyzed"
              fill
              style={{
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>

          <div
            style={{
              marginTop: "2vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                padding: "12px 40px",
                fontSize: 18,
                borderRadius: 8,
                background: "#757575",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
              }}
              onClick={handleRetry}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `url('/bg-hero.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "5vh",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "900",
            color: "#e53935",
            background: "rgba(255, 255, 255, 0.9)",
            padding: "12px 28px",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            textAlign: "center",
          }}
        >
          Is it pizza?
        </h1>

        {!image ? (
          <CameraCapture onCapture={setImage} />
        ) : (
          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", width: 300, height: 300 }}>
              <Image
                src={image}
                alt="Preview"
                fill
                style={{
                  objectFit: "cover",
                  borderRadius: 16,
                  boxShadow: "0 2px 12px #0002",
                }}
              />

              {/* Analyzing overlay */}
              {isAnalyzing && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      border: "5px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "5px solid white",
                      borderRadius: "50%",
                      marginBottom: "10px",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Analyzing...
                  <style jsx>{`
                    @keyframes spin {
                      0% {
                        transform: rotate(0deg);
                      }
                      100% {
                        transform: rotate(360deg);
                      }
                    }
                  `}</style>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  fontSize: 18,
                  borderRadius: 8,
                  background: "#ff7043",
                  color: "#fff",
                  border: "none",
                  fontWeight: "bold",
                }}
                onClick={handleSubmit}
                disabled={isUploading || isAnalyzing}
              >
                {isUploading ? "Uploading..." : "Submit"}
              </button>
              <button
                style={{
                  padding: "12px 24px",
                  fontSize: 18,
                  borderRadius: 8,
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  fontWeight: "bold",
                }}
                onClick={handleRetry}
                disabled={isUploading || isAnalyzing}
              >
                Retake
              </button>
            </div>
            {error && (
              <div
                style={{
                  marginTop: 12,
                  color: "#d32f2f",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
