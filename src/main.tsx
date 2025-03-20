import {createRoot} from "react-dom/client";
import "./index.css";
import {ThemeProvider} from "@/components/Theme/theme-provider.tsx";
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {GlobalProvider} from "@/context/GlobalContext.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <GlobalProvider>
                    <App/>
                </GlobalProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </BrowserRouter>
);
