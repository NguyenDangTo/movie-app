import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import requests from "../Requests";
import Layout from "../components/Layout";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";

const FilmWatch = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState();
  const [videos, setVideos] = useState();
  const [credit, setCredit] = useState();
  useEffect(() => {
    axios
      .get(requests.requestFilmById.replace("id", id))
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(requests.requestFilmCreditById.replace("id", id))
      .then((response) => {
        console.log(response.data);
        setCredit(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(requests.requestVideosFilmById.replace("id", id))
      .then((response) => {
        setVideos(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);
  return (
    <Layout>
      <div className="w-full min-h-screen text-white overflow-hidden">
        <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center relative">
          <img
            className="w-full h-full absolute top-0 left-0 object-cover opacity-10 -z-10"
            src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`}
            alt={movie?.title}
          />
          <iframe
            src={`https://www.youtube.com/embed/${videos?.[0]?.key}`}
            title={videos?.[0]?.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="p-4 w-full md:w-[1000px] h-[350px] md:h-[600px]"
          ></iframe>
        </div>
      </div>
    </Layout>
  );
};

export default FilmWatch;
