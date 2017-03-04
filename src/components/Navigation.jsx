import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import firebase from 'utils/firebase';
import * as authActions from 'reducers/auth';
import {smoothScrollTo} from 'utils/resources';
import dashboardImg from 'images/dashboard.svg';

class Navigation extends React.Component {
  static propTypes = {
    logout: React.PropTypes.func.isRequired
  }

  scrollToTop = () => {
    smoothScrollTo('top');
  }

  render() {
    const {logout} = this.props;
    const email = firebase.auth().currentUser ? firebase.auth().currentUser.email : '';

    return (
      <div className="nav">
        <div className="nav-username vcenter pull-left">{email === 'dm@5ecombatmanager.com' ? 'DM' : email}</div>
        {email.length > 0 &&
          <Link className="nav-dashboard vcenter pull-left" to="/dashboard" onClick={this.scrollToTop}><img src={dashboardImg} /></Link>
        }
        {email.length > 0 &&
          <button className="btn btn-nav vcenter pull-right" onClick={logout}>logout</button>
        }
      </div>
    );
  }
}

export default connect(() => ({}), {
  logout: authActions.startLogout
})(Navigation);
