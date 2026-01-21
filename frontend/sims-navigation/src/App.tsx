import { Routes, Route } from "react-router-dom"
import Landing from "./pages/landing"
import Navigation from "./pages/navigation"
import MapView from "./pages/Map-view"
import QRGenerator from "./pages/qrAdmin"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/navigation" element={<Navigation />} />
      <Route path="/map-view" element={<MapView />} />
      <Route path="/admin" element={<QRGenerator />} />

     
    </Routes>
  )
}

export default App
