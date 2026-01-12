import { HealthStatus } from "../components/HealthStatus"

export default function Landing() {
  return (
    <div>
      <h1>SIMS Indoor Navigation</h1>
      <p>Scan QR to begin</p>
      <HealthStatus />
    </div>
  )
}
