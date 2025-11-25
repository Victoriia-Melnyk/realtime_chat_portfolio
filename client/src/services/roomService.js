export const getRooms = async () => {
	const res = await fetch(`${process.env.REACT_APP_API_URL}/rooms`);
	return res.json();
};
