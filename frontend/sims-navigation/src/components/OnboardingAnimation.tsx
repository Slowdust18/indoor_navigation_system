import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { ScanLine, MapPin, Navigation, Search, CheckCircle2 } from "lucide-react"

gsap.registerPlugin(MotionPathPlugin)

export default function OnboardingAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
      
      const textDuration = 0.5
      
      // --- INITIAL STATE ---
      tl.set(".scene", { autoAlpha: 0, scale: 0.9 })
      tl.set(".scene-1", { autoAlpha: 1, scale: 1 })
      tl.set(".scanner-line", { scaleX: 0, opacity: 0 })
      tl.set(".scan-overlay", { opacity: 0 })
      tl.set(".list-item", { x: -20, opacity: 0 })
      tl.set(".path-line", { strokeDasharray: 300, strokeDashoffset: 300 })
      tl.set(".nav-dot", { opacity: 0 })
      tl.set(".destination-marker", { scale: 0, opacity: 0 })
      tl.set(".status-text", { text: "Scan QR Code" }) // Fallback initialization
      
      // Update text helper
      const updateText = (text: string) => {
        gsap.to(".status-text", {
          y: -10,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            const el = document.querySelector(".status-text")
            if (el) el.textContent = text
            gsap.set(".status-text", { y: 10 })
            gsap.to(".status-text", { y: 0, opacity: 1, duration: 0.3 })
          }
        })
      }

      // --- SCENE 1: QR SCAN ---
      // Animate scanner line
      tl.to(".scanner-line", { scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.out" })
      tl.to(".scanner-line", {
        y: 110, // Scan down
        duration: 1.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1
      })
      
      // Successful scan effect
      tl.to(".scan-overlay", { opacity: 1, duration: 0.1 })
      tl.to(".scan-overlay", { opacity: 0, duration: 0.3 })
      tl.to(".qr-icon", { scale: 1.1, color: "#10b981", duration: 0.3, ease: "back.out(1.7)" }, "-=0.3")
      
      // --- TRANSITION 1 -> 2 ---
      tl.to(".scene-1", { 
        autoAlpha: 0, 
        scale: 1.1, 
        filter: "blur(4px)",
        duration: 0.6, 
        ease: "power2.in" 
      }, "+=0.5")
      
      tl.call(() => updateText("Select Destination"))
      
      tl.to(".scene-2", { 
        autoAlpha: 1, 
        scale: 1, 
        filter: "blur(0px)",
        duration: 0.6, 
        ease: "power2.out" 
      }, "-=0.2")

      // --- SCENE 2: SELECTION ---
      // Stagger in list items
      tl.to(".list-item", {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.2)"
      })
      
      // Simulate click on "X-Ray Room" (2nd item)
      const targetItem = ".list-item:nth-child(2)"
      tl.to(targetItem, { scale: 0.95, duration: 0.1, ease: "power1.inOut" }, "+=0.5")
      tl.to(targetItem, { 
        scale: 1.02, 
        backgroundColor: "#3b82f6", 
        color: "#ffffff", 
        borderColor: "#3b82f6",
        duration: 0.2 
      })
      
      // --- TRANSITION 2 -> 3 ---
      tl.to(".scene-2", { 
        autoAlpha: 0, 
        x: -50,
        duration: 0.6, 
        ease: "power2.in" 
      }, "+=0.5")
      
      tl.call(() => updateText("Optimal Route Engine"))
      
      tl.to(".scene-3", { 
        autoAlpha: 1, 
        scale: 1,
        x: 0,
        duration: 0.6, 
        ease: "elastic.out(1, 0.9)" 
      }, "-=0.3")

      // --- SCENE 3: NAVIGATION ---
      // Reveal destination marker
      tl.to(".destination-marker", { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" })
      
      // Draw path
      tl.to(".path-line", {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power1.inOut"
      })
      
      // Move dot along path
      tl.to(".nav-dot", { opacity: 1, duration: 0.2 }, "-=1.5")
      tl.to(".nav-dot", {
        motionPath: {
          path: ".path-line",
          align: ".path-line",
          alignOrigin: [0.5, 0.5]
        },
        duration: 1.5,
        ease: "power1.inOut"
      }, "-=1.5")
      
      // Pulse at destination
      tl.to(".destination-marker", { 
        scale: 1.2, 
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        duration: 0.4,
        yoyo: true,
        repeat: 3 
      })

      // Fade out for loop
      tl.to(".scene-3, .status-text", { autoAlpha: 0, duration: 0.5, delay: 1 })
      
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={styles.wrapper}>
      {/* Phone Frame */}
      <div style={styles.phone}>
        {/* Notch */}
        <div style={styles.notch}></div>
        
        {/* Screen */}
        <div className="phone-screen" style={styles.screen}>
          
          {/* Status Header text */}
          <div style={styles.header}>
            <p className="status-text" style={styles.statusText}>Scan QR Code</p>
          </div>

          {/* === SCENE 1: QR SCAN === */}
          <div className="scene scene-1" style={styles.scene}>
            <div style={styles.qrContainer}>
              <ScanLine className="qr-icon" size={80} color="#374151" />
              {/* Scanner Line */}
              <div className="scanner-line" style={styles.scannerLine}></div>
              {/* Scan Overlay flash */}
              <div className="scan-overlay" style={styles.scanOverlay}></div>
            </div>
          </div>

          {/* === SCENE 2: DESTINATION SELECTION === */}
          <div className="scene scene-2" style={{...styles.scene, ...styles.listScene}}>
             <div style={styles.searchBar}>
                <Search size={14} color="#9ca3af" />
                <div style={styles.searchPlaceholder} />
             </div>
             
             <div className="list-item" style={styles.listItem}>
                <div style={styles.iconBox}><Navigation size={14} /></div>
                <span>Reception</span>
             </div>
             <div className="list-item" style={styles.listItem}>
                <div style={styles.iconBox}><CheckCircle2 size={14} /></div>
                <span>X-Ray Room</span>
             </div>
             <div className="list-item" style={styles.listItem}>
                <div style={styles.iconBox}><Navigation size={14} /></div>
                <span>Pharmacy</span>
             </div>
          </div>

          {/* === SCENE 3: NAVIGATION MAP === */}
          <div className="scene scene-3" style={styles.scene}>
             <div style={styles.mapContainer}>
                {/* Simulated Walls */}
                <svg width="100%" height="100%" viewBox="0 0 200 280" style={styles.mapSvg}>
                   <rect x="20" y="20" width="60" height="80" rx="4" fill="#e5e7eb" />
                   <rect x="120" y="20" width="60" height="60" rx="4" fill="#e5e7eb" />
                   <rect x="20" y="140" width="60" height="100" rx="4" fill="#e5e7eb" />
                   <rect x="120" y="120" width="60" height="120" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" /> {/* Dest. room */}
                   
                   {/* The Path */}
                   <path 
                      className="path-line"
                      d="M 50 260 L 50 120 L 150 120 L 150 180"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                   />
                </svg>
                
                {/* Navigation Dot */}
                <div className="nav-dot" style={styles.navDot}>
                   <Navigation size={12} color="white" style={{transform: 'rotate(0deg)'}} />
                </div>
                
                {/* Destination Marker */}
                <div className="destination-marker" style={styles.destMarker}>
                   <MapPin size={24} color="#ef4444" fill="#ef4444" />
                </div>
                
                {/* Floating info card */}
                <div style={styles.routeInfo}>
                   <span style={{fontSize: 10, color: '#6b7280'}}>Distance</span>
                   <span style={{fontSize: 14, fontWeight: 'bold', color: '#1f2937'}}>45m</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  phone: {
    width: 280,
    height: 500, // Slightly reduced to fit frames better while keeping ratio
    background: "#111827",
    borderRadius: 40,
    padding: 12,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 2px #374151",
    position: 'relative',
  },
  notch: {
    position: 'absolute',
    top: 12,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 24,
    background: '#111827',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 20,
  },
  screen: {
    width: "100%",
    height: "100%",
    background: "#f3f4f6", // Light gray background
    borderRadius: 30,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    height: 80,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 16,
    zIndex: 10,
    background: "linear-gradient(to bottom, #ffffff 60%, transparent)",
  },
  statusText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1f2937",
    margin: 0,
    fontFamily: "sans-serif",
  },
  scene: {
    position: "absolute",
    top: 60, // below header
    left: 0,
    width: "100%",
    height: "calc(100% - 60px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    visibility: "hidden" // GSAP controls this
  },
  // Scene 1 Styles
  qrContainer: {
    width: 160,
    height: 160,
    background: "#ffffff",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  scannerLine: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    height: 2,
    background: "#ef4444", // Red laser scanner color
    boxShadow: "0 0 8px 1px rgba(239, 68, 68, 0.6)",
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(16, 185, 129, 0.3)", // Green success overlay
    borderRadius: 20,
  },
  
  // Scene 2 Styles
  listScene: {
      justifyContent: "flex-start",
      padding: "20px",
      gap: 12,
  },
  searchBar: {
      width: "100%",
      height: 36,
      background: "#e5e7eb",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      gap: 8,
      marginBottom: 10
  },
  searchPlaceholder: {
      width: "60%",
      height: 6,
      background: "#d1d5db",
      borderRadius: 4
  },
  listItem: {
      width: "100%",
      padding: "12px 16px",
      background: "#ffffff",
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      border: "1px solid transparent",
      fontSize: 14,
      fontWeight: 500,
      color: "#374151"
  },
  iconBox: {
      width: 28,
      height: 28,
      background: "#f3f4f6",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280"
  },
  
  // Scene 3 Styles
  mapContainer: {
     width: "100%",
     height: "100%",
     position: "relative",
  },
  mapSvg: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
  },
  navDot: {
      position: 'absolute',
      width: 20,
      height: 20,
      background: '#3b82f6',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 10,
      // Centered alignment handled by GSAP motionPath alignOrigin
      top: 0, 
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  destMarker: {
      position: 'absolute',
      bottom: 85, // Approximate based on SVG rect
      right: 48,  // Approximate based on SVG rect
      transformOrigin: 'bottom center',
  },
  routeInfo: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      padding: '8px 16px',
      borderRadius: 20,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 120
  }
}

