import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import App from './App';
import Home from './containers/Home';

configure({adapter: new Adapter()});

describe('Renders App component', () => {
  it('renders without crashing', () => {
     shallow(<App />);
   });
});
