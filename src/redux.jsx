import React, {useState, useContext, useEffect} from 'react'


let state = null
let reducer = null
let listeners = []
const setState = (newState) => {
  state = newState
  listeners.map((fn)=>{fn()})
}

const appContext = React.createContext(null)
export const store = {
  getState(){
    return state
  },
  dispatch : (action) => {
    // 规范setState流程————简化流程简写几个单词
    setState(reducer(state,action))
  },
  subscribe(fn){
    listeners.push(fn)
    return ()=>{
      const index = listeners.indexOf(fn)
      listeners.splice(index,1)
    }
  }
}

export const createStore= (_reducer,initState) => {
  state = initState
  reducer = _reducer
}

export const Provider = ({store,children}) => {
  return(
    <appContext.Provider value={store}>
      {children}
    </appContext.Provider>
  )
}



function changed (oladData,newData){
  // 精准渲染
  let change = false
  for(let key in oladData){
    if(oladData[key] !== newData[key]){
      change = true
    }
  }
  return change
}


// 让dispatch支持函数与promiseredux并未支持，需要自己引入中间件
// createStore(reducer,initState,applyMiddleware(reduxThunk,reduxPromise))
// 这两个中间件会将代码放到dispatch 中

// 支持函数  与中间件redux-thunk 代码等价
let dispatch = store.dispatch
const prevDispatch = dispatch
dispatch = (action) => {
  if(action instanceof Function){
    action(dispatch)
  }else{
    prevDispatch(action)
  }
}

// 支持promise 与中间件redux-promise 代码等价
const prevDispatch2 = dispatch
dispatch = (action) => {
  if(action.payload instanceof Promise){
    action.payload.then(data => {
      dispatch({...action,payload:data})
    })
  }else{
    prevDispatch2(action)
  }
}



export const connect = (selector,dispatchSelector) => (Component) => {
  // 将disptach连接react的功能 
  return (props) => {
    // const {setState} = useContext(appContext)
    const [,upData] = useState({})
    const data = selector ? selector(state) : {state}

    const dispatcher = dispatchSelector ? dispatchSelector(dispatch) : {dispatch}
    useEffect(() => {
      //仅增加一次队列
      return store.subscribe(()=>{
        const newData = selector ? selector(state) : {state:state}
        if(changed(data,newData)){
          upData({})
        }
      })
    }, [selector])

    return <Component {...props} {...dispatcher} {...data}></Component>
  }
}