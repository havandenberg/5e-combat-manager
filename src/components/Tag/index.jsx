import React from 'react';

export default class Tag extends React.Component {
  static propTypes = {
    text: React.PropTypes.string,
    type: React.PropTypes.string.isRequired
  }

  render() {
    const {type, text} = this.props;

    return (
      <div className={`tag tag-${type}`}>
        {text ? text.toUpperCase() : type.toUpperCase()}
      </div>
    );
  }
}
