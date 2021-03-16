import { computeStyles } from '@popperjs/core';
import axios from 'axios';

export const useFetch = async (path: string, body: any) => {
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

export const useFetchFileUpload = async (path: string, data: any) => {
  const response = await axios({
    method: 'post',
    url: process.env.NEXT_PUBLIC_API_BASE_URL + path,
    data,
    withCredentials: true,
  }).then(resp => {
    return resp.data;
  });
  return response;
};
