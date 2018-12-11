var root_url = "http://comp426.cs.unc.edu:3001/";
var first = 0;
let minDist = 'N/A'
let codes = [];
let distances = [];
let markers = [];
let distMap = new Map();
var myLatLong;
let map;
let hasRun = false;
let currentlocation = null;
$(document).ready(() => {
  build_navbar();
  build_home();
});

  var build_home = function() {
    console.log("calling build_home()");
    console.log("calling the method formerly known as build_flight_view()");
    $('a[isActive=true]').attr('isActive', false);
    $('.home_nav').attr('isActive', true);
    $('#title_text').text('Find your next adventure!');
    $('#content').empty();
     // making slider div now before map, but need to make map first
    $("#content").append('<div id="slider_div"></div>').append('<div id="map"><div>').append('<br><div id="search"></div>');
    $("#slider_div").append('<p><label for="amount">Distance range:</label>\
    <input type="text" id="amount" readonly style="border:0; color:#0099ff; font-weight:bold;"></p> \
    <div id="slider-range"></div><br>');
    $.ajax(root_url + 'airports', {
      type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: (response) => {
        console.log("AJAX SUCCESS")
        build_search(response);
        get_location(response);
      },
      error: () => {
        alert("Unable to get all airports");
      }
    });
  }
  
  var build_navbar = function() {
    $('#navbar').append('<ul id="navbar_list"></ul>')
    $('#navbar_list').append('<li><p id="title">NOT KAYAK</p></li>')
    .append('<li><a class="home_nav" isActive=false onclick="build_home()">Home</a></li>')
    .append('<li><a class="flights_nav" isActive=false onclick="build_my_flights()">My Flights</a></li>')
    .append('<li><a class="flight_view_nav" isActive=false onclick="build_flight_view()">Flight View</a></li>');
  }
  var get_location = function (airports) {
    if(currentlocation == null){
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
          if (!hasRun) {
            currentlocation = position;
            console.log("get_location()")
            $("#dep_apt_drop").empty();
            $("#arr_apt_drop").empty();
            set_dep_airport(position, airports);
            build_gmaps_interface(airports);
            hasRun = true;
          }
        }, showError);
      } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";}
    }else{
      if (!hasRun) {
        position = currentlocation;
        console.log("get_location()2")
        $("#dep_apt_drop").empty();
        $("#arr_apt_drop").empty();
        set_dep_airport(position, airports);
        build_gmaps_interface(airports);
        hasRun = true;
      }
    }
  }

var set_dep_airport = function(position, airports) {
  //finding closest airport
  codes = [];
  distances = [];
  distMap = new Map();
  let minDist = Number.MAX_SAFE_INTEGER;
  myLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  for (let i = 0; i < airports.length; i++) {
    codes.push(airports[i].code);
    let aLatLong = new google.maps.LatLng(airports[i].latitude, airports[i].longitude);
    let currDist = google.maps.geometry.spherical.computeDistanceBetween(myLatLong, aLatLong)
    if (currDist < minDist) {
      minDist = currDist;
    }
    distances.push(currDist);
    distMap.set(currDist, airports[i].code);
  }
  distances.sort(function(a, b){return a-b});
  $("#dep_apt_drop").empty();
  $("#arr_apt_drop").empty();
  for(let i = 0; i < airports.length; i++){
    var port = airports[codes.indexOf(distMap.get(distances[i]))];
    var item = '<a id="loc" class="deps" dep_id="'+port.id +'" name="'+port.name+'" code="'+port.code+'">'+port.name+' ('+port.code+') </a>'
    $("#dep_apt_drop").append(item);
    var item = '<a id="loc" class="arrs" arr_id="'+port.id +'" name="'+port.name+'" code="'+port.code+'">'+port.name+' ('+port.code+') </a>'
    $("#arr_apt_drop").prepend(item);
  }

  $.ajax(root_url+"airports?filter[code]="+distMap.get(minDist),{
    type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: (response) => {
        var code = response[0].code;
        var name = response[0].name;
        var apt_id = response[0].id;
        $("#dep_apt").val(name+" ("+code+")");
        $("#dep_apt").attr("code",apt_id);
      },
  })
}
var showError = function(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.");
          break;
      case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
      case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
      case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
  }
}
var build_search = function(airports) {
    console.log("build search");
    $('#search').empty();
    $('#search').append('<div id="dropdowns"></div>');
    $('#search').append('<br>')
    $('#search').append(
    '<div><div class="label_div" id="dep_label"><label for="dep_apt">Departure Airport</label><input id="dep_apt" class="airport_search" type="text" code="N/A" placeholder="From where?"><div id="dep_apt_drop" class="dropdown-content2"></div></div> \
    <div class="label_div" id="arr_label"><label for="arr_apt">Arrival Airport</label><input id="arr_apt" class="airport_search" type="text" code="N/A" placeholder="To where?"><div id="arr_apt_drop" class="dropdown-content3"></div></div> \
    <div class="label_div" id="depdate_label"><label for="dep_date">When are you leaving?</label><input class="date" type="date" id="dep_date"></div> \
    <div class="label_div" id="retdate_label"><label for="ret_date">When are you returning?</label><input class="date" type="date" id="ret_date"></div> \
    <button onclick="searchFlights()">Go!</button></div>');
    $('#dropdowns').append(
    '<div class="info> \
      <div class="dropdown"> \
        <button onclick="myFunction()" class="dropbtn">Round-Trip</button> \
        <div id="myDropdown" class="dropdown-content"> \
            <a id="trip" val="Round-Trip">Round-Trip</a> \
            <a id="trip" val="One-way">One-way</a> \
        </div> \
      </"div>\
      <br>\
      <div class="passes">\
        <label class="passengers" for="passengers">Passenger Count:</label> \
        <input type="number" min="1" max="10" id="pcount" placeholder="How many passengers?" name="passengers"> \
      </div>\
    </div>');
    //Setting today to default date, next week default return date
    $("#pcount").val("1");
    let todayDate = new Date();
    document.getElementById('dep_date').valueAsDate = todayDate;
    let nextWeek = new Date();
    nextWeek.setDate(todayDate.getDate()+7);
    document.getElementById('ret_date').valueAsDate = nextWeek;
    //retrieving list of airports from API
    $("#dep_apt_drop").empty();
    $("#arr_apt_drop").empty();
    for (let i = 0; i < airports.length; i++){
      port = airports[i];
      var listitem = '<a id="loc" class="deps" dep_id="'+port.id +'" name="'+port.name+'" code="'+port.code+'">'+port.name+' ('+port.code+') </a>'
      $("#dep_apt_drop").append(listitem);
      var listitem = '<a id="loc" class="arrs" arr_id="'+port.id+'" name="'+port.name+'" code="'+port.code+'">'+port.name+' ('+port.code+') </a>'
      $("#arr_apt_drop").append(listitem);
    }
}


function getInstance(ticket) {
  return $.ajax(root_url + 'instances/'+ticket.instance_id,{
    type: 'GET',
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    }
  });
}

function getFlight(instance){
  return $.ajax(root_url + 'flights/' + instance.flight_id, {
    type: 'GET',
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    }
  });
}

var build_card = function(id, card){
  $.ajax(root_url + 'tickets?filter[itinerary_id]=' + id, {
    type: 'GET',
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      console.log(response);
      for (let i=0; i< response.length; i++){
        let tk = $('<div id=tk_' + i +' class=tks>');
        tk.append(
          '<p> Name:'+response[i].last_name +','+ response[i].first_name +'<br>' +
           'Gender:' + response[i].gender + '<br>' +
           'Age:' + response[i].age + '<br>' +
           'Price Paid:' + response[i].price_paid + '<br></p></div>'
        );

        getInstance(response[i]).then(getFlight).then(function(data) {
          $.ajax(root_url + 'airports/' + data.arrival_id, {
            type: 'GET',
            dataType:'json',
            xhrFields: {
              withCredentials:true
            },
            success: (response) => {
              tk.prepend('<p>Arrival:' + response.name + '</p>');
            }
          });
        });

        getInstance(response[i]).then(getFlight).then(function(data) {
          $.ajax(root_url + 'airports/' + data.departure_id, {
            type: 'GET',
            dataType:'json',
            xhrFields: {
              withCredentials:true
            },
            success: (response) => {
              tk.prepend('<p>Departure:' + response.name + '</p>');
            }
          });
        });
        card.append(tk);
      }
    },
    error: () => {
      alert("Unable to get all airports");
    }
  });
  
}



var build_my_flights = function() {
    console.log("calling build_my_flights()");
    //$('#not_navbar').empty();
    //build_navbar();
    hasRun=false;
    $('#content').empty();

    $('a[isActive=true]').attr('isActive', false);
    $('.flights_nav').attr('isActive', true);

    $.ajax(root_url + 'tickets', {
      type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: (response) => {
        if (response.length == 0)
          alert("No Flights!");
        else{
          let ids = [];
          for (let i = 0; i < response.length; i++){
            let itin_id = response[i].itinerary_id;
            if(!ids.includes(itin_id))
              ids.push(itin_id);
          }
          let flights = $('<div class = "bookings"></div>');
          for (let i = 0; i < ids.length; i++){
            /*build cards for each itinerary*/
            let card = $('<div id=it_'+i+' class="itinerary"> \
                          <h3>Itinerary:' + i +'</h3></div>');
            build_card(ids[i], card);
            flights.append(card);
          }
          $('#content').append(flights);
        }
      },
      error: () => {
        alert("Unable to get all airports");
      }
    });
}




var build_flight_view = function() {
}

var build_gmaps_interface = function(airports) {
  let DEFAULT_CIRCLE_RADIUS = 250 * 1000;
  console.log("calling build_gmaps_interface");
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4.65,
    //defaulting to center of US
    center: new google.maps.LatLng(39.8283, -98.5796),
    mapTypeId: 'roadmap'
  });
  var features = [];
  var icons = {airport:{icon: {url: "airport_icon.png", scaledSize: new google.maps.Size(35, 35)}}};

  for (let i = 0; i < airports.length; i++) {
    features.push({position: new google.maps.LatLng(airports[i].latitude, airports[i].longitude), type: "airport", apt: airports[i], code: codes[i]});
  }
  features.forEach(function(feature) {
    var marker = new google.maps.Marker({
      position: feature.position,
      icon: icons[feature.type].icon,
      map: map,
      animation: google.maps.Animation.DROP,
      apt: feature.apt,
      dist: google.maps.geometry.spherical.computeDistanceBetween(myLatLong, new google.maps.LatLng(feature.apt.latitude, feature.apt.longitude)),
      code: feature.code
    });
    google.maps.event.addListener(marker, 'mouseover', function() {
      marker.setIcon({url: "airport_icon_green.png", scaledSize: new google.maps.Size(35, 35)});
    });
    google.maps.event.addListener(marker, "mouseout", function() {
      marker.setIcon({url: "airport_icon.png", scaledSize: new google.maps.Size(35, 35)});
    });
    google.maps.event.addListener(marker, "click", function() {
      console.log(marker.apt);
      $.ajax(root_url+"airports?filter[code]="+marker.apt.code,{
        type: 'GET',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          success: (response) => {
            var code = response[0].code;
            var name = response[0].name;
            var apt_id = response[0].id;
            $("#arr_apt").val(name+" ("+code+")");
            $("#arr_apt").attr("code",apt_id);
          },
      });
    });
    markers.push(marker);
  });
  console.log(markers);
  let circ = setCircle(map, DEFAULT_CIRCLE_RADIUS);
  filterMarkers(DEFAULT_CIRCLE_RADIUS);

  $( function() {
    $( "#slider-range" ).slider({
      range: "max",
      min: DEFAULT_CIRCLE_RADIUS,
      max: 4000000,
      value: (DEFAULT_CIRCLE_RADIUS/1000),
      slide: function( event, ui ) {
        $( "#amount" ).val( (ui.value/1000)+ "km");
        updateRadius(map, ui.value, circ);
        filterMarkers(ui.value);
      }
    });
    $( "#amount" ).val(($( "#slider-range" ).slider( "value"))/1000 +"km");
  } );
}
var setCircle = function(map, DEFAULT_CIRCLE_RADIUS) {
  var circle = new google.maps.Circle({
    strokeColor: '#0099ff',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#0099ff',
    fillOpacity: 0.35,
    map: map,
    center: myLatLong,
    radius: DEFAULT_CIRCLE_RADIUS
  });
  return circle;
}
var updateRadius = function(map, value, circ) {
  circ.setRadius(value);
}
var filterMarkers = function(distance) {
  markers.forEach(function(marker) {
    if (marker.dist > distance) {
      marker.setMap(null);
    } else {
      marker.setMap(map);
    }
  }) 
}


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
function searchFlights() {
    var dep_apt = $("#dep_apt").attr("code");
    var arr_apt = $("#arr_apt").attr("code");
    var dep_date = $("#dep_date").val();
    var ret_date = $("#ret_date").val();
    $("#results").remove();
    $(".tickets").remove();
    $("#content").append('<div id="results"></div>')
    $("#results").append('<div class=departures><h2>Departure Flight Options</h2></div>')
    $.ajax(root_url + 'flights?filter[departure_id]='+dep_apt+'&filter[arrival_id]='+arr_apt, {
      type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: (response) => {
        var flights = response;
        for (let i = 0; i < flights.length; i++){
          let flight = flights[i];
          $.ajax(root_url + 'instances?filter[flight_id]='+flight.id, {
            type: 'GET',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            success: (response) => {
              var instances = response;
              for (let i = 0; i < instances.length; i++){
                instance = instances[i];
                console.log("dep: " +instance.date);
                if(instance.date == dep_date){
                  console.log("Dep apt: "+flight.departure_id);
                  console.log("Ret apt: "+flight.arrival_id)
                  $(".departures").append('<div class=instance id="'+instance.id+'"></div>')
                  if(flight.departs_at.substring(11,12)>flight.arrives_at.substring(11,12)){
                    var date_change = parseInt(instance.date.substring(8,10))+1;
                    var arrival_date = instance.date.substring(0,8) + String(date_change);
                  }else{
                    var arrival_date = instance.date;
                  }
                  let price = 0;
                  price = 1 + (Math.random()*100).toFixed(2);
                  $("#"+instance.id).append('<div class="container"><input type="radio" id="'+instance.id+'" name="Departure" price="'+price+'" plane="'+flight.plane_id+'"> \
                  <span class="checkmark"></span></div> \
                  <div class="results"> \
                  <div class="res date"> \
                  <h3>Departure Date</h3><p>'+instance.date+"</p> \
                  </div> \
                  <div class='res time'> \
                  <h3>Departure Time</h3><p>" + flight.departs_at.split('T')[1].split('Z')[0].substring(0,5)+"</p> \
                  </div> \
                  <div class='res date'>\
                  <h3>Arrival Date</h3><p>"+arrival_date+"</p> \
                  </div>\
                  <div class='res time'> \
                  <h3>Arrival Time</h3><p>" + flight.arrives_at.split('T')[1].split('Z')[0].substring(0,5) + "</p> \
                  </div> \
                  <div class='res'> \
                  <h3>Flight Number</h3><p>"+flight.number+'</p> \
                  </div><div class="res"><h3>Price</h3><p>$'+price+'</p></div></div>');
                }
              }
            }
          }); 
        }
        
      }
      });
      console.log($(".dropbtn").text())
      if($(".dropbtn").text()!="One-way"){
        $("#results").append('<div class=arrivals><h2>Return Flight Options</h2></div>')
        $.ajax(root_url + 'flights?filter[departure_id]='+arr_apt+'&filter[arrival_id]='+dep_apt, {
          type: 'GET',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          success: (response) => {
            var flights = response;
            for (let i = 0; i < flights.length; i++){
              let flight = flights[i];
              console.log("here")
              $.ajax(root_url + 'instances?filter[flight_id]='+flight.id, {
                type: 'GET',
                dataType: 'json',
                xhrFields: {
                  withCredentials: true
                },
                success: (response) => {
                  var instances = response;
                  for (let i = 0; i < instances.length; i++){
                    instance = instances[i];
                    console.log(instance.date);
                    if(instance.date == ret_date){
                      console.log("Dep apt: "+flight.departure_id);
                      console.log("Ret apt: "+flight.arrival_id);
                      $(".arrivals").append('<div class=instance id="'+instance.id+'"></div>')
                      if(flight.departs_at.substring(11,12)>flight.arrives_at.substring(11,12)){
                        var date_change = parseInt(instance.date.substring(8,10))+1;
                        var arrival_date = instance.date.substring(0,8) + String(date_change);
                      }else{
                        var arrival_date = instance.date;
                      }
                      let price = 0;
                      price = 1 + (Math.random()*100).toFixed(2);
                      var input = '<div class="container"><input type="radio" id="'+instance.id+'" name="Return" price="'+price+'" plane="'+flight.plane_id+'"> \
                      <span class="checkmark"></span></div> \
                      <div class="results"> \
                      <div class="res date"> \
                      <h3>Departure Date</h3><p>'+instance.date+"</p> \
                      </div> \
                      <div class='res time'> \
                      <h3>Departure Time</h3><p>" + flight.departs_at.split('T')[1].split('Z')[0].substring(0,5)+"</p> \
                      </div> \
                      <div class='res date'>\
                      <h3>Arrival Date</h3><p>"+arrival_date+"</p> \
                      </div>\
                      <div class='res time'> \
                      <h3>Arrival Time</h3><p>" + flight.arrives_at.split('T')[1].split('Z')[0].substring(0,5) + "</p> \
                      </div> \
                      <div class='res'> \
                      <h3>Flight Number</h3><p>"+flight.number+'</p> \
                      </div><div class="res"><h3>Price</h3><p>$'+price+'</p></div></div>'
                      $("#"+instance.id).append(input);
                    }
                  }
                }
                });
              
              }
            }
          });
        }
    $("#results").append('<br><br><button class="dropbtn itinerary">Create Itinerary</button>') ;

}
// Close the dropdown menu if the user clicks outside of it
$(document).on("click","#trip",function(){
  var trip = $(this).attr("val");
  $(".dropbtn").text(trip);
  if(trip == "One-way"){
    $("#ret_date").hide();
    $("#retdate_label").hide();
  }else{
    $("#ret_date").show();
    $("#retdate_label").show();
  }
});
$(document).on("click","#loc",function(){
  var code = $(this).attr("code");
  var name = $(this).attr("name");
  var type = $(this).attr("class");
  if(type == "arrs"){
    var apt_id = $(this).attr("arr_id")
    $("#arr_apt").val(name+" ("+code+")");
    $("#arr_apt").attr("code",apt_id);
  }else{
    var apt_id = $(this).attr("dep_id")
    $("#dep_apt").val(name+" ("+code+")");
    $("#dep_apt").attr("code",apt_id);
  }
});
$(document).on("click",".airport_search",function(){
  var box = $(this).attr("id");
  if(first==0){
    if(box == "dep_apt"){
      $("#dep_apt").val("");
      $("#dep_apt").attr("code","N/A")
    }else{
      $("#arr_apt").val("");
      $("#darr_apt").attr("code","N/A")
    }
    first = 1;
    document.getElementById($(this).attr("id")+"_drop").classList.toggle("show");
  }
});
$(document).on("keyup",".airport_search",function(){
  if($(this).attr("id") == "dep_apt"){
    var filt = ".deps"
  }else{
    var filt = ".arrs"
  }  
  var value = $(this).val().toLowerCase();
  $(filt).filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});
//build ticket interface
$(document).on('click', '.itinerary', function(){
  $('.tickets').remove();
  let num_tickets = $('#pcount').val();
  let departValue = $("input[name='Departure']:checked");
  let returnValue = $("input[name='Return']:checked");
  console.log(departValue);
  console.log(returnValue);
  let tickets = $('<div class = "tickets"></div>');
  let itin_id = Math.floor(Math.random() * (1000 - 1)) + 1;
  tickets.attr("id", itin_id);
  //let price = Math.random() * (300 - 50) + 50;
  for (let i = 0; i < num_tickets; i ++){
    let person = $('<div class="tkinfo"></div>');
    person.append('<h2 class ="pass">Passenger ' + (i+1) +'</h2>');
    //person.append('<p></p>');
    person.append(
      '<input type="text" name="fname" placeholder="First name"><br> \
       <input type="text" name="lname" placeholder="Last name"><br> \
       <input type="text" name="age" placeholder="Age"><br> \
       <input type="text" name="gender" placeholder="Gender"><br> \
       <button type = "button" class="tkbtn">Submit Passenger Info</button>'
    );
    tickets.append(person);
  }
  tickets.append(
  '<input type="text" name="email" placeholder="kmp@cs.unc.edu"><br> \
  <input type="text" name="info" placeholder="Notes"><br> \
  <button type = "button" class= "itbtn"> Complete Itinerary </button>'
  );
  $('#results').after(tickets);
  //$('#results').css("display", "none");
});

$(document).on('click', '.tkbtn', (e) =>{
  let person = $(e.target).parent();
  person.find('input').prop("disabled", true);
  let departValue = $("input[name='Departure']:checked");
  let returnValue = $("input[name='Return']:checked");
  const cap = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  if (departValue.length > 0){
    $.ajax(root_url + 'seats', {
        type: 'POST',
        data: {
            "seat": {
                "plane_id": departValue.attr("plane"),
                "row": Math.floor(Math.random() * (30 - 1)) + 1,
                "number": cap.charAt(Math.floor(Math.random() * cap.length)),
                "info": "taken"
            }
        }, 
        dataType:'json',
        xhrFields: {
            withCredentials: true
        }
    }).then(function(data) {
        // .then() returns a new promise
        console.log('DEPART:', data.id);
        return $.ajax(root_url + 'tickets', {
            type: 'POST',
            data: {
              "ticket": {
                "first_name":   person.find('[name="fname"]').val(),
                "last_name":    person.find('[name="lname"]').val(),
                "age":          person.find('[name="age"]').val(),
                "gender":       person.find('[name="gender"]').val(),
                "is_purchased": true,
                "price_paid":   departValue.attr("price"),
                "instance_id": departValue.attr("id"),
                "itinerary_id": $(".tickets").attr("id"),
                "seat_id": data.id
              }
            },
            dataType: "json",
            xhrFields: {
              withCredentials: true
            },
            success: (response) => {
              /*ignore*/
            },
            error: () => {
              alert("Unable submit ticket");
            }
        });
    });
  }

  if (returnValue.length > 0){

    $.ajax(root_url + 'seats', {
        type: 'POST',
        data: {
            "seat": {
                "plane_id": returnValue.attr("plane"),
                "row": Math.floor(Math.random() * (30 - 1)) + 1,
                "number": cap.charAt(Math.floor(Math.random() * cap.length)),
                "info" : "taken"
            }
        }, 
        dataType:'json',
        xhrFields: {
            withCredentials: true
        }
    }).then(function(data) {
        // .then() returns a new promise
        console.log('RETURN:', data.id);
        return $.ajax(root_url + 'tickets', {
            type: 'POST',
            data: {
              "ticket": {
                "first_name":   person.find('[name="fname"]').val(),
                "last_name":    person.find('[name="lname"]').val(),
                "age":          person.find('[name="age"]').val(),
                "gender":       person.find('[name="gender"]').val(),
                "is_purchased": true,
                "price_paid":   returnValue.attr("price"),
                "instance_id": returnValue.attr("id"),
                "itinerary_id": $(".tickets").attr("id"),
                "seat_id": data.id
              }
            },
            dataType: "json",
            xhrFields: {
              withCredentials: true
            },
            success: (response) => {
              /*ignore*/
            },
            error: () => {
              alert("Unable submit ticket");
            }
        });
    });
  }
});

$(document).on('click','.itbtn', (e) => {
  
  let conf_code = Math.random().toString(36).substr(2, 5);
  $.ajax(root_url + 'itineraries ', {
    type: 'POST',
    data: {
      "itinerary": {
        "confirmation_code": conf_code,
        "email": $("input[name='email']").val(),
        "info":  $("input[name='info']").val()
      }
    },
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
        $('.tickets').empty();
        $('.tickets').append($('<p></p>').text("Your booking has been successfully submitted with confirmation code" + conf_code));
    //   $('.tickets').empty();
    //   $('.tickets').append($('<p></p>').text("Your booking has been \
    //                                         successfully submitted \
    //                                         with confirmation code" + conf_code));
    // $('#results').empty();
    },
    error: () => {
      alert("Unable submit ticket");
    }
  });
  $("#results").remove();
});


window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  if (!event.target.matches('#dep_apt')) {

    var dropdowns = document.getElementsByClassName("dropdown-content2");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    first = 0;
  }
  if (!event.target.matches('#arr_apt')) {
    var dropdowns = document.getElementsByClassName("dropdown-content3");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    first = 0;
  }
}