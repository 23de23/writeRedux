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

const ajax = () => {
  return new Promise((res,rej)=>{
    setTimeout(() => {
      res({name:"3s"})
    }, 1000);
  })
}

const fetchUser = (updateUser) => {
  ajax().then((res)=>{
    updateUser({type:'updateUser', payload:res})
  })
}


// const UserModifier = connectToUser(({updateUser,user}) => {
//   console.log('User，二儿子运行了' + Math.random())
//   const onChange = (e) => {
//     updateUser(fetchUser)
//   }
//   return <div>
//     <input value={user.name}
//       onChange={onChange}/>
//   </div>
// })


const UserModifier = connect(null,null)(({state,dispatch}) => {
  console.log('User，二儿子运行了' + Math.random())
  const onChange = () => {
    // action支持函数
    // dispatch(fetchUser)
    // 支持promise action
    dispatch({type:'updateUser',payload:ajax().then(res=>res)})
  }
  return <div>
    <input value={state.user.name}
      onChange={onChange}/>
  </div>
})

const User = connectToUser(({user}) => {
  console.log('User，大儿子运行了' + Math.random())
  return <div>User:{user.name}</div>
})


