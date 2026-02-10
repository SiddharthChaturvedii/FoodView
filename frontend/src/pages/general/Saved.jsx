import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import api from '../../utils/api'
import ReelFeed from '../../components/ReelFeed'

const Saved = () => {
    const [videos, setVideos] = useState([])

    useEffect(() => {
        api.get("/api/food/save")
            .then(response => {
                const savedFoods = (response.data.savedFoods || [])
                    .filter(item => item.food) // Guard against null food refs
                    .map((item) => ({
                        _id: item.food._id,
                        video: item.food.video,
                        name: item.food.name,
                        description: item.food.description,
                        likeCount: item.food.likeCount || 0,
                        savesCount: item.food.savesCount || 0,
                        commentsCount: item.food.commentsCount || 0,
                        foodPartner: item.food.foodPartner,
                    }));
                setVideos(savedFoods);
            })
            .catch(() => { /* silently handle — empty state will show */ })
    }, [])

    const removeSaved = async (item) => {
        try {
            await api.post("/api/food/save", { foodId: item._id })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved
