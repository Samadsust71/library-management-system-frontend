
import RootLayout from "@/layouts/RootLayout";
import AddBook from "@/pages/AddBook";
import Books from "@/pages/Books";
import BorrowSummaryPage from "@/pages/BorrowSummaryPage";
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
            path:"/books",
            element:<Books/>
        },
        
        {
            path:"/create-book",
            element:<AddBook/>
        },
        {
            path:"/borrow-summary",
            element:<BorrowSummaryPage/>
        },
    ]
  },
]);

