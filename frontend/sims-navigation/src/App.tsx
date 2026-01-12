import { Routes, Route } from "react-router-dom"
import Landing from "./pages/landing"
import Navigation from "./pages/navigation"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/navigation" element={<Navigation />} />

     
    </Routes>
  )
}

export default App
