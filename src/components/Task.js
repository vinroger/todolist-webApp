import React, {useState} from 'react';
import { Button } from 'react-bootstrap';
import { Form, Card, Container, Row, Col } from 'react-bootstrap';
import {color1, color2, color3, color4} from './Color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faImages, faUndo, faTimes } from '@fortawesome/free-solid-svg-icons'

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
        document.getElementById("image-input"+ props.id).click();
    }

    const [isChecked, setCheck] = useState(false)
    const [isEditing, setEditing] = useState(false)
    const [input, setInput] = useState("")



    const imageElement = (<div>
        {props.imgSrc && 
        <div>
            <div className="mb-3 rcontainer-xl">
                <img className="mx-auto" src={props.imgSrc} style={{maxHeight:"200px",maxWidth: '500px' }} alt={props.content} />
                <br></br>
                <Button className="mx-auto mt-3 btn-sm" variant="danger" component="span" onClick={handleDelImg}>
                <FontAwesomeIcon icon={faTrashAlt} className="mr-2"/>
                    Delete Image
                </Button>
            </div>
            <div className="mb-3 rcontainer-xs">
                <img className="mx-auto" src={props.imgSrc} style={{maxHeight:"200px",maxWidth: '300px' }} alt={props.content} />
                <br></br>
                <Button className="mx-auto mt-3 btn-sm mb-4" variant="danger" component="span" onClick={handleDelImg}>
                <FontAwesomeIcon icon={faTrashAlt} className="mr-2"/>
                    Delete Image
                </Button>
            </div>
        </div>
        }
    </div>)

    const nonEditingElement = (
    <Card  className="roundedxl text-dark mx-auto my-3 task-card" style={{backgroundColor : '#fff2e0b9'}}>
        <div className="">
            <Container fluid className="mt-4 rcontainer-xl">
                <Row>
                    <Col xs={1}>
                        <input type="checkbox" checked={isChecked} onChange={handleCheck} className="flex ml-3 mt-2" style={{transform: 'scale(2)'}}></input>
                    </Col>
                    <Col xs={8}>
                        {isChecked? <strike><h5 style={{textAlign: 'left'}}>{props.content}</h5></strike>: <h5 className="flex">{props.content}</h5>}  
                    </Col>
                    <Col xs={3}>
                        <div className="">
                            <input type="file" accept="image/*" onChange={handleAddImg} className="input" style={{ display: 'none' }} id={"image-input"+ props.id}></input>
                            <Button variant="info" component="span" className=" btn-sm" onClick={uploadListener}><FontAwesomeIcon icon={faImages} className="" /></Button>
                            <Button variant="success" className="ml-2 btn-sm" onClick={handleEdit}><FontAwesomeIcon icon={faEdit} className=""/></Button>
                            <Button variant="warning" className="ml-2 btn-sm" onClick={handleDelete}><FontAwesomeIcon icon={faTimes} className="" style={{transform: 'scale(1.25)'}}/></Button>
                        </div>
                        
                    </Col>
                </Row>
            </Container>
            <Container fluid className="mt-4 rcontainer-xs" >
                <Row style={{width:"400px"}} className="mx-auto">
                    <Col xs={1} className="ml-3">
                        <input type="checkbox" checked={isChecked} onChange={handleCheck} className="flex mt-2" style={{transform: 'scale(2)'}}></input>
                    </Col>
                    <Col xs={10}>
                        {isChecked? <strike><h5 style={{textAlign: 'left'}}>{props.content}</h5></strike>: <h5 className="flex">{props.content}</h5>}  
                    </Col>
                </Row>
                <div className="mt-3 ml-5">
                            <input type="file" accept="image/*" onChange={handleAddImg} className="input" style={{ display: 'none' }} id={"image-input"+ props.id}></input>
                            <Button variant="info" component="span" className=" btn-sm" onClick={uploadListener}><FontAwesomeIcon icon={faImages} className="" /></Button>
                            <Button variant="success" className="ml-2 btn-sm" onClick={handleEdit}><FontAwesomeIcon icon={faEdit} className=""/></Button>
                            <Button variant="warning" className="ml-2 btn-sm" onClick={handleDelete}><FontAwesomeIcon icon={faTimes} className="" style={{transform: 'scale(1.25)'}}/></Button>
                </div>
            </Container>
        </div>
        <div className="flex ml-5 my-2 pb-1 rcontainer-xl">
            {imageElement} 
        </div>
        
        <div className="flex ml-5 rcontainer-xs">
            {imageElement} 
        </div>
    </Card>
    )

    const editingElement = (
        <Card  className="roundedxl text-dark mx-auto my-3 task-card" style={{backgroundColor : '#fff2e0b9'}}>
            <div className="my-3 mx-auto rcontainer-xl">
                <Form onSubmit={handleSubmit}>
                    <Form.Label><h5 className="mt-2">Edit Task</h5></Form.Label>
                    <Form.Control type="text" value={input} className="inline mx-auto" style={{width : '500px'}} placeholder="Write Something" onChange={e => handleChange(e)}></Form.Control>
                    <div className="inline my-2 mb-4">
                        <Button disabled={!input} variant="success" className="mr-2 btn-sm"  type="submit">
                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>Submit Edit
                        </Button>
                        <Button variant="info" className="btn-sm" onClick={undoEdit} >
                            <FontAwesomeIcon icon={faUndo} className="mr-2"/>Undo
                        </Button>
                    </div>
                </Form>
                {imageElement}
            </div>
            <div className="my-3 mx-auto rcontainer-xs">
                <Form onSubmit={handleSubmit}>
                    <Form.Label><h5 className="mt-2">Edit Task</h5></Form.Label>
                    <Form.Control type="text" value={input} className="inline mx-auto" style={{width : '300px'}} placeholder="Write Something" onChange={e => handleChange(e)}></Form.Control>
                    <div className="inline my-2 mb-4">
                        <Button disabled={!input} variant="success" className="mr-2 btn-sm"  type="submit">
                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>Submit Edit
                        </Button>
                        <Button variant="info" className="btn-sm" onClick={undoEdit} >
                            <FontAwesomeIcon icon={faUndo} className="mr-2"/>Undo
                        </Button>
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
