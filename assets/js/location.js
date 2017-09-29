//******************************************/
//**************  FUNCTIONS  ***************/
//******************************************/
function initMap() {
//set location as lat and lng from school object
  var myCenter = new google.maps.LatLng(gLat, gLong);
  var mapCanvas = document.getElementById("googleMap");
  var mapOptions = { center: myCenter, zoom: 10 };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;

  geocodeLatLng(geocoder, map, infowindow, myCenter);
}
// function to get the map an actual address reverse geocoded from lat lng
function geocodeLatLng(geocoder, map, infowindow, myCenter) {
  
  geocoder.geocode({ 'location': myCenter }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
       // console.log(myCenter);
        var marker = new google.maps.Marker({
          position: myCenter,
          map: map
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      }
    }else{
      //if no info 
      infowindow.setContent("Address Unavailable");
      infowindow.open(map, marker);
    }
  });
}

// draws the actual graph in html
function DrawGoogleMap() {
  $("#google-map").empty();
   var script_tag = document.createElement('script');
     script_tag.type = 'text/javascript';
      script_tag.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCHNMMsn8uWjLdbAQUWpT0Vsnc11DzNHcg&libraries=places&callback=initMap"
      script_tag.setAttribute('defer','');
      script_tag.setAttribute('async','');
      $("#googleMap").append(script_tag);
}
