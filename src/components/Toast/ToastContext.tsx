import { createContext } from 'react';

export interface Options {
  id?: string;
  duration?: number;
}

export interface ToastObject {
  title: string | null | undefined,
  content?: string;
  style?: 'info' | 'danger' | 'warning' | 'success' | null | undefined;
  icon?: string;
  options?: Options;
  key?: number;
}

export interface ToastInterface {
  add: (
    title: string | null | undefined,
    content: string,
    style: 'info' | 'danger' | 'warning' | 'success' | null | undefined,
    icon: string,
    key: number,
    options: Options
  ) => void;
}

export const ToastContext = createContext<ToastInterface | null>(null);

export const ToastContextProvider = ToastContext.Provider;

export const ToastContextConsumer = ToastContext.Consumer;
