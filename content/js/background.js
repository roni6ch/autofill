(function() {
  // Load the script
  var script = document.createElement("SCRIPT");
  script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
  script.type = "text/javascript";
  script.onload = function() {

    $.when(
      $.getScript( "https://www.gstatic.com/firebasejs/6.3.0/firebase-app.js" ),
      $.getScript( "https://www.gstatic.com/firebasejs/6.3.0/firebase-auth.js" ),
      $.getScript( "https://www.gstatic.com/firebasejs/6.3.0/firebase-database.js" ),
      $.Deferred(function( deferred ){
          $( deferred.resolve );
      })
  ).done(function(){

    
    var firebaseConfig = {
      apiKey: "AIzaSyCBIYJ0e1JT1v2bWGDWEwEZ-Cmb5xhFjSQ",
      authDomain: "autofill-1562836772794.firebaseapp.com",
      databaseURL: "https://autofill-1562836772794.firebaseio.com",
      projectId: "autofill-1562836772794",
      storageBucket: "",
      messagingSenderId: "47665567099",
      appId: "1:47665567099:web:0f041cb8c760f4d2"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);


    var $ = window.jQuery;
    console.log(window.autoFill);
    console.log(window.user);
    $("input").map((i, v) => {
      //map all inputs on tab
      let inputParam = [
        ...v.id.split(/\W+/).map(v => v.toLowerCase()),
        ...v.name.split(/\W+/),
        ...v.placeholder.split(/\W+/).map(v => v.toLowerCase()),
        ...v.className.split(/\W+/).map(v => v.toLowerCase())
      ];
      //remove all empty strings --> ["input_firstname", "firstName", "bb", "textfield__input" , "" , null]
      inputParam = inputParam.filter(function(el) { return el != ""; });
      inputParam = inputParam.map(function(item) { return item.toLowerCase(); });
      window.autoFill.forEach(function(value) {
        let valueSynonymous = value.synonymous.split(",");
        valueSynonymous.push(value.name);
        let found = false;
        valueSynonymous.forEach(function(val) {
            if (inputParam.includes(val)){
              found = true;
                console.log("found input equal to data -->", val);
                v.value = value.value;
                $(v).parent().find("label").addClass("active");
            }
        })
        if (!found){
          //send each inputParam to db with counter
          inputParam.forEach(function(val) {
            writeUnknownInputData(val);
          });
        }
      });

    });
  });
  
  };
  document.getElementsByTagName("head")[0].appendChild(script);
})();

function writeUnknownInputData(val) {
  let userId = window.user.user.uid;
  firebase
    .database()
    .ref("inputs/" + userId)
    .set({
      [val]: 1
    });
  localStorage.setItem("autofill", JSON.stringify(autofillArr));
}