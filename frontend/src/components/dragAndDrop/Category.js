import React from 'react'
import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import EditCategoryName from '../modals/EditCategoryName';
import TransactionOverview from '../modals/TransactionOverview'


export default class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
        showEditNameModal: false,
        showTransactionOverviewModal: false,
    }
    this.viewCategory = () => {
        this.setState({showTransactionOverviewModal: true})
    }
    this.editCategory = () => {
        this.setState({showEditNameModal: true})
    }
    this.handleCategoryChange = (oldName, newName) => {
        if (oldName != newName && newName != "" && !this.props.categories.includes(newName)) {
            var newCategories = this.props.categories.map(category => {
                if (category == oldName) {
                    category = newName
                }
                return category
            })
            this.props.setCategories(newCategories)
            var to_send = {
                "payload": {
                    "newName": newName,
                    "oldName": oldName,
                }
            }
            fetch("http://127.0.0.1:8000/edit_category", {
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
    this.handleTransactionChange = (newCards) => {
        this.props.setCards(newCards)
    }
    this.deleteCategory = () => {
        // move all transactions in this category to unassigned
        console.log(this.props.cards)
        var newCards = this.props.cards.map(card => {
            if (card.state == this.props.name) {
                card.state = "unassigned"
            }
            return card
        })
        this.props.setCards(newCards)
        // delete the category on the frontend
        var newCategories = this.props.categories.filter(category => { 
            return category !== this.props.name
        })
        this.props.setCategories(newCategories)
        var to_send = {
            "payload": this.props.name,
        }
        // delete the category on the backend
        fetch("http://127.0.0.1:8000/delete_category", {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            method: 'DELETE',
            body: JSON.stringify(to_send),
        }).then(async response => {
            var data = await response.json()
            console.log(data)
        })
    }
  }

  render(){
    var categoryTransactions = this.props.cards.filter(card => card.state === this.props.name)
    var nrCategories = categoryTransactions.length
    var categoryTransactionAmount = 0
    categoryTransactions.forEach(element => {
        categoryTransactionAmount = (categoryTransactionAmount + element.amount)
    });
    categoryTransactionAmount = (Math.round(categoryTransactionAmount * 100) / 100).toFixed(2);
    return (
      <div>
        <div
            className={this.props.isMainCol ? "column h-[85vh] bg-slate-300 rounded-lg overflow-scroll" : "column bg-slate-200 rounded-lg overflow-scroll"}
            data-column={this.props.name}
            onDragEnter={this.props.dragEnter}
            onDragLeave={this.props.dragLeave}
            onDragOver={this.props.allowDrop}
            onDrop={this.props.drop}
        >
            
            <h2 className= {this.props.isMainCol ? 'sticky top-0 h-8 bg-slate-200 w-full text-center flex items-center justify-center !z-100' : 'sticky top-0 h-8 bg-slate-300 w-full text-center flex items-center justify-center !z-100'}>{this.props.name}</h2>
            
            {
            this.props.isMainCol ?
            this.props.cards.filter(card => card.state === this.props.name).map(card => (
                <article key={card.id} className="card" draggable="true" onDragStart={this.props.drag} data-id={card.id}>
                    <Card change={this.handleTransactionChange} cards={this.props.cards} id={card.id} name={card.name} date={card.date} amount={card.amount} type={card.type} className="card" draggable="true" onDragStart={this.props.drag} data-id={card.id}/>
                </article>
            ))
            :
            <div>
                <div className='grid grid-cols-5'>
                    <div></div>
                    <div onClick={this.viewCategory} className='text-center border border-1px-solid border-black m-1 cursor-pointer'><FontAwesomeIcon icon={icon({name: 'eye'})} /></div>
                    <div onClick={this.editCategory} className='text-center border border-1px-solid border-black m-1 cursor-pointer'><FontAwesomeIcon icon={icon({name: 'edit'})} /></div>
                    <div onClick={this.deleteCategory} className='text-center border border-1px-solid border-black m-1 cursor-pointer'><FontAwesomeIcon icon={icon({name: 'trash'})} /></div>
                </div>
                <div className='py-10 mx-5 border border-1px border-dashed border-black text-center'>Sleep transacties hierin</div>
                <div className='grid grid-cols-3'>
                    <div><div className='w-fit bg-slate-300 rounded-lg m-2 px-1 '>{nrCategories}</div></div>

                    <div className='col-span-2 text-right m-2 px-1'>Spent: {categoryTransactionAmount}</div>
                </div>
            </div>
            
            }
        </div>
        <EditCategoryName show={this.state.showEditNameModal} close={() => this.setState({showEditNameModal: false})} change ={this.handleCategoryChange} name={this.props.name}></EditCategoryName>
        <TransactionOverview transactions={this.props.cards} show={this.state.showTransactionOverviewModal} close={() => this.setState({showTransactionOverviewModal: false})} change={this.handleTransactionChange} name={this.props.name}></TransactionOverview>
      </div>

      
    );
  }
}

