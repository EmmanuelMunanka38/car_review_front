import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import CarDetailsPage from "@/pages/CarDetailsPage"
import CarListingsPage from "@/pages/CarListingsPage"
import CompareVehiclesPage from "@/pages/CompareVehiclesPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarListingsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/compare" element={<CompareVehiclesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
