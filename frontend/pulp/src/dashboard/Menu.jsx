import React from 'react';
import ReactDOM from 'react-dom';
import shortid from 'shortid';

var menu_items = ["Overview", "Related", "More Info"];

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.changeSelected = this.changeSelected.bind(this);

    this.state = {
      'selected_text': 'Overview'
    }
  }

  changeSelected(index) {
    this.setState({
      'selected_text': menu_items[index]
    });
    this.props.changeSelected(index);
  }

  render() {
    return (
      <div className="menu">
        {
          menu_items.map((item, index) => {
            return <MenuItem changeSelected={this.changeSelected} selected={this.props.selected} key={shortid.generate()} index={index} item={item}/>
          })
        }
        <div className="menu-slider">
          <MenuItemSelected index={this.props.selected} text={this.state.selected_text}/>
        </div>
      </div>);
  }
}

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className;
    if (this.props.selected === this.props.index) {
      className = "selected"
    }
    return (<div index={this.props.index} onClick={() => this.props.changeSelected(this.props.index)} className="menu-item">
    {this.props.item}
    </div>)
  }
}

class MenuItemUnselected extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div></div>
    );
  }

}

class MenuItemSelected extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var offset = this.props.index * 30
    var style = {
      left: 'calc(' + 0 + 'px + ' + offset + '%)',
    }
    return (
      <div className="selected" style={style}>
        {this.props.text}
      </div>
    );
  }

}
