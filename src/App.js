import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/fontawesome-free-solid'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faShoppingCart)

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      selectedBooks: []
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
  }
  
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  userHasAddedBook = book => {
    const selectedBooks = this.state.selectedBooks.concat(book)
    this.setState({ selectedBooks })
  }

  handleLogout = async event => {
    await Auth.signOut();
  
    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      userHasAddedBook: this.userHasAddedBook,
      books: this.state.selectedBooks
    };
  
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Poudl'Amazon</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? 
                <Fragment>
                  <NavItem onClick={this.handleLogout}>Logout</NavItem>
                    <LinkContainer to="/cart">
                    <NavItem>
                      <FontAwesomeIcon icon='shopping-cart'/>
                    </NavItem>
                    </LinkContainer>      
                </Fragment>  
                : <Fragment>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}


export default withRouter(App);
