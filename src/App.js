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
import NotFound from "./pages/NotFound";

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
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route
            exact
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route exact path="/movie/:id" element={<FilmDetails />} />
          <Route exact path="/movie/:id/watch" element={<FilmWatch />} />
          <Route exact path="/search/:query" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
