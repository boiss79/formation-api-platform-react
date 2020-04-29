import '../css/app.css';
import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import CustomersPage from './pages/CustomersPage';
import {HashRouter, Switch, Route, withRouter} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authAPI';
import AuthContext from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import CustomerPage from './pages/CustomerPage';
import InvoicePage from './pages/InvoicePage';
import Register from './pages/Register';

require("../css/app.css");

AuthAPI.setup();

const App = () => {

    // Il faudrait demander à notre AuthAPI si on est déjà connecté ou pas
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    const NavbarWithRouter = withRouter(Navbar);

    return( 
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated}} >
            <HashRouter>
                <NavbarWithRouter/>

                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component= {LoginPage} />
                        <Route path="/register" component= {Register} />
                        <PrivateRoute 
                            path={"/invoice/:id"}
                            component={InvoicePage}
                        />
                        <PrivateRoute 
                            path={"/invoices"}
                            component={InvoicesPage}
                        />
                        <PrivateRoute 
                            path={"/customer/:id"}
                            component={CustomerPage}
                        />
                        <PrivateRoute 
                            path={"/customers"}
                            component={CustomersPage}
                        />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
}

const rootElement = document.querySelector("#app");

ReactDOM.render(<App />, rootElement);


