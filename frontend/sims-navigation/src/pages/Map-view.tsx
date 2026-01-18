import { useMemo, useState, useEffect, type CSSProperties } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CampusMap from '../components/map/floor1';
import floorData from '../data/floor_1.json';
import { findShortestPath } from '../utils/pathfinding';


type Destination = typeof floorData.destinations[keyof typeof floorData.destinations];


const getDestinationData = (id: string | null): Destination | null => {
  return id ? floorData.destinations[id as keyof typeof floorData.destinations] : null;
};

const calculatePath = (originData: Destination | null, destData: Destination | null) => {
  if (!originData || !destData) return { path: '', distance: 0 };

  const pathResult = findShortestPath(originData.nearest_node, destData.nearest_node);
  // Stitch: Origin -> Path -> Dest
  const fullPath = `${originData.x},${originData.y} ${pathResult.path} ${destData.x},${destData.y}`;

  return { path: fullPath, distance: pathResult.distance };
};

// --- Styles Object (Inline CSS) ---
// Color Palette
const colors = {
  primary: '#0f0902', // Blue
  primaryDark: '#0c0c01',
  secondary: '#10B981', // Green
  accent: '#F59E0B', // Orange
  background: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  lightBlue: '#F0F9FF',
  lightGreen: '#F0FDFA',
  lightPurple: '#FAF5FF',
};

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    background: colors.primary,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
    position: 'fixed', // Prevent scroll bounce on mobile
    inset: 0,
  },
  header: {
    background: colors.surface,
    padding: '16px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    zIndex: 30,
    flexShrink: 0,
    borderBottom: `1px solid ${colors.primary}`,
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: colors.primaryDark,
    margin: 0,
    lineHeight: 1.2,
  },
  headerSubtitle: {
    fontSize: '14px',
    color: colors.secondary,
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  mapSection: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.lightBlue,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // height: 'auto',
    // flex: 'none',
    // minHeight: 0,
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    padding: 0,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: '24px 20px 32px 20px',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    zIndex: 30,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderTop: `4px solid ${colors.primary}`,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  distanceBadge: {
    background: colors.accent,
    color: colors.surface,
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: 700,
    fontSize: '14px',
    boxShadow: `0 2px 6px rgba(245, 158, 11, 0.3)`,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  },
  locationsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: colors.lightGreen,
    padding: '16px',
    borderRadius: '16px',
    border: `1px solid ${colors.secondary}`,
  },
  locationNode: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: colors.secondary,
    fontWeight: 600,
  },
  value: {
    fontSize: '15px',
    fontWeight: 600,
    color: colors.text,
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '120px',
  },
  arrowIcon: {
    color: colors.primary,
    fontSize: '18px',
  },
  actionsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '12px',
    marginTop: '4px',
  },
  btnSecondary: {
    padding: '14px',
    borderRadius: '14px',
    border: `1px solid ${colors.secondary}`,
    backgroundColor: colors.lightGreen,
    color: '#065F46',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  btnPrimary: {
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background: colors.primary,
    color: colors.surface,
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 12px rgba(228, 192, 109, 0.3)`,
    transition: 'transform 0.1s',
  },
  floorPill: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: colors.primary,
    padding: '8px 16px',
    borderRadius: '50px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontWeight: 700,
    color: colors.surface,
    fontSize: '14px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  zoomControls: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 10,
  },
  zoomBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: colors.surface,
    border: `1px solid ${colors.secondary}`,
    color: colors.text,
    fontSize: '20px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'background-color 0.2s, transform 0.1s',
  },
};

// --- Components ---

const MapView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const originId = searchParams.get('origin');
  const destId = searchParams.get('dest');

  const originData = getDestinationData(originId);
  const destData = getDestinationData(destId);

  const { path: graphPathString, distance } = useMemo(
    () => calculatePath(originData, destData),
    [originData, destData]
  );

  const [viewBox, setViewBox] = useState('0 0 1400 1000');

  useEffect(() => {
    if (!graphPathString) {
      setViewBox('0 0 1400 1000');
      return;
    }
    const points = graphPathString.split(' ').map(p => p.split(',').map(Number));
    const xs = points.map(p => p[0]);
    const ys = points.map(p => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const padding = 50;
    const width = maxX - minX + 2 * padding;
    const height = maxY - minY + 2 * padding;
    setViewBox(`${minX - padding} ${minY - padding} ${width} ${height}`);
  }, [graphPathString]);

  const handleZoom = (factor: number) => {
    const [minX, minY, width, height] = viewBox.split(' ').map(Number);
    const newWidth = width * factor;
    const newHeight = height * factor;
    const newX = minX + (width - newWidth) / 2;
    const newY = minY + (height - newHeight) / 2;
    setViewBox(`${newX} ${newY} ${newWidth} ${newHeight}`);
  };

  const resetZoom = () => {
     setViewBox('0 0 1400 1000');
  };

  if (!originData || !destData) {
    return (
      <div style={{ ...styles.container, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6B7280' }}>Invalid Route Parameters</p>
        <button onClick={() => navigate('/navigation')} style={{ ...styles.btnSecondary, marginTop: '20px', width: 'auto', padding: '10px 24px' }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* <style> removed */}
      <Header />
      
      <div style={styles.mapSection}>
        {/* Floor Indicator Floating on Map */}
        <div style={styles.floorPill}>
          <span>Floor 1</span>
        </div>

        {/* Zoom Controls */}
        <div style={styles.zoomControls}>
          <button style={styles.zoomBtn} onClick={() => handleZoom(0.8)} title="Zoom In">+</button>
          <button style={styles.zoomBtn} onClick={() => handleZoom(1.25)} title="Zoom Out">−</button>
          <button style={{...styles.zoomBtn, fontSize: '14px'}} onClick={resetZoom} title="Reset View">⟲</button>
        </div>

        <div style={styles.mapWrapper}>
          <CampusMap viewBox={viewBox}>
            {/* 1. The Route Line */}
            {graphPathString && (
              <polyline
                points={graphPathString}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ 
                  filter: 'drop-shadow(0px 2px 4px rgba(59, 130, 246, 0.4))'
                }}
              />
            )}

            {/* 2. Start Marker (Blue) */}
            <g transform={`translate(${originData.x}, ${originData.y})`}>
              {/* Pulse Effect Circle */}
              <circle r="12" fill="rgba(59, 130, 246, 0.2)" />
              <circle r="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
              <text y="-14" textAnchor="middle" fontWeight="700" fontSize="12" fill="#1E3A8A" style={{ textShadow: '0px 0px 4px #fff' }}>
                Start
              </text>
            </g>

            {/* 3. Destination Marker (Orange) */}
            <g transform={`translate(${destData.x}, ${destData.y})`}>
              <path d="M0,-24 C-10,-24 -16,-16 -16,-6 C-16,8 0,24 0,24 C0,24 16,8 16,-6 C16,-16 10,-24 0,-24 Z" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
              <circle cy="-6" r="4" fill="#FFFFFF" />
              <text y="-30" textAnchor="middle" fontWeight="800" fontSize="14" fill="#B45309" style={{ textShadow: '0px 0px 4px #fff' }}>
                End
              </text>
            </g>
          </CampusMap>
        </div>
      </div>

      <BottomSheet 
        originName={originData.name} 
        destName={destData.name} 
        distance={distance} 
        onCancel={() => navigate('/navigation')}
        onChangeRoute={() => navigate('/navigation')}
      />
    </div>
  );
};

const Header = () => (
  <header style={styles.header}>
    <h1 style={styles.headerTitle}>Navigation Active</h1>
    <div style={styles.headerSubtitle}>
      <span style={{color: '#22C55E'}}>●</span> Live Guidance
    </div>
  </header>
);

interface BottomSheetProps {
  originName: string;
  destName: string;
  distance: number;
  onCancel: () => void;
  onChangeRoute: () => void;
}

const BottomSheet = ({ originName, destName, distance, onCancel, onChangeRoute }: BottomSheetProps) => (
  <div style={styles.bottomSheet}>
    {/* Drag Handle Visual */}
    <div style={{ width: '40px', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', margin: '-8px auto 8px auto' }} />

    {/* Header Row with Distance */}
    <div style={styles.infoRow}>
      <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Route Details</span>
      <div style={styles.distanceBadge}>
        <span>👟</span> {Math.round(distance)} meters
      </div>
    </div>

    {/* From -> To Grid */}
    <div style={styles.locationsGrid}>
      <div style={styles.locationNode}>
        <span style={styles.label}>From</span>
        <span style={{...styles.value, maxWidth: '100px'}} title={originName}>{originName}</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={styles.arrowIcon}>➝</span>
      </div>

      <div style={{...styles.locationNode, textAlign: 'right', alignItems: 'flex-end'}}>
        <span style={styles.label}>To</span>
        <span style={{...styles.value, color: '#F59E0B', maxWidth: '100px'}} title={destName}>{destName}</span>
      </div>
    </div>

    {/* Buttons */}
    <div style={styles.actionsRow}>
      <button 
        onClick={onCancel}
        style={styles.btnSecondary}
      >
        Exit
      </button>
      <button 
        onClick={onChangeRoute}
        style={styles.btnPrimary}
      >
        Change Route
      </button>
    </div>
  </div>
);

export default MapView;