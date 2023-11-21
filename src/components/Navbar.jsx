import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
  };

  return (
    <div
      className={`flex items-center justify-between p-4 z-[100] w-full fixed ${
        location.pathname === "/" ? "bg-black" : "bg-transparent"
      }`}
    >
      <Link to="/">
        <h1 className="text-red-600 text-4xl font-bold cursor-pointer hidden md:block">
          MOVIEE
        </h1>
      </Link>

      <div className="flex items-center w-full max-w-[600px] justify-center mx-4">
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <input
            type="text"
            placeholder="Search for movies"
            className="w-full rounded-md px-4 py-2 text-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-600 px-4 py-2 rounded text-white"
          >
            Search
          </button>
        </form>
      </div>

      {user?.email ? (
        <div className="hidden md:block">
          <Link to="/account">
            <button className="text-white pr-4 hover:underline">{`Hello, ${user?.displayName}`}</button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-6 py-2 rounded cursor-pointer text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="hidden md:block">
          <Link to="/login">
            <button className="text-white pr-4">Log In</button>
          </Link>
          <Link to="/signup">
            <button className="bg-red-600 px-6 py-2 rounded cursor-pointer text-white">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
