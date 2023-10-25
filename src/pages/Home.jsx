import React from "react";
import Main from "../components/Main";
import Row from "../components/Row";
import requests from "../Requests";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <Main />
      <Row
        rowID="1"
        title="Now Playing"
        fetchURL={requests.requestNowPlaying}
      />
      {/* <Row
        rowID="2"
        title="New Release"
        fetchURL={requests.requestNewRelease}
      /> */}
      <Row rowID="3" title="Up Coming" fetchURL={requests.requestUpcoming} />
      <Row rowID="4" title="Popular" fetchURL={requests.requestPopular} />
      <Row rowID="5" title="Trending" fetchURL={requests.requestTrending} />
      <Row rowID="6" title="Top Rated" fetchURL={requests.requestTopRated} />
    </Layout>
  );
};

export default Home;
