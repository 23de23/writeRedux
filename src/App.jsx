import React, {useState, useContext} from 'react'

const appContext = React.createContext(null)
export const App = () => {
  const [appState, setAppState] = useState({
    user: {name: 'frank', age: 18}
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </appContext.Provider>
  )
}
const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子<Wrapper/></section>
const 幺儿子 = () => <section>幺儿子</section>
const User = () => {
  const contextValue = useContext(appContext)
  return <div>User:{contextValue.appState.user.name}</div>

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



const Wrapper = () => {
  const {appState, setAppState} = useContext(appContext)
  const disptach = (action) => {
    // 规范setState流程————简化流程简写几个单词
    setAppState(reducer(appState,action))
  }
  return <UserModifier disptach={disptach} state={appState}></UserModifier>
}

const UserModifier = ({disptach,state}) => {
  const onChange = (e) => {
    disptach({type:'updateUser',payload:{name:e.target.value}})
  }
  return <div>
    <input value={state.user.name}
      onChange={onChange}/>
  </div>
}

