function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    localStorage.setItem('user',JSON.stringify(profile));
    init();
 }
 function onFailure(error) {
    console.log(error);
 }

 function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.removeItem('user');
        location.href = "/AutoFill/";
    });
    auth2.disconnect();
 }
 function renderButton() {
    gapi.signin2.render('my-signin2', {
       'scope': 'profile email',
       'width': 240,
       'height': 50,
       'longtitle': true,
       'theme': 'dark',
       'onsuccess': onSuccess,
       'onfailure': onFailure
    });
 }