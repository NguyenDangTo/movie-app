import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import requests from "../Requests";
import Movie from "../components/Movie";
import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Search = () => {
  const [movies, setMovies] = useState([]);

  const { query } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const [totalResults, setTotalResults] = useState("");

  const navigate = useNavigate();

  console.log(totalResults);
  useEffect(() => {
    axios
      .get(
        requests.requestFilmSearch
          .replace("searchQuery", query)
          .replace("pageQuery", currentPage)
      )
      .then((response) => {
        setMovies(response.data.results);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.total_pages);
        setTotalResults(response.data.total_results);
      });
  }, [currentPage, query]);

  const next = () => {
    if (currentPage === 10) return;
    setCurrentPage(currentPage + 1);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const prev = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    <Layout>
      <div className="pt-[80px] flex flex-col px-12">
        <div className="flex justify-between items-center text-xl px-4">
          <div className="text-red-500">
            Search for movies: <span className="text-white">{query}</span>
          </div>
          <div className="text-red-500">
            Page: <span className="text-white">{currentPage}</span>
          </div>
        </div>
        <div className="w-full h-full flex item-center flex-wrap gap-1">
          {totalResults === 0 ? (
            <div className="text-white">There are no movies</div>
          ) : (
            movies?.map((item, id) => <Movie key={id} item={item} />)
          )}
        </div>
        <div className="flex items-center justify-center gap-8 my-8">
          <IconButton
            size="sm"
            variant="outlined"
            onClick={prev}
            disabled={currentPage === 1}
            className="border-white"
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4 text-white" />
          </IconButton>
          <Typography color="white" className="font-normal">
            Page <strong className="text-red-500">{currentPage}</strong> of{" "}
            <strong className="text-red-500">{totalPages}</strong>
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            onClick={next}
            disabled={currentPage === totalPages}
            className="border-white"
          >
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4 text-white" />
          </IconButton>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
