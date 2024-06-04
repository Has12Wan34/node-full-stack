import socketIOClient from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTravel, editTravel, fetchTravels, fetchSearchTravels, fetchTravelsById, removeTravel, setTravel } from './travelSlice';

export default function Travel() {

  const dispatch = useDispatch();
  const { travels, travel } = useSelector((state) => state.travels);
  const [skip, setSkip] = useState(0);
  const [limit, setlimit] = useState(5);
  const [formData, setFormData] = useState({
    name: '',
    detail: '',
    coverimage: '',
    latitude: '',
    longitude: ''
  });

  const fetchSearchTravel = async (name) => {
    const config = {
      params: {
        name
      }
    }
    setTimeout(() => {
      dispatch(fetchSearchTravels(config));
    }, 500);
  }

  useEffect(() => {
    const config = {
      params : {
        skip,
        limit 
      }
    };
    setTimeout(() => {
      dispatch(fetchTravels(config));
    }, 500);
  },[]);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000');
    console.log(formData)
    // รับข้อความจากเซิร์ฟเวอร์
    socket.on('reply', (msg) => {
      console.log(msg)
    });

    // ปิดการเชื่อมต่อ socket เมื่อ unmount
    return () => socket.disconnect();
  }, [formData]);

  const handleSearch = (e) => {
    fetchSearchTravel(e.target.value)
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeEdit = (e) => {
    dispatch(setTravel(e.target));
  };

  const handleDetail = async (id) => {
    const config = {
      id
    }
    setTimeout(() => {
      dispatch(fetchTravelsById(config));
    }, 500);
  };

  const handleRemove = async (id) => {
    const config = {
      id
    }
    setTimeout(() => {
      dispatch(removeTravel(config));
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(addTravel({ 
      name: formData.name, 
      coverimage: formData.coverimage,
      detail: formData.detail,
      latitude: formData.latitude,
      longitude: formData.longitude }));
    setFormData((state) => ({
      ...state,
      name: '', 
      coverimage: '',
      detail: '',
      latitude: '',
      longitude: ''
    }));
    const socket = socketIOClient('http://localhost:5000');
    socket.emit('create-travel', formData);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const config = {
      body: travel,
      id: travel.id
    }
    dispatch(editTravel(config));
  };

  return (
    <div>
     <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Detail:
        <input type="text" name="detail" value={formData.detail} onChange={handleChange} />
      </label>
      <label>
        Cover Image:
        <input type="text" name="coverimage" value={formData.coverimage} onChange={handleChange} />
      </label>
      <label>
        Latitude:
        <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} />
      </label>
      <label>
        Longitude:
        <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} />
      </label>
      <button type="submit">Add</button>
    </form>
    <form onSubmit={handleEdit}>
      <label>
        Name:
        <input type="text" name="name" value={travel.name} onChange={handleChangeEdit} />
      </label>
      <label>
        Detail:
        <input type="text" name="detail" value={travel.detail} onChange={handleChangeEdit} />
      </label>
      <label>
        Cover Image:
        <input type="text" name="coverimage" value={travel.coverimage} onChange={handleChangeEdit} />
      </label>
      <label>
        Latitude:
        <input type="number" name="latitude" value={travel.latitude} onChange={handleChangeEdit} />
      </label>
      <label>
        Longitude:
        <input type="number" name="longitude" value={travel.longitude} onChange={handleChangeEdit} />
      </label>
      <button type="submit">Edit</button>
    </form>
      <input type="search" onChange={handleSearch}/>
      {travels?.length > 0 ? travels?.map((m, i) => (
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
          <p key={i}>{m.name}</p>
          <div>
            <button type="button" onClick={() => handleDetail(m.id)}>detail</button>
            <button type="button" onClick={() => handleRemove(m.id)}>remove</button>
          </div>
        </div>
      )) : 'loading...'}
    </div>
  );
}
