appendInputs();
init();


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

function init() {
  if (localStorage.getItem("user") !== null) {
    //load data from the json to inputs in extention
    $(".loader").show();
    loadData();
    $("#my-signin2").hide();
    $("#logout").show();
  } else {
    $("#my-signin2").show();
    $(".loader").hide();
    $("#logout").hide();
    $(".wrapper").hide();
  }
}
//loop all inputs from data.json and append them to extion screen
function appendInputs() {
  let formInfo = "",
    social = "";
  for (i = 0; i < formInputsObj.info.length; i++) {
    let obj = formInputsObj.info[i];
    formInfo += `<div class="col-4">
                <div class="row">
                    <div class="input-field col s12">
                    <i class="material-icons prefix">${obj.icon}</i>
                    <input type="${obj.type}" id="${obj.name}" name="${
      obj.name
    }" data-synonymous="${obj.synonymous}" class="autocomplete">
                    <label for="${obj.name}">${obj.name}</label>
                </div>
            </div>
        </div>`;
  }
  for (i = 0; i < formInputsObj.social.length; i++) {
    let obj = formInputsObj.social[i];
    social += `<div class="col-4">
        <div class="row">
            <div class="input-field col s12">
            <i class="material-icons prefix">${obj.icon}</i>
            <input type="${obj.type}" id="${obj.name}" name="${
      obj.name
    }" data-synonymous="${obj.synonymous}" class="autocomplete">
            <label for="${obj.name}">${obj.name}</label>
        </div>
            </div>
            </div>`;
  }
  $(".profile").append(formInfo);
  $(".social").append(social);
}
function loadData() {
  //get data from firebase DataBase and insert to 'autofill' localstorage
  setTimeout(function() {
    firebase
      .database()
      .ref("users/" + JSON.parse(localStorage.getItem("user")).user.uid)
      .once("value")
      .then(function(snapshot) {
        if (snapshot.val() !== null) {
          let autoFill = Object.values(snapshot.val().data);
          console.log(autoFill);
          $("#profileName span").html(autoFill[0].value);
          $(".loader").hide();
          $(".wrapper").show();
          $(document.querySelectorAll("input")).each(function(i, val) {
            let filterObj = _.filter(autoFill, function(o) {
              return o.name.toLowerCase() === val.name.toLowerCase();
            });
            if (filterObj.length > 0) {
              $(this).val(filterObj[0].value);
              $(this)
                .parent()
                .find("label")
                .addClass("active");
            }
          });
        }
      });
  }, 0);
}
