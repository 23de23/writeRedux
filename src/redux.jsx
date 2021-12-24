import React, {useState, useContext, useEffect} from 'react'


export const appContext = React.createContext(null)
export const store = {
  state: {
    user: {name: 'frank', age: 18}
  },
  setState(newState) {
    store.state = newState
    store.listeners.map((fn)=>{fn()})
  },
  listeners:[],
  subscribe(fn){
    store.listeners.push(fn)
    return ()=>{
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index,1)
    }
  }
}

const reducer = (state,{type,payload}) => {
  // reducer为了规范state创建流程
  if(type === 'updateUser'){
    return {
      ...state,
      user:{
        ...state.user,
        ...payload
      }
    }
  }
}

export const connect = (Component) => {
  // 将disptach连接react的功能
  return (props) => {
    const [,upData] = useState({})
    useEffect(() => {
      //仅增加一次队列
      store.subscribe(()=>{
        upData({})
      })
    }, [])
    const {state, setState} = useContext(appContext)
    const disptach = (action) => {
      // 规范setState流程————简化流程简写几个单词
      setState(reducer(state,action))
    }
    return <Component {...props} disptach={disptach} state={state}></Component>
  }
}