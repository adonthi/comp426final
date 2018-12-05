var root_url = "http://comp426.cs.unc.edu:3001/";

$(document).ready(() => {
    build_navbar();
    build_home();
});

var build_home = function() {
    $('#title_text').text('Find your flight here!');
    $('a[isActive=true]').attr('isActive', false);
    $('.home_nav').attr('isActive', true);
    $('#content').empty();
    $('#content').append('<img src="Header.jpg" class="head_img"></img>').append('<div id="search"></div>').append('<div id="results"></div>');
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
    $('#search').append('<br>')
    $('#search').append(
    '<div><div class="label_div" id="dep_label"><label for="dep_apt">Departure Airport</label><input id="dep_apt" class="airport_search" type="text" code="N/A" placeholder="From where?"><div id="dep_apt_drop" class="dropdown-content2"></div></div> \
    <div class="label_div" id="arr_label"><label for="arr_apt">Arrival Airport</label><input id="arr_apt" class="airport_search" type="text" code="N/A" placeholder="To where?"><div id="arr_apt_drop" class="dropdown-content3"></div></div> \
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
    </"div>');
    //Setting today to default date, next week default return date
    let todayDate = new Date();
    document.getElementById('dep_date').valueAsDate = todayDate;
    let nextWeek = new Date();
    nextWeek.setDate(todayDate.getDate()+7);
    document.getElementById('ret_date').valueAsDate = nextWeek;
    $.ajax(root_url + 'airports', {
      type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: (response) => {
        var airports = response;
        console.log(response);
        for (let i = 0; i < airports.length; i++){
          port = airports[i];
          var listitem = '<a id="loc" class="deps" dep_id="'+port.id +'" name="'+port.name+'" code="'+port.code+'">'+port.name+' ('+port.code+') </a>'
          $("#dep_apt_drop").append(listitem);
          var listitem = '<a id="loc" class="arrs" arr_id="'+port.id+'" name="'+port.name+'" code="'+port.code+'">'+port.name+' ('+port.code+') </a>'
          $("#arr_apt_drop").append(listitem);
        }
      }
      });
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
    var dep_apt = $("#dep_apt").attr("code");
    var arr_apt = $("#arr_apt").attr("code");
    var dep_date = $("#dep_date").val();
    var ret_date = $("#ret_date").val();
    $("#results").empty();
    console.log(dep_apt);
    console.log(arr_apt);
    console.log(dep_date);
    console.log(ret_date);
    $.ajax(root_url + 'flights?filter[departure_id]='+dep_apt+'filter[arrival_id]='+arr_apt, {
      type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: (response) => {
        var flights = response;
        for (let i = 0; i < flights.length; i++){
          let flight = flights[i];
          console.log(flight.id)
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
                if(instance.date == dep_date){
                  console.log("instance:"+instance.flight_id);
                  console.log("flight id:" +flight.id);
                  $("#results").append('<div class=instance id="'+instance.id+'"></div>')
                  $("#"+instance.id).append("Departure Date:"+instance.date+" Departure Time:" + flight.departs_at.split('T')[1].split('Z')[0]+" Arrival Time:" + flight.arrives_at.split('T')[1].split('Z')[0] + " Flight Number:"+flight.number)
                }
              }
            }
            });
          
        }
        
      }
      });
}
// Close the dropdown menu if the user clicks outside of it
$(document).on("click","#trip",function(){
  var trip = $(this).attr("val");
  console.log(trip)
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
  document.getElementById($(this).attr("id")+"_drop").classList.toggle("show");
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
  }
}