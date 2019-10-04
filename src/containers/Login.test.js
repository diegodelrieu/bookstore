import React from 'react';
import { shallow, configure } from 'enzyme';
import Login from './Login';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe('Renders Login component', () => {
  it('renders without crashing', () => {
     shallow(<Login />);
   });
});