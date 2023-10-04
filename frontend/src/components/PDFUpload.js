import React from 'react'
import Loader from './loader/Loader'
import DragAndDrop from './dragAndDrop/DragAndDrop'

export default class PDFUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            done_loading_transactions: false,
            done_loading_categories: false,
        }
        this.FileInputChange = async () => {
            this.LoadCategories()
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
            this.LoadTransactions(pdfName, pdfB64)
        }
        this.LoadTransactions = (filename, payload) => {
            var to_send = {
                "filename": filename,
                "payload": payload,
            }
            fetch("http://127.0.0.1:8000/upload_pdf", {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                method: 'POST',
                body: JSON.stringify(to_send),
            }).then(async response => {
                var data = await response.json()
                this.transactions = data
                this.setState({done_loading_transactions: true})
            })
        }
        this.LoadCategories = () => {
            fetch("http://127.0.0.1:8000/get_categories", {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                method: 'GET',
            }).then(async response => {
                var data = await response.json()
                this.categoryData = data
                console.log(this.categoryData)
                this.setState({done_loading_categories: true})
            })
        }
        this.transactions = []
        this.categoryData = []
    }

  render(){
    if (this.state.done_loading_categories && this.state.done_loading_transactions) {
        return (
            <DragAndDrop transactions={this.transactions} categoryData={this.categoryData}></DragAndDrop>
        );
    } else if (this.state.loading) {
        return (
            <Loader></Loader>
        );
    } else {
        return (
            <div className='h-screen flex items-center justify-center'>
                <div className='flex flex-col items-center'>
                    <div>Upload een ING transactie overzicht:</div>
                    <button className='border border-2px-solid border-black rounded py-2 px-10 mt-5'><label className="cursor-pointer" for="pdf">Selecteer PDF</label></button>
                    <input type="file" id="pdf" accept="application/pdf" style={{"display": "none"}} onChange={this.FileInputChange}></input>
                </div>
            </div>
        );
    }
  }
}
