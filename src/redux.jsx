import React, {useState, useContext, useEffect} from 'react'


const appContext = React.createContext(null)
export const store = {
  state:null,
  reducer:null,
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

export const createStore= (reducer,initState) => {
  store.state = initState
  store.reducer = reducer
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

export const connect = (selector,dispatchSelector) => (Component) => {
  // 将disptach连接react的功能 
  return (props) => {
    const {state, setState} = useContext(appContext)
    const [,upData] = useState({})
    const data = selector ? selector(state) : {state}
    const disptach = (action) => {
      // 规范setState流程————简化流程简写几个单词
      setState(store.reducer(state,action))
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