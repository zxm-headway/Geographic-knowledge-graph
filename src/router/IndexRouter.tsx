import React from 'react'
import {HashRouter,Redirect,Route, Switch} from 'react-router-dom'
import Sandbox from '../views/sandbox/Sandbox'

export default function IndexRouter() {
  return (
    <div>
      <HashRouter>
            <Switch>
                <Route path="/home" component={Sandbox}/>
                <Redirect from='/' to='/home'></Redirect>
                
            </Switch>
        </HashRouter>
    </div>
  )
}
