import React, {useState} from 'react';
import { Button } from 'react-bootstrap';
import { Form, Card, Container, Row, Col } from 'react-bootstrap';

function Task(props) {
    function handleDelete() {
        props.onDelete(props.id);
    }
    function handleCheck(){
        setCheck(!isChecked);
    }
    function handleEdit(){
        setEditing(true);
        setInput(props.content);
    }
    function undoEdit(){
        setEditing(false);
    }
    function handleSubmit(e){
        e.preventDefault();
        props.onEdit(props.id, input);
        
        setEditing(false);
    }
    const handleChange = (e) => {
        setInput(e.target.value);
    }
    const handleAddImg = (e) => {
        e.preventDefault();
        props.onAddImg(e.target.files[0], props.id);
    }
    const handleDelImg = (e) => {
        props.onDelImg(props.id)
    }

    const uploadListener = async (e) => {
        document.getElementById("image-input").click();
    }

    const [isChecked, setCheck] = useState(false)
    const [isEditing, setEditing] = useState(false)
    const [input, setInput] = useState("")

    const imageElement = (<div>
        {props.imgSrc && 
        <div className="text-center mb-3">
            <img className="mx-auto" src={props.imgSrc} width="200px" alt={props.content} />
            <br></br>
            <Button className="mx-auto mt-3" variant="danger" component="span" onClick={handleDelImg}>Delete Image</Button>
        </div>
        }
    </div>)

    const nonEditingElement = (
    <Card  className="rounded text-light mx-auto my-3" style={{backgroundColor : '#519259', width : '600px'}}>
        <div className="">
            <Container fluid className="mt-4">
                <Row>
                    <Col xs={1}>
                        <input type="checkbox" checked={isChecked} onChange={handleCheck} className="flex ml-3 mt-2" style={{transform: 'scale(3)'}}></input>
                    </Col>
                    <Col xs={10}>
                        {isChecked? <strike><h4 style={{textAlign: 'left'}}>{props.content}</h4></strike>: <h4 className="flex">{props.content}</h4>}  
                    </Col>
                </Row>
            </Container>
        </div>
        
        <div className="flex mx-auto mt-3">
            <div className="mb-3">
                <input type="file" accept="image/*" onChange={handleAddImg} className="input" style={{ display: 'none' }} id="image-input"></input>
                <Button variant="info" component="span" className="mx-3" onClick={uploadListener}>Upload Image</Button>
                <Button variant="warning" className="mx-3" onClick={handleEdit}>Edit</Button>
                <Button variant="danger" className="mx-3" onClick={handleDelete}>Delete Task</Button>
            </div>
        {imageElement} 
        </div>
    </Card>
    )

    const editingElement = (
        <Card  className="rounded text-light mx-auto my-3" style={{backgroundColor : '#519259', width : '600px'}}>
            <div className="my-3 mx-auto">
                <Form onSubmit={handleSubmit}>
                    <Form.Label><h5 className="mt-2">Edit Task</h5></Form.Label>
                    <Form.Control type="text" value={input} className="inline mx-auto" style={{width : '500px'}} placeholder="Write Something" onChange={e => handleChange(e)}></Form.Control>
                    <div className="inline my-2 mb-4">
                        
                        <Button disabled={!input} variant="warning" className="mr-2"  type="submit">Submit Edit</Button>
                        <Button variant="info" className="" onClick={undoEdit} >Undo</Button>
                    </div>
                </Form>
            
                {imageElement}
            </div>
    </Card>
    )

    return (
        <div>
            {isEditing? editingElement:nonEditingElement}
        </div>
    );
}

export default Task
