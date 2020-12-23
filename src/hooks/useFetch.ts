export const useFetch = async (path, body) => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + path, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    redirect: 'follow',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
};
