import React from 'react';
import { connect } from 'react-redux';
import * as L from 'leaflet';
import * as RL from 'react-leaflet';

import LeafBaseMap from './LeafBaseMap.jsx';
import LeafOverlay from './LeafOverlay.jsx';

import { trackMapView } from '../../actions';
import { boundsToCircle, circleToBounds } from '../../utils/Math.js';

L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.1.0/images/';

var mcCRS = L.extend({}, L.CRS.Simple, {
  transformation: new L.Transformation(1, 0, 1, 0)
});

class LeafMap extends React.Component {
  componentWillReceiveProps(newProps) {
    const { lastView } = newProps;
    if (lastView !== this.props.lastView) {
      this.checkAndSetView(lastView);
    }
    if (lastView === this.waitingForView) {
      this.waitingForView = null;
    }
  }

  checkAndSetView(view) {
    if (!this.map) return;
    if (!view) return;
    if (!this.waitingForView) {
      this.map.fitBounds(circleToBounds(view), { animate: false });
    }
  }

  onRef(ref) {
    if (!ref) return;
    const map = ref.leafletElement;
    if (this.map == map) return;
    this.map = map;
    this.checkAndSetView(this.props.lastView);
  }

  onViewChange(e) {
    const newView = boundsToCircle(e.target.getBounds());
    this.waitingForView = newView;
    this.props.trackMapView(newView);
  }

  render() {
    const {
      mapBgColor,
    } = this.props;

    return (
      <div className="mapContainer"
        style={{ backgroundColor: mapBgColor }}
      >
        <RL.Map
          className="map"
          ref={this.onRef.bind(this)}
          crs={mcCRS}
          center={[0, 0]}
          zoom={-6}
          maxZoom={5}
          minZoom={-6}
          attributionControl={false}
          zoomControl={false}
          onmoveend={this.onViewChange.bind(this)}
          onzoomend={this.onViewChange.bind(this)}
        >
          <LeafBaseMap />
          <LeafOverlay />
        </RL.Map>
      </div>
    );
  }
}

const mapStateToProps = ({ control, mapConfig, mapView }, ownProps) => {
  return {
    mapBgColor: mapConfig.basemaps[mapView.basemapId].bgColor,
    lastView: mapView.lastView,
    _windowWidth: control.windowWidth, // dummy, only to trigger a re-render
  };
};

const mapDispatchToProps = {
  trackMapView,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeafMap);
