import Dashboard from "@/pages/Dashboard"
import Home from "@/pages/Home"
import {Route, Routes} from "react-router-dom"

export default function App() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/" element={<Home/>}/>

        </Routes>
    )
}
