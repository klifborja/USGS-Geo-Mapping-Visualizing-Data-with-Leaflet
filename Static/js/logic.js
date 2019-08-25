// Define URL for dataSet
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// Define markerColor by magnitude "mag" of earthquake
function markerColor(mag) {
    if (mag <= 2) {
        return "#ADFF2F";
    } else if (mag <= 3) {
        return "#9ACD32";
    } else if (mag <= 4) {
        return "#FFFF00";
    } else if (mag <= 5) {
        return "#ffd700";
    } else {
        return "#FF0000";
    };
}

// Make markerSize larger by multiplying "mag" x 25k
function markerSize(mag) {
    return mag * 25000;
}

// Query the URL
d3.json(url, function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    var earthquakes = L.geoJSON(earthquakeData, {

        onEachFeature: function (feature, layer) {

            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
        }, pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {
                    radius: markerSize(feature.properties.mag),
                    fillColor: markerColor(feature.properties.mag),
                    fillOpacity: .75,
                    stroke: false,
                })
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define map layers
    var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satelite Map": satelitemap,
        "Dark Map": darkmap,
        "Light Map": lightmap
    };

    // Create an overlays object to add to the layer control
    var overlays = {
        "Earthquakes": earthquakes,
        // "Fault Lines": fault_lines
    };


    // Initialize all of the LayerGroups we'll be using
    var layers = {
        earthquakes: new L.LayerGroup(),
        // fault_lines: new L.LayerGroup()
    };

    // Create the map with our layers
    var map = L.map("map-id", {
        center: [39.381266, -97.922211],
        zoom: 4.5,
        layers: [
            layers.earthquakes,
            // layers.fault_lines
        ]
    });

    L.control.layers(baseMaps, overlays, {
        collapsed: false
    }).addTo(map);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [1, 2, 3, 4, 5];

        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(mag[i] + 1) + '"></i> ' +
                + mag[i] + (mag[i + 1] ? ' - ' + mag[i + 1] + '<br>' : ' + ');
        }

        return div;
    };

    legend.addTo(map);

}


