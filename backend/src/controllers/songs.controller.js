import { Song } from '../models/song.model.js';

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }); // -1 = Descending => newest to oldest
    return res.status(200).json(songs);
  } catch (error) {
    console.log('Error in getAllSongs', error);
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json(songs);
  } catch (error) {
    console.log('Error in getFeaturedSongs', error);
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json(songs);
  } catch (error) {
    console.log('Error in getMadeForYouSongs', error);
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json(songs);
  } catch (error) {
    console.log('Error in getTrendingSongs', error);
    next(error);
  }
};

export const getSongById = async (req, res, next) => {
  try {
  } catch (error) {
    console.log('Error in getSongById', error);
    next(error);
  }
};
