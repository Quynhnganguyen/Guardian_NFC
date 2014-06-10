$baseUrl = "http://mighty-fortress-1212.herokuapp.com";

//Nhung ham phu
function setpr(key, value) {
  console.log("in setpr");
   window.localStorage.setItem(key,value);
}

function getpr(key) {
  console.log ("in getpr");
  var prs = window.localStorage.getItem(key);
  console.log(prs);
  //alert (prs);
  return prs;
}

function fillvalue(element, value){
  var key = getElement(element);
      key.value = value;
}

function delvalue(element){
  var key = getElement(element);
      key.value = '';
}

function resetformentry(){
  var img = getElement("showimg");
              img.src = '';
   delvalue("tagid");
   delvalue("timein");
   delvalue("timeout");
   delvalue("guard");
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 10, 10);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
//Nhung ham chinh
function login() {
    console.log("login verification");
    //send a post request to your web-service
    $.post($baseUrl+"/api/user/sign_in", $('#login').serialize(), function (response) {
    // console.log("da gui du lieu");
    console.log("send data for login verification");
    console.log(response.message);
    setpr("username", response.username);
    setpr("userid", response.user_id);
    setpr("login", response.authentication_token);

    //check if the authorization was successful or not
    if (response.status == 'success') {
       $.mobile.changePage( "#home_page",
                            {transition: "slide"} );
       $("#guardname").append(getpr("username"));
    } else {
      alert (response.status);
      }
    }

    ); 
}


function logout() {
  console.log("on log out");
  window.localStorage.clear();
  $.get($baseUrl+"/api/user/sign_out");
    // alert("Ban vua thoat ung dung!");
    alert("You have signed out!");
      $.mobile.changePage( "#login_page",
                      {transition: "slide"} ); 
      
}


function show_entry(id_tag){
   resetformentry();
   // console.log("Goi duoc ham show_entry");
   console.log("called the function show_entry");
   console.log(id_tag);
   setpr("idtag", id_tag);
   var idtag = getpr("idtag");
   console.log(idtag);
   var par1 = getpr("login");

  $.post($baseUrl + "/api/show_entry", {auth_token: par1, idtag: idtag}, function (response) {
      if (response.message == 'succeeded') {
              var img = getElement("showimg");
                img.src = $baseUrl + response.image;
              fillvalue("tagid", response.tag);
              fillvalue("timein", response.time_checkin+"-"+response.date_checkin);
              if (response.time_checkout) {
                fillvalue("timeout", response.time_checkout+"-"+response.date_checkin)};
              fillvalue("guard", response.guard);
      } else {
        alert(response.message);
        $.mobile.changePage( "#home_page",
                              {transition: "slide"} );
        }
  }); 
}
 
function list_entries_on(){
  var par1 = getpr("login");
  $.post($baseUrl + "/api/list_on", {auth_token: par1}, function (response) {

  $( '#liston .lilist' ).remove();
    if (response.length ==0) {
      // $("#liston").html("Hien tai khong co Entry");} 
      $("#liston").html("Currently, we haven't any entry in the building");} 
    else {
      for (var i=0;i<response.length;i++){
    
        $( '#liston' ).append(
          " <li class='lilist'>"+
                          "<a href='#showentry' onclick='show_entry(\"" + response[i].idtag + "\");'>"+
                              "<img class='img' src='"+$baseUrl + response[i].image+"'/>"+
                              "<h3>"+response[i].guard+"</h3>"+
                              "<p class='ui-li-aside'>"+response[i].date_checkin+"</p>"+
                              "<p><strong id='time'>"+response[i].time_checkin+"</strong></p>"+
                          "</a> </li>" 
                        );
        $('#liston').listview('refresh');
      }
    }
   });
}


function list_entries_off(){
  var par1 = getpr("login");
  $.post($baseUrl + "/api/list_off", {auth_token: par1}, function (response) {
    $( '#listoff .lilist' ).remove();
    if (response.length ==0) {
      // $("#listoff").html("Hien tai khong co Entry ra khoi toa nha");}
      $("#listoff").html("We haven't any Entry in this list");} 

    else {
      for (var i=0;i<response.length;i++){
        $( '#listoff' ).append(
          " <li class='lilist'>"+
                          "<a href='#showentry' onclick='show_entry(\"" + response[i].idtag + "\");'>"+
                              "<img class='img' src='"+$baseUrl + response[i].image+"'/>"+
                              "<h3>"+response[i].guard+"</h3>"+
                              "<p class='ui-li-aside'>"+response[i].date_checkin+"</p>"+
                              "<p><strong id='time'>"+response[i].time_checkin+" - "+ response[i].time_checkout+"</strong></p>"+
                          "</a> </li>" 
                        );
        $('#listoff').listview('refresh');
      }
    }
   });
}

function setform_for_checkin(){
    // console.log('goi duoc ham setform');
    console.log('called the function setform');

    console.log($nfcid);
    
   

    var img = getElement("image");
    
    img.src= $imageurl;

    var image = getBase64Image(img);
       console.log(image);

    var photo = getElement("entry[image]");
    
    photo.value =  image;
    var tag = getElement("entry[tag]");
    
    tag.value = $nfcid;
    
}

function check_in(){
  // console.log('goi duoc ham check_in');
  console.log('called the function check_in');

  var par1 = getpr("login");
 
  $.post($baseUrl+"/api/check_in?auth_token="+par1, $('#checkin').serialize(), function (response) {
    // console.log("da gui du lieu check in");
    console.log("send data for checking in");
    console.log($('#checkin').serialize());

    //check if the authorization was successful or not
    if (response.message == 'Check in succeeded') {
       alert(response.message);
       list_entries_on();
       $.mobile.changePage( "#onlist",
                            {transition: "slide"} );
    } else {
      alert(response.message);
      $.mobile.changePage( "#check_in",
                            {transition: "slide"} );

      }
    }

    );  
}

function check_entry(){
  var par1 = getpr("login");
  resetformentry();
  var nfcid = $nfcid;
  $.post($baseUrl+"/api/check_entry", {auth_token: par1, tag: nfcid}, function (response) {
    // console.log("da gui du lieu");
    console.log("send data for checking entry");
    console.log(response.message);

    //check if the authorization was successful or not
    if (response.message == 'succeeded') {
            var img = getElement("showimg");
              img.src = $baseUrl + response.image;
            fillvalue("tagid", response.tag);
            fillvalue("timein", response.time_checkin+"-"+response.date_checkin);
            fillvalue("guard", response.guard);
    } else {
      alert(response.message);
      $.mobile.changePage( "#nfc",
                            {transition: "slide"} );
      }
  });  
}

function check_out(){
  // console.log('goi duoc ham check_out');
  console.log('called the function check_out');
  var par1 = getpr("login");
  $.post($baseUrl+"/api/check_out", {auth_token: par1, tag: $nfcid}, function (response) {
    // console.log("da gui du lieu check out");
    console.log("send data for checking out");
    console.log(response.message);

    //check if the authorization was successful or not
    if (response.message == 'check out succeeded') {
       alert(response.message);
       $.mobile.changePage( "#offlist",
                            {transition: "slide"} );
       list_entries_off();
    } else {
      alert (response.message);
      $.mobile.changePage( "#nfc",
                            {transition: "slide"} );
      init();

      }
    }

    );  
}
