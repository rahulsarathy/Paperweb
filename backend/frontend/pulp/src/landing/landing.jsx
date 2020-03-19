import React from "react";
import ReactDOM from "react-dom";
import { Row, Col, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";
import "./components.scss";

const images_url = "../static/images/";

function Header() {
	return (
		<div id="header">
			<img
				className="logo"
				src={images_url + "pulp_black_logo.svg"}
			/>
			<div className="links">
                <a href="#">Pricing</a>
				<a href="#">Contact</a>
                <a href="#">FAQ</a>
				<span>|</span>
				<a href="/accounts/login">Login</a>
				<a href="/accounts/signup">Sign Up</a>
			</div>
		</div>
	);
}


function Splash() {
    return (
        <Row id="splash">
            <Col className="left">
                <h1>Your favorite articles, made into a magazine</h1>
            </Col>
            <Col className="right">
                <h4>High quality writing was meant to be held, not scrolled through</h4>
                <Button id="sign-up">Sign Up</Button>
            </Col>
        </Row>
    );
}

function Steps() {
    return (
        <div id="steps">
            <Row>
                <Col className="step">
                    <div className="step-info">
                        <img src={images_url + "step1.png"}/>  
                        <span className="step-desc">Add Articles you want to read</span>
                    </div>
                </Col>
                <Col className="step">
                    <div className="step-info">
                        <img src={images_url + "step2.png"}/>  
                        <span className="step-desc">Read, whenever you want</span>
                    </div>
                </Col>
                <Col className="step">
                    <div className="step-info">
                        <img src={images_url + "step3.png"}/>  
                        <span className="step-desc">What you don't finish gets delivered to you as a magazine</span>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

function Preview() {
    return (
        <div id="preview">
            <img src={images_url + "preview.png"}/>
        </div>
    );
}

function Landing() {
    return (
        <div>
            <Header/>
            <Splash/>
            <Steps/>
            <Preview/>
        </div>
    );
}

ReactDOM.render(<Landing />, document.querySelector("body"));
