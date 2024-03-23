# [Redux基础](https://www.redux.org.cn)

## [Store 总结](https://www.redux.org.cn/tutorials/fundamentals/part-4-store.html)

1. dux 应用程序始终只有一个 store
    1. 使用 Redux createStore API 创建 store
    2. 每个 store 都有一个独立的根 reducer 方法
2. Stores 主要有三种方法
    1. getState 返回当前 state
    2. dispatch 向 reducer 发送一个 action 来更新 state
    3. subscribe 接受一个监听器回调，该回调在每次 dispatch action 时运行
3. Store enhancers 让我们能够在创建 store 时进行自定义操作
    1. Enhancers 包装了 store 并且可以覆盖它的方法
    2. createStore 接受一个 enhancer 作为参数
    3. 可以使用 compose API 将多个 enhancers 合并在一起
4. Middleware 是自定义 store 的主要方式
    1. 使用 applyMiddleware enhancer 添加 middleware
    2. Middleware 被写成三个相互嵌套的函数
    3. 每次 dispatch action 时都会运行 middleware
    4. Middleware 内部可能有副作用
5. Redux DevTools 可让你查看应用程序随时间发生的变化
    1. DevTools 扩展可以安装在你的浏览器中
    2. Store 需要添加 DevTools enhancer，使用 composeWithDevTools
    3. DevTools 显示已 dispatch action 和 state 随时间的变化

***
## UI && React

```
<!-- 1) 使用 `createStore` 函数创建 Redux store -->
const store = Redux.createStore(counterReducer);

<!-- 2) 订阅更新（以便将来数据更改时能够重绘） -->
store.subscribe(render);

<!-- 我们的“用户界面”是单个 HTML 元素中的一些文本 -->
const valueEl = document.getElementById("value");

<!-- 3) 当订阅回调函数运行时： -->
function render() {
  <!-- 3.1) 获取当前 store 的 state -->
  const state = store.getState();
  <!-- 3.2) 提取你想要的数据 -->
  const newValue = state.value.toString();
  <!-- 3.3) 使用新值更新 UI -->
  valueEl.innerHTML = newValue;
}

<!-- 4) 使用初始 state 渲染 UI -->
render();

<!-- 5) 基于 UI 输入 dispatch action -->
document.getElementById("increment").addEventListener("click", function () {
  store.dispatch({ type: "counter/incremented" });
});
```

1. Redux stores 可以和任何 UI 层一起使用
    1. UI 代码始终订阅 store 以获取最新的 state，并自行重绘
2. React-Redux 是 React 的官方 Redux UI 绑定库
    1. React-Redux 作为单独的 react-redux 包安装
3. useSelector hook 使得 React 组件能够从 store 中读取数据
    1. selector 函数将整个 store state 作为参数，并根据该 state 返回一个值
    2. useSelector 调用它的 selector 函数并返回 selector 返回的结果
    3. useSelector 订阅 store，并在每次 dispatch action 时重新运行 selector
    4. 每当 selector 结果发生变化时，useSelector 将强制组件使用新数据重新渲染
4. useDispatch hook 使得 React 组件能够向 store dispatch action
    1. useDispatch 返回实际的 store.dispatch 函数
    2. 你可以根据需要在组件内部调用 dispatch(action)
5. \<Provider> 组件使其他 React 组件可以和 store 进行交互
    1. 使用 \<Provider store={store}> 组件包裹 \<App>

***
## 异步逻辑和数据获取

1. Redux middleware 旨在支持编写具有副作用的逻辑
    1. “副作用”是指更改函数外部 state 或行为的代码:
        1. 在控制台打印日志
        2. 保存文件
        3. 设置异步定时器
        4. 发送 AJAX HTTP 请求
        5. 修改存在于函数之外的某些 state，或改变函数的参数
        6. 生成随机数或唯一随机 ID（例如 Math.random() 或 Date.now()）
1. middleware 为标准 Redux 数据流增加了一个额外的步骤
    1. middleware 可以拦截传递给 dispatch 的其他值
    2. middleware 可以访问 dispatch 和 getState，因此它们可以作为异步逻辑的一部分 dispatch 更多 action
2. Redux “Thunk” middleware 使得可以传递函数给 dispatch
    3. “Thunk” 函数让我们可以提前编写异步逻辑，而不需要知道当前使用的 Redux store
    4. Redux thunk 函数接收 dispatch 和 getState 作为参数，并且可以 dispatch 诸如“此数据是从 API 响应中接收到的”之类的 action

***
## 标准 Redux 模式

1. Action creators 函数可以封装关于 action 对象和 thunks 的逻辑
    1. Action creators 可以接受参数并包含设置逻辑，并返回最终的 action 对象或 thunk 函数
2. 记忆化（memoized）selectors 有助于提高 Redux 应用性能
    1. Reselect 有一个 createSelector API 可以生成记忆化（memoized）selectors
    2. 如果给记忆化（memoized）selectors 传入相同的参数，将返回相同的结果（引用）
3. 请求状态应存储为枚举值，而不是布尔值
    1. 使用 'idle', 'loading', 'succeeded', 'failed'等枚举有助于一致地跟踪状态
4. Flux Standard Actions 是管理 action 对象公认的约定
    1. 在 Actions 里，payload 表示数据，meta 表示额外的描述，error 表示错误信息
5. 规范化 state 使按 ID 查找项目变得更加容易
    1. 规范化数据存储在对象而不是数组中，以项目 ID 作为键
6. Thunks 可以从 dispatch 中返回 promise
    1. 组件内可以等待异步 thunks 完成后再处理一些逻辑

***
## [使用 Redux Toolkit 的现代 Redux](https://www.redux.org.cn/tutorials/fundamentals/part-8-modern-redux.html)

1. Redux Toolkit (RTK) 是编写 Redux 逻辑的标准方式:
    1. RTK 包含用于简化大多数 Redux 代码的 API
    2. RTK 围绕 Redux 核心，并包含其他有用的包
2. configureStore 用来设置一个具有良好默认值的 Redux store:
    1. 自动组合 slice reducers 来创建根 reducer
    2. 自动设置 Redux DevTools 扩展和调试 middleware
3. createSlice 简化了 Redux actions 和 reducers 的编写:
    1. 根据 slice/reducer 名称自动生成 action creators
    2. Reducers 可以使用 Immer 在 createSlice 中“改变”（mutate）state
4. createAsyncThunk 为异步调用生成 thunk:
    1. 4自动生成一个 thunk + pending/fulfilled/rejected action creators
    2. dispatch thunk 运行 payload creator 并 dispatch actions
    3. 可以在 createSlice.extraReducers 中处理 thunk actions
5. createEntityAdapter 为标准化 state 提供了 reducers + selectors:
    1. 包括用于常见任务的 reducer 功能，例如添加/更新/删除 items
    2. 为 selectAll 和 selectById 生成记忆化 selectors
