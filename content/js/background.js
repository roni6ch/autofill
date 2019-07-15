console.log(window.autoFill);

inputs = document.querySelectorAll('input');
for (let i = 0; i < inputs.length; i++) {
    let filterObj = _.filter(window.autoFill, function (o) {
        return (o.name.toLowerCase() === (inputs[i].name.toLowerCase() || inputs[i].id.toLowerCase())) ||
            //  typeof(o.synonymous) !== "undefined" && ( ( inputs[i].name.includes(o.synonymous) && inputs[i].name !== "" ) || ( inputs[i].id.includes(o.synonymous) && inputs[i].id !== "" )) ||
            // typeof(o.synonymous) !== "undefined" && ( ( o.synonymous.includes(inputs[i].name) && inputs[i].name !== "" ) || ( o.synonymous.includes(inputs[i].id) && inputs[i].id !== "" )) ||
            containsAny(inputs[i].name, o.synonymous) && inputs[i].name !== "" ||
            containsAny(inputs[i].id, o.synonymous) && inputs[i].id !== "" ||
            containsAny(inputs[i].autocomplete, o.synonymous) && inputs[i].autocomplete !== ""
        //  || $(inputs[i]).parent().html() !== "" && ( $(inputs[i]).parent().html().includes(inputs[i].name) || $(inputs[i]).parent().html().includes(inputs[i].id) )
    });
    if (filterObj.length > 0) {
        inputs[i].value = filterObj[0].value;
        $(inputs[i]).parent().find('label').addClass('active');
    }
}


function containsAny(str, substrings) {
    if (substrings !== "undefined" && substrings !== "") {
        substrings = substrings.split(",");
        for (var i = 0; i != substrings.length; i++) {
            var substring = substrings[i];
            if (str.indexOf(substring) != - 1) {
                return true;
            }
        }
    }
    return false;
}