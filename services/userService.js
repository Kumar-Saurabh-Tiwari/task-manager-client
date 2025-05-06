const API_URL =
  process.env.NEXT_PUBLIC_API_URL + '/users' ||
  'https://your-backend.onrender.com/api/users';

const getToken = () => localStorage.getItem('token');

export const searchUsers = async (query) => {
    const res = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.json();
  };
  