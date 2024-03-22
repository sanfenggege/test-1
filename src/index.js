import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './app/store';

import './index.css';

import { fetchUsers } from "./app/features/users/usersSlice";
import { fetchNotifications } from "./app/features/notifications/notificationsSlice";
import { worker } from './api/server';

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' });
  
  store.dispatch(fetchUsers());
  store.dispatch(fetchNotifications());
  
  const root = createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
}

start()
