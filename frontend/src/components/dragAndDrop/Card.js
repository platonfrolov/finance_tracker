import React from "react"


const Card = (props) => {

    return (
        <div className="w-[95%] bg-slate-300 rounded-md my-2 mx-[2.5%]">
            <div>
                {props.name}
            </div>
            <div>
                {props.date}
            </div>
            <div className="grid grid-col-2">
            {props.type}: {props.amount}
            
            </div>
            
        </div>
    )
}


export default Card