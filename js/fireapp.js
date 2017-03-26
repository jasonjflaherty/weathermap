//            /*TIME DIMESIONS*/
var today = new Date(); //Today's Date
var minutes = today.getUTCMinutes(0, 0);
var hours = today.getUTCHours() - 8;
var n = 4; //number of days to add.
var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + n, hours);
var rightNow = today.getTime();
console.log(rightNow);
/*Basemap...*/
var topo = L.esri.basemapLayer("USATopo");
var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});
var Esri_NatGeoWorldMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    maxZoom: 16
});

var map = L.map('map', {
    layers: [Esri_WorldStreetMap],
    center: [42, -119],
    zoom: 7,
    loadingControl: true,
    timeDimension: true,
    timeDimensionControl: true,
    timeDimensionControlOptions: {
        autoPlay: false,
        playerOptions: {
            buffer: 12,
            transitionTime: 500,
            loop: true,
            loopButton: true,
        },
        speedSlider: true
    },
    timeDimensionOptions: {
        loadingTimeout: 5000,
        //n-1...
        timeInterval: "P3D/" + endDate.toISOString(),
        period: "PT3H"
    }
});

/*SIDEBAR HOLDS DATA OR SHOULD WE USE POPUPS?*/
var sidebar = L.control.sidebar('sidebar', {
    position: 'left',
    closeButton: true,
    autoPan: false
});

/*GEOLOCATE THE USER AND FOLLOW...*/
var locateControl = L.control.locate({
    drawCircle: true,
    follow: true,
    setView: true,
    keepCurrentZoomLevel: true,
    markerStyle: {
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
    },
    circleStyle: {
        weight: 1,
        clickable: false
    },
    icon: "fa fa-location-arrow",
    iconLoading: "fa fa-spinner fa-spin",
    metric: false,
    strings: {
        title: "My location",
        popup: "You are within {distance} {unit} from this point",
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
    },
    locateOptions: {
        maxZoom: 18,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
    }
}).addTo(map);

map.addControl(sidebar);


/*
 * placeholder for variable from custom radio button layer list...
 * 
 */
//            var l = "8";
//
//            var currentLayer;
//            var minTemp;
//            
//            $( ".radio-group" ).change(function() {
////                currentLayer = minTemp.getLayers();
////                console.log(currentLayer);
////                currentLayer.removeLayer();
//                var layerSelected = $('input[name=radio-group-wxlayers]:checked').val();
//                
//                
//            });  
//            
//LOADING AFTER DOM READY TO SEE LAYER GROUP...
$(document).ready(function () {
    $('body').append('<div id="loading"><p>LOADING DATA...</p><div class="progress"><div class="indeterminate"></div></div></div>');
    $(".leaflet-control-layers-group label > input").click(function () {
        $("#loading").fadeIn(500);
    });

});
//proxy script
var proxy = 'proxy.php';
/* Loads of NOAA data overlays*/
//var regions = "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_RegionBoundaries_01/MapServer";
var forecastRest = 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_time/MapServer';
var forecastWms = 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_time/MapServer/WMSServer';
var hazardsRest = 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/forecast_meteoceanhydro_pts_zones_geolinks/MapServer';
var hazardsWms = 'https://nowcoast.noaa.gov/arcgis/services/forecast_meteoceanhydro_pts_zones_geolinks/MapServer/WMSServer';
var surfaceRHoffsets = 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_relhumidity_offsets/MapServer';
var quantitaivePrecipEstimates = "https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/analysis_meteohydro_sfc_qpe_time/MapServer";
var rtmaRest = "https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/analysis_meteohydro_sfc_rtma_time/MapServer";
//            var allHazardsGeoJson = 'http://preview.weather.gov/mwp/data/iris/allhazard.geojson';
//            var geojsonLayer = L.geoJson.ajax(allHazardsGeoJson,{dataType:"jsonp"}).addTo(map);


var hazardsWMS = L.nonTiledLayer.wms(hazardsWms, {
    layers: '8',
    version: '1.3.0',
    format: 'image/png',
    transparent: true,
    opacity: 1,
    attribution: 'nowCOAST'
});
var hazardsLayer = L.timeDimension.layer.wms(hazardsWMS, {
    proxy: proxy,
    cache: 5,
    updateTimeDimension: false,
    updateTimeDimensionMode: "replace",
    //requestTimeFromCapabilities:updateTimeDimension,
});

var radarWMS = L.nonTiledLayer.wms(forecastWms, {
    layers: '17',
    version: '1.3.0',
    format: 'image/png',
    transparent: true,
    opacity: 0.5,
    attribution: 'nowCOAST'
});

var radarLayer = L.timeDimension.layer.wms(radarWMS, {
    proxy: proxy,
    cache: 5,
    updateTimeDimension: false,
    updateTimeDimensionMode: "replace",
    //requestTimeFromCapabilities:updateTimeDimension,
});
//radarLayer.addTo(map);
var MaxTempWMS = L.nonTiledLayer.wms(forecastWms, {
    layers: '17',
    version: '1.3.0',
    format: 'image/png',
    transparent: true,
    opacity: 0.5,
    attribution: 'nowCOAST'
});
var maxTempTD = L.timeDimension.layer.wms(MaxTempWMS, {
    //proxy: proxy,
    cache: 5,
    updateTimeDimension: false,
    updateTimeDimensionMode: "replace",
    //requestTimeFromCapabilities:updateTimeDimension,
});
//            MaxTempWMS.on("load", function () {
//                //console.log("all visible tiles have been loaded");
//                $("#loading").fadeOut(500);
//            });

/********** MIN/MAX TEMPS **************/

var surfaceTemp = L.esri.dynamicMapLayer({
    url: rtmaRest,
    layers: [11],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000
});
surfaceTemp.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});

//            surfaceTemp.legend(function(error, legend){
//                if(!error) {
//                    var html = '<ul>';
//                    for(var i = 0, len = legend.layers.length; i < len; i++) {
//                        html += '<li><strong>' + legend.layers[i].layerName + '</strong><ul>';
//                        for(var j = 0, jj = legend.layers[i].legend.length; j < jj; j++){
//                            html += L.Util.template('<li><img width="{width}" height="{height}" src="data:{contentType};base64,{imageData}"><span>{label}</span></li>', legend.layers[i].legend[j]);
//                        }
//                        html += '</ul></li>';
//                    }
//                    html+='</ul>';
//                    document.getElementById('legend').innerHTML = html;
//                }
//            });

var minTemp = L.esri.dynamicMapLayer({
    url: forecastRest,
    layers: [11],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000
});
minTemp.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});

var maxTemp = L.esri.dynamicMapLayer({
    url: forecastRest,
    layers: [11],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000
});
maxTemp.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});
/*********** Surface (2m AGL) Dew Point Temperature (deg. F) ***********/
var surfaceDP = L.esri.dynamicMapLayer({
    url: rtmaRest,
    layers: [15],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000
});
surfaceDP.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});

/*********** 24 hour precip ***********/

//            var timeForm = document.getElementById('form');
//            var startTimeInput = document.getElementById('from');
//            var endTimeInput = document.getElementById('to');

var twentyFourHrPrecip = L.esri.dynamicMapLayer({
    url: quantitaivePrecipEstimates,
    layers: [19],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000,
//                f: 'image',
//                from: new Date(startTimeInput.value),
//                to: new Date(endTimeInput.value)
//                from: rightNow,
//                to: rightNow
});
twentyFourHrPrecip.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});

//            timeForm.addEventListener('submit', function updateTimeRange(e){
//                twentyFourHrPrecip.setTimeRange(new Date(startTimeInput.value), new Date(endTimeInput.value));
//                e.preventDefault();
//              });


/*********** surface RH ***********/

var surfaceRH = L.esri.dynamicMapLayer({
    url: forecastRest,
    layers: [43],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000
});
surfaceRH.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});

/*********** surface winds ***********/
var windKnots = L.esri.dynamicMapLayer({
    url: rtmaRest,
    layers: [19, 3],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000
});
windKnots.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});
var windGusts = L.esri.dynamicMapLayer({
    url: rtmaRest,
    layers: [23, 3],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000
});
windGusts.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});

/************ TOTAL SKY COVER % **************/
var skyCover = L.esri.dynamicMapLayer({
    url: forecastRest,
    layers: [27],
    opacity: .7, useCache: true, crossOrigin: true, cacheMaxAge: 1800000
});
skyCover.on("load", function () {
    //console.log("all visible tiles have been loaded");
    $("#loading").fadeOut(500);
});

var popup = L.popup().setContent('<strong>LOADING...</strong>');

/*OUR LAYERS TO SHOW / HIDE*/
var baseMaps = {
    "USA Topo": topo,
    "World Street": Esri_WorldStreetMap,
    "National Georaphic": Esri_NatGeoWorldMap
};
//            var overlayMaps = {
//                        "Relative Humidity (2m AGL)": surfaceRH,
//                 "Temperature (2m AGL)": surfaceTemp,
//                 "Dew Point (2m AGL)": surfaceDP,
//         //                    "Surface MinTemp": minTemp,
//         //                    "Surface MaxTemp": maxTemp,
//                 "24hr Precip": twentyFourHrPrecip,
//                 "Wind (kt - 10m AGL)": windKnots,
//                 "Wind (gusts - 10m AGL)": windGusts,
//                 "Cloud Cover %": skyCover,
//            };

var groupedOverlays = {
    "Weather Overlays": {
//                    "Mixing Height" : ,
//                    "Ventilation Index",
//                    "Haines (middle) Index",
//                    "Haines (upper) Index",
//                    "Lifted Index",
        "Relative Humidity (2m AGL)": surfaceRH,
        "Temperature (2m AGL)": surfaceTemp,
        "Dew Point (2m AGL)": surfaceDP,
//                    "Surface MinTemp": minTemp,
//                    "Surface MaxTemp": maxTemp,
        "24hr Precip": twentyFourHrPrecip,
        "Wind (kt - 10m AGL)": windKnots,
        "Wind (gusts - 10m AGL)": windGusts,
        "Cloud Cover %": skyCover,
    },
    "Weather Loops": {
        "MaxTemp Loop": radarLayer,
        "Fire Wx Forecast": hazardsLayer,
    }
};
var GOoptions = {
    // exclusive (use radio inputs)
    exclusiveGroups: ["Weather Overlays", "Weather Loops"]
};
L.control.groupedLayers(baseMaps, groupedOverlays, GOoptions).addTo(map);
//var activeL = L.control.activeLayers(baseMaps, overlayMaps).addTo(map);
//console.log(activeL.getActiveOverlayLayers());
//L.control.layers(baseMaps, overlayMaps).addTo(map);

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function processWX(lat, lng) {
    //IN APRIL CHECK THIS OUT
    //https://forecast-v3.weather.gov/documentation?preview=points/33.749%2C-84.388/forecast%7Capplication/vnd.noaa.dwml%2Bxml
    var wgovurl = 'https://api.weather.gov/points/' + lat + ',' + lng;
    console.log(wgovurl);
    $.ajax({
        url: wgovurl,
        dataType: 'jsonp',
        jsonpCallback: 'jsonCB', // specify the callback name if you're hard-coding it
        success: function (wxdata, status) {
            console.log(status);
            console.log(wxdata.properties);
        },
        error: function (xhr, status, errorThrown) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    });

}

// FUNCTION TO GET NOAA POINT FORECAST //
function processForecast(lat, lng) {
    //popup.setContent("Featching WX data, just a sec...").update();
    var locAreaDesc, locFireZone, locMetar, minTemp, maxTemp, weather, hazard, text, coElev, coTemp, coRelh, coWinds, coWindd, coGust, coWeather, coVisibility, coSLP, coAlt;
    var pfURL = 'http://forecast.weather.gov/MapClick.php?lat=' + lat + '&lon=' + lng;
    var pfFcstType = '&unit=0&lg=english&FcstType=json';
    var pfjson = pfURL + pfFcstType;

    $.ajax({
        data: {},
        url: pfjson,
        dataType: 'jsonp',
        jsonpCallback: 'jsonCB', // specify the callback name if you're hard-coding it
        success: function (jsondata, status) {
            if (status === "success") {
                //if(typeof jsondata.location.areaDescription == "undefined"){
                locAreaDesc = jsondata.location.areaDescription;
                locFireZone = jsondata.location.firezone;
                locMetar = jsondata.location.metar;
                minTemp = jsondata.data.temperature[0];
                maxTemp = jsondata.data.temperature[1];
                weather = jsondata.data.weather[0];
                hazard = jsondata.data.hazard;
                text = jsondata.data.text[0];
                coElev = jsondata.currentobservation.elev;
                coTemp = jsondata.currentobservation.Temp;
                coRelh = jsondata.currentobservation.Relh;
                coWinds = jsondata.currentobservation.Winds;
                coWindd = jsondata.currentobservation.Windd;
                coGust = jsondata.currentobservation.Gust;
                coWeather = jsondata.currentobservation.Weather;
                coVisibility = jsondata.currentobservation.Visibility;
                coSLP = jsondata.currentobservation.SLP;
                coAlt = jsondata.currentobservation.Altimeter;
                var clearContent = "<p><strong>Currently it is " + coWeather + " with a Temperature of " + coTemp + "&deg;, RH of " + coRelh + "% with Winds from " + coWindd + "&deg; at " + coWinds + "<sup>mph</sup>.</strong></p><p><small><strong>Other Point Data</strong><br/>Elevation: " + coElev + "<sup>FT</sup><br/>Wind Gusts: " + coGust + "<sup>MPH</sup></br>Visibility: " + coVisibility + "<sup>MI</sup><br/>Barometer: " + coSLP + "<sup>\IN</sup> (" + coAlt + "<sup>MB</sup>)</small></p>";
                //console.log(minTemp + " | " + maxTemp + " | " + weather + " | " + hazard + " | " + text + " | " + coElev + " | " + coTemp + " | " + coRelh + " | " + coWinds + " | " + coWindd + " | " + coGust + " | " + coWeather + " | " + coVisibility + " | " + coSLP);
                //var content = "<div class='wxdata'><img src='images/noaalogo_sm.png' alt='noaa logo' class='noaalogo'><div class='wxtitle'>NOAA WEATHER INFORMATION</div><div class='wxcontent'><strong>Current Observations (" + locAreaDesc + ")</strong><hr/><ul><li>Elevation: " + coElev + "<sup>ft</sup></li><li>Temperature: " + coTemp + "&deg;</li><li>RH: " + coRelh + "%</li><li>Wind (speed/direction/gust): " + coWinds + "<sup>mph</sup> / " + coWindd + "&deg; / " + coGust + "<sup>mph</sup></li><li>Observation: " + coWeather + "</li><li>Visibility: " + coVisibility + "mi</li><li>Barometer: " + coSLP + "in ("+ coAlt +"mb)</li></ul><strong>WX Summary: " + weather + "</strong><hr/><ul><li>Fire Zone: " + locFireZone + "</li><li>Temp (Hi/Low): " + maxTemp + "&deg; / " + minTemp + "&deg;</li><li>Hazard(s): " + hazard + "</li><li>" + text + "</li></ul></div><p><a href='"+ pfURL +"'>Full Forecast on Weather.gov</a></p></div>";
                var content = "<div class='wxdata'><img src='images/noaalogo_sm.png' alt='noaa logo' class='noaalogo'><div class='wxtitle'>NOAA WEATHER INFORMATION</div><div class='wxcontent'><strong class='section'>Current Observations (" + locAreaDesc + ")</strong><hr/>" + clearContent + "<strong class='section'>WX Summary</strong><hr/><strong> " + text + "</strong><ul><li>Fire Zone: " + locFireZone + "</li><li>Temp (Hi/Low): " + maxTemp + "&deg; / " + minTemp + "&deg;</li><li>Hazard(s): " + hazard + "</li></ul></div><p><a href='" + pfURL + "'>Full Forecast on Weather.gov</a></p></div>";
                //popup.setContent(content).update();
                sidebar.setContent(content);
//                            }else{
//                               sidebar.setContent("<p>Sorry, data is not available.</p> <p>Please check the location clicked on and make sure you are in CONUS or AK. Data Status: " + status + "</p>");
//                            }
            } else {
                sidebar.setContent("<p>Sorry, data is not available.</p> <p> Please check your network connection. Data Status: " + status + "</p>");
            }
        },
        error: function (xhr, status, errorThrown) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            sidebar.setContent("<p>Sorry, data is not available. Data/Error Status: " + xhr.status + " - " + xhr.responseText + "</p>");
        }
    });
}
//right click to get NOAA map wx point forecast...
map.on("click contextmenu", function (e) {
    if (e.type == "contextmenu") {
        sidebar.setContent('<div class="loadingupdates"><p class="text-center"></p><p class="text-center">Fetching latest updates. Just a sec...</p></div><div class="progress"><div class="indeterminate"></div></div>');
        //add marker where the person clicks, remove when on next location... marker = new L.marker(e.latlng).addTo(map);
        var lati = e.latlng.lat;
        var lngi = e.latlng.lng;
        //console.log(lati + " " + lngi);
        processForecast(lati, lngi);
        //processWX(lati,lngi);
        //popup.setLatLng(e.latlng).openOn(map);
        // Show sidebar
        sidebar.show();
    }
});

surfaceDP.bindPopup(function (error, featureCollection) {
    if (error || featureCollection.features.length === 0) {
        return "No information found. Try another location.";

    } else {
        return 'Dew Point: ' + round(featureCollection.features[0].properties['Pixel Value'],2) + '%';
    }
});

map.on('click', function (e) {
    L.esri.identifyFeatures({
        url: rtmaRest
    })
            .on(map)
            .at(e.latlng)
            .layers('visible:15')
            .run(function (error, featureCollection, response) {
                //console.log(error + " - " + featureCollection + " - " + response);
                console.log(featureCollection.features[0].properties['Pixel Value']);
//                     if(error || featureCollection.features.length === 0) {
//                        return false;
//                      } else {
//                        return 'Minimum Temperature: ' + featureCollection.features[0].properties['Pixel Value'];
//                      }
            });
});