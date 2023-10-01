import React from 'react'
import Loader from './loader/Loader'

export default class PDFUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            done_loading: false,
        }
        this.FileInputChange = async () => {
            this.setState({loading: true})
            var pdfFile = document.querySelector("#pdf").files[0]
            var pdfName = pdfFile.name
            const readImageFileAsDataURL = (inputFile) => {
                const temporaryFileReader = new FileReader();
                return new Promise((resolve, reject) => {
                    temporaryFileReader.onerror = () => {
                    temporaryFileReader.abort();
                        reject(new DOMException("Problem parsing input file."));
                    };
                    temporaryFileReader.onload = () => {
                        resolve(temporaryFileReader.result.split(",")[1].trim());
                    };
                    temporaryFileReader.readAsDataURL(inputFile);
                });
                };
            var pdfB64 = await readImageFileAsDataURL(pdfFile)
            var to_send = {
                filename: pdfName,
                payload: pdfB64,
            }
            fetch("http://127.0.0.1:8000/upload_pdf", {
                method: 'POST',
                body: to_send,
            }).then(async response => {
                this.setState({done_loading: true})
                console.log(response)
            })
        }
    }

  render(){
    if (this.state.done_loading) {

    } else if (this.state.loading) {
        return (
            <Loader></Loader>
        );
    } else {
        return (
            <div>
                <div>Upload een transactie overzicht:</div>
                <button><label for="pdf">Selecteer PDF</label></button>
                <input type="file" id="pdf" accept="application/pdf" style={{"display": "none"}} onChange={this.FileInputChange}></input>
            </div>
        );
    }
  }
}
