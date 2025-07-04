
import RouteError from "@/components/RouteError";
import RootLayout from "@/layouts/RootLayout";
import AddBook from "@/pages/AddBook";
import BookDetails from "@/pages/BookDetails";
import Books from "@/pages/Books";
import BorrowSummaryPage from "@/pages/BorrowSummaryPage";
import EditBook from "@/pages/EditBook";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    errorElement:<RouteError />,
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
            path:"/books/:id",
            element:<BookDetails/>
        },
        
        {
            path:"/create-book",
            element:<AddBook/>
        },
        {
            path:"/edit-book/:id",
            element:<EditBook/>
        },
        {
            path:"/borrow-summary",
            element:<BorrowSummaryPage/>
        },
    ]
  },
]);

