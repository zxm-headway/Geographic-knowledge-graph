
import React from 'react'
// import {withRouter} from 'react-router-dom'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import KgSearch from '../Pages/KgPages/KgSearch'
import KgPages from '../Pages/KgPages/KgPages'
import SearchGragh from '../Pages/KgPages/SearchGragh'
import Classification from '../Pages/regions/Classification'
import ExtensionGrangh from '../Pages/regions/ExtensionGrangh'
import SearchDetail from '../Pages/KgPages/SearchDetail'
import DomainMap from '../Pages/KgPages/DomainMap'
import TryCoponent from '../Pages/PagesComponent/TryCoponent'









export default function IndexRouter() {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path="/home/kgpages" component={KgPages} exact />
          <Route path="/home/kgsearch" component={KgSearch} exact />
          <Route path="/home/searchgragh" component={SearchGragh} exact />
          <Route path="/home/classification" component={Classification} exact />
          <Route path="/home/extensiongrangh" component={ExtensionGrangh} exact />
          <Route path="/home/searchdetail" component={SearchDetail} exact />
          <Route path="/home/domainmap" component={DomainMap} exact />
          <Route path="/home/trycoponent" component={TryCoponent} exact />


          <Redirect from='/home' to='/home/kgpages'></Redirect>

        </Switch>
      </HashRouter>
    </div>
  )
}