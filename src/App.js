import React from "react";
import { BrowserRouter as Router, RouterProvider, Switch } from "react-router-dom";
import HomePage from './components/HomePage'
import AddPage from './components/AddPage'

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/add" component={AddPage} />
            </Switch>
        </Router>
    );
}

export default App;