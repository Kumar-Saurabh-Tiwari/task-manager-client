const API_URL = process.env.NEXT_PUBLIC_API_URL + '/notifications';

export const scheduleNotification = async ({
  title,
  body,
  token,
  scheduledTime,
}: {
  title: string;
  body: string;
  token: any;
  scheduledTime: string; 
}) => {
  const res = await fetch(`${API_URL}/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body, token, scheduledTime }),
  });

  return res.json();
};