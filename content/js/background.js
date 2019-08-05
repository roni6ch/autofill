console.clear();
unknownInputDataFilteredExistInputs = [];

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


var $ = window.jQuery;
console.log(window.autoFill);
console.log(window.unfilledInputs);
console.log(window.user);

/********* DOM INPUTS  *********/
domInputs = $("input").not("[type=hidden]");
if (domInputs.length > 0) {
  console.log("iframe", domInputs);
  unknownInputDataFilteredExistInputs = fillDomInputs(domInputs);
}

/********* IFRAME INPUTS  *********/
iframeInputs = $("iframe")
  .contents()
  .find("input")
  .not("[type=hidden]");
if (iframeInputs.length > 0) {
  console.log("iframe", iframeInputs);
  unknownInputDataFilteredExistInputs = fillDomInputs(iframeInputs);
}

window.unfilledInputs.forEach(function(val,ind) {
  console.log('unfilledInputs',val);
  $(`input[${val.attr}=${val.input}]`).val(val.value);
});



$("input")
  .not("[type=hidden]")
  .each(function(i, node) {
    if (node.value === "") {
      node.setAttribute("eInput", true);
    }
  });

//snap all inputs from DB
writeInputs2DB(unknownInputDataFilteredExistInputs);
function writeInputs2DB(unknownInputDataFilteredExistInputs) {
  firebase
    .database()
    .ref("websites/" + window.location.hostname.split(".")[1])
    .push({
      url: [window.location.href],
      inputs: unknownInputDataFilteredExistInputs
    });
  firebase
    .database()
    .ref("inputs/")
    .once("value")
    .then(function(snapshot) {
      if (snapshot.val() !== null) {
        unknownInputDataFilteredExistInputs.forEach(function(val) {
          let valObj;
          if (Object.keys(snapshot.val()).indexOf(val) > -1) {
            valObj = {
              key: val,
              val() {
                return snapshot.val()[val] + 1;
              }
            };
          } else {
            valObj = {
              key: val,
              val() {
                return 1;
              }
            };
          }
          writeUnknownInputData(valObj);
        });
      } else {
        unknownInputDataFilteredExistInputs.forEach(function(val) {
          let valObj = {
            key: val,
            val() {
              return 1;
            }
          };
          writeUnknownInputData(valObj);
        });
      }
      firebase
        .database()
        .ref("inputs")
        .orderByValue();
    });
}
function writeUnknownInputData(val) {
  firebase
    .database()
    .ref("inputs")
    .child(val.key)
    .set(val.val());
}

function fillDomInputs(domInputs) {
  let unknownInputData = [],
    foundsArr = [],
    unknownInputDataFilteredExistInputs = [];
  domInputs.map((i, v) => {
    //map all inputs on tab
    let inputParam = [
      ...v.id.split(/\W+/).map(v => v.toLowerCase()),
      ...v.name.split(/\W+/),
      ...v.placeholder.split(/\W+/).map(v => v.toLowerCase()),
      ...v.className.split(/\W+/).map(v => v.toLowerCase())
    ];
    //remove all empty strings --> ["input_firstname", "firstName", "bb", "textfield__input" , "" , null]
    inputParam = inputParam.filter(function(el) {
      return el.replace(/[^\w\s]/gi, "").replace(/[0-9]/g, "");
    }); // checks if the string have numbers in it --> b9
    inputParam = inputParam.map(function(el) {
      return el.replace(/[0-9]/g, "");
    });
    inputParam = inputParam.filter(function(el) {
      return el !== "";
    });
    inputParam = inputParam.map(function(item) {
      return item.toLowerCase();
    });
    window.autoFill.forEach(function(value) {
      let valueSynonymous = value.synonymous.split(",");
      valueSynonymous.push(value.name);
      valueSynonymous.forEach(function(val) {
        if (inputParam.includes(val.toLowerCase())) {
          foundsArr.push(val.toLowerCase());
          console.log("found IFRAME input equal to data -->", val);
          v.value = value.value;
          $(v)
            .parent()
            .find("label")
            .addClass("active");
        }
      });
    });
    unknownInputData = _.union(unknownInputData, inputParam);
    unknownInputDataFilteredExistInputs = _.difference(
      unknownInputData,
      foundsArr
    );
  });
  return unknownInputDataFilteredExistInputs;
}

if (
  $("button").length > 0 ||
  $("input[type='button']").length > 0 ||
  $("input[type='submit']").length > 0
) {
  $("button , input[type='submit'] , input[type='button']").click(function() {
    //get all inputs that the user filled
    let unFilled = [];
    $("input[eInput]")
      .not("[type=file]")
      .not("[type=hidden]")
      .each(function(i, node) {
        if (node.value !== "") {
          let input = "";
          let attrType = "";
          if (typeof node.getAttribute("name") !== "undefined"){
            input = node.getAttribute("name");
            attrType = "name";
          }
          else if (typeof node.getAttribute("id") !== "undefined"){
            input = node.getAttribute("id");
            attrType = "id";
          }
          else if (typeof node.getAttribute("placeholder") !== "undefined"){
            input = node.getAttribute("placeholder");
            attrType = "placeholder";
          }
          unFilled.push({ attr: attrType, input:input, value: node.value });
        }
      });
    if (unFilled.length > 0){
        //save the input + value on firebase
        writeUserData(unFilled);
    }
  });
}

//save the input + value on firebase
function writeUserData(unFilledArr) {
    let userId = user.user.uid;
    firebase
      .database()
      .ref("usersUnfilledInputs/" + userId + "/" + getDomain())
      .update({
        unfilled: unFilledArr
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