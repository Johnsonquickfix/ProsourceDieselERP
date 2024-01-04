!(function () {
    $(document).ready(function () {
        //$('.select2').select2();
        new Choices(document.querySelector('#metrics'), { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: `Select a metric…`, itemSelectText: '', shouldSort: false });
        loadActivities();
        $(document).on('change', '#metrics', function () { loadActivities(); });
        $(document).on('click', 'a[data-toggle="collapse"]', function () {
            $(this).siblings("div.collapse").hasClass('show') ? ($(this).html('Details'), $(this).siblings("div.collapse").removeClass('show')) : ($(this).html('Collapse'), $(this).siblings("div.collapse").addClass('show'));
        });
        $(document).on('click', 'a.raw-data', function (t) {
            let j = JSON.parse(decodeURIComponent($(this).data('value')));
            $('.raw_data_time').html($(this).data('time') + 'Z');
            $('.raw_data_json').html(JSON.stringify(j, null, 2));
            $('#raw_data_modal').modal('show');

        });
        $('#matrics-list').DataTable({
            paging: false, info: false, searching: false, ordering: false, scrollCollapse: true,
            scrollY: '40vh'
        });
    });
    var d = document;
    var m = $('#metrics'), feed = $('#activity-feed'),
        loadActivities = function () {
            let _i = parseInt(m.val()) || 0; feed.empty().append('<li class="text-center py-4"><h4>Loging activities....</h4></li>');
            $.get('/api/profiles/activities', { metric_id: _i, profiles_id: m.data('profileid') }, function (data, status, xhr) {
                feed.empty();
                data === null ? feed.append('<li class="text-center py-4"><h4>There\'s no recent activity.</h4></li>') : '';
                $.each(data, function (i, r) {
                    feed.append(fee_template(r));
                });
                //if (data.success) { location.href = `${location.origin}${data.url}`; }
                //else { $("#loader").hide(); swal('Alert!', data.error_msg, 'error'); }
            }).fail(function () { swal('Error!', 'something went wrong', 'error'); }).always(function () { });
        },
        fee_template = function (data) {
            return `<li class="event-list">
                        <div class="event-timeline-dot"><i class="bx bx-right-arrow-circle font-size-18"></i></div>
                        <div class="d-flex justify-content-between">
                            <div class="flex-fill me-3">
                                <h6 class="font-size-14 mb-1">${data.metric_name}</h6>                                
                            </div>
                            <div class="flex-shrink-0 "><a title="View Raw Data" href="javascript:void(0);" class="mb-0 text-muted raw-data" data-time="${data.created}" data-value='${encodeURIComponent(JSON.stringify(data.properties))}'>${moment(data.created).format('MMMM Do YYYY, h:mm A')}</a></div>
                        </div>
                        <div>
                            <div class="collapse mb-2" id="ac-${data.event_id}"><div class="event_properties">${json_template(data.properties)}</div></div>
                            <a data-toggle="collapse" href="javascript:void(0);">Details</a>
                        </div>
                    </li>`;
        },
        json_template = function (data) {
            let _h = '';
            $.each(data, function (key, value) {
                let _k = key.replace(/([a-z$])([A-Z$])/g, '$1 $2').replace('$', '').replace(new RegExp(/(^\w|\s\w)/g), (m) => m.toUpperCase());
                if (value.constructor === Object) _h += `<div class="event_property"><strong>${_k}</strong>: <span title="${JSON.stringify(value)}">${JSON.stringify(value, null, 2)}</span></div>`;
                else if (value.constructor === Array) {
                    _h += `<div class="event_property"><strong>${_k}</strong>: <span title="${JSON.stringify(value)}">${value.toString()}</span></div>`;
                }
                else if (isURL(value)) {
                    _h += `<div class="event_property"><strong>${_k}</strong>: <a target="_blank" href="${value}">${value.toString()}</a></div>`;
                }
                else {
                    _h += `<div class="event_property"><strong>${_k}</strong>: <span title="${value}">${value}</span></div>`;
                }
                //if (value instanceof String) _h += `<div class="event_property"><strong>${key}</strong>: <span title="${value}">${value}</span></div>`;
                //else if (value instanceof Number) _h += `<div class="event_property"><strong>${key}</strong>: <span title="${value}">${value}</span></div>`;
                //else if (value instanceof Array) {
                //    _h += `<div class="event_property"><strong>${key}</strong>: <span title="${JSON.stringify(value)}">${JSON.stringify(value, null, 2)}</span></div>`;
                //}
                //else {
                //    _h += `<div class="event_property"><strong>${key}</strong>: <span title="${JSON.stringify(value)}">${JSON.stringify(value, null, 2)}</span></div>`;
                //}
            });
            return _h;
        };

    function isURL(str) {
        var regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        if (!regex.test(str)) { return false; } else { return true; }
    }
    d.querySelector('#add-custom-property').addEventListener('click', function (evt) {
        evt.preventDefault(), evt.stopPropagation();
        var html = '<div class="modal-header">' +
            '<h5 class="modal-title" id="exampleModalLabel">Add custom profile property</h5>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>Enter a profile property name and value. We will automatically convert numbers and other data types.</p>' +
            '<div class="row">' +
            '<div class="form-group col-md-6"><label>Property name <span style="color:red">*</span></label><input type="text" class="form-control" id="meta_key"></div>' +
            '<div class="form-group col-md-6"><label>Value <span style="color:red">*</span></label><input type="text" class="form-control" id="meta_value"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer"></div>';
        setModalContent(html);
        let p = d.querySelector("#modalEdit .modal-footer"), btn = d.createElement('button', { "type": "button", "class": "btn btn-dark" }, 'Add profile property');
        p.replaceChildren();
        p.append(d.createElement('button', { "type": "button", "class": "btn btn-outline-dark", "data-bs-dismiss": "modal" }, 'Close'), btn);
        btn.addEventListener('click', function (evt) {
            let _j = { profile_id: d.querySelector("#metrics").getAttribute('data-profileid') || '', meta_key: d.querySelector("#modalEdit #meta_key").value, meta_value: d.querySelector("#modalEdit #meta_value").value };
            let requestOptions = { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_j) };
            fetch('/api/profiles/add-custom-property', requestOptions).then(response => response.json())
                .then(result => {
                    if (result.status) location.reload();
                    else swal('Info!', 'Invalid details.', 'info');
                }).catch(error => { swal('Error!', error, 'error'); });
        });
    });
    d.querySelectorAll('[name="menu-option-edit-value"]').forEach(ele => {
        ele.addEventListener('click', function (ev) {
            var html = '<div class="modal-header">' +
                '<h5 class="modal-title" id="exampleModalLabel">Edit Property</h5>' +
                '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<p>This will update the value for the custom property Engine Type for this specific profile.</p>' +
                '<div class="row"><div class="form-group col-md-12"><h5>Value </h5> <input type="text" class="form-control" id="meta_value" value=\'' + ev.target.getAttribute('data-value') + '\'></div></div>' +
                '</div>' +
                '</div>' +
                '<div class="modal-footer"><button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Close</button><button type="button" class="btn btn-dark">Update</button></div>';
            setModalContent(html);
            let p = d.querySelector("#modalEdit .modal-footer"), btn = d.createElement('button', { "type": "button", "class": "btn btn-dark" }, 'Add profile property');
            p.replaceChildren();
            p.append(d.createElement('button', { "type": "button", "class": "btn btn-outline-dark", "data-bs-dismiss": "modal" }, 'Close'), btn);
            btn.addEventListener('click', function (evt) {
                let _j = { profile_id: d.querySelector("#metrics").getAttribute('data-profileid') || '', meta_key: ev.target.getAttribute('data-key'), meta_value: d.querySelector("#modalEdit #meta_value").value };
                let requestOptions = { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_j) };
                fetch('/api/profiles/add-custom-property', requestOptions).then(response => response.json())
                    .then(result => {
                        if (result.status) location.reload(); else swal('Info!', 'Invalid details.', 'info');
                    }).catch(error => { swal('Error!', error, 'error'); });
            });
        });
    });
    d.querySelectorAll('[name="menu-option-view"]').forEach(ele => {
        ele.addEventListener('click', function (ev) {
            var html = '<div class="modal-header">' +
                '<h5 class="modal-title" id="exampleModalLabel">View Property</h5>' +
                '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                '</div>' +
                '<div class="modal-body">' +
                `<div class="row row mb-2"><div class="form-group col-md-12"><h5>Property </h5> ${ev.target.getAttribute('data-key')}</div></div>` +
                `<div class="row"><div class="form-group col-md-12"><h5>Value </h5> ${ev.target.getAttribute('data-value')}</div></div>` +
                '</div>' +
                '</div>' +
                '<div class="modal-footer"><button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Close</button></div>';
            setModalContent(html);
        });
    });
    d.querySelectorAll('[name="menu-option-delete"]').forEach(ele => {
        ele.addEventListener('click', function (ev) {
            var html = '<div class="modal-header">' +
                '<h5 class="modal-title" id="exampleModalLabel">Delete Property</h5>' +
                '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<p>You are about to delete the custom property Engine Type for this profile. Note: This will only remove the custom property for this specific profile. It will not delete the custom property entirely. Are you sure?</p>' +
                '</div>' +
                '</div>' +
                '<div class="modal-footer"></div>';
            setModalContent(html);
            let p = d.querySelector("#modalEdit .modal-footer"), btn = d.createElement('button', { "type": "button", "class": "btn btn-danger" }, 'Delete');
            p.replaceChildren();
            p.append(d.createElement('button', { "type": "button", "class": "btn btn-outline-dark", "data-bs-dismiss": "modal" }, 'Close'), btn);
            btn.addEventListener('click', function (evt) {
                let _j = { profile_id: d.querySelector("#metrics").getAttribute('data-profileid') || '', id: ev.target.getAttribute('data-id') };
                let requestOptions = { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_j) };
                fetch('/api/profiles/delete-custom-property', requestOptions).then(response => response.json())
                    .then(result => {
                        if (result.status) location.reload(); else swal('Info!', 'Invalid details.', 'info');
                    }).catch(error => { swal('Error!', error, 'error'); });
            });
        });
    })
    function setModalContent(html) {
        if (d.getElementById('modalEdit')) d.getElementById('modalEdit').remove();
        initModal().querySelector('.modal-content').innerHTML = html;
        let _m = d.getElementById('modalEdit');
        // Show the modal.
        jQuery(_m).modal('show');
    }
    function initModal() {
        var modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.setAttribute('id', 'modalEdit');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'exampleModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = '<div class="modal-dialog" role="document"><div class="modal-content"></div></div>';
        document.body.appendChild(modal);
        return modal;
    }
})();

//$(document).ready(function () {
//    $('.select2').select2();
//    loadActivities();
//});

//function loadActivities() {
//    let _i = parseInt($('#metrics').val()) || 0;
//    $.get('/api/profiles/activities', { metric_id: _i, profiles_id: $('#metrics').data('profileid') }, function (data, status, xhr) {
//        console.log(data);
//        //if (data.success) { location.href = `${location.origin}${data.url}`; }
//        //else { $("#loader").hide(); swal('Alert!', data.error_msg, 'error'); }
//    }).fail(function () { swal('Error!', 'something went wrong', 'error'); }).always(function () { });
//};