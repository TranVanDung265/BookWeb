import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container my-4 flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
