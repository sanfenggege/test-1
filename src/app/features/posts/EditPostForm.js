import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postUpdated, selectPostById } from "./postSlice";

export const EditPostForm = ({ match }) => {
  const { postId } = match.params;
  
  const users = useSelector((state) => state.users);

  const post = useSelector((state) => selectPostById(state, postId));

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [userId, setUserId] = useState(post.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({ id: postId, title, content, userId }));
      history.push(`/posts/${postId}`);
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>编辑文章</h2>
      <form>
        <label htmlFor="postTitle">文章标题：</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        保存文章
      </button>
    </section>
  );
};