import React, { Component } from 'react';
import { graphql } from '@apollo/react-hoc';
import {getBooksQuery} from '../queries/queries';


class BookList extends Component {
  displayBooks(){
    var data = this.props.data;
    if(data.loading){
      return (<div>books details loading...</div>);
    }else {
      let books = this.props.data.books;
      return books.map(book => {
        return(<li key={book.id}>{book.name}</li>)
      });
    }
  }
    render(){
        console.log(this.props);
        return(
            <div>
                <ul id="book-list">
                    {this.displayBooks()}
                </ul>
            </div>
        );
    }
}

export default graphql(getBooksQuery)(BookList);