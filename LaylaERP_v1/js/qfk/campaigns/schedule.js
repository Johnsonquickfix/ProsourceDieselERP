!(function () {
    "use strict";
    const e = document,
        times = function () {
            var timeStops = [], startTime = moment().startOf('day'), endTime = moment().endOf('day'), el = e.querySelector("#schedule_time");
            el.replaceChildren(e.createElement('option', { value: '-' }, 'Select time'));
            while (startTime <= endTime) { let t = new moment(startTime).format('hh:mm a'); el.append(e.createElement('option', { value: t }, t)), startTime.add(15, 'm'); }
        },
        validateDate = function () {
            let _d = e.querySelector("#schedule_date").value, _t = e.querySelector("#schedule_time").value, nf = e.querySelector("#notification"),
                f = e.querySelector(".modal-footer"), cb = e.createElement('button', { class: 'btn btn-danger', 'data-bs-dismiss': 'modal' }, 'Cancel');
            f.replaceChildren(cb);
            if (_t === '-') _t = '';
            if (moment(`${_d} ${_t}`, 'MMM DD, YYYY hh:mm a') <= moment()) nf.replaceChildren(e.createElement('div', { class: 'alert alert-warning ' }, '<i class="mdi mdi-alert-outline me-2"></i>The selected time has passed in some timezones.'));
            else {
                nf.replaceChildren()
                let b = e.createElement('button', { id: 'send', class: 'btn btn-primary float-end' }, 'Schedule');
                f.append(b), b.onclick = function () { startCampaign(); }
            }
        };
    e.querySelector("#schedule-send")?.addEventListener("click", (evt) => {
        evt.preventDefault(), evt.stopPropagation(), times();
        $('#schedule_time').select2({ dropdownParent: $("#raw_data_modal"), placeholder: "Choose time" });
        $('#schedule_date').daterangepicker({ minDate: moment(), singleDatePicker: true, autoApply: true, locale: { format: "MMM DD, YYYY", } }, function (start, end) { validateDate(); });
        $(`#raw_data_modal`).modal('show'), validateDate();
    });
    e.querySelectorAll("[name=btnsendday]")?.forEach(box => {
        box.addEventListener("change", (evt) => {
            evt.preventDefault(), evt.stopPropagation(); let div = e.getElementById("div_schedule_date");
            let f = e.querySelector(".modal-footer"), nf = e.querySelector("#notification"), cb = e.createElement('button', { class: 'btn btn-danger', 'data-bs-dismiss': 'modal' }, 'Cancel');
            nf.replaceChildren(), f.replaceChildren(cb);
            if (evt.target.value === 'scheduled') {
                div.replaceChildren(e.createElement('label', { for: "formrow-firstname-input", class: "form-label" }, 'Choose send time'));
                let cr = e.createElement('div', { class: "row" },
                    e.createElement('div', { class: "col-md-4" }, e.createElement('div', { class: "input-group" }, e.createElement('div', { class: "input-group" },
                        e.createElement('div', { class: "input-group-text" }, '<i class="mdi mdi-calendar"></i>'),
                        e.createElement('input', { type: "text", class: "form-control", id: "schedule_date", placeholder: "Date" })
                    ))),
                    e.createElement('div', { class: "col-md-8" }, e.createElement('select', { id: "schedule_time", class: "select2", style: "width:100%" }))
                );
                div.appendChild(cr), times();
                $('#schedule_time').select2({ dropdownParent: $("#raw_data_modal"), placeholder: "Choose time" });
                $('#schedule_date').daterangepicker({ minDate: moment(), singleDatePicker: true, autoApply: true, locale: { format: "MMM DD, YYYY", } }, function (start, end) { validateDate(); });
                $('#schedule_time').on('select2:select', function (evt) { evt.preventDefault(), evt.stopPropagation(), validateDate(); });
            }
            else {
                div.replaceChildren(); let b = e.createElement('button', { id: 'send', class: 'btn btn-primary float-end' }, 'Schedule');
                f.append(b), b.onclick = function () { startCampaign(); }
            }

            //div.style.display = (evt.target.value === 'scheduled' ? 'block' : 'none');
            //e.querySelector("#schedule_date").disabled = (evt.target.value === 'scheduled' ? false : true);
            //e.querySelector("#schedule_time").disabled = (evt.target.value === 'scheduled' ? false : true);
        });
    });
    $('#schedule_time').on('select2:select', function (evt) { evt.preventDefault(), evt.stopPropagation(), validateDate(); });
    function startCampaign() {
        let action = e.querySelector("[name=btnsendday]:checked").value;
        let j = { campaign_id: parseInt(e.getElementById('recipients').getAttribute('campaign')) | 0, action: action };
        if (action === 'scheduled') {
            let _d = e.querySelector("#schedule_date").value, _t = (e.querySelector("#schedule_time").value !== '-' ? e.querySelector("#schedule_time").value : '');
            j.campaign_send_time = moment(`${_d} ${_t}`, 'MMM DD, YYYY hh:mm a');
        }
        else j.campaign_send_time = moment();

        if (j.campaign_id === 0) { swal('Error!', 'Invalid campaign.', 'error').then(function () { swal.close(); }); return false; }
        else {
            //console.log(j);
            $.ajax({
                type: 'PUT', url: '/api/campaigns',
                contentType: "application/json",
                data: JSON.stringify(j),
                success: function (result) {
                    if (result.status > 0) {
                        if (action === 'scheduled') window.location = window.location.origin + `/campaigns/${result.id}/sent`;
                        else window.location = window.location.origin + `/campaigns/list`;
                    }
                    else { swal('Info!', result.response, 'info'); }
                },
                error: function (jqXHR, exception) { swal('Error!', jqXHR.responseJSON.message, 'error'); }
            });
        }
    }
    var g = function () {
        let p = e.getElementById("recipients"), $a = e.createElement('button', { class: 'btn btn-light btn-sm' }, 'Change Template');
        let c = p.getAttribute('campaign'), ids = p.getAttribute('values');

        p.replaceChildren(), p.append(e.createElement('div', { class: 'flex-shrink-0 me-3' },
            e.createElement('div', { class: 'avatar-xs' },
                e.createElement('div', { class: 'avatar-title rounded-circle bg-light text-primary' }, e.createElement('i', { class: 'mdi mdi-check-bold' }))
            )
        ));
        let $d = e.createElement('div', { class: 'flex-grow-1' },
            e.createElement('h5', { class: 'font-size-14 mb-1' }, 'Recipients', e.createElement('a', { class: 'btn btn-primary float-end', href: `/campaigns/create/${c}` }, 'Edit'))
        )
        p.append($d); let $r = e.createElement('p', { class: 'text-muted mb-1' }, 'This will send to ');
        $.ajaxSetup({ async: true });
        $.get(`/api/lists/member_count/`, { ids: ids }).done(function (result) {
            let a1 = [], a2 = 0, a3 = '';
            $.each(result, function (i, r) { a2 += r.counts, a1.push(r.name); });
            $r.append(a1.length > 1 ? `${a1.slice(0, -1).join(', ')} and ${a1.slice(-1)}` : { 0: '', 1: a1[0] }[a1.length]);
            $d.append($r); $d.append(e.createElement('p', { class: 'text-muted' }, `Estimated ${a2} total recipients.`));
        });
    },
        resetCssClasses = function (e) {
            var t = document.querySelectorAll("button");
            Array.prototype.forEach.call(t, function (e) { e.classList.remove("active") }), e.target.classList.add("active")
        };
    g();

    //$(document).ready(function () {

    //    //$('.select2').select2({ placeholder: "Choose a list or segment", allowClear: true });
    //    //$('#campaign_date').daterangepicker({ singleDatePicker: true, autoApply: true, locale: { format: "MM/DD/YYYY", } });
    //    //fr(e), getdata();//ss(),
    //    //$(document).on('click', '#update-name', function (evt) {
    //    //    evt.preventDefault(), evt.stopPropagation();
    //    //    let _id = parseInt($(this).data('id')) || 0;
    //    //    selectTemplate(_id)
    //    //});
    // });

    //document.querySelector("#one_month").addEventListener("click", function (e) {
    //    resetCssClasses(e),
    //        chart.updateOptions({
    //            xaxis: {
    //                min: new Date("28 Jan 2013").getTime(),
    //                max: new Date("27 Feb 2013").getTime()
    //            }
    //        })
    //}),
    //    document.querySelector("#six_months").addEventListener("click", function (e) {
    //        resetCssClasses(e),
    //            chart.updateOptions({
    //                xaxis: {
    //                    min: new Date("27 Sep 2012").getTime(),
    //                    max: new Date("27 Feb 2013").getTime()
    //                }
    //            })
    //    }),
    //    document.querySelector("#one_year").addEventListener("click", function (e) {
    //        resetCssClasses(e),
    //            chart.updateOptions({
    //                xaxis: {
    //                    min: new Date("27 Feb 2012").getTime(),
    //                    max: new Date("27 Feb 2013").getTime()
    //                }
    //            })
    //    }),
    //    document.querySelector("#all").addEventListener("click", function (e) {
    //        resetCssClasses(e),
    //            chart.updateOptions({
    //                xaxis: {
    //                    min: void 0,
    //                    max: void 0
    //                }
    //            })
    //    });

})();