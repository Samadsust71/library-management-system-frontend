import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/ui/sonner.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.ts";
// import { store } from "./lib/store.ts";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
