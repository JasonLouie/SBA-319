import mongoose from "mongoose";

const reviews = [
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a70"),
        anime_id: 1,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf600"),
        reviewText: "Best anime ever! Amazing plot and character development! Cant wait to see what will happen next!!",
        rating: 10
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a71"),
        anime_id: 1,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf601"),
        rating: 9
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a72"),
        anime_id: 1,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf602"),
        reviewText: "Peak anime. Wish the earlier arcs weren't dragged out as much.",
        rating: 9
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a73"),
        anime_id: 2,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf600"),
        rating: 9
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a74"),
        anime_id: 2,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf601"),
        reviewText: "Some text here",
        rating: 8
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a75"),
        anime_id: 2,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf603"),
        reviewText: "Also some text here",
        rating: 10
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a76"),
        anime_id: 2,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf605"),
        rating: 8
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a77"),
        anime_id: 2,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf604"),
        reviewText: "some text here",
        rating: 7
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a78"),
        anime_id: 3,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf600"),
        reviewText: "Saitama is the GOAT!",
        rating: 10
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a79"),
        anime_id: 3,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf602"),
        reviewText: "The new season's animations remind me of a powerpoint...",
        rating: 6
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a7a"),
        anime_id: 4,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf606"),
        rating: 10
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a7b"),
        anime_id: 5,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf606"),
        rating: 8
    },
    {
        _id: new mongoose.Types.ObjectId("68f3da3ff827bdfcbb384a7c"),
        anime_id: 6,
        user_id: new mongoose.Types.ObjectId("68f3d6837b7fdd9996acf606"),
        rating: 9
    },
];

export default reviews;