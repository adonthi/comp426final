$(document).ready(() => {
    build_navbar();
    build_home();
});

var build_home = function() {
    $('#title_text').text('Home');
    $('a[isActive=true]').attr('isActive', false);
    $('.home_nav').attr('isActive', true);
    $('#content').empty();
    $('#content').append('<div id="search"></div>').append('<div id="results"></div>');
    build_search();
}

var build_navbar = function() {
    $('#navbar').append('<ul id="navbar_list"></ul>')
    $('#navbar_list').append('<li><a class="home_nav" isActive=false onclick="build_home()">Home</a></li>')
    .append('<li><a class="flights_nav" isActive=false onclick="build_my_flights()">My Flights</a></li>')
    .append('<li><a class="flight_view_nav" isActive=false onclick="build_flight_view()">Flight View</a></li>');
}

var build_search = function() {

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