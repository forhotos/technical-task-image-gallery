import './App.css';
import './styles/searchPhotos.css';
import './styles/searchResults.css';
import './styles/cardList.css';
import React from 'react';
import SearchPhotos from "./modules/search-photos/searchPhotos"
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import SearchResults from "./modules/search-results/searchResults";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
      <Router>
          <div className="App">
              <div className="app-container">
                  <Switch>
                      <Route path="/search">
                          <SearchResults />
                      </Route>
                      <Route path="/">
                          <SearchPhotos />
                      </Route>
                  </Switch>
              </div>
          </div>
      </Router>
  );
}

export default App;
