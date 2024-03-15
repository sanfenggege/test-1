import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "./postSlice";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [addError, setAddError] = useState("");
  const dispatch= useDispatch();
  const users = useSelector((state) => state.users);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);
  
  // const onSavePostClicked = ()=>{
  //   if(title && content){
  //       dispatch(postAdded(title, content, userId));
  //       setTitle("");
  //       setContent("");
  //       setUserId("");
  //   } else {
  //       alert('Please add title and content!');
  //   }
  // }

  // const canSave = Boolean(title) && Boolean(content) && Boolean(userId);
  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        await dispatch(addNewPost({ title, content, user: userId })).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
      } catch (err) {
        console.error("Failed to save the post: ", err);
        // 如果你想查看 addNewPost API 调用失败时如何处理，请尝试创建一个新帖子，其中“内容”字段只有“error”一词（不含引号）。服务器将看到并发送回失败的响应，这样你应该会看到控制台记录一条日志。
        setAddError(err.message);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>添加新文章</h2>
      <form>
        <label htmlFor="postTitle">文章标题:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
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
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>保存文章</button>
        <p className="addPost-notice">{addError}</p>
      </form>
    </section>
  );
};