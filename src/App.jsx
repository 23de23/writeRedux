import React, {useContext} from 'react'
import {connect,store,appContext} from "./redux.jsx"
import connectToUser from './connecters/connectToUser'

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
const 幺儿子 = connect((state)=>{return {group:state.group}})(() => {
  console.log('User，三儿子运行了'+ Math.random())
  return <section>幺儿子</section>
})



const UserModifier = connectToUser(({updateUser,user}) => {
  console.log('User，二儿子运行了' + Math.random())
  const onChange = (e) => {
    updateUser({name:e.target.value})
  }
  return <div>
    <input value={user.name}
      onChange={onChange}/>
  </div>
})

const User = connectToUser(({user}) => {
  console.log('User，大儿子运行了' + Math.random())
  return <div>User:{user.name}</div>
})


