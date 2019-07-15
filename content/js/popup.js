let formInfo = '', social = '';
appendInputs();
loadData();
function appendInputs() {
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
$("#autoFillForm").submit(function (e) {
    e.preventDefault();
    let autoFill = $("#autoFillForm").serializeArray();

    let autofillArr = [];
    $('#autoFillForm input').each(function(){
        autofillArr.push({
            name:$(this).attr('name'),
            value:$(this).val(),
            synonymous:$(this).attr('data-synonymous'),
        });
    })
    console.log(autofillArr);
    localStorage.setItem('autofill', JSON.stringify(autofillArr));
});

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

