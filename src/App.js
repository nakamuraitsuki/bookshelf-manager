import React from "react";
import { BrowserRouter as Router, RouterProvider, Switch } from "react-router-dom";
import HomePage from './pages/HomePage'
import AddPage from './pages/AddPage'

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