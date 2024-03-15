import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../../api/client";

const initialState = {
  posts:[],
  status: "idle",
  error: null,
};

// Redux Toolkit 的 createAsyncThunk API 生成 thunk，为你自动 dispatch 那些 "start/success/failure" action。
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client.get("/fakeApi/posts");
  return response.data;
});

// new postAdded by API:
export const addNewPost = createAsyncThunk("posts/addNewPost",
  // payload 创建者接收部分“{title, content, user}”对象
  async (initialPost) => {
    // 我们发送初始数据到 API server
    const response = await client.post("/fakeApi/posts", initialPost);
    // 响应包括完整的帖子对象，包括唯一 ID
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // old postAdded:
    // postAdded: {
    //     reducer(state, action) {
    //       state.posts.push(action.payload);
    //     },
    //     prepare(title, content, userId) {
    //       return {
    //         payload: {
    //           id: nanoid(),
    //           date: new Date().toISOString(),
    //           title,
    //           content,
    //           user: userId,
    //           reactions: {
    //             thumbsUp: 0,
    //             hooray: 0,
    //             heart: 0,
    //             rocket: 0,
    //             eyes:0,
    //           },
    //         },
    //       };
    //     },
    //   },

    postUpdated(state, action){
        const { id, title, content, userId } = action.payload;
        const existingPost = state.posts.find((post) => post.id === id);
        if (existingPost) {
          existingPost.title = title;
          existingPost.content = content;
          existingPost.user = userId;
          existingPost.date = new Date().toISOString();
        }
      },

    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },

  // extraReducers 选项是一个接收名为 builder 的参数的函数。
  // builder 对象提供了一些方法，让我们可以定义额外的 case reducer，这些 reducer 将响应在 slice 之外定义的 action。
  // 我们将使用 builder.addCase(actionCreator, reducer) 来处理异步 thunk dispatch 的每个 action。
  // extraReducers(builder) {
  //   builder
  //     .addCase(fetchPosts.pending, (state, action) => {
  //       state.status = "loading";
  //     })
  //     .addCase(fetchPosts.fulfilled, (state, action) => {
  //       state.status = "succeeded";
  //       // Add any fetched posts to the array
  //       state.posts = state.posts.concat(action.payload);
  //     })
  //     .addCase(fetchPosts.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.error.message;
  //     });
  // },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { postAdded, postUpdated, reactionAdded} = postsSlice.actions;

export default postsSlice.reducer;

// 可以编写可复用的“selector 选择器”函数来封装从 Redux 状态中读取数据的逻辑,选择器是一种函数，它接收 Redux state 作为参数，并返回一些数据
export const selectAllPosts = (state) => state.posts.posts;
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;
export const selectPostById = (state, postId) => state.posts.posts.find((post) => post.id === postId);

// 一：
// 使用 Middleware 处理异步逻辑:
// 就其本身而言，Redux store 对异步逻辑一无所知。它只知道如何同步 dispatch action，通过调用 root reducer 函数更新状态，并通知 UI 某些事情发生了变化。任何异步都必须发生在 store 之外。

// 但是，如果你希望通过调度或检查当前 store 状态来使异步逻辑与 store 交互，该怎么办？ 这就是 Redux middleware 的用武之地。它们扩展了 store，并允许你：

// dispatch action 时执行额外的逻辑（例如打印 action 的日志和状态）
// 暂停、修改、延迟、替换或停止 dispatch 的 action
// 编写可以访问 dispatch 和 getState 的额外代码
// 教 dispatch 如何接受除普通 action 对象之外的其他值，例如函数和 promise，通过拦截它们并 dispatch 实际 action 对象来代替
// 使用 middleware 的最常见原因是允许不同类型的异步逻辑与 store 交互。这允许你编写可以 dispatch action 和检查 store 状态的代码，同时使该逻辑与你的 UI 分开。

// Redux 有多种异步 middleware，每一种都允许你使用不同的语法编写逻辑。最常见的异步 middleware 是 redux-thunk，它可以让你编写可能直接包含异步逻辑的普通函数。
// Redux Toolkit 的 configureStore 功能默认自动设置 thunk middleware，我们推荐使用 thunk 作为 Redux 开发异步逻辑的标准方式。

// 二：
// 可以编写可复用的“selector 选择器”函数来封装从 Redux 状态中读取数据的逻辑，选择器是一种函数，它接收 Redux state 作为参数，并返回一些数据
// Redux 使用叫做“ middleware ”这样的插件模式来开发异步逻辑，官方的处理异步 middleware 叫 redux-thunk，包含在 Redux Toolkit 中
// Thunk 函数接收 dispatch 和getState 作为参数，并且可以在异步逻辑中使用它们，你可以 dispatch 其他 action 来帮助跟踪 API 调用的加载状态
// 典型的模式是在调用之前 dispatch 一个 "pending" 的 action，然后是包含数据的 “success” 或包含错误的 “failure” action
// 加载状态通常应该使用枚举类型，如 'idle' | 'loading' | 'succeeded' | 'failed'
// **Redux Toolkit 有一个 createAsyncThunk API 可以为你 dispatch 这些 action **
// createAsyncThunk 接受一个 “payload creator” 回调函数，它应该返回一个 Promise，并自动生成 pending/fulfilled/rejected action 类型
// 像 fetchPosts 这样生成的 action creator 根据你返回的 Promise dispatch 这些 action
// 可以使用 extraReducers 字段在 createSlice 中监听这些 action，并根据这些 action 更新 reducer 中的状态。
// action creator 可用于自动填充 extraReducers 对象的键，以便切片知道要监听的 action。
// Thunk 可以返回 promise。 具体对于createAsyncThunk，你可以await dispatch(someThunk()).unwrap()来处理组件级别的请求成功或失败。
