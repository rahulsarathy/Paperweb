import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import {Modal} from 'react-bootstrap';
import {Category, Magazine, Header} from './Components.jsx'

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.showMagazine = this.showMagazine.bind(this);
    this.closeMagazine = this.closeMagazine.bind(this);
    this.showAboutCard = this.showAboutCard.bind(this);
    this.hideAboutCard = this.hideAboutCard.bind(this);
    this.state = {
      data: [],
      showMagazine: false,
      selected: {},
      categories: {}
    };
  }

  componentDidMount() {
    this.getBlogs();
  }

  showMagazine() {
    this.setState({showMagazine: true});
  }

  closeMagazine() {
    this.setState({showMagazine: false});
  }

  assembleCategories(blogs) {
    let categories = {};
    // Iterate through all blogs
    for (let i = 0; i < blogs.length; i++) {
      let blog_categories = blogs[i].categories;
      // Iterate through this blog's categories
      for (let j = 0; j < blog_categories.length; j++) {
        let blog_category = blog_categories[j];
        //
        let categories_list = categories[blog_category] || [];
        categories_list.push(blogs[i]);
        categories[blog_category] = categories_list;
      }
    }
    return categories;
  }

  showAboutCard(blog) {
    if (blog === this.state.selected) {
      this.setState({selected: {}});
    } else {
      this.setState({selected: blog});
    }
  }

  hideAboutCard(blog) {
    this.setState({selected: {}});
  }

  getBlogs() {
    $.ajax({
      url: '/api/blogs',
      type: 'GET',
      success: function(data) {
        let categories = this.assembleCategories(data);
        this.setState({data: data, categories: categories});
      }.bind(this)

    });
  }

  // Uppercase first letter in javascript
  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (<div>
      <Header handleClick={this.showMagazine}/>
      <div className="dashboard">
        <Modal show={this.state.showMagazine} onHide={this.closeMagazine}>
          <Magazine close={this.closeMagazine}/>
        </Modal>
        <div className="categories">
          {
            Object.keys(this.state.categories).map((category) => {
              if (this.state.categories[category].includes(this.state.selected))
                return <Category hide={this.hideAboutCard} show={this.showAboutCard} selected={this.state.selected} key={shortid.generate()} category={this.jsUcfirst(category)} blogs={this.state.categories[category]}/>
              return <Category selected={{}} hide={this.hideAboutCard} show={this.showAboutCard} key={shortid.generate()} category={this.jsUcfirst(category)} blogs={this.state.categories[category]}/>
            })
          }
        </div>
      </div>
    </div>);
  }
}

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'))
