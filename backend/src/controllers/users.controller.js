import { Message } from '../models/message.model.js';
import { User } from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth().userId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
    return res.status(200).json(users);
  } catch (error) {
    console.log('Error in getAllUsers', error);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.auth().userId;
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: currentUserId },
        { senderId: currentUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages', error);
    next(error);
  }
};
