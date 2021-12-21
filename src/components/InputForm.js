import React, {useState, useEffect} from 'react';



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
            <input type="text" value={input} className="m-5 rounded p-3" placeholder="Write Something" onChange={e => handleChange(e)}></input>
            <div className="">
                <button disabled={!input} className="text-white bg-black rounded m-5 p-3 hover:scale-105 disabled:bg-gray-500 disabled:text-gray-400 disabled:hover:scale-100"  type="submit">Submit</button>
            </div>
            
        </form>
        </div>
    )
}



export default InputForm;
