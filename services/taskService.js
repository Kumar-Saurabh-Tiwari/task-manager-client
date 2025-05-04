const API_URL =
  process.env.NEXT_PUBLIC_API_URL + '/tasks' ||
  'https://your-backend.onrender.com/api/tasks';

const getToken = () => localStorage.getItem('token');

export const getTasks = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const createTask = async (taskData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(taskData),
  });
  return res.json();
};

export const updateTask = async (id, updates) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const assignTask = async (id, userId) => {
  const res = await fetch(`${API_URL}/${id}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ userId }),
  });
  return res.json();
};
