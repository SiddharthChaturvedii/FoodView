import React, { useEffect, useState } from 'react'
import api from '../../utils/api';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CreateFood from '../food-partner/CreateFood';
import LandingPage from './LandingPage';

const Home = () => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    // ... (rest of useEffect)
    api.get("/api/food")
      .then(response => {
        // Shuffle the videos randomly
        const shuffledVideos = [...response.data.foodItems].sort(() => Math.random() - 0.5);
        setVideos(shuffledVideos);
      })
      .catch(() => { /* noop: optionally handle error */ })
  }, [])

  // ... (rest of functions)

  async function likeVideo(item) {
    try {
      const response = await api.post("/api/food/like", { foodId: item._id });

      // Use authoritative likeCount from backend
      setVideos((prev) => prev.map((v) =>
        v._id === item._id
          ? { ...v, likeCount: response.data.likeCount }
          : v
      ));
    } catch (error) {
      // Silently handle error - could add toast notification here
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
      <div className="bg-black min-h-screen text-white relative">
        <Link
          to="/home"
          className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all border border-white/10 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back</span>
        </Link>
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