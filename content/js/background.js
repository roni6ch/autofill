(function() {


      
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'content/js/jquery-3.4.1.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        var $ = window.jQuery;
        console.log(window.autoFill);
        $('input').map((i, v) => {
            //map all inputs on tab
            let inputParam = [...v.id.split(/\W+/).map(v => v.toLowerCase()), ...v.name.split(/\W+/), ...v.placeholder.split(/\W+/).map(v => v.toLowerCase()), ...v.className.split(/\W+/).map(v => v.toLowerCase())];
            //remove all empty strings --> ['name','username']
            inputParam = inputParam.filter(function (el) {
                return el != "";
            });
            console.log(inputParam);
            //filter each input that equal to data
            let filterObj = _.filter(window.autoFill, function (o) {
                return (inputParam.indexOf(o.name.toLowerCase()) > -1 || inputParam.indexOf(o.synonymous.toLowerCase()) > -1)
            });
            if (filterObj.length > 0) {
                console.log('found input equal to data -->',filterObj);
                v.value = filterObj[0].value;
                $(v).parent().find('label').addClass('active');
            }
        });
        
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();


$("#register").click(function (e) {
    e.preventDefault();
    let email = $("#email").val();
    let password = $("#password").val();
    let auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email, password).then(function(data) {
        console.log(data);
      }).catch(e => console.log(e.message));
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
