import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import travelAPI from './travelAPI';
import { setTravels } from './travelSlice';

export default function Travel() {

  const dispatch = useDispatch();
  const { travels } = useSelector((state) => state.travels);
  const [skip, setSkip] = useState(0);
  const [limit, setlimit] = useState(5);

  const fetchSearchTravel = async (name) => {
    const res = await travelAPI.get('/api/travels/search');
    // dispatch(setTravel(res.data))
    console.log(res.data)
  }

  useEffect(() => {
    const fetchTravel = async () => {
      const res = await travelAPI.get('/api/travels', { 
        params : {
          skip,
          limit 
        }
      });
      setTimeout(() => {
        dispatch(setTravels(res.data))
      }, 500)
    }
    fetchTravel();
  },[]);

  const handleSearch = (e) => {
    fetchSearchTravel(e.target.value)
  }

  return (
    <div>
      <input type="search" onChange={handleSearch}/>
      {travels?.length > 0 ? travels?.map((m, i) => (
        <p key={i}>{m.name}</p>
      )) : 'loading...'}
    </div>
  );
}
