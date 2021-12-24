import React, {useContext} from 'react'
import {connect,store,appContext} from "./redux.jsx"

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


