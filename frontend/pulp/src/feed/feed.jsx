import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import {Post, Header, DateDivider} from './Components.jsx'


export default class Feed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            date_map: {}
        };
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts() {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();

        $.ajax({
            url: '/api/blogs/get_posts',
            type: 'GET',
            success: function(data) {
                console.log(data);
                this.setState({
                    date_map: data
                });
                // var dates = this.getDates();
                // this.setState({
                //     posts: data,
                //     dates: dates,
                // });
            }.bind(this)
        });
    }

    getDates() {
        var dates = [];
        var posts = this.state.posts;
        for (var i =0; i < posts.length; i++) {
            dates.push(posts[i].date_published);
        }
        var unique_dates = new Set(dates);
        return unique_dates;
    }

    render () {
        return (
            <div>
                <Header />
                  <div className="feed">
                    <h1>Feed</h1>
                    {
                        Object.keys(this.state.date_map).map((date, index) =>
                            <DateDivider index={index} date={date} posts={this.state.date_map[date]} key={shortid.generate()}/>
                            )
                    }
                </div>
            </div>
        );
  }
}

ReactDOM.render(<Feed/>, document.getElementById('feed'))
