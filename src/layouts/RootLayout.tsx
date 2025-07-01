import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Outlet } from "react-router"


const RootLayout = () => {
  return (
    <div>
        <Header/>
        <main className="pt-20 min-h-screen">
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default RootLayout