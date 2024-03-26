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
    1. “Thunk” 函数让我们可以提前编写异步逻辑，而不需要知道当前使用的 Redux store
    2. Redux thunk 函数接收 dispatch 和 getState 作为参数，并且可以 dispatch 诸如“此数据是从 API 响应中接收到的”之类的 action

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

***

## [Redux VS Flux](https://www.redux.org.cn/understanding/history-and-design/PriorArt.html)

1. Flux VS Redux:
    1. Redux 的灵感来源于 Flux 的几个重要特性。和 Flux 一样，Redux 规定，将模型的更新逻辑全部集中于一个特定的层（Flux 里的 store，Redux 里的 reducer）。Flux 和 Redux 都不允许程序直接修改数据，而是用一个叫作 action 的普通对象来对更改进行描述。

    2. 而不同于 Flux ，Redux 并没有 dispatcher 的概念。原因是它依赖纯函数来替代事件处理器。纯函数构建简单，也不需额外的实体来管理它们。你可以将这点看作这两个框架的差异或细节实现，取决于你怎么看 Flux。Flux 常常被表述为 (state, action) => state。从这个意义上说，Redux 无疑是 Flux 架构的实现，且得益于纯函数使其更简单。

    3. 和 Flux 的另一个重大区别，是 Redux 认为你永远不会变更数据。你可以使用简单对象或数组来表示 state，但麻烦的是你要在 reducers 中改变他们。你应该在 reducer 中返回一个新对象来更新 state，你可以配合 object spread 运算符提案 或使用一些库，比如 Immer immutable 变更库。

    4. 虽然出于性能方面的考虑，写非纯函数的 reducer 来变更数据在技术上是可行的，但我们并不鼓励这么做。不纯的 reducer 不能实现一些开发特性，如时间旅行、记录/回放或热加载。此外，在大部分实际应用中，这种数据不可变动的特性并不会带来性能问题，就像 Om 显示的，即使对象分配失败，仍可以防止昂贵的重渲染和重计算。而得益于 reducer 是纯函数，应用内的变化更是一目了然。(因为 Redux 的价值，Flux 的创始人们高度赞扬了 Redux)

2. flux:
   1. Flux是由Facebook提出的一个应用架构，用于构建客户端Web应用。它更多的是一种模式而非具体的库实现。 Flux应用的核心特点包括：
   2. 特点：
       1. Dispatcher：应用中有一个单一的dispatcher，所有的Actions都会经过这个Dispatcher。
       2. Stores：负责存储状态和逻辑的容器。在Flux架构中，可以有多个Store，每个Store负责管理应用状态的一个特定部分。
       3. Views：通常是React组件，从Stores中读取状态，并随状态更新而重新渲染。
       4. Actions：是触发状态变化的信息载体。在Flux中，视图（View）不直接与Store交互，而是通过分发（dispatching）Action来请求数据变化。
   3. Flux的特点是强调了一个单向的数据流，使得应用架构变得清晰和可预测。然而，Flux本身并没有严格的规范，不同的实现之间可能会有所不同.

3. Redux:
   1. Redux是由Dan Abramov和Andrew Clark创建的，受Flux架构的启发但简化了很多概念，并增加了一些自己的特色：
   2. 单一真实数据源：Redux使用单一的store来存储整个应用的状态。这使得状态的管理变得更加一致和易于调试，特别是配合时间旅行等调试工具时。
   3. 状态是只读的：唯一改变状态的方式是触发action。
   4. 使用纯函数执行修改：为了指定状态树是如何由actions转换的，需要编写reducers。Reducers是纯函数，它们接收先前的状态和一个action，并返回新的状态。

4. 主要差异：
    1. Store的数量：Flux允许有多个Store；Redux建议有一个单一的Store。
    2. Reducer和Dispatcher：Flux有一个Dispatcher来控制action的分发，每个Store根据需要自己处理action。Redux没有Dispatcher的概念，而是通过Reducer函数来处理所有action，Reducer负责根据action更新状态。

5. 选择依据：
    1. 如果你的应用状态管理非常复杂，需要更多的灵活性和分散的状态管理，Flux可能是一个好选择。
    2. 如果你倾向于有一个集中的状态管理，以及更简单的数据流和更强大的调试能力，Redux可能更适合。

***

## [redux-toolkit](https://www.redux.org.cn/redux-toolkit/)

1. Redux Toolkit 是什么？
   1. Redux Toolkit 是 Redux 官方强烈推荐，开箱即用的一个高效的 Redux 开发工具集。
   2. 它旨在成为标准的 Redux 逻辑开发模式，我们强烈建议你使用它。
2. 包含了什么:
    1. configureStore()：封装了createStore，简化配置项，提供一些现成的默认配置项。它可以自动组合 slice 的 reducer，可以添加任何 Redux 中间件，默认情况下包含 redux-thunk，并开启了 Redux DevTools 扩展。
    2. createReducer() 帮你将 action type 映射到 reducer 函数，而不是编写 switch...case 语句。另外，它会自动使用 immer 库来让你使用普通的 mutable 代码编写更简单的 immutable 更新，例如 state.todos[3].completed = true。
    3. createAction() 生成给定 action type 字符串的 action creator 函数。该函数本身已定义了 toString()，因此可以代替常量类型使用。
    4. createSlice() 接收一组 reducer 函数的对象，一个 slice 切片名和初始状态 initial state，并自动生成具有相应 action creator 和 action type 的 slice reducer。
    5. createAsyncThunk: 接收一个 action type 字符串和一个返回值为 promise 的函数, 并生成一个 thunk 函数，这个 thunk 函数可以基于之前那个 promise ，dispatch 一组 type 为 pending/fulfilled/rejected 的 action。
    6. createEntityAdapter: 生成一系列可复用的 reducer 和 selector，从而管理 store 中的规范化数据。
    7. createSelector 来源于 Reselect 库，重新 export 出来以方便使用。
    8. Redux Toolkit 更是提供一个新的 RTK Query 数据请求 API。RTK Query 是为 Redux 打造数据请求和缓存的强有力的工具。 它设计出来就是为了 web 应用中加载数据的通用用例，免得手动去写数据请求和缓存的逻辑。
3. 安装:
    ```
    <!-- # NPM -->
    npm install @reduxjs/toolkit

    <!-- # Yarn -->
    yarn add @reduxjs/toolkit
    ```

***

## [Redux API](https://www.redux.org.cn/api/)

1. createStore(reducer, [preloadedState], [enhancer]):
    1. 创建一个包含程序完整 state 树的 Redux store 。 应用中应有且仅有一个 store。
    2. 参数:
        1. reducer (Function): 接收两个参数，分别是当前的 state 树和要处理的 action，返回新的 state 树。

        2. [preloadedState] (any): 初始时的 state。你可以决定是否把服务端传来的 state 水合（hydrate）后传给它，或者从之前保存的用户会话中恢复一个传给它。如果你使用 combineReducers 创建 reducer，它必须是一个普通对象，与传入的 keys 保持同样的结构。否则，你可以自由传入任何 reducer 可理解的内容。

        3. enhancer (Function): Store enhancer。你可以选择指定它以使用第三方功能，如 middleware、时间旅行、持久化来增强 store。Redux 中唯一内置的 store enhander 是 applyMiddleware()。

    3. 返回值: (Store): 保存了应用程序所有 state 的对象。改变 state 的惟一方法是 dispatch action。你也可以 subscribe state 的变化，然后更新 UI。

2. combineReducers(reducers): 
    1. combineReducers 辅助函数的作用是，把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数，然后就可以对这个 reducer 调用 createStore 方法。

    2. 合并后的 reducer 可以调用各个子 reducer，并把它们返回的结果合并成一个 state 对象。 由 combineReducers() 返回的 state 对象，会将传入的每个 reducer 返回的 state 按其传递给 combineReducers() 时对应的 key 进行命名。
    3. 示例：
        ```
        rootReducer = combineReducers({potato: potatoReducer, tomato: tomatoReducer})
            // 这将返回如下的 state 对象
            {
            potato: {
                // ... potatoes, 和一些其他由 potatoReducer 管理的 state 对象 ...
            },
            tomato: {
                // ... tomatoes, 和一些其他由 tomatoReducer 管理的 state 对象，比如说 sauce 属性 ...
            }
        }
        ```
    4. 手写简单实现：
        ```
        function combineReducers(reducerMap) {
            <!-- 先把参数里面所有的键值拿出来 -->
            const reducerKeys = Object.keys(reducerMap);

            <!-- 返回值是一个普通结构的reducer函数 -->
            const reducer = (state = {}, action) => {
                const newState = {};

                for(let i = 0; i < reducerKeys.length; i++) {
                <!-- reducerMap里面每个键的值都是一个reducer，我们把它拿出来运行下就可以得到对应键新的state值
                然后将所有reducer返回的state按照参数里面的key组装好
                最后再返回组装好的newState就行 -->
                const key = reducerKeys[i];
                const currentReducer = reducerMap[key];
                const prevState = state[key];
                newState[key] = currentReducer(prevState, action);
                }

                return newState;
            };

            return reducer;
        }
        ```

3. applyMiddleware(...middleware):
   1. 使用包含自定义功能的 middleware 来扩展 Redux 是一种推荐的方式.
   2. Middleware:
        1. Middleware 可以让你包装 store 的 dispatch 方法来达到你想要的目的。
        2. 同时，middleware 还拥有 “可组合” 这一关键特性。
        3. 多个 middleware 可以被组合到一起使用，形成 middleware 链。其中，每个 middleware 都不需要关心链中它前后的 middleware 的任何信息。
        4. Middleware 最常见的使用场景是无需引用大量代码或依赖类似 Rx 的第三方库实现异步 actions。这种方式可以让你像 dispatch 一般的 actions 那样 dispatch 异步 actions。
        5. 例如，redux-thunk 支持 dispatch function，以此让 action creator 控制反转。被 dispatch 的 function 会接收 dispatch 作为参数，并且可以异步调用它。这类的 function 就称为 thunk。另一个 middleware 的示例是 redux-promise。它支持 dispatch 一个异步的 Promise action，并且在 Promise resolve 后可以 dispatch 一个普通的 action。
        6. Middleware 并不需要和 createStore 绑在一起使用，也不是 Redux 架构的基础组成部分，但它带来的益处让我们认为有必要在 Redux 核心中包含对它的支持。因此，虽然不同的 middleware 可能在易用性和用法上有所不同，它仍被作为扩展 dispatch 的唯一标准的方式。
   3. 参数 (arguments) ...middleware:
        遵循 Redux middleware API 的函数。每个 middleware 接受 Store 的 dispatch 和 getState 函数作为命名参数，并返回一个函数。该函数会被传入被称为 next 的下一个 middleware 的 dispatch 方法，并返回一个接收 action 的新函数，这个函数可以直接调用 next(action)，或者在其他需要的时刻调用，甚至根本不去调用它。调用链中最后一个 middleware 会接受真实的 store 的 dispatch 方法作为 next 参数，并借此结束调用链。所以，middleware 的函数签名是 ({ getState, dispatch }) => next => action。
   4. 返回值(Function):
        一个应用了 middleware 后的 store enhancer。这个 store enhancer 的签名是 createStore => createStore，但是最简单的使用方法就是直接作为最后一个 enhancer 参数传递给 createStore() 函数。

4. compose(...functions):
    1. 从右到左来组合多个函数。这是函数式编程中的方法，为了方便，被放到了 Redux 里。当需要把多个 store enhancers 依次执行的时候，需要用到它。
    2. 参数(arguments): 需要合成的多个函数。预计每个函数都接收一个参数。它的返回值将作为一个参数提供给它左边的函数，以此类推。例外是最右边的参数可以接受多个参数，因为它将为由此产生的函数提供签名。（译者注：compose(funcA, funcB, funcC) 形象为 compose(funcA(funcB(funcC())))）
    3. 返回值(Function): 从右到左把接收到的函数合成后的最终函数。
    4. 示例：
        ```
        import { createStore, applyMiddleware, compose } from "redux";
        import thunk from "redux-thunk";
        import DevTools from "./containers/DevTools";
        import reducer from "../reducers";

        const store = createStore(
        reducer,
        compose(applyMiddleware(thunk), DevTools.instrument())
        );
        ```

5. 总结:
    1. 单纯的Redux只是一个状态机，store里面存了所有的状态state，要改变里面的状态state，只能dispatch action。
    2. 对于发出来的action需要用reducer来处理，reducer会计算新的state来替代老的state。
    3. subscribe方法可以注册回调方法，当dispatch action的时候会执行里面的回调。
    4. Redux其实就是一个发布订阅模式！
    5. Redux还支持enhancer，enhancer其实就是一个装饰者模式，传入当前的createStore，返回一个增强的createStore。
    6. Redux使用applyMiddleware支持中间件，applyMiddleware的返回值其实就是一个enhancer。
    7. Redux的中间件也是一个装饰者模式，传入当前的dispatch，返回一个增强了的dispatch。
    8. 单纯的Redux是没有View层的，所以他可以跟各种UI库结合使用，比如react-redux，计划下一篇文章就是手写react-redux。