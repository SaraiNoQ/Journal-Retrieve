// if (!process.env.NEXT_PUBLIC_API_SECRET_KEY) {
//   throw new Error('API密钥未设置，请在.env文件中设置 NEXT_PUBLIC_API_SECRET_KEY');
// }

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('API基础URL未设置，请在.env文件中设置 NEXT_PUBLIC_API_BASE_URL');
}

export const API_CONFIG = {
  SECRET_KEY: process.env.NEXT_PUBLIC_API_SECRET_KEY,
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
} as const; 