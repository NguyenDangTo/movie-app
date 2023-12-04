import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import requests from "../Requests";
import Layout from "../components/Layout";
import { FaCalendarAlt, FaStar } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import bg_default_avt from "../assets/img/default_avt.png";
import { UserAuth } from "../context/AuthContext";
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  runTransaction,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import ReactStars from "react-rating-stars-component";
import Toastify from "../components/Toastify";
const FilmWatch = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState();
  const [videos, setVideos] = useState();
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const { user } = UserAuth();
  const navigate = useNavigate();

  const handleAddComment = async (e) => {
    e.preventDefault();
    const movieRef = doc(db, "movies", movie.id.toString());

    try {
      const docSnapshot = await getDoc(movieRef);

      if (docSnapshot.exists()) {
        // Movie exists, update the comments array
        await updateDoc(movieRef, {
          comments: arrayUnion({
            displayName: user.displayName,
            userId: user.uid,
            comment: commentValue,
          }),
        });
        setComments([
          ...comments,
          {
            displayName: user.displayName,
            userId: user.uid,
            comment: commentValue,
          },
        ]);
      } else {
        // Movie does not exist, create a new document
        await setDoc(movieRef, {
          comments: [
            {
              displayName: user.displayName,
              userId: user.uid,
              comment: commentValue,
            },
          ],
        });
        setComments([
          ...comments,
          {
            displayName: user.displayName,
            userId: user.uid,
            comment: commentValue,
          },
        ]);
      }
      setCommentValue("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRating = async (rate) => {
    const movieRef = doc(db, "movies", movie.id.toString());

    try {
      const docSnapshot = await getDoc(movieRef);

      if (docSnapshot.exists()) {
        const movieData = docSnapshot.data();
        const ratings = movieData.ratings || [];
        const userRatingIndex = ratings.findIndex(
          (rating) => rating.userId === user.uid
        );

        if (userRatingIndex !== -1) {
          // User already rated, update their existing rating
          ratings[userRatingIndex].rate = rate;

          await updateDoc(movieRef, {
            ratings: ratings,
          });
        } else {
          // Add a new rating for the user
          ratings.push({ userId: user.uid, rate: rate });

          await updateDoc(movieRef, {
            ratings: ratings,
          });
        }
      } else {
        await setDoc(movieRef, {
          ratings: [{ userId: user.uid, rate: rate }],
        });
      }

      setRating(rate);
      Toastify("Thanks for your rating!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useLayoutEffect(() => {
    axios
      .get(requests.requestFilmById.replace("id", id))
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useLayoutEffect(() => {
    axios
      .get(requests.requestVideosFilmById.replace("id", id))
      .then((response) => {
        setVideos(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleLoginBtn = () => {
    navigate(`/login`);
  };

  // get comments from firestore
  useLayoutEffect(() => {
    const getComments = async () => {
      const movieRef = doc(db, "movies", movie?.id.toString());
      const docSnapshot = await getDoc(movieRef);
      if (docSnapshot.exists()) {
        setComments(docSnapshot.data().comments);
      }
    };
    getComments();
  }, [movie?.id]);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!user || !user.uid) {
        return;
      }
      const movieRef = doc(db, "movies", id.toString());
      try {
        const docSnapshot = await getDoc(movieRef);

        if (docSnapshot.exists()) {
          const movieData = docSnapshot.data();
          const ratings = movieData.ratings || [];

          const userRatingObj = ratings.find(
            (rating) => rating.userId === user.uid
          );

          if (userRatingObj) {
            setUserRating(userRatingObj.rate);
          } else {
            setUserRating(0);
          }
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [id, user, rating]);

  return (
    <Layout>
      <div className="w-full min-h-screen text-white overflow-hidden">
        <div className="w-full h-[300px] mt-[60px] md:mt-2 md:min-h-screen flex flex-col md:flex-row justify-center items-center relative">
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

        <div className="flex flex-col w-full p-8 md:px-[48px] gap-4">
          <div className="text-white text-2xl font-sans font-bold w-full flex items-center">
            <div>{movie?.title}</div>
            <div className="flex text-red-500 text-lg justify-center items-center mx-4 gap-1">
              <div className="">{movie?.vote_average.toFixed(1)}</div>
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
          <div className="w-full flex">
            <div>{movie?.overview}</div>
          </div>
        </div>
        <div className="p-6 my-6 flex flex-col items-center">
          <div className="flex items-center">
            <div className="mx-6 font-bold text-2xl ">Đánh giá:</div>
            {!user?.uid ? (
              <div className="text-center text-bold m-4">
                Please{" "}
                <span
                  className="text-red-500 cursor-pointer hover:underline"
                  onClick={handleLoginBtn}
                >
                  LOGIN
                </span>{" "}
                to Rating
              </div>
            ) : (
              <ReactStars
                value={userRating}
                count={5}
                onChange={handleRating}
                size={36}
                activeColor="#ffd700"
              />
            )}
          </div>

          <div className="flex items-center">
            {userRating !== null ? (
              <div>Your current rating: {userRating}</div>
            ) : (
              <div>You haven't rated this movie yet.</div>
            )}
          </div>
        </div>

        <div className="p-6 my-6">
          <div className="mx-6 font-bold text-2xl">Comments:</div>

          {!user?.uid ? (
            <div className="w-full text-center text-bold m-4">
              Please{" "}
              <span
                className="text-red-500 cursor-pointer hover:underline"
                onClick={handleLoginBtn}
              >
                LOGIN
              </span>{" "}
              to comment
            </div>
          ) : (
            <form
              onSubmit={handleAddComment}
              className="mt-5 flex items-center"
            >
              <input
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                type="text"
                placeholder="Comment"
                className="ml-4 px-5 py-2 w-full text-white bg-white/10 rounded-full outline-none"
              />
              <button type="submit" className="ml-3 px-3">
                <RiSendPlaneFill className="text-4xl text-red" />
              </button>
            </form>
          )}

          <div className="mt-8 max-h-[700px] overflow-y-auto flex flex-col">
            {comments?.map((comment, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  user?.uid === comment.userId && "flex-row-reverse"
                }`}
              >
                <div
                  className={`flex ${
                    user?.uid !== comment.userId && "flex-row-reverse"
                  } justify-end items-center mx-8 my-2 text-black bg-white max-w-[400px] w-2/3 md:w-2/5 py-2 px-4 rounded-2xl flex-end h-auto`}
                >
                  <div className="flex flex-col">
                    <div
                      className={`font-bold text-lg ${
                        user?.uid === comment.userId && "text-right"
                      }`}
                    >
                      {comment.displayName}
                    </div>
                    <div className="text-md">{comment.comment}</div>
                  </div>
                  <img
                    className="w-[50px] h-[50px] object-cover rounded-full mx-4"
                    src={bg_default_avt}
                    alt={movie?.title}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FilmWatch;
