import React from "react"


const Card = (props) => {
    var amount = (Math.round(props.amount * 100) / 100).toFixed(2);
    return (
        <div className="w-[95%] bg-slate-200 rounded-md my-2 mx-[2.5%]">
            <div>
                {props.name}
            </div>
            <div>
                {props.date}
            </div>
            <div className="grid grid-col-2">
            {props.type}: {amount}
            
            </div>
            
        </div>
    )
}


export default Card