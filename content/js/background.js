(function () {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
    script.type = "text/javascript";
    script.onload = function () {
        let unknownInputData = [] , foundsArr = [] , unknownInputDataFilteredExistInputs = [];

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
        $("input").not("[type=hidden]").map((i, v) => {
            //map all inputs on tab
            let inputParam = [
                ...v.id.split(/\W+/).map(v => v.toLowerCase()),
                ...v.name.split(/\W+/),
                ...v.placeholder.split(/\W+/).map(v => v.toLowerCase()),
                ...v.className.split(/\W+/).map(v => v.toLowerCase())
            ];
            //remove all empty strings --> ["input_firstname", "firstName", "bb", "textfield__input" , "" , null]
            inputParam = inputParam.filter(function (el) { 
                return el.replace(/[^\w\s]/gi, '') != "" &&
                 isNaN(parseFloat(el)) && //checkes if it is number
                 !/\d/.test(el); }); // checks if the string have numbers in it --> b9
            inputParam = inputParam.map(function (item) { return item.toLowerCase(); });
            window.autoFill.forEach(function (value) {
                let valueSynonymous = value.synonymous.split(",");
                valueSynonymous.push(value.name);
                valueSynonymous.forEach(function (val) {
                    if (inputParam.includes(val.toLowerCase())) {
                        foundsArr.push(val.toLowerCase());
                        console.log("found input equal to data -->", val);
                        v.value = value.value;
                        $(v).parent().find("label").addClass("active");
                    }
                })
            });
            unknownInputData = _.union(unknownInputData, inputParam);
            unknownInputDataFilteredExistInputs = _.difference(unknownInputData, foundsArr);
        });


        if ($("iframe").length > 0){
            console.log('iframe',$('iframe').contents().find('input').not("[type=hidden]"));
        }

        
        firebase.database().ref("websites/"+window.location.hostname.split(".")[1]).push({ 'url': [window.location.href], 'inputs': unknownInputDataFilteredExistInputs });

        //send each inputParam to db with counter
        unknownInputDataJSON = {};
        //snap all inputs from DB
        firebase
            .database()
            .ref("inputs/")
            .once("value")
            .then(function (snapshot) {
                if (snapshot.val() !== null) {
                    unknownInputDataFilteredExistInputs.forEach(function (val) {
                        let valObj;
                        if (Object.keys(snapshot.val()).indexOf(val) > -1) {
                            valObj = { key: val, val() { return snapshot.val()[val] + 1; } }
                        }
                        else{
                            valObj = { key: val, val() { return 1; } }
                        }
                        writeUnknownInputData(valObj);
                    });
                }
                else {
                    unknownInputDataFilteredExistInputs.forEach(function (val) {
                        let valObj = { key: val, val() { return 1; } }
                        writeUnknownInputData(valObj);
                    });
                }
                firebase.database().ref('inputs').orderByValue();

            })


    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();

function writeUnknownInputData(val) {
    firebase.database().ref("inputs").child(val.key).set(val.val());
}
