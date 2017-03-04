import React from 'react';
import EditCombat from 'components/EditCombat';

export default class CreateCombat extends React.Component {
  render() {
    return (
        <EditCombat isNew={true} />
    );
  }
}
