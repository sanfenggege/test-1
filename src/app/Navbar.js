import React from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, selectAllNotifications } from "./features/notifications/notificationsSlice";

export const Navbar = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const numUnreadNotifications = notifications.filter((n) => !n.read).length;
  let unreadNotificationsBadge;

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    );
  }

  const fetchNewNotifications = () => {
    dispatch(fetchNotifications());
  };

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">文章列表</Link>
            <Link to="/addPost">添加文章</Link>
            <Link to="/users">用户列表</Link>
            <Link to="/notifications">通知列表 {unreadNotificationsBadge}</Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            刷新通知
          </button>
        </div>
      </section>
    </nav>
  )
}
