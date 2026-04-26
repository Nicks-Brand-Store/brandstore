import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

let id = 0;
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, opts = {}) => {
    const toast = { id: ++id, message, type: opts.type || 'info' };
    setToasts((t) => [...t, toast]);
    const timeout = opts.timeout || 3000;
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== toast.id));
    }, timeout);
  }, []);

  const removeToast = useCallback((tid) => {
    setToasts((t) => t.filter((x) => x.id !== tid));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}
