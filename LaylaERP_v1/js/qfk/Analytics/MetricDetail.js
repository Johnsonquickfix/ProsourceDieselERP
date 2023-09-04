!(function () {
    $(document).ready(function () {
        $('.select2').select2();
        $('#date-range').daterangepicker({
            showDropdowns: true,
            autoApply: true,
            ranges: {
                'Week-to-date': [moment().startOf('week'), moment()],
                'Month-to-date': [moment().startOf('month'), moment()],
                'Year-to-date': [moment().startOf('year'), moment()],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'Last 90 Days': [moment().subtract(90, 'days'), moment()]
            },
            alwaysShowCalendars: true,
            startDate: moment().subtract(29, 'days'),
            endDate: moment()
        }, function (start, end, label) { getdata() });
        $("#metrics,#view-by").change(function (e) { getdata(), loadfeeds(), loadpersons(); });
        createchart(_chart_option), getdata(), loadfeeds(), loadpersons();
        $(document).on('click', 'a.raw-data', function (t) {
            let j = JSON.parse(decodeURIComponent($(this).data('value')));
            $('.raw_data_time').html($(this).data('time') + 'Z');
            $('.raw_data_json').html(JSON.stringify(j, null, 2));
            $('#raw_data_modal').modal('show');

        });
    });
    if (window.sr_chart) window.sr_chart.destroy();

    function getdata() {
        let j = { metric_id: parseInt($("#metrics").val()) || 0, period: $('#view-by').val(), date_from: $('#date-range').data('daterangepicker').startDate.format('MM-DD-YYYY'), date_to: $('#date-range').data('daterangepicker').endDate.format('MM-DD-YYYY') }
        $.ajaxSetup({ headers: { 'Content-Type': 'application/json; charset=utf-8', 'dataType': 'json' } });
        $.get(`/api/analytics/metrics-chart`, j, function (response) {
            sr_chart.updateSeries([{ name: 'Everyone', data: response }]);
        }).fail(function () { swal('Error!', 'something went wrong', 'error'); }).always(function () { $("#loader").hide(); });
    }
    var sr = document.querySelector("#metrics-chart"),
        m = $("#metrics"),
        _chart_option = {
            chart: { height: 360, type: "line", stacked: !0, toolbar: { show: !1, }, zoom: { enabled: !0 } },
            tooltip: { x: { format: 'dd MMM yyyy' }, shared: true, followCursor: true },
            dataLabels: { enabled: !1 }, series: [], legend: { position: "top" }, fill: { opacity: 1 },
            xaxis: { type: 'datetime', labels: { datetimeFormatter: { year: 'yyyy', month: 'MMM \'yy', day: 'dd MMM', hour: 'HH:mm' } } },
            colors: ["#5560b5", "#61c5c8", '#f4a984', '#d658a9', '#8d97e3', '#b0ecde'],
            noData: { text: "Loading...", align: 'center', verticalAlign: 'middle', offsetX: 0, offsetY: 0 },
            yaxis: [{ labels: { formatter: function (val) { return val.toFixed(0); } } }],
            stroke: { curve: "smooth", width: 3 }
        },
        createchart = function (o) {
            sr_chart = new ApexCharts(sr, o); sr_chart.render();
        },
        loadfeeds = function () {
            $('#feeds').DataTable({
                //dom: '<"d-flex justify-content-start"f><"d-flex justify-content-end"l>tip',
                lengthMenu: [[25, 50, 100], [25, 50, 100]], order: [[1, 'desc']],
                destroy: true, bProcessing: true, responsive: false, bServerSide: true, bAutoWidth: true, scrollX: false,
                language: {
                    lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> of _TOTAL_",
                    infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
                },
                sAjaxSource: "/api/analytics/metrics-feeds",
                fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                    aoData.push({ name: "metric_id", value: parseInt(m.val()) || 0 });
                    if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                    oSettings.jqXHR = $.ajax({
                        url: sSource, data: aoData,// dataType: 'json', type: "get", 
                        success: function (data) {
                            let _recordsTotal = data.length > 0 ? data[0].totalcount : 0;
                            return fnCallback({ sEcho: aoData.find(el => el.name === "sEcho").value, recordsTotal: _recordsTotal, recordsFiltered: _recordsTotal, aaData: data });
                        }
                    });
                },
                columns: [
                    {
                        data: 'profile', title: 'Profile', sWidth: "50%", render: function (data, type, row, meta) {
                            return `<div class="d-flex"><div class="me-3"><div class="avatar-xs d-none d-xl-inline-block"><div id="application_avatar" class="avatar-title bg-primary text-primary bg-soft rounded">${data.charAt(0).toUpperCase()}</div></div></div><div class="align-self-center overflow-hidden me-auto"><h5 class="font-size-13 text-truncate mb-1"><a href="javascript: void(0);" class="text-dark">${row.profile}</a></h5><p class="text-muted mb-0">${row.metric_name}</p></div></div>`;
                        }
                    },
                    { data: 'created', title: 'Time', sWidth: "40%", render: function (data, type, row, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    { data: 'created', title: '', orderable: false, sWidth: "10%", class: 'text-center', render: function (data, type, row, meta) { return `<a title="View Raw Data" href="javascript:void(0);" class="mb-0 text-muted raw-data" data-time="${row.created}" data-value='${encodeURIComponent(JSON.stringify(row.properties))}'>Activity details</a>`; } }
                ]
            });
        },
        loadpersons = function () {
            $('#persons').DataTable({
                //dom: '<"d-flex justify-content-start"f><"d-flex justify-content-end"l>tip',
                //lengthMenu: [[25, 50, 100], [25, 50, 100]], order: [[1, 'desc'],[2, 'desc']],
                ordering: false, lengthChange: false,
                destroy: true, bProcessing: true, responsive: false, bServerSide: true, bAutoWidth: true, scrollX: false,
                language: {
                    lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> of _TOTAL_",
                    infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
                },
                sAjaxSource: "/api/analytics/metrics-best-person",
                fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                    aoData.push({ name: "metric_id", value: parseInt(m.val()) || 0 });
                    if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                    oSettings.jqXHR = $.ajax({
                        url: sSource, data: aoData,// dataType: 'json', type: "get", 
                        success: function (data) {
                            let _recordsTotal = data.length > 0 ? data[0].totalcount : 0;
                            return fnCallback({ sEcho: aoData.find(el => el.name === "sEcho").value, recordsTotal: _recordsTotal, recordsFiltered: _recordsTotal, aaData: data });
                        }
                    });
                },
                columns: [
                    {
                        data: 'profile', title: 'Profile', orderable: false, sWidth: "50%", render: function (data, type, row, meta) {
                            return `<div class="d-flex"><div class="me-3"><div class="avatar-xs d-none d-xl-inline-block"><div id="application_avatar" class="avatar-title bg-primary text-primary bg-soft rounded">${data.charAt(0).toUpperCase()}</div></div></div><div class="align-self-center overflow-hidden me-auto"><h5 class="font-size-13 text-truncate mb-1"><a href="javascript: void(0);" class="text-dark">${row.profile}</a></h5><p class="text-muted mb-0">${row.location}</p></div></div>`;
                        }
                    },
                    { data: 'track_count', title: 'Count', orderable: false, sWidth: "10%" },
                    { data: 'track_value', title: 'Value', orderable: false, sWidth: "10%" },
                    //{ data: 'created', title: 'Time', sWidth: "40%", render: function (data, type, row, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    //{ data: 'created', title: '', orderable: false, sWidth: "10%", class: 'text-center', render: function (data, type, row, meta) { return `<a title="View Raw Data" href="javascript:void(0);" class="mb-0 text-muted raw-data" data-time="${row.created}" data-value='${encodeURIComponent(JSON.stringify(row.properties))}'>Activity details</a>`; } }
                ]
            });
        };
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