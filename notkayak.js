$(document).ready(() => {
    build_navbar();
    build_home();
});

var build_home = function() {
    $('#title_text').text('Find your flight here!');
    $('a[isActive=true]').attr('isActive', false);
    $('.home_nav').attr('isActive', true);
    $('#content').empty();
    $('#content').append('<div id="search"></div>').append('<div id="results"></div>');
    build_search();
}

var build_navbar = function() {
    $('#navbar').append('<ul id="navbar_list"></ul>')
    $('#navbar_list').append('<li><p id="title">NOT KAYAK</p></li>')
    .append('<li><a class="home_nav" isActive=false onclick="build_home()">Home</a></li>')
    .append('<li><a class="flights_nav" isActive=false onclick="build_my_flights()">My Flights</a></li>')
    .append('<li><a class="flight_view_nav" isActive=false onclick="build_flight_view()">Flight View</a></li>');
}

var build_search = function() {
    $('#search').append('<div id="dropdowns"></div>');
    $('#search').append(
    '<div><div class="label_div"><label for="dep_apt">Departure Airport</label><input id="dep_apt" class="airport_search" type="text" placeholder="From where?"></div> \
    <div class="label_div"><label for="arr_apt">Arrival Airport</label><input id="arr_apt" class="airport_search" type="text" placeholder="To where?"></div> \
    <div class="label_div"><label for="dep_date">When are you leaving?</label><input class="date" type="date" id="dep_date"></div> \
    <div class="label_div"><label for="ret_date">When are you returning?</label><input class="date" type="date" id="ret_date"></div> \
    <button onclick="searchFlights()">Go!</button></div>');
    $('#dropdowns').append(
    '<div class="dropdown"> \
        <button onclick="myFunction()" class="dropbtn">Dropdown</button> \
        <div id="myDropdown" class="dropdown-content"> \
            <a href="#">Link 1</a> \
            <a href="#">Link 2</a> \
            <a href="#">Link 3</a> \
        </div> \
    </div>');
    
}

var build_my_flights = function() {
    console.log("calling build_my_flights()");
    $('a[isActive=true]').attr('isActive', false);
    $('.flights_nav').attr('isActive', true);
}

var build_flight_view = function() {
    console.log("calling build_flight_view()");
    $('a[isActive=true]').attr('isActive', false);
    $('.flight_view_nav').attr('isActive', true);
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
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
}