import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import Header from "../components/Header";
import Guidance from "../components/OnboardingAnimation";
import PWAInstallPrompt from "../components/PWAInstallPrompt";

export default function Landing() {
  const navigate = useNavigate(); // Initialize the hook
  const [isQrOpen, setIsQrOpen] = useState(false); // State to handle QR visibility

  // Function to handle page navigation
  const handleNavigate = () => {
    navigate("/navigation"); // Replace with your actual route path
  };

  // Function to toggle QR display
  const toggleQr = () => {
    setIsQrOpen(!isQrOpen);
  };

  return (
    <>
      <Header />
      <Guidance />

      {/* Button Container */}
      <div style={styles.container}>
        <button onClick={toggleQr} style={styles.button}>
          {isQrOpen ? "Close QR" : "Open QR"}
        </button>

        <button onClick={handleNavigate} style={styles.button}>
          Go to Page
        </button>
      </div>

      {/* Conditional Rendering for QR Code */}
      {isQrOpen && (
        <div style={styles.qrContainer}>
          <p>Scan the code below:</p>
          {/* Replace the image source below with your actual QR code logic/image */}
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example" 
            alt="QR Code" 
          />
        </div>
      )}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </>
  );
}

// Basic styling object for demonstration
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
    padding: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  qrContainer: {
    textAlign: "center",
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "fit-content",
    margin: "20px auto",
  }
};