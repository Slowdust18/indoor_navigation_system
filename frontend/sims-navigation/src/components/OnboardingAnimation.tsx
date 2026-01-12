import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function OnboardingAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })

      // RESET
      tl.set(".qr-line, .destination, .route, .dot", { opacity: 0 })
      tl.set(".phone-screen", { backgroundColor: "#f8fafc" })

      // STEP 1 — QR Scan
      tl.to(".qr-line", {
        opacity: 1,
        y: 100,
        duration: 1,
        ease: "power2.inOut",
      })
      tl.to(".qr-line", { opacity: 0, duration: 0.3 })

      // STEP 2 — Destination selection
      tl.to(".destination", {
        opacity: 1,
        scale: 1,
        duration: 0.4,
      })
      tl.to(".destination", {
        backgroundColor: "#2563eb",
        color: "#fff",
        duration: 0.3,
      })
      tl.to(".destination", {
        backgroundColor: "#e5e7eb",
        color: "#111827",
        duration: 0.3,
      })

      // STEP 3 — Route drawing
      tl.to(".route", {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      })
      tl.to(".dot", {
        opacity: 1,
        motionPath: {
          path: ".route",
          align: ".route",
        },
        duration: 1.2,
        ease: "power1.inOut",
      })

      tl.to({}, { duration: 0.6 }) // pause
      tl.to(".route, .dot, .destination", { opacity: 0, duration: 0.3 })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={styles.wrapper}>
      <div style={styles.phone}>
        <div className="phone-screen" style={styles.screen}>
          {/* QR */}
          <div style={styles.qrBox}>
            <div className="qr-line" style={styles.qrLine} />
          </div>

          {/* Destination */}
          <div className="destination" style={styles.destination}>
            X-Ray Department
          </div>

          {/* Route */}
          <svg width="180" height="120" style={styles.map}>
            <path
              className="route"
              d="M10 100 L70 60 L130 70 L170 20"
              fill="none"
              stroke="#f59a23"
              strokeWidth="4"
              strokeDasharray="220"
              strokeDashoffset="220"
              strokeLinecap="round"
            />
            <circle
              className="dot"
              cx="10"
              cy="100"
              r="5"
              fill="#2563eb"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "3rem 0",
  },

  phone: {
    width: 260,
    height: 520,
    borderRadius: 32,
    background: "#111827",
    padding: 10,
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },

  screen: {
    height: "100%",
    borderRadius: 24,
    padding: 12,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  qrBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    background: "#e5e7eb",
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
  },

  qrLine: {
    width: "100%",
    height: 3,
    background: "#f59a23",
    position: "absolute",
    top: 0,
  },

  destination: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#e5e7eb",
    textAlign: "center",
    fontSize: 12,
    fontWeight: 500,
    color: "#111827",
    transform: "scale(0.95)",
    opacity: 0,
    flexShrink: 0,
  },

  map: {
    width: 180,
    height: 120,
    flexShrink: 0,
  },
}
