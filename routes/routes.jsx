var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute; // a reactrouter component for the default route
var browserHistory = ReactRouter.browserHistory;

// if (typeof window === 'object') {
// 	function createElement(Component, props) {
// 		return <Component {...props} custom = {window.PROPS} />;
// 	}
// }

module.exports = (  


<Router history = {browserHistory}>
<Route path = '/' component ={require('../views/Layout.jsx')}>
//now we add routes within Route
	<IndexRoute component = {require('../views/Index.jsx')} /> //doesn't need path since it's the index component
	<Route path = 'about' component = {require('../views/About.jsx')} />
</Route>
</Router>
);

//you have to separate your custom props from those of reactrouter

//the fact that index and about are within the route for layout make it so that index and about are the children of layout