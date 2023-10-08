import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

const Card = (props) => {
    var transactions = props.cards
    var amount = (Math.round(props.amount * 100) / 100).toFixed(2);
    const deleteTransaction = event => {
        var toChange = event.currentTarget.attributes.value.value
        console.log(toChange)
        var newTransactions = transactions.map(transaction => {
            if (transaction.id == toChange) {
                transaction.state = ""
            }
            return transaction
        })
        props.change(newTransactions)

    }
    return (
        <div className="w-[95%] bg-slate-200 rounded-md my-2 mx-[2.5%] grid grid-col-12">
            <div className="col-span-12">
                {props.name}
            </div>
            <div className="col-span-12">
                {props.date}
            </div>
            <div className="col-span-11">
                {props.type}: {amount}
            </div>
            <div value={props.id} onClick={deleteTransaction} className="col-span-1">
                <FontAwesomeIcon icon={icon({name: 'trash'})} />
            </div>
            
        </div>
    )
}

export default Card