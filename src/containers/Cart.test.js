import React from 'react';
import { shallow, configure } from 'enzyme';
import Cart from './Cart';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe('Renders Cart component', () => {
  it('renders without crashing', () => {
     shallow(<Cart />);
   });
});