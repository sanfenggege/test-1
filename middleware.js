// https://www.redux.org.cn/understanding/history-and-design/middleware.html
//   version 1:
  function patchStoreToAddLogging(store) {
    const next = store.dispatch
    store.dispatch = function dispatchAndLog(action) {
      console.log('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result
    }
  }
  
  function patchStoreToAddCrashReporting(store) {
    const next = store.dispatch
    store.dispatch = function dispatchAndReportErrors(action) {
      try {
        return next(action)
      } catch (err) {
        console.error('Caught an exception!', err)
        Raven.captureException(err, {
          extra: {
            action,
            state: store.getState()
          }
        })
        throw err
      }
    }
  }

  // 如果这些函数作为单独的模块发布，那之后就可以用它们来给 store 打补丁：
  patchStoreToAddLogging(store)
  patchStoreToAddCrashReporting(store)



//   version 2:
  function logger(store) {
    const next = store.dispatch
    return function dispatchAndLog(action) {
      console.log('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result
    }
  }

  function crashReporter(store){
    const next = store.dispatch
    return function dispatchAndReportErrors(action) {
      try {
        return next(action)
      } catch (err) {
        console.error('Caught an exception!', err)
        Raven.captureException(err, {
          extra: {
            action,
            state: store.getState()
          }
        })
        throw err
      }
    }
  }

  function applyMiddlewareByMonkeypatching(store, middlewares) {
    middlewares = middlewares.slice()
    middlewares.reverse()
    // 依次调用每个 middleware 来增强 dispatch
    middlewares.forEach(middleware => (store.dispatch = middleware(store)))
  }

  applyMiddlewareByMonkeypatching(store, [logger, crashReporter])



//   version 3：
//   为什么每次都需要重写 dispatch 呢（const next = store.dispatch）？很简单，为了以后能够调用它（next(action)）；
//   但还有另外一个原因：这样每个 middleware 都可以访问（和调用）之前封装的 store.dispatch.

//   必须要链式调用 middlewares！

//   如果 applyMiddlewareByMonkeypatching 在处理第一个 middleware 后没有立即覆盖掉原来的 store.dispatch，store.dispatch 将继续指向原始的 dispatch 函数。那么第二个 middlewares 也会绑定到原来的 dispatch 函数上。

//   但是还有一种不同的方式来做链式调用。Middlewares 来接受 next() 调度函数作为参数，而不是从 store 实例中读取它。
//   function logger(store) {
//     return function wrapDispatchToAddLogging(next) {
//       return function dispatchAndLog(action) {
//         console.log('dispatching', action)
//         let result = next(action)
//         console.log('next state', store.getState())
//         return result
//       }
//     }
//   }
// 这是一个 “我们需要更深入” 的时刻，所以这可能需要一段时间来理解。函数级联感觉很吓人。ES6 箭头函数使这个 柯里化 更易读：
 const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
  
  const crashReporter = store => next => action => {
    try {
      return next(action)
    } catch (err) {
      console.error('Caught an exception!', err)
      Raven.captureException(err, {
        extra: {
          action,
          state: store.getState()
        }
      })
      throw err
    }
  }

// 注意：这是简单粗暴的middleware调用方法：并 *不是* Redux API 真实的实现方法。
function applyMiddleware(store, middlewares) {
    middlewares = middlewares.slice()
    middlewares.reverse()
    let dispatch = store.dispatch
    middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
    return Object.assign({}, store, { dispatch })
  }

    // import { createStore, combineReducers, applyMiddleware } from 'redux'
    const todoApp = combineReducers(reducers)
    const store = createStore(
    todoApp,
    // applyMiddleware() 告诉 createStore() 如何处理 middlewares
    applyMiddleware(logger, crashReporter)
    )
    // 将会经过 logger 和 crashReporter middleware!
    store.dispatch(addTodo('Use Redux'))    