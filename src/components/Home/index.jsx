import React from 'react';
import {Link} from 'react-router';

export default class Home extends React.Component {
  render() {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title vcenter center">D&D 5e Combat Manager</div>
        </div>
        <div className="page-content">
          <div className="form-field">
            <Link to="/dm-login">
              <button className="btn btn-action full-width">Click here if you are the DM</button>
            </Link>
          </div>
          <div className="form-field">
            <Link to="/player-login">
              <button className="btn btn-action full-width">Click here if you are NOT the DM</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
