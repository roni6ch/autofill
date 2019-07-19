
init();
appendInputs();
function init() {
    if (localStorage.getItem('user') !== null) {
        //load data from the json to inputs in extention
        loadData();
        $("#my-signin2").hide();
        $(".wrapper").show();
    }
    else{
        $("#my-signin2").show();
        $("#logout").hide();
        
    }
}
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

//loop all inputs from data.json and append them to extion screen
function appendInputs() {
    let formInfo = '', social = '';
    for (i = 0; i < formInputsObj.info.length; i++) {
        let obj = formInputsObj.info[i];
        formInfo += `<div class="col-4">
                <div class="row">
                    <div class="input-field col s12">
                    <i class="material-icons prefix">${obj.icon}</i>
                    <input type="${obj.type}" id="${obj.name}" name="${obj.name}" data-synonymous="${obj.synonymous}" class="autocomplete">
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
            <input type="${obj.type}" id="${obj.name}" name="${obj.name}" data-synonymous="${obj.synonymous}" class="autocomplete">
            <label for="${obj.name}">${obj.name}</label>
        </div>
            </div>
            </div>`;
    }
    $('.profile').append(formInfo);
    $('.social').append(social);

}
function loadData() {
    let autoFill = JSON.parse(localStorage.getItem('autofill'));
    $(document.querySelectorAll("input")).each(function (i, val) {
        let filterObj = _.filter(autoFill, function (o) { return o.name.toLowerCase() === val.name.toLowerCase(); });
        if (filterObj.length > 0) {
            $(this).val(filterObj[0].value);
            $(this).parent().find('label').addClass('active');
        }
    })
}

$("#register").click(function (e) {
    e.preventDefault();
    let email = $("#email").val();
    let password = $("#password").val();
    let auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email, password).then(function(data) {
        console.log(data);
        let user = {email:data.user.email}
        localStorage.setItem('user',JSON.stringify(user));
        init();
      }).catch(e =>  $("#error").html(e.message));
})

$("#signin").click(function (e) {
    e.preventDefault();
    let email = $("#email").val();
    let password = $("#password").val();
    let auth = firebase.auth();
    auth.signInWithEmailAndPassword(email, password).then(function(data) {
        console.log(data);
        let user = {email:data.user.email}
        localStorage.setItem('user',JSON.stringify(user));
        init();
      }).catch(e => $("#error").html(e.message));
})

$("#logout").click(function (e) {
    e.preventDefault();
    firebase.auth().signOut().then(function () {
        console.log("Sign-out successful");
        $("#my-signin2").show();
        $(".wrapper").hide();
    }).catch(function (error) {
        console.log(error);
    });
})

$("#facebook").click(function (e) {
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log(result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
})

//submit - save new data to localstorage
$("#autoFillForm").submit(function (e) {
    e.preventDefault();
    let autoFill = $("#autoFillForm").serializeArray();

    let autofillArr = [];
    $('#autoFillForm input').each(function () {
        autofillArr.push({
            name: $(this).attr('name'),
            value: $(this).val(),
            synonymous: $(this).attr('data-synonymous'),
        });
    })
    console.log(autofillArr);
    localStorage.setItem('autofill', JSON.stringify(autofillArr));
});

//fill - inject data from extention to tab
$("#fill").click(function (e) {
    e.preventDefault();
    let domInputs = [];
    document.querySelectorAll('input').forEach(function (node) {
        domInputs.push($(node).attr("name"));
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: "content/js/jquery-3.4.1.min.js" });
        chrome.tabs.executeScript(activeTab.id, { file: "content/js/lodash.min.js" });
        chrome.tabs.executeScript(activeTab.id, { file: "content/data/data.js" });

        chrome.tabs.executeScript(activeTab.id, { code: "var autoFill = " + localStorage.getItem('autofill') },
            function () {
                chrome.tabs.executeScript(activeTab.id, { file: "content/js/background.js" });
            })
    }
    );
});

