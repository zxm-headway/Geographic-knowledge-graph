import React from 'react'
import {HashRouter,Redirect,Route, Switch} from 'react-router-dom'
import Sandbox from '../views/sandbox/Sandbox'
import Login from '../component/Login/Login'

export default function IndexRouter() {
  return (
   
      <HashRouter>
            <Switch>
                <Route path="/home" component={Sandbox}/>
                <Route path="/login" component={Login}/>
                
                <Redirect from='/' to='/home'></Redirect>
                
            </Switch>
        </HashRouter>
   
  )
}
