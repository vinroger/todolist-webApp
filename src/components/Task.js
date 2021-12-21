import React, {useState} from 'react';

function Task(props) {
    function handleDelete() {
        props.onDelete(props.id);
    }
    function handleCheck(){
        setCheck(!isChecked);
    }
    function handleEdit(){
        setEditing(true);
    }
    function handleSubmit(e){
        e.preventDefault();
        props.onEdit(props.id, input)

        setEditing(false);
    }
    const handleChange = (e) => {
        setInput(e.target.value);
    }
    const [isChecked, setCheck] = useState(false)
    const [isEditing, setEditing] = useState(false)
    const [input, setInput] = useState("")

    const nonEditingElement = (<div className="m-5"><input type="checkbox" checked={isChecked} onChange={handleCheck} className="scale-150"></input>
    {isChecked? <strike><p className="inline text-xl m-5 text-gray-500">{props.content}</p></strike>: <p className="inline text-xl m-5">{props.content}</p>}
    <button className="text-white bg-yellow-500 rounded p-3 hover:scale-105 inline scale-100 hover:bg-yellow-800 mx-2" onClick={handleEdit}>EDIT</button>
    <button className="text-white bg-red-500 rounded p-3 hover:scale-105 inline scale-100 hover:bg-red-800 mx-2" onClick={handleDelete}>DELETE</button></div>)

    const editingElement = (<div className="my-5">
    <form onSubmit={handleSubmit}>
        <input type="text" value={input} className="mx-5 rounded p-3" placeholder="Write Something" onChange={e => handleChange(e)}></input>
        <div className="inline">
            <button disabled={!input} className="text-white bg-yellow-800 rounded mx-5 p-3 hover:scale-105 disabled:bg-gray-500 disabled:text-gray-400 disabled:hover:scale-100"  type="submit">Edit</button>
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
