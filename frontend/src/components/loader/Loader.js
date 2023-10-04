import React from 'react'
import './loader.css'


export default class Loader extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <div className='grid h-screen place-items-center'>
                <div className="lds-circle color-white"><div>€</div></div>
            </div>
            
        );
    }
}
