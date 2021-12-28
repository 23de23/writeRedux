import {connect} from '../redux'
const userSelector = (state)=>{return {user:state.user}}
const userDispatchSelector = (disptach)=>{
  return {updateUser:(attrs)=>disptach({type:'updateUser',payload:attrs})}
}
const connectToUser = connect(userSelector,userDispatchSelector)
export default connectToUser