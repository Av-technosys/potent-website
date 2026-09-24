import Footer from "../components/common/Footer"
import { Navbar } from "../components/common/Navbar"

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return <>
        <Navbar />
        {children}
        <Footer />
    </>
}