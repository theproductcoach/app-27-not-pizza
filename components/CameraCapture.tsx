import React, { useRef } from "react";

type Props = {
  onCapture: (dataUrl: string) => void;
};

const CameraCapture: React.FC<Props> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        style={{
          padding: "16px 32px",
          fontSize: 20,
          borderRadius: 12,
          background: "#43a047",
          color: "#fff",
          border: "none",
          fontWeight: "bold",
          marginBottom: 12,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        Take a Picture
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CameraCapture;
