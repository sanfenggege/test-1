import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";
import { selectAllPosts, fetchPosts } from "./postSlice";

let PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  );
};

PostExcerpt = React.memo(PostExcerpt);

export const PostsList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector((state) => state.posts.status);
  const postsError = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch]);

  let content;
  if (postsStatus === "loading") {
    content = <Spinner text="Loading..." />;
  } else if (postsStatus === "succeeded") {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post,index) => (
      <PostExcerpt key={post.id + index} post={post} />
    ));
  } else if (postsStatus === "failed") {
    content = <div>{postsError}</div>;
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );

  // old version:
  // sort by date：
  // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
  // const renderedPosts = orderedPosts.map((post) => (
  //   <article className="post-excerpt" key={post.id}>
  //     <h3>{post.title}</h3>
  //     <p className="post-content">{post.content}</p>
  //     <PostAuthor userId={post.user} />
  //     <TimeAgo timestamp={post.date} />
  //     <ReactionButtons post={post} />
  //     <Link to={`/posts/${post.id}`} className="button muted-button">
  //       View Post
  //     </Link>
  //   </article>
  // ));
  // return (
  //   <section className="posts-list">
  //     <h2>Posts</h2>
  //     {renderedPosts}
  //   </section>
  // );
};