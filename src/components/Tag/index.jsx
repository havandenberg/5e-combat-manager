import React from 'react';

export default class Tag extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired
  }

  render() {
    const {type} = this.props;

    return (
      <div className={`tag tag-${type}`}>
        {type.toUpperCase()}
      </div>
    );
  }
}
