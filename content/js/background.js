(function() {

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

