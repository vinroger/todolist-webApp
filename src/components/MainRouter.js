import React from "react"
import Signup from "./login/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import App from "./App"
import Login from "./login/Login"
import PrivateRoute from "./login/PrivateRoute"


function MainRouter() {
return (
    <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
    >
        
        <Router>
            <AuthProvider>
            <Switch>
                <PrivateRoute exact path="/" component={App} />
                <div className="w-100 " style={{ maxWidth: "500px" }}>
                    <Route path="/signup" component={Signup} />
                    <Route path="/login" component={Login} />
                </div>
                

            </Switch>
            </AuthProvider>
        </Router>
        
    </Container>
    )
}

export default MainRouter