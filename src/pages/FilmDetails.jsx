import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import requests from "../Requests";
import Layout from "../components/Layout";
import { FaCalendarAlt, FaArrowRight, FaStar } from "react-icons/fa";
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  runTransaction,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

const FilmDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState();
  const [videos, setVideos] = useState();
  const [credit, setCredit] = useState();
  const [viewCount, setViewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const handleWatchBtn = async () => {
    const movieRef = doc(db, "movies", id.toString());

    try {
      const docSnapshot = await getDoc(movieRef);

      if (docSnapshot.exists()) {
        // Movie exists, update the view count
        const movieData = docSnapshot.data();
        const updatedViews = (movieData.views || 0) + 1;

        await updateDoc(movieRef, {
          views: updatedViews,
        });

        navigate(`/movie/${id}/watch`);
      } else {
        await setDoc(movieRef, {
          views: 1,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  // fetch view counts
  useEffect(() => {
    const fetchViewCount = async () => {
      const movieRef = doc(db, "movies", id.toString());

      try {
        const docSnapshot = await getDoc(movieRef);

        if (docSnapshot.exists()) {
          const movieData = docSnapshot.data();
          const views = movieData.views || 0;
          setViewCount(views);
        } else {
          setViewCount(0);
        }
      } catch (error) {
        console.error("Error fetching view count:", error);
      }
    };

    fetchViewCount();
  }, [id]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const movieRef = doc(db, "movies", id.toString());
        const docSnapshot = await getDoc(movieRef);

        if (docSnapshot.exists()) {
          const movieData = docSnapshot.data();
          const ratings = movieData.ratings || [];

          let totalRating = 0;
          let numberOfRatings = ratings.length;

          if (numberOfRatings > 0) {
            for (let i = 0; i < numberOfRatings; i++) {
              totalRating += ratings[i].rate;
            }
          }

          const avgRating =
            numberOfRatings > 0 ? totalRating / numberOfRatings : 0;
          setAverageRating(avgRating);
        } else {
          console.log("Movie not found");
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchAverageRating();
  }, [id]);

  return (
    <Layout>
      <div className="w-full min-h-screen text-white overflow-hidden">
        {/* Poster and Information of Film */}
        <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center relative">
          <img
            className="w-full h-full absolute top-0 left-0 object-cover opacity-10"
            src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`}
            alt={movie?.title}
          />
          {/* Poster */}
          <div className="w-[350px] h-[550px] relative">
            <img
              className="w-full h-auto block"
              src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
              alt={movie?.title}
            />
          </div>

          {/* Information of Film */}
          <div className="w-full md:w-1/3 h-auto relative flex flex-col p-8 gap-2">
            <div className="text-white text-2xl font-sans font-bold w-full flex items-center">
              <div>{movie?.title}</div>
              <div className="flex text-red-500 text-lg justify-center items-center mx-4 gap-1">
                <div className="">{averageRating.toFixed(1)}</div>
                <FaStar />
              </div>
            </div>
            <div className="w-full flex items-center gap-4">
              <div className="bg-red-500 text-white p-1 rounded-md font-bold">
                HD 4K
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt />
                <div>{movie?.release_date}</div>
              </div>
            </div>
            <div className="w-full flex">
              {movie?.genres.map((genre) => (
                <div key={genre.id} className="p-2 font-bold">
                  {genre.name}
                </div>
              ))}
            </div>
            <div className="w-full flex items-center">
              <div>{movie?.overview}</div>
            </div>
            <div className="w-full flex items-center">
              <div className="mr-2">Số lượt xem:</div>
              <div>{viewCount}</div>
            </div>
            <div className="w-full p-4">
              <div
                className="flex justify-center gap-2 items-center border border-red-500 py-4 px-8 rounded-3xl duration-300 hover:bg-red-500 cursor-pointer"
                onClick={handleWatchBtn}
              >
                <span>Watch Now</span>
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
        {/* Trailer and Teaser */}
        <div className="flex flex-col">
          <div className="w-full flex flex-col-reverse md:flex-row justify-center p-8 gap-4">
            <div className="flex flex-col w-full md:w-3/4 items-center justify-center">
              {videos?.slice(0, 2).map((video, index) => (
                <iframe
                  key={index}
                  src={`https://www.youtube.com/embed/${video?.key}`}
                  title={video?.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="p-4 w-full h-[350px] md:h-[500px]"
                ></iframe>
              ))}
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <h2 className="font-bold p-4 text-2xl">CAST</h2>
              <div className="w-full flex-col h-[400px] md:h-[800px] scrollbar scrollbar-thumb-red-500 pr-2 overflow-auto">
                {credit?.cast.map((cast) => (
                  <div
                    key={cast?.id}
                    className="w-full h-[85px] flex justify-between items-center"
                  >
                    <img
                      className="w-[75px] h-[75px] rounded-full object-cover"
                      src={`https://image.tmdb.org/t/p/w500/${cast?.profile_path}`}
                      alt={cast?.name}
                    />
                    <div className="text-center flex flex-col">
                      <div className="text-center">{cast?.name}</div>
                      <div className="text-center font-bold">
                        {cast?.character}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FilmDetails;
