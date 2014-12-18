var southWest = L.latLng(40.18202, -75.93063),
    northEast = L.latLng(40.97575, -74.18655),
    mapBounds = L.latLngBounds(southWest, northEast);


/*
 * the first map in the page
 */
var map = L.map('map',{
  maxBounds: mapBounds,
  maxZoom: 15,
  minZoom: 10
});

/*
 * the second map, showing the grid data
 */
var gridmap = L.map('grid-map',{
  maxBounds: mapBounds,
  maxZoom: 15,
  minZoom: 10
});

/*
 * the third map, showing the generated data points
 */
var pointmap = L.map('pointmap',{
  maxBounds: mapBounds,
  maxZoom: 15,
  minZoom: 10
});

L.tileLayer('https://{s}.tiles.mapbox.com/v3/dsachitano.osm_walkable_data/{z}/{x}/{y}.png').addTo(map);
L.tileLayer('https://{s}.tiles.mapbox.com/v3/dsachitano.osm_walkable_data/{z}/{x}/{y}.png').addTo(gridmap);
L.tileLayer('https://{s}.tiles.mapbox.com/v3/dsachitano.osm_walkable_data/{z}/{x}/{y}.png').addTo(pointmap);



map.fitBounds(mapBounds);
gridmap.fitBounds(mapBounds);

var geojsonMarkerOptions = {
    radius: 2,
    fillOpacity: 0.85
};

/**
 * Copmute color for markers based on
 * pedestrian access categorization
 */
function colorForAnswer(answer) {
  switch(answer) {
    case 'Has Sidewalk::On Left side of Road':
    case 'Has Sidewalk::On Right side of Road':
    case 'Has Sidewalk::On Both Sides of Road':
    case 'Has Sidewalk::Unsure Which Side':
      return "red";

    case 'Has wide shoulder::On Left side of Road':
    case 'Has wide shoulder::On Right side of Road':
    case 'Has wide shoulder::On Both sides of Road':
    case 'Has narrow shoulder::On Left side of Road':
    case 'Has narrow shoulder::On Right side of Road':
    case 'Has narrow shoulder::On Both sides of Road':
      return "orange";

    case 'No Imagery available':
    case 'Road Not Visible':
      return "#ccc";

    default:
      return "#ccc";

  }
}









function colorForCell(length) {
  if (length <= 13728.3664) return "#ffffcc";
  if (length <= 27456.7327) return "#ffeda0";
  if (length <= 41185.0991) return "#fed976";
  if (length <= 54913.4654) return "#feb24c";
  if (length <= 68641.8318) return "#fd8d3c";
  if (length <= 82370.1981) return "#fc4e2a";
  if (length <= 96098.5645) return "#e31a1c";
  if (length <= 109826.9308) return "#bd0026";
  if (length <= 123555.2972) return "#800026";
  else return "#800026";
}

/**
 * Load the mechanicalturk-generated pedestrian access
 * dataset, coloring Sidewalks red, roads with passable 
 * shoulders as orange, and all else gray.
 */
$.ajax({
  dataType: "json",
  url: "data/mturk_results.geojson",
  success: function(data) {
    var myLayer = L.geoJson(data, {
      style: function(feature) {
          return {color: colorForAnswer(feature.properties.Answer)};
      },
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    });
    pointmap.addLayer(myLayer);
    pointmap.fitBounds(myLayer.getBounds());
  },
  error: function(xhr, ajaxOptions, thrownError) {
     console.log(xhr.status);
     console.log(thrownError);
  }
});


/**
 * Load the grid showing OSM pedestrian-access
 * miles per cell
 */
$.ajax({
  dataType: "json",
  url: "data/line_length_grid.geojson",
  success: function(data) {
    var myLayer = L.geoJson(data, {
      style: function(feature) {
          if (feature.properties.ID === 48) {
            return {fillColor: colorForCell(feature.properties.LENGTH),
                    fillOpacity: 0.8,
                    color: "#0f0",
                    stroke: true,
                    opacity: 1};  
          }
          return {color: colorForCell(feature.properties.LENGTH),
                  fillOpacity: 0.8,
                  stroke: false};
      }
    });
    gridmap.addLayer(myLayer);
    gridmap.fitBounds(myLayer.getBounds())
    console.log("added grid to map");
  },
  error: function(xhr, ajaxOptions, thrownError) {
     console.log(xhr.status);
     console.log(thrownError);
  }
});



/**
 * Google Street View code
 */
function initialize() {
  var pointFromMap = new google.maps.LatLng(40.6541319328, -75.083689931);
  var panoramaOptions = {
    position: pointFromMap,
    pov: {
      heading: 0,
      pitch: 0
    },
    zoom: 1
  };
  var myPano = new google.maps.StreetViewPanorama(
      document.getElementById('map-canvas'),
      panoramaOptions);
  myPano.setVisible(true);
}

google.maps.event.addDomListener(window, 'load', initialize);
    