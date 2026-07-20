import { Platform } from 'react-native';

const DEFAULT_LAN_IP = '192.168.1.10';
const DEFAULT_API_PORT = '5000';

export const API_HOST = process.env.EXPO_PUBLIC_API_HOST || DEFAULT_LAN_IP;
export const API_PORT = process.env.EXPO_PUBLIC_API_PORT || DEFAULT_API_PORT;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'web'
    ? `http://localhost:${API_PORT}/api`
    : `http://${API_HOST}:${API_PORT}/api`);

export const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');
