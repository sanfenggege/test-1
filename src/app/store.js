import { configureStore } from "@reduxjs/toolkit";
import postsReducer from  "../app/features/posts/postSlice";
import usersSlice from "./features/users/usersSlice";
import notificationsSlice from "./features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersSlice,
    Notifications: notificationsSlice,
  },
});