import React from 'react';
import { shallow, configure } from 'enzyme';
import Home from './Home';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe('Renders Home component', () => {
  it('renders without crashing', () => {
     shallow(<Home />);
   });
});