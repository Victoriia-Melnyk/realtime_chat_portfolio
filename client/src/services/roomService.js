export const getRooms = async () => {
	const res = await fetch('https://realtime-chat-portfolio.onrender.com/rooms');
	return res.json();
};
