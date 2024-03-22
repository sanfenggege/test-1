import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllPosts } from "../posts/postSlice";

export const UserPage = ({ match }) => {
  const { userId } = match.params;

  const user = useSelector((state) => state.users.find((user) => user.id === userId));

  const postsForUser = useSelector((state) => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter((post) => post.user === userId);
  });

  const postTitles = postsForUser.map((post,index) => (
    <li key={post.id + index}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  );
};