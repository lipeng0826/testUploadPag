import React from 'react';
import ReactDOM from 'react-dom';

import App from './comp/total.jsx';
// import App from './comp/1.jsx';
// import App from './comp/2.jsx';
// import App from './comp/3.jsx';
// import App from './comp/4.jsx';


function render(props = {}) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('react'));
}

render();