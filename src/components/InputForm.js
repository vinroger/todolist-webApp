import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';



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
        <form onSubmit={handleSubmit}>
            <input type="text" value={input} className="" placeholder="Write Something" onChange={e => handleChange(e)}></input>
            <div className="">
                <Button disabled={!input} variant="primary" className=""  type="submit">Submit</Button>
            </div>
            
        </form>
        </div>
    )
}



export default InputForm;
