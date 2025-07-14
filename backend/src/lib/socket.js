import { Server } from 'socket.io';
import { Message } from '../models/message.model.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
  const userSockets = new Map(); // { userId: socketId }
  const userActivities = new Map(); // { userId: activity }

  io.on('connection', (socket) => {
    socket.on('user_connected', (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, 'Idle');

      // broadcast to all connected sockets that this user just logged in
      io.emit('user_connected', userId);

      // tell the new client who else is online right now
      socket.emit('users_online', Array.from(userSockets.keys()));

      // send everyone what the users are doing right now (why everyone?)
      io.emit('activities', Array.from(userActivities.entries()));
    });

    socket.on('update_activity', ({ userId, activity }) => {
      //console.log('  activity updated:', userId, activity);
      userActivities.set(userId, activity);
      io.emit('activity_updated', { userId, activity });
    });

    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // send to receiver in realtime if they are online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', message);
        }

        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Message error:', error);
        // send a realtime information, that an error occured while sending the message
        socket.emit('message_error', error.message);
      }
    });

    socket.on('disconnect', () => {
      let disconnectedUserId;
      // find disconnected user
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          disconnectedUserId = userId;
          userActivities.delete(userId);
          break;
        }
      }

      /* // but why not this way?
      userSockets.entries().find((e) => {
        const [k, v] = e.entries();
        if ((v = socket.id)) return true;
        return false;
      });
      */ // because in Node? the method find() does not exist on MapIterator

      if (disconnectedUserId) {
        io.emit('user_disconnected', disconnectedUserId);
      }
    });
  });
};
