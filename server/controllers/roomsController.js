import * as roomsServices from '../services/roomsServices.js';

export const getRoomsRequest = async (req, res) => {
	res.json(await roomsServices.getRooms());
};

export const createRoomEvent = (socket, io) => {
	socket.on('create-room', async ({ roomName, ownerName, ownerId }) => {
		try {
			const createdRoom = await roomsServices.createRoom({
				name: roomName,
				ownerName,
				ownerId,
			});
			socket.emit('room-created', createdRoom.name);
			io.emit('rooms-updated', await roomsServices.getRooms());
		} catch (e) {
			socket.emit('room-error', e.message);
		}
	});
};

export const sendMessageEvent = (socket, io) => {
	socket.on('send-message', async (roomName, userName, userId, message) => {
		try {
			const messages = await roomsServices.sendMessage(
				roomName,
				userName,
				userId,
				message
			);
			io.to(roomName).emit('new-message', messages);
		} catch (e) {
			socket.emit('room-error', e.message);
		}
	});
};

export const joinRoomEvent = socket => {
	socket.on('join-room', async (roomName, userName, userId) => {
		try {
			const roomToJoin = await roomsServices.joinRoom(
				roomName,
				userName,
				userId
			);
			socket.join(roomName);
			socket.emit('joined-room', roomToJoin.name);
			socket.emit('room-messages', roomToJoin.messages);
		} catch (e) {
			socket.emit('room-error', e.message);
			return;
		}
	});
};

export const leaveRoomEvent = (socket, io) => {
	socket.on('leave-room', async (roomName, userId) => {
		try {
			await roomsServices.leaveRoom(roomName, userId);
			socket.leave(roomName);
			socket.emit('leaved-room', userId);
		} catch (e) {
			socket.emit('room-error', e.message);
		}
	});
};

export const renameRoomEvent = (socket, io) => {
	socket.on('rename-room', async (oldRoomName, newRoomName, userId) => {
		try {
			await roomsServices.renameRoom(oldRoomName, newRoomName, userId);
			io.to(oldRoomName).emit('room-renamed', newRoomName);
		} catch (e) {
			socket.emit('room-error', e.message);
		}
	});
};

export const deleteRoomEvent = (socket, io) => {
	socket.on('delete-room', async (roomName, userId) => {
		try {
			await roomsServices.deleteRoom(roomName, userId);
			io.to(roomName).emit('room-deleted', roomName);
		} catch (e) {
			socket.emit('room-error', e.message);
			return;
		}
	});
};

export const editMessageEvent = (socket, io) => {
	socket.on('edit-message', async (roomName, editingId, editingText) => {
		try {
			const messages = await roomsServices.editMessage(
				roomName,
				editingId,
				editingText
			);
			io.to(roomName).emit('message-edited', messages);
		} catch (e) {
			socket.emit('room-error', e.message);
		}
	});
};
