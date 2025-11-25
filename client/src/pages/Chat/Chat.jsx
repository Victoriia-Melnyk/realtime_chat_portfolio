import { useEffect, useRef, useState } from 'react';
import { socket } from '../../socket.js';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './Chat.module.scss';
import { Pencil } from '../../images/Pencil';
import { Plane } from '../../images/Plane';

export const ChatPage = () => {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [isJoined, setIsJoined] = useState(false);
	const [newRoomName, setNewRoomName] = useState('');
	const [roomError, setRoomError] = useState('');
	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState('');
	const [editingRoomName, setEditingRoomName] = useState(false);

	const navigate = useNavigate();

	const { roomName } = useParams();
	const userName = localStorage.getItem('username');
	const userId = localStorage.getItem('userId');

	const messagesEndRef = useRef(null);

	useEffect(() => {
		const handleRoomMessages = msgs => {
			setMessages([...msgs]);
		};

		const handleJoinedRoom = room => {
			if (room === roomName) setIsJoined(true);
		};

		const handleRoomRenamed = newRoomNameValue => {
			setNewRoomName('');
			navigate(`/chat-room/${newRoomNameValue}`);
		};

		const handleRoomDeleted = () => {
			setIsJoined(false);
			setMessages([]);
			navigate('/chat-pannel');
		};

		const handleRoomError = errorMessage => {
			setRoomError(errorMessage);
		};

		const handleLeavedRoom = leavedId => {
			if (leavedId === userId) {
				setIsJoined(false);
				navigate('/chat-pannel');
			}
		};

		const handleMessageEdited = editedMessages => {
			setMessages([...editedMessages]);
		};

		socket.on('room-messages', handleRoomMessages);
		socket.on('new-message', handleRoomMessages);
		socket.on('joined-room', handleJoinedRoom);
		socket.on('room-renamed', handleRoomRenamed);
		socket.on('room-deleted', handleRoomDeleted);
		socket.on('room-error', handleRoomError);
		socket.on('leaved-room', handleLeavedRoom);
		socket.on('message-edited', handleMessageEdited);

		return () => {
			socket.off('room-messages', handleRoomMessages);
			socket.off('new-message', handleRoomMessages);
			socket.off('joined-room', handleJoinedRoom);
			socket.off('room-renamed', handleRoomRenamed);
			socket.off('room-deleted', handleRoomDeleted);
			socket.off('room-error', handleRoomError);
			socket.off('leaved-room', handleLeavedRoom);
			socket.off('message-edited', handleMessageEdited);
		};
	}, [roomName, userId, navigate]);

	useEffect(() => {
		if (!roomName || !userName || !userId) return;
		if (!socket.connected) return;

		setIsJoined(false);
		socket.emit('join-room', roomName, userName, userId);
	}, [roomName, userName, userId]);

	useEffect(() => {
		const handleReconnect = () => {
			if (roomName && userName && userId) {
				socket.emit('join-room', roomName, userName, userId);
			}
		};

		socket.on('connect', handleReconnect);

		return () => {
			socket.off('connect', handleReconnect);
		};
	}, [roomName, userName, userId]);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const handleSendMessage = () => {
		if (message.trim() && isJoined && socket.connected) {
			console.log('📤 Sending message:', message);
			socket.emit('send-message', roomName, userName, userId, message);
			setMessage('');
		}
	};

	const handleLeaveRoom = () => {
		socket.emit('leave-room', roomName, userId);
	};

	const handleRenameRoom = () => {
		const normalizedRoomName = newRoomName.trim();

		if (!normalizedRoomName) {
			setRoomError('New room name is required');
			return;
		}
		setRoomError('');
		setEditingRoomName(false);
		socket.emit('rename-room', roomName, newRoomName, userId);
	};

	const handleDeleteRoom = () => {
		socket.emit('delete-room', roomName, userId);
	};

	const handleInputChange = e => {
		setRoomError('');
		setNewRoomName(e.target.value);
	};

	const handleEditMessage = msg => {
		setEditingId(msg.messageId);
		setEditingText(msg.message);
	};

	const handleSaveEdit = () => {
		socket.emit('edit-message', roomName, editingId, editingText);
		setEditingId(null);
		setEditingText('');
	};

	const handleEditRoom = () => {
		setEditingRoomName(true);
		setNewRoomName(roomName);
	};

	const handleCancelRename = () => {
		setEditingRoomName(false);
		setNewRoomName('');
		setRoomError('');
	};

	return (
		<div className={styles.chatPage}>
			<div className={styles.chatPage__container}>
				<div className={styles.chatPage__roomName}>
					{editingRoomName ? (
						<div className={styles.chatPage__roomNameActions}>
							<input
								type="text"
								value={newRoomName}
								onChange={handleInputChange}
								onFocus={() => setRoomError('')}
							/>
							<div>
								<button onClick={handleRenameRoom}>Rename room</button>
								<button onClick={handleCancelRename}>Cancel</button>
							</div>
						</div>
					) : (
						<h1>
							Chat room: <span style={{ color: '#7b61ff' }}>{roomName}</span>
						</h1>
					)}
					{!editingRoomName && (
						<button
							className={styles.chatPage__editButton}
							onClick={handleEditRoom}
						>
							{Pencil}
						</button>
					)}
				</div>
				<div className={styles.chatPage__messagesContainer}>
					<div className={styles.chatPage__messages}>
						{messages.map(msg => {
							const isAuthor = msg.authorId === userId;
							const messageContainerClass = isAuthor
								? `${styles.chatPage__messageContainer} ${styles['chatPage__messageContainer--author']}`
								: styles.chatPage__messageContainer;
							return (
								<div key={msg.messageId} className={messageContainerClass}>
									<p className={styles.chatPage__author}>
										{isAuthor ? 'You' : msg.author}
									</p>
									<div className={styles.chatPage__message}>
										{editingId === msg.messageId ? (
											<div className={styles.chatPage__editContainer}>
												<textarea
													value={editingText}
													onChange={e => setEditingText(e.target.value)}
													rows={2}
												/>
												<div>
													<button onClick={handleSaveEdit}>Save</button>
													<button
														onClick={() => {
															setEditingId(null);
															setEditingText('');
														}}
													>
														Cancel
													</button>
												</div>
											</div>
										) : (
											<p>{msg.message}</p>
										)}
										{isAuthor && !editingId && (
											<button
												className={styles.chatPage__editButton}
												onClick={() => handleEditMessage(msg)}
											>
												{Pencil}
											</button>
										)}
									</div>
									<span>{new Date(msg.time).toLocaleString('uk-UA')}</span>
								</div>
							);
						})}
						<div ref={messagesEndRef} />
					</div>
				</div>
				<div className={styles.chatPage__messageInputContainer}>
					<textarea
						value={message}
						onChange={e => setMessage(e.target.value)}
						placeholder="Type your message here..."
						rows={2}
						className={styles.chatPage__messageInput}
					/>
					<button
						onClick={handleSendMessage}
						disabled={!isJoined || !socket.connected}
					>
						{Plane}
					</button>
				</div>
				<div className={styles.chatPage__roomActions}>
					{/* <button
						onClick={handleSendMessage}
						disabled={!isJoined || !socket.connected}
					>
						Send
					</button> */}
					<button onClick={handleLeaveRoom}>Leave the chat</button>
					<button onClick={handleDeleteRoom}>Delete room</button>
				</div>
				<p className={styles.chatPage__error}>{roomError}</p>
			</div>
		</div>
	);
};
