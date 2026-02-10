import React, { useEffect, useState } from 'react'
import api from '../../utils/api';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Home = () => {
  const [videos, setVideos] = useState([])
  const [likedFoodIds, setLikedFoodIds] = useState(new Set())

  useEffect(() => {
    // Fetch food items
    api.get("/api/food")
      .then(response => {
        const shuffledVideos = [...response.data.foodItems].sort(() => Math.random() - 0.5);
        setVideos(shuffledVideos);
      })
      .catch(() => { /* noop */ })

    // Fetch user's liked foods
    api.get("/api/user/liked")
      .then(response => {
        const likedIds = new Set(
          (response.data.likedFoods || []).map(food => food._id)
        );
        setLikedFoodIds(likedIds);
      })
      .catch(() => { /* noop - user may not be logged in */ })
  }, [])

  async function likeVideo(item) {
    try {
      const response = await api.post("/api/food/like", { foodId: item._id });

      // Update like count
      setVideos((prev) => prev.map((v) =>
        v._id === item._id
          ? { ...v, likeCount: response.data.likeCount }
          : v
      ));

      // Update liked status
      setLikedFoodIds(prev => {
        const next = new Set(prev);
        if (response.data.isLiked) {
          next.add(item._id);
        } else {
          next.delete(item._id);
        }
        return next;
      });
    } catch (error) {
      // Silently handle error
    }
  }

  async function saveVideo(item) {
    try {
      const response = await api.post("/api/food/save", { foodId: item._id });

      setVideos((prev) => prev.map((v) =>
        v._id === item._id
          ? { ...v, savesCount: response.data.savesCount ?? (response.data.save ? v.savesCount + 1 : v.savesCount - 1) }
          : v
      ));
    } catch (error) {
      // Silently handle error
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
          likedFoodIds={likedFoodIds}
          onLike={likeVideo}
          onSave={saveVideo}
          emptyMessage="No videos available."
        />
      </div>
    </>
  );
}

export default Home