import React from 'react';
import { connect } from 'react-redux';

let lastLocalStorageError = {};

const LocalStorageSync = ({
  mapView,
  overlay,
}) => {
  try {
    window.localStorage.setItem('civMap.state', JSON.stringify({ mapView }));
    window.localStorage.setItem('civMap.overlay', JSON.stringify(overlay));
  } catch (e) {
    if (lastLocalStorageError.code != e.code) {
      lastLocalStorageError = e;
      console.error('Failed storing app state in LocalStorage:', e);
    }
  }
  return null; // don't render anything
};

const mapStateToProps = ({ mapView, overlay }, ownProps) => {
  const { basemapId, lastView } = mapView;
  mapView = { basemapId, lastView };
  return { mapView, overlay };
};

export default connect(mapStateToProps)(LocalStorageSync);
