//clientside javascript

// var React = require('react');
var ReactDOM = require('react-dom');
// var Component = require('./Component.jsx');
var routes = require('./routes/routes.jsx');

// var props = window.PROPS;

// Note how ReactDOM takes in two parameters (the contents and the location)
ReactDOM.render(
	routes, document.getElementById("app")
);

//you can have multiple ReactDOM.render statements