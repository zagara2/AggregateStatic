var React = require('react');
var Link = require('react-router').Link;//allows you to navigate around your application

module.exports = React.createClass({
	displayName: 'Layout',
	_handleClick: function() {
		alert();
	},
	render: function() {
		
		return(

			<div>
			<h1> Aggregate </h1>
			<p> Isnt server-side rendering remarkable?</p>
			<button onClick = {this._handleClick}>Click Me</button>



			
			{this.props.children}
			<ul>
				<li>
				<Link to ='/'>Home</Link>
				</li>
				<li>
				<Link to = '/about'>About</Link>
				</li>
			</ul>
			</div>
			

		);
	}

});

//allowing the client side to see the props?
//layout will be the main (parent) component, and all other components will be rendered within it