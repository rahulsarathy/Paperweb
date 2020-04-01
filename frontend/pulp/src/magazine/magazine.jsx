import React from "react";
import $ from "jquery";
import { BlogChapter } from "./components.jsx";

const images_url = "../static/images/";

var BlogChapters = [
    {
        blog: "Bryan Caplan",
        domain: "econlib.org",
        title: "Historically Hollow: The Cries of Populism",
        color: "#0E1534"
    },
    {
        blog: "Venkatesh Rao",
        domain: "ribbonfarm.com",
        title: "Pleasure as an Organizing Principle",
        color: "#7ECDFC"
    },
    {
        blog: "Antonio Garcia Martinez",
        domain: "https://pullrequest.substack.com/",
        title: "Slouching toward Bethlehem to be born",
        color: "#E62D29"
    },
    {
        blog: "Andrew Kortina",
        domain: "https://kortina.nyc/",
        title:
            "Speech is Free, Distribution is Not // A Tax on the Purchase of Human Attention and Political Power",
        color: "#438BCA"
    }
];

export default class Magazine extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            top_gradient: {},
            bottom_gradient: {}
        };
    }

    componentDidMount() {
        this.createGarnish();
    }

    createGarnish() {
        var top_gradient = $("#underline0").offset().top;
        var top_magazine = $(".magazine").offset().top;

        var next_color = $("#underline0")
            .css("border-bottom")
            .split("solid ")[1];

        this.setState({
            top_gradient: {
                top: "0px",
                height: top_gradient - top_magazine + "px",
                backgroundImage: "linear-gradient(#B3AB9D, " + next_color + ")"
            }
        });
    }

    createBlogChapters() {
        var to_return = [];

        to_return = BlogChapters.map((blog_chapter, index) => (
            <BlogChapter
                key={blog_chapter.blog}
                index={index}
                color={blog_chapter.color}
                blog={blog_chapter.blog}
                title={blog_chapter.title}
            />
        ));

        to_return.push(
            <BlogChapter
                key="bottombc"
                index={4}
                blog="And 12 More Posts"
                color="#B3AB9D"
            />
        );

        return to_return;
    }

    render() {
        let blog_chapters = this.createBlogChapters();

        let style1 = {
            top: "0px",
            height: "96px"
        };

        let econlib_url = "url(" + images_url + "econlib.png" + ")";

        let page_style = {
            backgroundImage: econlib_url,
            backgroundSize: "400px 520px"
        };

        return (
            <div className="magazine-container">
                <div className="magazine">
                    <div className="hide-magazine"></div>
                    <div className="binding"></div>
                    <div className="content">
                        <img
                            className="logo"
                            src={images_url + "pulp_black_logo.svg"}
                        />
                        <p className="subtitle">Printed for Harry Daly</p>
                        <p className="date">July 1st to July 31st</p>
                        <div className="blog-chapters">
                            <div
                                className="gradient2"
                                style={this.state.top_gradient}
                            ></div>
                            {blog_chapters}
                        </div>
                    </div>
                </div>
                <div className="page" style={page_style}></div>
                <div className="page2"></div>
            </div>
        );
    }
}
