import React, { Component } from "react";
import axios from 'axios';
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";


export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      offers: [],
      total: 0
    }
  }

  async componentDidMount() {
    try {
      const offers = await this.getCommercialOffers();
      this.setState({ offers: offers.data.offers });
    } catch (e) {
      alert(e);
    } 
    this.setState({ total: this.getBestOffer()}) 
  }

  getBestOffer() {
    if (!this.state.books || !this.state.offers[0] || !this.state.offers[1] || !this.state.offers[2]) {
      return;
    }
    const total = this.state.books.reduce((acc, book) => acc += book.price, 0)
    const percentageDiscount = total * (1 - (this.state.offers[0].value / 100))
    const minusDiscount = total - this.state.offers[1].value
    const sliceDiscount = total - (Math.floor(total/this.state.offers[2].sliceValue) * this.state.offers[2].value)
    return Math.min(percentageDiscount, minusDiscount, sliceDiscount) 
  }
  
  getCommercialOffers() {
    const books = this.state.books.concat(this.props.books)
    this.setState({ books })
    const isbn = books.map((book) => book.isbn).join(',')
    return axios.get(`http://henri-potier.xebia.fr/books/${isbn}/commercialOffers`);
  }

  renderBooksList() {
    return [{}].concat(this.state.books).map(
      (book) =>
      this.state.books.length > 0 
          ? 
            book.price !== undefined ?
            <div>
              <ListGroupItem header={book.title}>
                {"Price: " + book.price}
              </ListGroupItem>
            </div>
            :
            ''
          : 
            <h4>
              <b>{"\uFF0B"}</b> Your cart is empty !
            </h4>
    );
  }

  render() {
    return(
      <div className="books">
        <PageHeader>Cart</PageHeader>
        <ListGroup>
          {this.renderBooksList(this.state.books)}
        </ListGroup>
      </div>
    )
  }
}