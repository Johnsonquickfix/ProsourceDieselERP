!(function () {
    $(document).ready(function () {
        $('.select2').select2();
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

                if (value.constructor === Object) _h += `<div class="event_property"><strong>${key}</strong>: <span title="${JSON.stringify(value)}">${JSON.stringify(value, null, 2)}</span></div>`;
                else if (value.constructor === Array) {
                    _h += `<div class="event_property"><strong>${key}</strong>: <span title="${JSON.stringify(value)}">${value.toString()}</span></div>`;
                }
                else if (isURL(value)) {
                    console.log(key, value, isURL(value))
                    _h += `<div class="event_property"><strong>${key}</strong>: <a target="_blank" href="${value}">${value.toString()}</a></div>`;
                }
                else {
                    _h += `<div class="event_property"><strong>${key}</strong>: <span title="${value}">${value}</span></div>`;
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