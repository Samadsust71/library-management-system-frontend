
import RootLayout from "@/layouts/RootLayout";
import AddBook from "@/pages/AddBook";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    children:[
        {
            path:"/",
            element:<Home/>
        },
        {
            path:"/create-book",
            element:<AddBook/>
        }
    ]
  },
]);

