//Starbucks Finder


var map;
var service;
var marker;
var pos;
var infowindow;
var cardCount = 1;
var idArray = [];


function initMap() {
    /* Initializes the map and begins the application cycle.
    */
    detectBrowser();
    var mapOptions = {
        zoom: 14
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

            infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Found you!'
            });

            map.setCenter(pos);

            var request = {
                location: pos,
                radius: 5000,
                keyword: ['Starbucks']
            };

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            
            //Searches for nearby Chipotle
            service.nearbySearch(request, callback);
        }, function () {
            handleLocationError(true, infowindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infowindow, map.getCenter());
    }

    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            
            for (var i = 0; i < results.length; i++) {
                if(results[i].name === "Starbucks"){
                //Keeps track of number of Cards
                cardCount++;
                    
                //Adds marker to the map
                createMarker(results[i]);
                    
                //Gets details about the Chipotle
                var service2 = new google.maps.places.PlacesService(map);
                service2.getDetails({
                    placeId: results[i].place_id
                }, function(place, status){
                    //creates Card for Chipotle on page
                    createCard(place);
                });

                }
            }
            if (cardCount === 1){
                //If there are no Starbucks in range, alerts the user
                noStarbucks();
            }
        }
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infowindow.setPosition(pos);
        infowindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }

function noStarbucks(){
    /* In the event that no Starbucks are located in the search radius, 
    this function adds an element to the page that alerts the user.
    */
    var element = document.getElementById("button_container");
    var error = document.createElement("div");
    error.className = "failed";
    var errorText = document.createTextNode("No Starbucks Nearby...");
    error.appendChild(errorText);
    element.appendChild(error);
}

function createMarker(place) {
    /* Given a place from the Google Places search results, this function
    adds a marker to the main map, and labels it with the place name.
    */
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: placeLoc
        });
        
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }

function createCard(place) {
    /* This function creates a W3 card in the button container div on the page.
    The card includes the name, address, phone number, rating, and a review. 
    */
    
    //Creates the card 
    var element = document.getElementById("button_container");
    var newCard = document.createElement("div");
    newCard.className = "w3-card-2";
    newCard.setAttribute("id", "card" + cardCount);  
    element.appendChild(newCard);
    
    //adds the Place name to the card
    var name = document.createElement("p");
    name.className = "place_title";
    var nameText = document.createTextNode(place.name);
    name.appendChild(nameText);
    newCard.appendChild(name);
    
    //adds whether the location is currently open to the card
    var hours = document.createElement("div");
    hours.className = "open_hours";
    var hoursText = document.createTextNode("Am I Open?:  " + openBoolean(place.opening_hours.open_now));
    hours.appendChild(hoursText);
    newCard.appendChild(hours);
    
    //adds the address to the card
    var address = document.createElement("div");
    address.className = "address";
    var addressText = document.createTextNode("Address:  " + place.formatted_address)
    address.appendChild(addressText);
    newCard.appendChild(address);
    
    //adds the phone number to the card
    var phoneNumber = document.createElement("div");
    address.className = "phone_number";
    var phoneNumberText = document.createTextNode("Phone Number:  " + place.formatted_phone_number);
    phoneNumber.appendChild(phoneNumberText);
    newCard.appendChild(phoneNumber);

    //adds the rating to the card
    var rating = document.createElement("div");
    rating.className = "rating";
    var ratingText = document.createTextNode("Rating: " + place.rating);
    rating.appendChild(ratingText);
    newCard.appendChild(rating);

    //adds a review to the card
    var review = document.createElement("p");
    review.className = "review";
    var reviewText = document.createTextNode('"' + place.reviews[0].text + '"');
    review.appendChild(reviewText);
    newCard.appendChild(review);
    console.log("created Card");
    
}

function openBoolean(bool) {
    /* This function takes a boolean that is retrieved from the place Details request.
    Based on the value of the boolean, it returns a sting to be added to the createCard function.
    */
    if (bool === true) {
        return "Open for business!";
    }
    else {
        return "Maybe another time! :("
    }
}

function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    mapdiv.style.width = '75%';
    mapdiv.style.height = '75%';
  }
}