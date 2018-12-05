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
    $('#search').empty();
    $('#search').append('<div id="dropdowns"></div>');
    $('#search').append(
    '<div><div class="label_div" id="dep_label"><label for="dep_apt">Departure Airport</label><input id="dep_apt" class="airport_search" type="text" placeholder="From where?"></div> \
    <div class="label_div" id="arr_label"><label for="arr_apt">Arrival Airport</label><input id="arr_apt" class="airport_search" type="text" placeholder="To where?"></div> \
    <div class="label_div" id="depdate_label"><label for="dep_date">When are you leaving?</label><input class="date" type="date" id="dep_date"></div> \
    <div class="label_div" id="retdate_label"><label for="ret_date">When are you returning?</label><input class="date" type="date" id="ret_date"></div> \
    <button onclick="searchFlights()">Go!</button></div>');
    $('#dropdowns').append(
    '<div class="dropdown"> \
        <button onclick="myFunction()" class="dropbtn">Round-Trip</button> \
        <div id="myDropdown" class="dropdown-content"> \
            <a id="trip" val="Round-Trip">Round-Trip</a> \
            <a id="trip" val="One-way">One-way</a> \
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
function searchFlights() {
    var dep_apt = $("#dep_apt").val();
    var arr_apt = $("#arr_apt").val();
    var dep_date = $("#dep_date").val();
    var ret_date = $("#ret_date").val();
    console.log(dep_apt);
    console.log(arr_apt);
    console.log(dep_date);
    console.log(ret_date);
}
// Close the dropdown menu if the user clicks outside of it
$(document).on("click","#trip",function(){
  var trip = $(this).attr("val");
  $(".dropbtn").text(trip);
  build_search();
  if(trip == "One-way"){
    $("#ret_date").hide();
    $("#retdate_label").hide();
  }
  console.log($(this).attr("val"))
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
}