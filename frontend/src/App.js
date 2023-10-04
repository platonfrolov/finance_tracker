import React from 'react'
import PDFUpload from './components/PDFUpload';
import DragAndDrop from './components/dragAndDrop/DragAndDrop';


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pdf_uploaded: false
    }
  }

  render(){
    return (
      <div className='select-none'>
        <PDFUpload></PDFUpload>
      </div>
    );
  }
}

