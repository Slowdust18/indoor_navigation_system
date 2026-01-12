import React from "react";
import { QrCode, MapPin, ArrowRight, Sparkles } from "lucide-react";
import "./Guidance.css";

export default function Guidance() {
  return (
    <div className="guidance-container">
      <div className="guidance-card">
        {/* Animated background elements */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        {/* Main content */}
        <div className="guidance-content">
          {/* QR Code Section */}
          <div className="qr-section">
            <div className="qr-icon-container">
              <QrCode className="qr-icon" size={80} />
              <div className="qr-pulse"></div>
              <div className="qr-glow"></div>
            </div>

            <h2 className="guidance-title">
              Scan to Navigate
            </h2>

            <p className="guidance-subtitle">
              Point your camera at the QR code to get started
            </p>
          </div>

          {/* Arrow Animation */}
          <div className="arrow-section">
            <ArrowRight className="arrow-icon" size={32} />
            <div className="arrow-trail"></div>
          </div>

          {/* Routes Preview */}
          <div className="routes-section">
            <div className="routes-header">
              <MapPin className="map-icon" size={24} />
              <span className="routes-title">Your Route Awaits</span>
              <Sparkles className="sparkle-icon" size={20} />
            </div>

            <div className="route-preview">
              <div className="route-line">
                <div className="route-point start-point">
                  <MapPin size={16} />
                  <span>Entrance</span>
                </div>

                <div className="route-path">
                  <div className="path-segment"></div>
                  <div className="path-segment"></div>
                  <div className="path-segment"></div>
                </div>

                <div className="route-point end-point">
                  <MapPin size={16} />
                  <span>Destination</span>
                </div>
              </div>
            </div>

            <p className="routes-description">
              Get personalized indoor navigation routes instantly
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="guidance-footer">
          <div className="scan-indicator">
            <div className="scan-dot"></div>
            <span>Ready to scan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
