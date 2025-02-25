import {createRoot} from 'react-dom/client'
import './index.css'
import {ThemeProvider} from "@/components/Theme/theme-provider.tsx"
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom"

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <App/>
        </ThemeProvider>
    </BrowserRouter>
)
