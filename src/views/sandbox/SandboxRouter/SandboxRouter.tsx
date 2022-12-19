
import React from 'react'
// import {withRouter} from 'react-router-dom'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import KgSearch from '../Pages/KgPages/KgSearch'
import KgPages from '../Pages/KgPages/KgPages'
import SearchGragh from '../Pages/KgPages/SearchGragh'




export default function IndexRouter() {
  return (
    <div>
      <HashRouter>
            <Switch>
                <Route path="/home/kgpages" component={KgPages}/>
                <Route path="/home/kgsearch" component={KgSearch}/>
                <Route path="/home/searchgragh" component={SearchGragh}/>
                <Redirect from='/home' to='/home/kgpages'></Redirect>
                
            </Switch>
        </HashRouter>
    </div>
  )
}