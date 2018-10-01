import PropTypes from 'prop-types';

export const bikeType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  bikeNumber: PropTypes.number.isRequired,
});

export const lendingType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  lender: PropTypes.string.isRequired,
  bike_id: PropTypes.string.isRequired,
  bikeNumber: PropTypes.number.isRequired,
  time: PropTypes.shape({
    lent: PropTypes.string.isRequired,
    returned: PropTypes.string.isRequired,
  }),
});

export const breakdownType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
  description: PropTypes.string,
  bikeNumber: PropTypes.number.isRequired,
  time: PropTypes.shape({
    fixed: PropTypes.string.isRequired,
    broken: PropTypes.string.isRequired,
  }),
});

// vim: et ts=2 sw=2 :
