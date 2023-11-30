import React from "react";
import Layout from "../components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="text-4xl text-white">
          <span className="text-red-500 text-6xl font-bold mr-4">404</span> NOT
          FOUND
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
