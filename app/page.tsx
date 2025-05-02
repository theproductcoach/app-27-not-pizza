"use client";
import Image from "next/image";
import styles from "./page.module.css";
import CameraCapture from "../components/CameraCapture";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffe066",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: 24 }}>
        Is it pizza?
      </h1>
      <CameraCapture onCapture={setImage} />
      {image && (
        <div style={{ marginTop: 24 }}>
          <img
            src={image}
            alt="Preview"
            style={{
              maxWidth: 300,
              borderRadius: 16,
              boxShadow: "0 2px 12px #0002",
            }}
          />
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
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
            >
              Submit
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
              onClick={() => setImage(null)}
            >
              Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
