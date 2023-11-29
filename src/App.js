import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import FilmDetails from "./pages/FilmDetails";
import FilmWatch from "./pages/FilmWatch";
import react, { useLayoutEffect } from "react";
import Search from "./pages/Search";

function App() {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <>
      <AuthContextProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="/movie/:id" element={<FilmDetails />} />
          <Route path="/movie/:id/watch" element={<FilmWatch />} />
          <Route path="/search/:query" element={<Search />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
