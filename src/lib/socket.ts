import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getAuthToken = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^|;)\s*auth_token\s*=\s*([^;]+)/);
  return match ? match[2] : null;
};

export const initSocket = () => {
  if (!socket) {
    const token = getAuthToken();
    if (!token) return null;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      ? process.env.NEXT_PUBLIC_API_BASE_URL.replace("/api", "")
      : "http://localhost:5000";

    socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
