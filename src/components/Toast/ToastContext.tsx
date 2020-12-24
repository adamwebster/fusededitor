import { createContext } from 'react';

export interface Options {
  id?: string;
  duration?: number;
}

export interface ToastObject {
  title: string;
  content?: string;
  style?: string;
  icon?: string;
  options?: Options;
  key?: number;
}

export interface ToastInterface {
  add: (
    title: string,
    content: string,
    style: string,
    icon: string,
    key: number,
    options: Options
  ) => void;
}

export const ToastContext = createContext<ToastInterface | null>(null);

export const ToastContextProvider = ToastContext.Provider;

export const ToastContextConsumer = ToastContext.Consumer;
