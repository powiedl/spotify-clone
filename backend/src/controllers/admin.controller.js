import { Song } from '../models/song.model.js';
import { Album } from '../models/album.model.js';
import cloudinary from '../lib/cloudinary.js';

const uploadToCloudinary = async (file) => {
  // helper function to upload files to cloudinary
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.log('Error in uploadToCloudinary', error);
    throw new Error('Error uploading to cloudinary');
  }
};

export const getAdmin = (req, res) => {
  res.send('Admin Routes: GET /');
};

// #region check-admin endpoint
export const checkAdmin = async (req, res, next) => {
  // if we reach the controller, the user is an admin (because in the route we added the protectRoute and isAdmin middleware)
  return res.status(200).json({ admin: true });
};
// #endregion

// #region Admin songs endpoints
export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: 'Please upload all files' });
    }
    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    // save files to cloudinary;
    console.log('uploading audioFile', audioFile);
    const audioUrl = await uploadToCloudinary(audioFile);
    console.log('uploading imageFile', imageFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      duration,
      audioUrl,
      imageUrl,
      albumId: albumId || null,
    });

    await song.save();

    // if the song belongs to an album, update the album's song array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    return res.status(201).json(song);
  } catch (error) {
    console.log('Error in createSong', error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    // if song belongs to the album, update the album's song array
    if (song?.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.log('Error in deleteSong', error);
    next(error);
  }
};
// #endregion

// #region Admin albums endpoints
export const createAlbum = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
      console.log('createAlbum - missing files in request');
      return res.status(400).json({ message: 'Please upload all files' });
    }
    const { title, artist, releaseYear } = req.body;
    if (!title || !artist || !releaseYear) {
      console.log('CreateAlbum - missing required information in request');
      return res.status(400).json({
        message: 'Please provide a title, an artist and a releaseYear',
      });
    }
    const imageFile = req.files.imageFile;

    // save files to cloudinary;
    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      releaseYear,
      imageUrl,
    });

    await album.save();

    return res.status(201).json(album);
  } catch (error) {
    console.log('Error in createAlbum', error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.log('Error in deleteAlbum', error);
    next(error);
  }
};
// #endregion
