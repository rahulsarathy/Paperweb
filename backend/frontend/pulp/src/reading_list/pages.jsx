import React from 'react';
import PropTypes from 'prop-types';

class Pages extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (<div>
      {
        this.props.showPages ?
        <div>
          {
            this.props.page > 0 ? <button
            onClick={this.props.previousPage}>Previous Page
          </button> : <div></div>
          }
          {
               this.props.length > 0 ? <button
               onClick={this.props.nextPage}>Next Page
             </button>
             :
              <div></div>
             }
        </div> : <div></div>
      }
    </div>);
  }
}

export default Pages;
