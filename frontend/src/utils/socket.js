import { io } from 'socket.io-client'

let socketInstance = null
const defaultUrl = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:8000'

export function getSocket(token, url = defaultUrl) {
    if (!socketInstance) {
        socketInstance = io(url, {
            transports: ['websocket'],
            withCredentials: true,
            auth: { token }
        })
    }
    return socketInstance
}

export function disconnectSocket() {
    if (socketInstance) {
        socketInstance.disconnect()
        socketInstance = null
    }
}


