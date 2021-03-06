
appendInputs();
init();


var firebaseConfig = {
    apiKey: "AIzaSyALriwi-z6pB4dSyVEujDdjlbLeCSo13Rs",
    authDomain: "autofill-1562836772794.firebaseapp.com",
    databaseURL: "https://autofill-1562836772794.firebaseio.com",
    projectId: "autofill-1562836772794",
    storageBucket: "",
    messagingSenderId: "47665567099",
    appId: "1:47665567099:web:0f041cb8c760f4d2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log("User is signed in");
    } else {
        console.log("User is signed out");
    }
});

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
        if (obj.type === 'text' || obj.type === 'number' || obj.type === 'email' ){
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
        else if (obj.type === 'select'){
            formInfo += `<div class="col-4"> <div class="row">
            <select id="${obj.name}" name="${obj.name}" data-synonymous="${obj.synonymous}">
            <option value="" disabled selected>Choose your ${obj.name}</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <label>${obj.name}</label>
          </div></div>`;
        }
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
    $('select').formSelect();
    $(".select-wrapper").addClass('input-field col s12')
    
}
function loadData() {
    //get data from firebase DataBase and insert to 'autofill' localstorage
    setTimeout(function () {
        firebase
            .database()
            .ref("users/" + JSON.parse(localStorage.getItem("user")).user.uid)
            .once("value")
            .then(function (snapshot) {
                if (snapshot.val() !== null && typeof(snapshot.val().data) !== "undefined") {
                    let autoFill = Object.values(snapshot.val().data);
                    console.log(autoFill);
                    $("#profileName span").html(autoFill[0].value);

                    localStorage.setItem("autofill", JSON.stringify(autoFill));

                    $(document.querySelectorAll("input")).each(function (i, val) {
                        let filterObj = _.filter(autoFill, function (o) {
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

                    /* Dynamic select inputs */
                    for (i = 0; i < formInputsObj.info.length; i++) {
                        let obj = formInputsObj.info[i];
                        if (obj.type === 'select'){
                            let selectObj = _.find(autoFill, function(o) { return o.name == obj.name; });
                            $('#'+obj.name).parent().find('input').val(selectObj.value);
                        }
                    }
                 
                }



               //get "usersUnfilledInputs" - by website - from db and add to localStorage in order to send to background with "openBackground" function and then loop inside the background js file
                chrome.tabs.query({ active: true, currentWindow: true }, function ( arrayOfTabs ) {
                    var activeTab = arrayOfTabs[0];
                    console.log(activeTab)
                        // get unfilled Inputs
                        firebase
                        .database()
                        .ref("usersUnfilledInputs/" + JSON.parse(localStorage.getItem("user")).user.uid + "/" + getDomain(activeTab.url))
                        .once("value")
                        .then(function (snapshot) {
                            if (snapshot.val() !== null && typeof(snapshot.val().unfilled) !== "undefined") {
                                let unfilledInputs = Object.values(snapshot.val().unfilled);
                                localStorage.setItem("unfilledInputs", JSON.stringify(unfilledInputs));
                            }
                                        
                            $(".loader").hide();
                            $(".wrapper").show();
                            openBackground();
                        })
                })

            });
    }, 0);
}
function topInputs() {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/inputs/').once('value').then(function (snapshot) {
        let data = snapshot.val();
        var result = [];
        for (var i in data)
            result.push({ name: i, sum: data[i] });
        result = _.orderBy(result, [function (o) { return o.sum; }], ['desc']);
        console.log('top Results: ',result);
    });
}

function getDomain(domain = window.location.hostname) {
  var domain = domain;
  var parts = domain.split('.').reverse();
  var cnt = parts.length;
  if (cnt >= 3) {
    if (parts[1].match(/^(com|edu|gov|net|mil|org|nom|co|name|io|info|biz)$/i)) {
        return parts[1];
    }
  }
  if (parts[1].includes("http://"))
    parts[1] = parts[1].replace("http://",'');
    if (parts[1].includes("https://"))
    parts[1] = parts[1].replace("https://",'');
    return parts[1];
}