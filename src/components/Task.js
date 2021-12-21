import React, {useState} from 'react';
import { Button } from 'react-bootstrap';

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
    const [isChecked, setCheck] = useState(false)
    const [isEditing, setEditing] = useState(false)
    const [input, setInput] = useState("")

    const nonEditingElement = (<div className="flex"><input type="checkbox" checked={isChecked} onChange={handleCheck} className="flex"></input>
    {isChecked? <strike><p className="flex">{props.content}</p></strike>: <p className="flex">{props.content}</p>}
    <Button variant="warning" className="" onClick={handleEdit}>EDIT</Button>
    <Button variant="danger" className="" onClick={handleDelete}>DELETE</Button></div>)

    const editingElement = (<div className="my-5">
    <form onSubmit={handleSubmit}>
        <input type="text" value={input} className="inline" placeholder="Write Something" onChange={e => handleChange(e)}></input>
        <div className="inline">
            
            <Button disabled={!input} variant="warning" className=""  type="submit">Submit Edit</Button>
            <Button variant="info" className="btn-sm" onClick={undoEdit} >Undo</Button>
        </div>
    </form>
    </div>)


    return (
        <div className="mx-5 font-semibold font-mono">
            {isEditing? editingElement:nonEditingElement}
        </div>
    );
}

export default Task
