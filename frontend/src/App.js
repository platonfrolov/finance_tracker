import React from 'react'
import PDFUpload from './components/PDFUpload';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pdf_uploaded: false
    }
  }

  render(){
    return (
      <div>
        <PDFUpload></PDFUpload>
      </div>
    );
  }
}

