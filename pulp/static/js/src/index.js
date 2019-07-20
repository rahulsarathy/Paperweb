import React from "react";
import ReactDOM from "react-dom";
import Landing from './Landing.jsx';


window.onload = function() {
	console.log("js loaded");
}


const landing = document.getElementById('landing') !== null;
console.log("user is " + landing)
if (landing) {
	ReactDOM.render(< Landing/>, document.getElementById('landing'))
}