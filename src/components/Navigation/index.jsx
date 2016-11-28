import React from 'react';
import {connect} from 'react-redux';
import firebase from 'utils/firebase';
import * as authActions from 'reducers/auth';

class Navigation extends React.Component {
  static propTypes = {
    isDM: React.PropTypes.bool,
    logout: React.PropTypes.func.isRequired
  }

  render() {
    const {isDM, logout} = this.props;
    const email = firebase.auth().currentUser ? firebase.auth().currentUser.email : '';

    return (
      <div className="nav">
        <div className="nav-username vcenter pull-left">{isDM ? 'DM' : email}</div>
        {email.length > 0 &&
          <button className="btn btn-nav vcenter pull-right" onClick={logout}>logout</button>
        }
      </div>
    );
  }
}

export default connect((state) => {
  return {
    isDM: state.auth.get('isDM')
  };
}, {
  logout: authActions.startLogout
})(Navigation);
