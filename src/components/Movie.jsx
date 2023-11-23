import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Toastify from "./Toastify";

const Movie = ({ item }) => {
  const [like, setLike] = useState(false);
  const { user } = UserAuth();
  const [likedMovies, setLikedMovies] = useState([]);

  const navigate = useNavigate();
  const movieRef = doc(db, "users", `${user?.email}`);

  const handleLikeBtn = async () => {
    if (user?.email) {
      const result = [
        ...likedMovies,
        {
          id: item.id,
          title: item.title,
          img: item.backdrop_path,
        },
      ];
      await updateDoc(movieRef, {
        savedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path,
        }),
      }).then(() => {
        setLike(true);
        setLikedMovies(result);
        Toastify("Lưu phim đã thích");
        console.log("Document add successfully updated!");
      });
    } else {
      navigate(`/login`);
    }
  };
  const handleDislikeBtn = async () => {
    if (user?.email) {
      try {
        const result = likedMovies.filter((movie) => movie.id !== item.id);
        await updateDoc(movieRef, {
          savedShows: result,
        }).then(() => {
          setLike(false);
          setLikedMovies(result);
          Toastify("Xóa phim đã lưu");
          console.log("Document delete successfully updated!");
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate(`/login`);
    }
  };
  const handleChooseFilm = (e) => {
    e.preventDefault();
    console.log(item.id);
    navigate(`/movie/${item.id}`);
  };

  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setLikedMovies(doc.data()?.savedShows);
    });
  }, [user?.email]);

  useEffect(() => {
    if (likedMovies?.find((movie) => movie.id === item.id)) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [item.id, likedMovies]);
  return (
    <div className="w-[300px]  md:w-[340px] inline-block cursor-pointer p-2">
      <div className="w-full cursor-pointer relative ">
        <img
          className="w-full h-auto block"
          src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
          alt={item?.title}
          onClick={handleChooseFilm}
        />

        {like ? (
          <div
            onClick={handleDislikeBtn}
            className="absolute top-1 left-1 p-2 bg-red-600 rounded-md "
          >
            <FaHeart className="text-gray-300" />
          </div>
        ) : (
          <div onClick={handleLikeBtn} className="absolute top-1 left-1 p-2 ">
            <FaRegHeart className="text-red-600" />
          </div>
        )}
      </div>
      <div className="text-gray-200 text-center pt-1 px-4 truncate">
        {item?.title ?? "Coming Soon"}
      </div>
    </div>
  );
};

export default Movie;
