# **Realtime Chat App 💬**

This Realtime Chat App is a modern, responsive web application that enables users to communicate instantly in chat rooms. Users can create, join, rename, and delete rooms, send and edit their own messages, and see real-time updates from other participants. The app uses Socket.IO for live communication and persists chat history and rooms on the server.

---

## **Technologies Used** 🛠️

- **React**: For building the interactive user interface.
- **SCSS (CSS Modules)**: For modular and responsive styling.
- **Node.js & Express**: Backend server for API and Socket.IO.
- **Socket.IO**: Real-time, bidirectional communication between client and server.
- **uuid**: For generating unique message and user IDs.
- **File System (fs)**: For persisting rooms and messages in JSON format on the server.

---

## **Features** ✨

- **Create & Join Rooms**: Users can create new chat rooms or join existing ones.
- **Send & Edit Messages**: Send messages in real time and edit your own messages.
- **Rename & Delete Rooms**: Room owners can rename or delete rooms.
- **Leave Room**: Users can leave rooms at any time.
- **Real-Time Updates**: All actions are instantly reflected for all users in the room.
- **Persistent Chat History**: Messages and rooms are saved on the server and restored after reloads.
- **Responsive Design**: Works well on desktop and mobile devices.

---

## **Preview** 🎉

- **Local Demo**: Run locally to see real-time chat in action.

---

## **Getting Started** 🚀

Before running this project, make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (Version **16.14.0** or higher)
- [npm](https://www.npmjs.com/)

## **Installation Instructions**

1. **Clone the Repository in your terminal**:

```bash
git clone https://github.com/Victoriia-Melnyk/realtime_chat_portfolio.git
```

2. **Open the cloned project in your IDE (e.g., VSCode)**

3. **Install Dependencies for both client and server:**

```bash
cd realtime_chat/client
npm install
cd ../server
npm install
```

4. **Start the Development Servers:**

- **Start the backend (server):**

```bash
npm run dev
```

- **Start the frontend (client):**

```bash
npm start
```

5. **Open your browser and go to** `http://localhost:3000` to use the chat app.
