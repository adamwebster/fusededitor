export const useFetch = async (url, body) => {
  const response = await fetch(url, {
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
