import React, { Component } from "react";
import axios from "axios";
import { Navbar, NavbarBrand, PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Cart.css"

export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      offers: [],
      total: 0,
      bestOffer: 0
    }
  }

  async componentDidMount() {
    try {
      const offers = await this.getCommercialOffers();
      this.setState({ offers: offers.data.offers });
    } catch (e) {
      console.log(e);
    } 
    this.setState({ bestOffer: this.getBestOffer()}) 
  }

  getBestOffer() {
    const total = this.state.books.reduce((acc, book) => acc += book.price, 0)
    this.setState({ total })

    let percentageDiscount
    let minusDiscount
    let sliceDiscount  

    this.state.offers[0] ? percentageDiscount = total - total * (1 - (this.state.offers[0].value / 100)) : percentageDiscount = 0
    this.state.offers[1] ? minusDiscount = this.state.offers[1].value : minusDiscount = 0
    this.state.offers[2] ? sliceDiscount = Math.floor(total/this.state.offers[2].sliceValue) * this.state.offers[2].value : sliceDiscount = 0
    return Math.max(percentageDiscount, minusDiscount, sliceDiscount) 
  }
  
  getCommercialOffers() {
    const books = this.state.books.concat(this.props.books)
    this.setState({ books })
    const isbn = books.map((book) => book.isbn).join(",")
    return axios.get(`http://henri-potier.xebia.fr/books/${isbn}/commercialOffers`);
  }

  renderBooksList() {
    return [{}].concat(this.state.books).map(
      (book) =>
        this.state.books.length > 0 
          ? 
            book.price !== undefined ?
            <div>
              <ListGroupItem className="list-itm" header={book.title} key={book.isbn}>
                <div className="price">{book.price + "€"}</div>
              </ListGroupItem>
            </div>
            :
            ""
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
          <ListGroupItem className="list-itm discount" header={"Discount"}>
            <div className="price">{`-${this.state.bestOffer}€`}</div>
          </ListGroupItem>
        </ListGroup>
        <div id="footer">  
          <Navbar className="total-container">
            <NavbarBrand>Total</NavbarBrand>
            <div className="price">{this.state.total - this.state.bestOffer + "€"}</div>
          </Navbar>
        </div>
      </div>
    )
  }
}