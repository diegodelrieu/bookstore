import React, { Component } from "react";
import axios from 'axios';
import { Navbar, NavbarBrand, PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/fontawesome-free-solid'
import { library } from "@fortawesome/fontawesome-svg-core";
import "./Cart.css"

library.add(faTimes)

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
      console.log(e);
    } 
    this.setState({ total: this.getBestOffer()}) 
  }

  getBestOffer() {
    const total = this.state.books.reduce((acc, book) => acc += book.price, 0)
    let percentageDiscount
    let minusDiscount
    let sliceDiscount  

    this.state.offers[0] ? percentageDiscount = total * (1 - (this.state.offers[0].value / 100)) : percentageDiscount = Infinity
    this.state.offers[1] ? minusDiscount = total - this.state.offers[1].value : minusDiscount = Infinity
    this.state.offers[2] ? sliceDiscount = total - (Math.floor(total/this.state.offers[2].sliceValue) * this.state.offers[2].value) : sliceDiscount = Infinity
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
              <ListGroupItem className='list-itm' header={book.title}>
                {"Price: " + book.price}
                <div className='delete-btn' onClick={() => this.deleteBook(book)}>
                  <FontAwesomeIcon  icon='times'/>
                </div>
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

  deleteBook(book) {
    this.props.userHasDeletedBook(book)
  }

  render() {
    return(
      <div className="books">
        <PageHeader>Cart</PageHeader>
        <ListGroup>
          {this.renderBooksList(this.state.books)}
        </ListGroup>
        <div id="footer">  
            <Navbar className="total-container">
              <NavbarBrand>Total</NavbarBrand>
              <p className="total">{this.state.total === Infinity ? 0 + '€' : this.state.total}</p>
            </Navbar>
        </div>
      </div>
    )
  }
}