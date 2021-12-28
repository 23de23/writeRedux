import React from 'react'
import {connect,store,createStore,Provider} from "./redux.jsx"
import connectToUser from './connecters/connectToUser'

createStore((state,{type,payload}) => {
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
},{
  user: {name: 'frank', age: 18},
  group:{name:'前端'}
})

export const App = () => {
  return (
    <Provider store={store}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </Provider>
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


