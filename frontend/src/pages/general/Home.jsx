import React, { useEffect, useState } from 'react'
import api from '../../utils/api';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { Link, useParams } from 'react-router-dom';
import CreateFood from '../food-partner/CreateFood';
import LandingPage from './LandingPage';

const Home = () => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    api.get("/api/food")
      .then(response => {
        // Shuffle the videos randomly
        const shuffledVideos = [...response.data.foodItems].sort(() => Math.random() - 0.5);
        setVideos(shuffledVideos);
      })
      .catch(() => { /* noop: optionally handle error */ })
  }, [])

  async function likeVideo(item) {
    const response = await api.post("/api/food/like", { foodId: item._id })

    if (response.data.like) {
      console.log("Video liked");
      setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
    } else {
      console.log("Video unliked");
      setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
    }
  }

  async function saveVideo(item) {
    const response = await api.post("/api/food/save", { foodId: item._id })

    if (response.data.save) {
      setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
    } else {
      setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
    }
  }

  return (
    <>
      <div className="bg-black min-h-screen text-white">
        <ReelFeed
          items={videos}
          onLike={likeVideo}
          onSave={saveVideo}
          emptyMessage="No videos available."
        />
      </div>
    </>
  );

}

export default Home