import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Outlet } from "react-router"


const RootLayout = () => {
  return (
    <div>
        <Header/>
        <main className="pt-20 min-h-screen container mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default RootLayout