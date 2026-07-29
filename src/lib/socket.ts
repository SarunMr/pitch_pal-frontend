import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getAuthToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^|;)\s*auth_token\s*=\s*([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
};

const BASE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) return "http://localhost:5000";
  // Strip trailing /api so the socket connects to the root server
  return raw.replace(/\/api\/?$/, "");
})();

export const initSocket = (): Socket | null => {
  // Return existing connected socket
  if (socket && socket.connected) return socket;

  const token = getAuthToken();
  if (!token) return null;

  // Disconnect old disconnected socket before creating new one
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1500,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket?.id);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Try to init the socket, retrying until a token is found (up to maxAttempts).
 * Useful when called right after login before cookies are flushed to document.cookie.
 */
export const initSocketWithRetry = (
  onConnected: (s: Socket) => void,
  maxAttempts = 8,
  delayMs = 500
): (() => void) => {
  let attempts = 0;
  let timer: NodeJS.Timeout;

  const tryInit = () => {
    attempts++;
    const s = initSocket();
    if (s) {
      onConnected(s);
    } else if (attempts < maxAttempts) {
      timer = setTimeout(tryInit, delayMs);
    } else {
      console.warn("[Socket] Could not initialise after", maxAttempts, "attempts — token missing.");
    }
  };

  tryInit();

  // Return a cleanup function
  return () => clearTimeout(timer);
};
