import React from 'react';
import ReactDOM from 'react-dom';
import Landing from "./Pages/Landing.jsx";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import $ from 'jquery';

const landing = document.getElementById('landing') !== null;
console.log("landing is " + landing)
if (landing) {
	ReactDOM.render(< Landing/>, document.getElementById('landing'))
}

$(document).ready(function() {
	console.log("js loaded");
});