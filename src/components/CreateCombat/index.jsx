import React from 'react';
import ViewCombat from 'components/ViewCombat';

export default class CreateCombat extends React.Component {
  render() {
    return (
        <ViewCombat isNew={true} />
    );
  }
}
