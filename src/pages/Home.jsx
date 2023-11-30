import React from "react";
import Main from "../components/Main";
import Slider from "../components/Slider";
import requests from "../Requests";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <Main />
      <Slider
        rowID="1"
        title="Now Playing"
        fetchURL={requests.requestNowPlaying}
      />
      <Slider rowID="2" title="Up Coming" fetchURL={requests.requestUpcoming} />
      <Slider rowID="3" title="Popular" fetchURL={requests.requestPopular} />
      <Slider rowID="4" title="Trending" fetchURL={requests.requestTrending} />
      <Slider rowID="5" title="Top Rated" fetchURL={requests.requestTopRated} />
    </Layout>
  );
};

export default Home;
