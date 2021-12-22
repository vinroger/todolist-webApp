import React, {useState, useEffect} from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';



function InputForm(props) {

    const [input, setInput] = useState("");

    const handleChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(input.length > 0) {
            props.onAdd(input);
        }
        else {

        }
        setInput("");
        
        
    }
    return (
        <div>
        <Form className="text-center" onSubmit={handleSubmit}>
            <Container fluid className="mt-3">
                <Row>
                    <Col xs={10}>
                        <Form.Control type="text" value={input} className="w-100 mx-auto inline " placeholder="Write Something" onChange={e => handleChange(e)}></Form.Control>
                    </Col>
                    <Col xs={1}>
                    <Button disabled={!input} variant="dark" className=""  type="submit">Submit</Button>
                    </Col>
                </Row>
            </Container>
            
        </Form>
        </div>
    )
}



export default InputForm;
