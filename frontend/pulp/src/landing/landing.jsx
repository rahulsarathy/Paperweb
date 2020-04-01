import React from "react";
import ReactDOM from "react-dom";
import { Row, Col, Button } from "react-bootstrap";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    useHistory,
    withRouter
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "./components.scss";
import { Magazine } from "../magazine/components.jsx";
import "../magazine/components.scss";

const images_url = "../static/images/";

function Splash() {
    return (
        <Row id="splash">
            <Col className="left">
                <h1>Your favorite articles, made into a magazine</h1>
            </Col>
            <Col className="right">
                <h4>High quality writing was meant to be held, not scrolled</h4>
                <a href="/accounts/signup">
                    <Button id="sign-up">Sign Up</Button>
                </a>
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
                        <div className="step1-background">
                            <div className="number">1</div>
                            <img src={images_url + "step1.svg"} />
                        </div>
                        <span className="step-desc">
                            Sync your already existing reading lists or add your
                            own articles
                        </span>
                    </div>
                </Col>
                <Col className="step">
                    <div className="step-info">
                        <div className="step1-background">
                            <div className="number">2</div>

                            <img src={images_url + "step2.svg"} />
                        </div>
                        <span className="step-desc">
                            Read, whenever you want
                        </span>
                    </div>
                </Col>
                <Col className="step">
                    <div className="step-info">
                        <div className="step1-background">
                            <div className="number">3</div>

                            <img src={images_url + "step3.svg"} />
                        </div>
                        <span className="step-desc">
                            What you don't finish gets delivered to you as a
                            magazine
                        </span>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

function Preview() {
    return (
        <div id="preview">
            <img src={images_url + "preview.png"} />
        </div>
    );
}

export default class Landing extends React.Component {
    render() {
        return (
            <div>
                <div className="landing">
                    <div className="first-row">
                        <div className="first-half">
                            <Magazine />
                        </div>
                        <div className="second-half">
                            <Splash />
                        </div>
                    </div>
                </div>
                <Steps />
            </div>
        );
    }
}
