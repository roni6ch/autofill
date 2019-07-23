$("#registerBT").click(function (e) {
  $("#my-signin2").hide();
  $("#registerForm").show();
})
$("#signInBT").click(function (e) {
  $("#my-signin2").show();
  $("#registerForm").hide();
})

$("#register").click(function (e) {
  e.preventDefault();
  let email = $("#email").val();
  let password = $("#password").val();
  let password_repeat = $("#password_repeat").val();
  if (password == password_repeat) {
    let auth = firebase.auth();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(function (data) {
        console.log("user", data);
        $("#registerForm").hide();
        localStorage.setItem("user", JSON.stringify(data));
        init();
      })
      .catch(e => $("#error_register").html(e.message).show());
  }
  else {
    $("#error_register").html('Passwords are not equal!').show();
  }
});

$("#signin").click(function (e) {
  e.preventDefault();
  let email = $("#sign_email").val();
  let password = $("#sign_password").val();
  let auth = firebase.auth();
  auth
    .signInWithEmailAndPassword(email, password)
    .then(function (data) {
      localStorage.setItem("user", JSON.stringify(data));
      init();
    })
    .catch(e =>
      $("#error")
        .html(e.message)
        .show()
    );
});

$("#logout").click(function (e) {
  e.preventDefault();
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("Sign-out successful");
      localStorage.removeItem("user");
      localStorage.removeItem("autofill");
      init();
    })
    .catch(function (error) {
      console.log(error);
    });
});

$("#google").click(function (e) {
  e.preventDefault();
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (data) {
      console.log("user", data);
      localStorage.setItem("user", JSON.stringify(data));
      init();
    })
    .catch(function (error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
});


//submit - save new data to localstorage
$("#autoFillForm").submit(function (e) {
  e.preventDefault();
  $(".update").hide();
  let autofillArr = [];
  $("#autoFillForm input").each(function () {
    autofillArr.push({
      name: $(this).attr("name"),
      value: $(this).val(),
      synonymous: $(this).attr("data-synonymous")
    });
  });
  $("#profileName span").html(autofillArr[0].value);
  console.log(autofillArr);
  writeUserData(autofillArr);
});

function writeUserData(autofillArr) {
  let userId = JSON.parse(localStorage.getItem("user")).user.uid;
  firebase
    .database()
    .ref("users/" + userId)
    .set({
      data: autofillArr
    });
  localStorage.setItem("autofill", JSON.stringify(autofillArr));
}

//fill - inject data from extention to tab
$("#fill").click(function (e) {
  e.preventDefault();
  let domInputs = [];
  document.querySelectorAll("input").forEach(function (node) {
    domInputs.push($(node).attr("name"));
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (
    arrayOfTabs
  ) {
    var activeTab = arrayOfTabs[0];
    chrome.tabs.executeScript(activeTab.id, {
      file: "content/js/jquery-3.4.1.min.js"
    });
    chrome.tabs.executeScript(activeTab.id, {
      file: "content/js/lodash.min.js"
    });
    chrome.tabs.executeScript(activeTab.id, { file: "content/data/data.js" });
    chrome.tabs.executeScript(activeTab.id, { code: "var user = " + localStorage.getItem("user") });
    chrome.tabs.executeScript(
      activeTab.id,
      { code: "var autoFill = " + localStorage.getItem("autofill") },
      function () {
        chrome.tabs.executeScript(activeTab.id, {
          file: "content/js/firebase.js"
        });
        chrome.tabs.executeScript(activeTab.id, {
          file: "content/js/firebase-database.js"
        });
        chrome.tabs.executeScript(activeTab.id, {
          file: "content/js/background.js"
        });
      }
    );
  });
});

$("#forgot").click(function (e) {
  e.preventDefault();
  var auth = firebase.auth();
  var emailAddress = $("#sign_email").val();

  auth
    .sendPasswordResetEmail(emailAddress)
    .then(function () {
      // Email sent.
      $("#error")
        .html("Email sent to " + emailAddress)
        .show();
    })
    .catch(function (error) {
      // An error happened.
      $("#error")
        .html("Error - Please fill email input")
        .show();
    });
});

$("input")
  .not("#sign_email")
  .not("#sign_password")
  .not("#email")
  .not("#password")
  .keydown(function () {
    $(".update").show();
    $("#error").hide();
  });

$("#email , #password , #sign_email , #sign_password").keydown(function () {
  $("#error").hide();
});
