!(function () {
    "use strict"; var e = document;
    const $group = new Choices(e.querySelector('#send_to'), { allowHTML: false, searchEnabled: true, placeholder: true, placeholderValue: 'Choose a list or segment', removeItemButton: true, itemSelectText: '', shouldSort: false });
    //.setChoices(async () => {
    //    try {
    //        return await groupData.getData().then(function (data) { return data ? data.map(function (row) { return { value: row.group_id, label: row.name, selected: row.group_id == (o && o.group) ? true : false }; }) : []; });
    //    } catch (err) { console.error(err); }
    //});

    //e.addEventListener("DOMContentLoaded", function (event) {
    //$('.select2').select2({ placeholder: "Choose a list or segment", allowClear: true });
    $('#campaign_date').daterangepicker({ singleDatePicker: true, autoApply: true, locale: { format: "MM/DD/YYYY", } });
    getdata(e);
    //})
    e.querySelector("#is_add_utm").addEventListener("change", (evt) => {
        evt.preventDefault(), evt.stopPropagation();
        if (evt.target.checked) utmPara(e); else e.getElementById("utm_para").replaceChildren();
    });
    function ss(e) {
        $('#campaign_date').daterangepicker({ singleDatePicker: true, autoApply: true, locale: { format: "MM/DD/YYYY", } });
        e.getElementById('campaign_name').value = 'Email Campaign - ' + moment().format('MMM DD YYYY h:mm A');
    }
    function fr(e) {
        let p = e.getElementsByTagName("footer")[0], $a = e.createElement('button', { class: 'btn btn-primary' }, 'Continue to Content');
        p.replaceChildren(), p.append($a), $a.onclick = function () { Post(); }
    }
    function utmPara(e) {
        let p = e.getElementById("utm_para"); p.replaceChildren();
        p.append(e.createElement('div', { class: 'bg-light p-3 rounded' },
            e.createElement('h4', { class: 'card-title mb-3' }, 'Don\'t Use Personal Data'),
            e.createElement('p', {}, 'In order to protect the privacy of your customers, do not use any profile properties that include personal data as custom tracking parameters. Personal data includes things like names, addresses, email addresses, or any similar data, including any sensitive data or “special categories” of data under applicable laws (like sexual orientation, gender identity, religion, race, ethnicity, health data, government ID number, etc.).'),
        ));
        p.append(e.createElement('table', { class: 'table mb-0' },
            e.createElement('thead', {}, e.createElement('tr', {}, e.createElement('th', {}, 'UTM Parameter'), e.createElement('th', {}, 'Campaign Value'))),

            e.createElement('tbody', {},
                e.createElement('tr', {}, e.createElement('td', {}, e.createElement('div', { class: 'form-check' }, e.createElement('input', { class: "form-check-input", type: "checkbox", id: "utm_source", checked: "", disabled: "" }), e.createElement('label', { class: "form-check-label", for: "utm_source" }, 'Source (utm_source)'))),
                    e.createElement('td', {}, e.createElement('input', { type: "text", class: "form-control", id: "utm_source_value", value: "quickfixclay", maxlength: "100" }))
                ),
                e.createElement('tr', {}, e.createElement('td', {}, e.createElement('div', { class: 'form-check' }, e.createElement('input', { class: "form-check-input", type: "checkbox", id: "utm_medium", checked: "", disabled: "" }), e.createElement('label', { class: "form-check-label", for: "utm_medium" }, 'Medium (utm_medium)'))),
                    e.createElement('td', {}, e.createElement('input', { type: "text", class: "form-control", id: "utm_medium_value", value: "campaign", maxlength: "100" }))
                ),
                e.createElement('tr', {}, e.createElement('td', {}, e.createElement('div', { class: 'form-check' }, e.createElement('input', { class: "form-check-input", type: "checkbox", id: "utm_campaign" }), e.createElement('label', { class: "form-check-label", for: "utm_campaign" }, 'Campaign (utm_campaign)'))),
                    e.createElement('td', {}, e.createElement('select', { class: "form-control", id: "utm_campaign_value" }, '<option value="campaign_name">Campaign name</option><option value="campaign_id">Campaign id</option><option value="campaign_name_and_id">Campaign name (Campaign id)</option>'))
                ),
                e.createElement('tr', {}, e.createElement('td', {}, e.createElement('div', { class: 'form-check' }, e.createElement('input', { class: "form-check-input", type: "checkbox", id: "utm_id" }), e.createElement('label', { class: "form-check-label", for: "utm_id" }, 'Id (utm_id)'))),
                    e.createElement('td', {}, e.createElement('select', { class: "form-control", id: "utm_id_value" }, '<option value="campaign_name">Campaign name</option><option value="campaign_id">Campaign id</option><option value="campaign_name_and_id">Campaign name (Campaign id)</option>'))
                ),
                e.createElement('tr', {}, e.createElement('td', {}, e.createElement('div', { class: 'form-check' }, e.createElement('input', { class: "form-check-input", type: "checkbox", id: "utm_term" }), e.createElement('label', { class: "form-check-label", for: "utm_term" }, 'Term (utm_term)'))),
                    e.createElement('td', {}, e.createElement('select', { class: "form-control", id: "utm_term_value" }, '<option value="-">Select</option><option value="campaign_name">Campaign name</option><option value="campaign_id">Campaign id</option><option value="campaign_name_and_id">Campaign name (Campaign id)</option><option value="profile_id">Profile id</option>'))
                )
            )
        ));
    }
    function Post() {
        let j = {
            campaign_id: parseInt(e.getElementById('campaign_name').getAttribute('data-id')) | 0, is_smart_sending: e.getElementById('is_smart_sending').checked,
            campaign_name: e.getElementById('campaign_name').value, campaign_date: e.getElementById('campaign_date').value,
            is_add_utm: e.getElementById('is_add_utm').checked
        };
        j.campaign_date = e.getElementById('campaign_date').value !== '' ? e.getElementById('campaign_date').value : moment().format('MM/DD/YYYY');
        //j.content = {
        //    subject: e.getElementById('subject').value, preview_text: e.getElementById('preview_text').value, from_label: e.getElementById('from_label').value, from_email: e.getElementById('from_email').value, reply_to_email: e.getElementById('reply_to_email').value,
        //    template_id: parseInt(e.getElementById('template').getAttribute('data-id')) | 0
        //};
        j.audiences = { group_ids: $("#send_to").val() };
        if (j.is_add_utm) {
            j.utm_source = e.getElementById('utm_source_value').value, j.utm_medium = e.getElementById('utm_medium_value').value;
            if (e.getElementById('utm_campaign').checked) j.utm_campaign = e.getElementById('utm_campaign_value').value;
            if (e.getElementById('utm_id').checked) j.utm_id = e.getElementById('utm_id_value').value;
            if (e.getElementById('utm_term').checked && e.getElementById('utm_term_value').value != '-') j.utm_term = e.getElementById('utm_term_value').value;
        }
        if (j.campaign_name === '') { swal('Error!', 'Please enter campaign name.', 'error').then(function () { swal.close(); e.getElementById('campaign_name').focus(); }); return false; }
        else if (j.audiences.group_ids.length === 0) { swal('Error!', 'You must select at least one list or segment.', 'error').then(function () { swal.close(); e.getElementById('send_to').focus(); }); return false; }
        else if (j.is_add_utm && j.utm_source === '') { swal('Error!', 'Please enter source (utm_source).', 'error').then(function () { swal.close(); e.getElementById('utm_source_value').focus(); }); return false; }
        else if (j.is_add_utm && j.utm_medium === '') { swal('Error!', 'Please enter medium (utm_medium).', 'error').then(function () { swal.close(); e.getElementById('utm_medium_value').focus(); }); return false; }
        //else if (j.content.subject === '') { swal('Error!', 'Please enter subject line.', 'error').then(function () { swal.close(); e.getElementById('subject').focus(); }); return false; }
        //else if (j.content.from_label === '') { swal('Error!', 'Please enter sender name.', 'error').then(function () { swal.close(); e.getElementById('from_label').focus(); }); return false; }
        //else if (j.content.from_email === '') { swal('Error!', 'Please enter sender email address.', 'error').then(function () { swal.close(); e.getElementById('from_email').focus(); }); return false; }
        //else if (!ValidateEmail(j.content.from_email)) { swal('Error!', 'Please enter valid sender email address.', 'error').then(function () { swal.close(); e.getElementById('from_email').focus(); }); return false; }
        //else if (!ValidateEmail(j.content.reply_to_email) && j.content.reply_to_email !== '') { swal('Error!', 'Please enter valid reply-to email address.', 'error').then(function () { swal.close(); e.getElementById('from_email').focus(); }); return false; }
        //else if (j.content.template_id === 0) { swal('Error!', 'Your changes have been saved. Select a template to continue.', 'error').then(function () { swal.close(); e.getElementById('from_email').focus(); }); return false; }
        else {
            $.post(`/api/campaigns`, j).done(function (result) {
                if (result.status > 0) {
                    window.location = window.location.origin + `/campaigns/${result.id}/content`;
                    //e.getElementById("campaign_name").setAttribute("data-id", result.id);
                    //window.location = window.location.origin + `/campaigns/${result.id}/schedule`;
                }
                else {
                    e.getElementById("campaign_name").setAttribute("data-id", result.id);
                    swal('Info!', result.response, 'info');
                }
                console.log(result);
                //if (data.id > 0) { window.location = window.location.origin + '/emailtemplates/list'; }
            }).fail(function (xhr, status, error) { swal('Error!', xhr.responseJSON.message, 'error'); });
        }
    }
    function getdata(e) {
        let i = parseInt(e.getElementById('campaign_name').getAttribute('data-id')) | 0; console.log(i)
        if (i <= 0) { ss(e), utmPara(e), fr(e); return; }
        else {
            $.ajaxSetup({ async: true });
            $.get(`/api/campaigns/${i}`, {}).done(function (result) {
                e.getElementById('campaign_name').value = result.campaign_name;
                e.getElementById('campaign_date').value = moment(result.campaign_date).format('MM/DD/YYYY');
                e.getElementById('is_smart_sending').checked = result.is_smart_sending;
                console.log(result.audiences.group_ids)
                result.audiences.group_ids.forEach((v, i) => {
                    $group.setChoiceByValue(v.toString());
                });
                //$('#send_to').val(result.audiences.group_ids).trigger('change');
                e.getElementById('is_smart_sending').checked = result.is_add_utm;
                if (!result.is_add_utm) e.getElementById("utm_para").replaceChildren();
                else {
                    utmPara(e);
                    e.getElementById('utm_source_value').value = result.utm_source, e.getElementById('utm_medium_value').value = result.utm_medium;
                    if (result.utm_campaign) e.getElementById('utm_campaign').checked = true, e.getElementById('utm_campaign_value').value = result.utm_campaign;
                    if (result.utm_id) e.getElementById('utm_id').checked = true, e.getElementById('utm_id_value').value = result.utm_id;
                    if (result.utm_term) e.getElementById('utm_term').checked = true, e.getElementById('utm_term_value').value = result.utm_term;
                }

                //e.getElementById('subject').value = result.content.subject;
                //e.getElementById('preview_text').value = result.content.preview_text;
                //e.getElementById('from_label').value = result.content.from_label;
                //e.getElementById('from_email').value = result.content.from_email;
                //e.getElementById('reply_to_email').value = result.content.reply_to_email;
                //(parseInt(result.content.template_id) | 0) > 0 ? st(result.content.template_id) : tp(e);
            }).fail(function (xhr, status, error) { swal('Error!', xhr.responseJSON.message, 'error'); })
                .always(function () { fr(e); });
        }
    }
})();