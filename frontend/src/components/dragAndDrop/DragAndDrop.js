import { useState, useEffect } from 'react'
import './styles.css'
import Card from './Card'
import Loader from '../loader/Loader'


const DragAndDrop = (props) => {
    var initialState = []
    props.transactions.forEach((transaction, idx) => {
        var el = 
        {
            id: idx,
            name: transaction.name,
            amount: transaction.amount,
            type: transaction.type,
            date: transaction.date,
            state: "unassigned"
        }
        initialState.push(el)
    })
    const [cards, setCards] = useState(initialState)
    const [categories, setCategories] = useState(props.categories)
    const [state, setState] = useState({loading: false})
    const proceed = async () => {
        setState({loading: true})
        var to_send = {
            "payload": cards,
        }
        fetch("http://127.0.0.1:8000/create_overview", {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            method: 'POST',
            body: JSON.stringify(to_send),
        }).then(async response => {
            var data = await response.json()
            console.log(data)
            //expecting .xlsx file here
        })
    }
    const addCategory = () => {
        var categoryName = document.querySelector("#newCategoryName").value
        document.querySelector("#newCategoryName").value = ""
        var updatedCategories = [...categories]
        updatedCategories.push(categoryName)
        console.log(updatedCategories)
        setCategories(updatedCategories)
        console.log(categories)
    }
    useEffect(() => {
        document.addEventListener('dragstart', dragStart)
        document.addEventListener('dragend', dragEnd)
    
        
        return () => {
            document.removeEventListener('dragstart', dragStart)
            document.removeEventListener('dragend', dragEnd)
        }
    }, [])
    
    const dragStart = event => {
        if (event.target.className.includes('card')) {
            event.target.classList.add('dragging')
        }
    }

    
    const dragEnd = event => {
        if (event.target.className.includes('card')) {
            event.target.classList.remove('dragging')
        }
    }

    const dragEnter = event => {
        event.currentTarget.classList.add('drop')
    }
    
    const dragLeave = event => {
        event.currentTarget.classList.remove('drop')
    }
    const drag = event => {
        event.dataTransfer.setData('text/plain', event.currentTarget.dataset.id)
    }
    const drop = event => {
        const column = event.currentTarget.dataset.column
        const id = Number(event.dataTransfer.getData('text/plain'))
    
        event.currentTarget.classList.remove('drop')
    
        event.preventDefault()
    
        const updatedState = cards.map(card => {
            if (card.id === id) {
                card.state = column
            }
    
            return card
        })
    
        setCards(updatedState)
    }
    const allowDrop = event => {
        event.preventDefault()
    }
    if (state.loading) {
        return (
            <Loader></Loader>
        )
    } else {
        return (
            <div>
                <main className="board gap-4 grid grid-cols-5 m-[5vh]">
                    <div className='l col-span-1'>
                        <div
                            className="column column-todo h-[85vh] bg-slate-200 rounded-lg overflow-scroll"
                            data-column="unassigned"
                            onDragEnter={dragEnter}
                            onDragLeave={dragLeave}
                            onDragOver={allowDrop}
                            onDrop={drop}
                        >
                            <h2 className='sticky top-0 h-8 bg-slate-200 w-full text-center flex items-center justify-center'>Niet toegewezen</h2>
                            {cards.filter(card => card.state === "unassigned").map(card => (
                                <article key={card.id} className="card" draggable="true" onDragStart={drag} data-id={card.id}>
                                    <Card key={card.id} name={card.name} date={card.date} amount={card.amount} type={card.type} className="card" draggable="true" onDragStart={drag} data-id={card.id}/>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div className='r col-span-4 gap-4 grid grid-cols-4'>
                    {
                        categories.map(element => {
                            return (
                                <div
                                    className="column column-todo bg-slate-200 h-[41.5vh] rounded-lg overflow-scroll"
                                    data-column={element}
                                    onDragEnter={dragEnter}
                                    onDragLeave={dragLeave}
                                    onDragOver={allowDrop}
                                    onDrop={drop}
                                >
                                    <h2 className='sticky top-0 h-8 bg-slate-200 w-full text-center flex items-center justify-center'>{element}</h2>
                                    {cards.filter(card => card.state === element).map(card => (
                                        <article key={card.id} className="card" draggable="true" onDragStart={drag} data-id={card.id}>
                                            <Card key={card.id} name={card.name} date={card.date} amount={card.amount} type={card.type} className="card" draggable="true" onDragStart={drag} data-id={card.id}/>
                                        </article>
                                        
                                    ))}
                                </div>
                            )
                        })
                    }
                    </div>
                </main>
                <div id="footer" className='w-full bg-slate-100 h-[5vh] flex items-center justify-center'>
                    <input className="bg-slate-100 border border-2px-solid border-black rounded" type="text" id="newCategoryName" placeholder='New category name'></input>
                    <button className="border border-2px-solid border-black rounded px-5 ml-3" onClick={addCategory}>Add category</button>
                    <button className="border border-2px-solid border-black rounded px-5 ml-[50%]" onClick={proceed}>Done</button>
                </div>
            </div>
        )
    }
}


export default DragAndDrop