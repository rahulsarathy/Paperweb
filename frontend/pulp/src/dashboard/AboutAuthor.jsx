import React from 'react';
import ReactDOM from 'react-dom';

export default class AboutAuthor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var author = this.props.author;
    console.log(author);
    return (<div className="about-author">
      {
        this.props.num_authors === 1
          ? <h2>Author</h2>
          : <h2>Authors</h2>
      }
      <a href={author.link} target="_blank">
        <h3>{author.name}</h3>
      </a>
      {
        this.props.num_authors === 1
          ? <div></div>
          : <button onClick={this.props.nextAuthor}>Next Author</button>
      }
      <p>{author.bio}</p>
    </div>)
  }
}
