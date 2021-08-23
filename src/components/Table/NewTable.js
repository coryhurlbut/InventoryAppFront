import React, { Component } from 'react'
import MOCK_DATA from './MOCK_DATA.json'
import { useTable } from 'react-table'
import './table.css'

export default class NewTable extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: props.data
        }
        
    }
    //Included this function, so when toggling between table types, the table actually updates with correct information Ex. Available items display by default, but without this, clicking unavailable the table didnt change
    componentDidUpdate(prevProps, prevState){
        if(this.props.data !== prevProps.data){
            this.setState({ data: this.props.data });
        }
    }

    renderTableData(){
        return this.state.data.map((item, index) => {
            const { _id, name, description, homeLocation, serialNumber, notes } = item
            return(
                <tr key={_id}>
                    <input type='checkbox'>{}</input>
                    <td>{_id}</td>
                    <td>{name}</td>
                    <td>{description}</td>
                    <td>{homeLocation}</td>
                    <td>{serialNumber}</td>
                    <td>{notes}</td>
                </tr>
            )
        })
    }
    
    render() {
        return(
            <div>
            <h1 id='title'></h1>
            <table id='items'>
                <thead>
                    <th></th>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Serial Number</th>
                    <th>Notes</th>
                </thead>
                <tbody>
                    {this.renderTableData()}
                </tbody>
            </table>
            <pre></pre>
            </div>
    )
}



//A way to generate header based off of key from incoming database info, doesn't work well with current mongodb database 
// renderTableHeader() {
//     if (this.state.data.length < 1) {
//         return "No Data";
//     }

//     let header = Object.keys(this.state.data[0]);
//     if(key != _id){
//         console.log(this.state.data[0]);
//         return header.map((key, index) => {
//             console.log(key, index);
//             return <th key={index}>{key}</th>
//         })
//     }
    
// }
}



