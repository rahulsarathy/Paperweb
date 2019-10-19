import React from 'react';
import ReactDOM from 'react-dom';

export default class Related extends React.Component {

  constructor(props) {
    super(props);


    this.state = {

    };
  }

  render() {
    const {blog} = this.props;

    return (<div className="related">
    <h1>Readers of {blog.display_name} also enjoy</h1>
    </div>);
  }
}
