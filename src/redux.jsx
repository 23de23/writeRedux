import React, {useState, useContext, useEffect} from 'react'


export const appContext = React.createContext(null)
export const store = {
  state: {
    user: {name: 'frank', age: 18},
    group:{name:'前端'}
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

export const connect = (selector,dispatchSelector) => (Component) => {
  // 将disptach连接react的功能 
  return (props) => {
    const {state, setState} = useContext(appContext)
    const [,upData] = useState({})
    const data = selector ? selector(state) : {state}
    const disptach = (action) => {
      // 规范setState流程————简化流程简写几个单词
      setState(reducer(state,action))
    }

    const dispatcher = dispatchSelector ? dispatchSelector(disptach) : {disptach}
    useEffect(() => {
      //仅增加一次队列
      return store.subscribe(()=>{
        const newData = selector ? selector(store.state) : {state:store.state}
        if(changed(data,newData)){
          upData({})
        }
      })
    }, [selector])


    
    return <Component {...props} {...dispatcher} {...data}></Component>
  }
}