import React, { Component } from "react";
import { ListGroup, Button } from "react-bootstrap";
import "./Home.css";
import axios from "axios";


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      books: []
    };
  }

  renderBooksList = books => {
    return books.map(
      (book) =>
      <div className="card-product">
        <img src={book.cover} alt="Book cover"/>
        <div className="card-product-infos">
          <h2>{book.title}</h2>
          <p>{book.synopsis}</p>
          <Button variant="outline-primary" onClick={() => this.addToBasket(book)}>Add to basket</Button>
          <div className="price-tag">{book.price}€</div>
        </div>
      </div>
    );
  }

  addToBasket = book => {
    this.props.userHasAddedBook(book)
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    try {
      const books = await this.books();
      this.setState({ books: books.data });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  books() {
    return axios.get("http://henri-potier.xebia.fr/books");
  }

  render() {
    return (
      <div className="books">
        <h1>Books</h1>
        <ListGroup>
          {!this.state.isLoading && this.renderBooksList(this.state.books)}
        </ListGroup>
      </div>
    );
  }
}