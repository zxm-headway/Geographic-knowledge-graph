
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
import D3Main from '../Pages/KgPages/D3Main'
// import EpandNode from '../Pages/KgPages/WordClonds'
import ShortestPath from '../Pages/KgPages/ShortestPath'
// import Experiment from '../Pages/KgPages/Experiment'
// import WordsClouds from '../Pages/KgPages/WordClounds'
// import GraphTwo from '../Pages/PagesComponent/GraphTwo'
import Entity from '../Pages/PagesComponent/Entity'
import WordClouds from '../Pages/KgPages/WordClonds'
import SearchShortPath from '../Pages/PagesComponent/SearchShortPath'
import Exactor from '../Pages/PagesComponent/Exactor'

// Entity
// GraphTwo



// import TryCoponent from '../Pages/PagesComponent/TryCoponent'
// import D3 from '../Pages/KgPages/D3'

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
          <Route path="/home/trycoponent" component={D3Main} exact />
          <Route path="/home/wordclouds" component={WordClouds} exact />
          <Route path="/home/shortestpath" component={ShortestPath} exact />
          <Route path="/home/experiment" component={Entity} exact />
          <Route path="/home/searchshortpath" component={SearchShortPath} exact />
          {/* <Route path="/home/searchshortpath" component={Exactor} exact /> */}
          <Route path="/home/exactor" component={Exactor} exact />
          {/* <Route path="/home/wordsclounds" component={WordsClouds} exact /> */}


          <Redirect from='/home' to='/home/kgpages'></Redirect>

        </Switch>
      </HashRouter>
    </div>
  )
}