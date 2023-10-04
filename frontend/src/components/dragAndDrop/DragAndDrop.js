import { useState, useEffect } from 'react'
import './styles.css'
import Card from './Card'
import Category from './Category'
import Loader from '../loader/Loader'



const DragAndDrop = (props) => {
    var initialState = []
    // receive saved name -> catefory mappings from 
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
    const [categories, setCategories] = useState(props.categoryData["categories"])
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
        if (categories.length < 28) {
            var categoryName = document.querySelector("#newCategoryName").value
            if (categories.includes(categoryName) || categoryName == "") {
                console.log("TODO: Please give the category a different name")
            } else {
                document.querySelector("#newCategoryName").value = ""
                var updatedCategories = [...categories]
                updatedCategories.push(categoryName)
                setCategories(updatedCategories)
                var to_send = {
                    "payload": categoryName,
                }
                fetch("http://127.0.0.1:8000/create_category", {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    method: 'POST',
                    body: JSON.stringify(to_send),
                }).then(async response => {
                    var data = await response.json()
                    console.log(data)
                })
            }
        }
        
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
                        <Category 
                            categories={categories}
                            setCategories={setCategories}
                            name={"unassigned"} 
                            cards={cards}
                            setCards={setCards}
                            drop={drop}
                            drag={drag}
                            allowDrop={allowDrop}
                            dragLeave={dragLeave}
                            dragEnter={dragEnter}
                            isMainCol={true}
                        ></Category>
                    </div>
                    <div className='r col-span-4 gap-4 grid grid-cols-4'>
                    {
                        categories.map(element => {
                            return (
                                <Category 
                                    categories={categories}
                                    setCategories={setCategories}
                                    name={element} 
                                    cards={cards}
                                    setCards={setCards}
                                    drop={drop}
                                    drag={drag}
                                    allowDrop={allowDrop}
                                    dragLeave={dragLeave}
                                    dragEnter={dragEnter}
                                    isMainCol={false}
                                ></Category>
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