let formInfo = '', social = '';
for (i = 0; i < formInputsObj.info.length; i++) {
    let obj = formInputsObj.info[i];
    formInfo += `<div class="col-4">
            <div class="row">
                <div class="input-field col s12">
                <i class="material-icons prefix">${obj.icon}</i>
                <input type="${obj.type}" id="${obj.name}" name="${obj.name}" class="autocomplete">
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
        <input type="${obj.type}" id="${obj.name}" name="${obj.name}" class="autocomplete">
        <label for="${obj.name}">${obj.name}</label>
    </div>
        </div>
        </div>`;
}
$('.profile').append(formInfo);
$('.social').append(social);

$("#autoFillForm").submit(function (e) {
    e.preventDefault();
    let autoFill = $("#autoFillForm").serializeArray();
    console.log(autoFill);
    localStorage.setItem('autofill', JSON.stringify(autoFill));
});

$("#fill").click(function (e) {
    e.preventDefault();
    let autoFill = JSON.parse(localStorage.getItem('autofill'));

    let domInputs = [];
    document.querySelectorAll('input').forEach(function(node) {
        domInputs.push($(node).attr("name"));
     });


   chrome.runtime.sendMessage({dom: domInputs});
     chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
         console.log(request);
    });

    
    $( document.querySelectorAll("input") ).each(function( i,val ) {
        let filterObj = _.filter(autoFill, function(o) { return o.name.toLowerCase() === val.name.toLowerCase(); });
        if (filterObj.length > 0){
              $(this).val(filterObj[0].value);
              $(this).parent().find('label').addClass('active');
          }
      })
});