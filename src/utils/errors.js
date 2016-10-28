import _ from 'lodash';

export function hasError(errors, fields) {
  return _.some(fields, (field) => {
    return _.indexOf(errors, field) !== -1;
  });
}
