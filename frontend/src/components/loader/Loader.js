import React from 'react'
import './loader.css'


export default class Loader extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <div className="lds-circle"><div></div></div>
        );
    }
}
