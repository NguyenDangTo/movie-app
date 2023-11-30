import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery === "") return;
    navigate(`/search/${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <div
      className={`flex items-center justify-between p-4 z-[100] w-full fixed ${
        location.pathname === "/" ? "bg-black" : "bg-transparent"
      }`}
    >
      <Link to="/">
        <h1 className="text-red-600 text-3xl font-bold cursor-pointer hidden md:block">
          MOVIEE
        </h1>
      </Link>

      <div className="flex items-center w-1/2 md:w-[600px] justify-center mx-4">
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search for movies"
            className="w-full px-4 py-2 rounded-md text-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-600 px-4 py-2 ml-2 rounded-md text-white hidden md:block"
          >
            Search
          </button>
        </form>
      </div>

      {user?.email ? (
        <div className="block">
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
        <div className="block">
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
