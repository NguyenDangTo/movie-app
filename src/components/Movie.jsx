import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";

const Movie = ({ item }) => {
  const [like, setLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = UserAuth();

  const movieID = doc(db, "users", `${user?.email}`);

  const saveShow = async () => {
    if (user?.email) {
      setLike(!like);
      setSaved(true);
      // Check doc exists
      // if exists, update doc
      if (doc.exists) {
        await updateDoc(movieID, {
          savedShows: arrayUnion({
            id: item.id,
            title: item.title,
            img: item.backdrop_path,
          }),
        }).then(() => {
          console.log("Document successfully updated!");
        });
      } else {
        // if not exists, create then update doc
        await setDoc(doc(db, "users", user?.email), {
          savedShows: [],
        });
        await updateDoc(movieID, {
          savedShows: arrayUnion({
            id: item.id,
            title: item.title,
            img: item.backdrop_path,
          }),
        }).then(() => {
          console.log("Document successfully written!");
        });
      }
    } else {
      alert("Please log in to save a movie");
    }
  };

  return (
    <div className="w-[200px] sm:w-[300px] inline-block cursor-pointer p-2">
      <div className="w-full cursor-pointer relative">
        <img
          className="w-full h-auto block"
          src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
          alt={item?.title}
        />
        <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
          <p onClick={saveShow}>
            {like ? (
              <FaHeart className="absolute top-4 left-4 text-gray-300" />
            ) : (
              <FaRegHeart className="absolute top-4 left-4 text-gray-300" />
            )}
          </p>
        </div>
      </div>
      <div className="text-gray-200 text-center pt-1">{item?.title}</div>
    </div>
  );
};

export default Movie;
