import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />        {/* ✅ NAVBAR RENDERS HERE */}
      <main>{children}</main>  {/* ✅ ROUTES RENDER HERE */}
    </>
  );
};

export default Layout;

