import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
    e.preventDefault()
    //Login Function    
    try {
        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        history.push("/")
    } catch {
        setError("Failed to log in")
    }

    setLoading(false)
    }

    return (
    <>
        <Card className="roundedxl p-2 pt-3" style={{ minHeight: "400px" }}>
        <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {/* Alert for the errors in case the log in fails */}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
                Log In
            </Button>
            </Form>
            <div className="w-100 text-center mt-5">
            Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </Card.Body>
        </Card>
        
        
        
    </>
    )
}