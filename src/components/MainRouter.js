import React from "react"
import Signup from "./login/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import App from "./App"
import Login from "./login/Login"
import PrivateRoute from "./login/PrivateRoute"
import { auth } from './firebase';


function MainRouter() {
return (
    <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
    >
        
        <Router>
            <AuthProvider>
            {/* This components provides all the necessary variables and functions (from useContext Hook) for firebase auth
            The login and signup button needs all these auth components, 
            while the App itself needs a userID key from this provider to access the firestore database */}
            <Switch>
            {/* I used custom route to solve the issue where react router try to render /app even though it has redirected to /login after the user log out, 
            which will create an error since there is no user ID passed in (user not log in).
            Hence, this custom route will check if the user logged in, if not then redirect to "/login"*/}
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