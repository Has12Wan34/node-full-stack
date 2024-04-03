import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import movieAPI from './movieAPI';
import { addMovie } from './movieSlice';

export default function Movie() {

  const dispatch = useDispatch();
  const { movies } = useSelector((state) => state.movies);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await movieAPI.get('/products');
      setTimeout(() => {
        dispatch(addMovie(res.data))
      }, 500)
    }
    fetchMovie();
  },[]);

  return (
    <div>
      {movies?.length > 0 ? movies?.map((m, i) => (
        <p key={i}>{m.name}</p>
      )) : 'loading...'}
    </div>
  );
}
