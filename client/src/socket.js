import { io } from "socket.io-client";

// change this to your backend URL or localhost:5000 during local dev
const URL = "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false, // we’ll connect manually when needed
});
