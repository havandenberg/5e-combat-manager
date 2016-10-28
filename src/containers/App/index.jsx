import React from 'react';
import {connect} from 'react-redux';
import Navigation from 'components/Navigation';

class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  };

  render() {
    const {children} = this.props;
    return (
      <main>
        <Navigation />
        {children}
      </main>
    );
  }
}

export default connect(() => ({}), {})(App);
