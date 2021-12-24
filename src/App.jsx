import React, {useState, useContext, useEffect} from 'react'

const appContext = React.createContext(null)
const store = {
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
export const App = () => {
  return (
    <appContext.Provider value={store}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </appContext.Provider>
  )
}
const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子<UserModifier/></section>
const 幺儿子 = () => <section>幺儿子</section>

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

const connect = (Component) => {
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

const _UserModifier = ({disptach,state}) => {
  const onChange = (e) => {
    disptach({type:'updateUser',payload:{name:e.target.value}})
  }
  return <div>
    <input value={state.user.name}
      onChange={onChange}/>
  </div>
}
const UserModifier = connect(_UserModifier)

const _User = () => {
  const contextValue = useContext(appContext)
  return <div>User:{contextValue.state.user.name}</div>
}
const User = connect(_User)


