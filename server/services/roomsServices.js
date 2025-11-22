import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const ROOMS_FILE = './rooms.json';

const loadRooms = async () => {
	if (existsSync(ROOMS_FILE)) {
		const data = await fs.readFile(ROOMS_FILE, 'utf-8');
		return JSON.parse(data);
	}
	return [];
};

const saveRooms = async rooms => {
	await fs.writeFile(ROOMS_FILE, JSON.stringify(rooms, null, 2));
};

export const getRooms = async () => {
	const latestRooms = await loadRooms();
	return latestRooms.map(room => room.name);
};

export const getRoomByName = async roomName => {
	const latestRooms = await loadRooms();
	return latestRooms.find(room => room.name === roomName);
};

export const createRoom = async ({ name, ownerName, ownerId }) => {
	const latestRooms = await loadRooms();
	const room = latestRooms.find(room => room.name === name);

	if (room) {
		throw new Error('Room already exists');
	}

	const newRoom = {
		name,
		ownerName,
		ownerId,
		messages: [],
		participants: [{ userId: ownerId, name: ownerName }],
	};

	latestRooms.push(newRoom);
	await saveRooms(latestRooms);
	return newRoom;
};

export const sendMessage = async (roomName, userName, userId, message) => {
	const latestRooms = await loadRooms();
	const room = latestRooms.find(room => room.name === roomName);

	if (!room) {
		throw new Error('Room not found');
	}

	const messageData = {
		messageId: uuidv4(),
		author: userName,
		authorId: userId,
		message,
		time: new Date(),
	};

	room.messages.push(messageData);
	await saveRooms(latestRooms);
	return room.messages;
};

export const joinRoom = async (roomName, userName, userId) => {
	const latestRooms = await loadRooms();
	const room = latestRooms.find(room => room.name === roomName);

	if (!room) {
		throw new Error('Room not found');
	}

	const participantExists = room.participants.some(
		participant => participant.userId === userId
	);

	if (!participantExists) {
		room.participants.push({ userId: userId, name: userName });
		await saveRooms(latestRooms);
	}

	return room;
};

export const leaveRoom = async (roomName, userId) => {
	const latestRooms = await loadRooms();
	const room = latestRooms.find(room => room.name === roomName);

	if (!room) {
		throw new Error('Room not found');
	}

	room.participants = room.participants.filter(p => p.userId !== userId);
	await saveRooms(latestRooms);

	return room;
};

export const renameRoom = async (oldRoomName, newRoomName, userId) => {
	const latestRooms = await loadRooms();
	const room = latestRooms.find(room => room.name === oldRoomName);

	if (!room) {
		throw new Error('Room not found');
	}

	const isOwner = room.ownerId === userId;

	if (!isOwner) {
		throw new Error('Only the room owner can rename the room');
	}

	room.name = newRoomName;
	await saveRooms(latestRooms);

	return room;
};

export const deleteRoom = async (roomName, userId) => {
	const latestRooms = await loadRooms();
	const room = latestRooms.find(room => room.name === roomName);

	if (!room) {
		throw new Error('Room not found');
	}

	const isOwner = room.ownerId === userId;

	if (!isOwner) {
		throw new Error('Only the room owner can delete the room');
	}

	const index = latestRooms.findIndex(room => room.name === roomName);

	if (index !== -1) {
		latestRooms.splice(index, 1);
	}

	await saveRooms(latestRooms);

	return latestRooms;
};

export const editMessage = async (roomName, editingId, editingText) => {
	const latestRooms = await loadRooms();
	const room = latestRooms.find(room => room.name === roomName);

	if (!room) {
		throw new Error('Room not found');
	}

	const message = room.messages.find(msg => msg.messageId === editingId);

	if (!message) {
		throw new Error('Message not found');
	}

	message.message = editingText;
	await saveRooms(latestRooms);

	return room.messages;
};
