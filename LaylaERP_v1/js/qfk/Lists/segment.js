!(function (r) {
    "use strict";
    $(document).ready(function () {
        //renderSelect();
        //$(document).on('change', 'select[name="type"]', function (evt) {
        //    evt.preventDefault(), evt.stopPropagation(); addFilter(this);
        //});
        $(document).on('click', '[name="add-definition"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), $(this).prop('disabled', true); addDefinition();
        });
        $(document).on('click', '[name="or-definition"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), addOrDefinition(this);
        });
        $(document).on('click', '[name="remove-definition"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), removeDefinition(this);
        });
        $(document).on('click', '[name="add-filter-row"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), addFilterRow(this);
        });
        $(document).on('click', '[name="close-filter-row"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), removeFilterRow(this);
        });
        $(document).on('change', '[name="timeframe"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), addTimeFrame(this);
        });
        $(document).on('click', '#create-Segments', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), postDetails(this);
        });
    });
    const L = [{ value: 'customer-group-membership', name: 'If someone is in or not in a list' }, { value: 'customer-exclusion', name: 'If someone is or is not suppressed for email' }, { value: 'customer-location', name: 'If someone is or is not within the country' }];
    const U = [{ value: 'hour', name: 'hours' }, { value: 'day', name: 'days', select: true }, { value: 'week', name: 'weeks' }];
    const T = [{ value: 'in-the-last', name: 'in the last', select: true }, { value: 'more-than', name: 'more than' }, { value: 'at-least', name: 'at least' }, { value: 'between', name: 'between' }, { value: 'before', name: 'before' }, { value: 'after', name: 'after' }, { value: 'between-static', name: 'between dates' }];
    const O = [{ value: 'eq', name: 'is', select: true }, { value: 'neq', name: 'is not' }];
    var dr = '.definition-row', dc = '.definition-col', dcfr = '.FilterRowContainer',
        renderSelect = function () { $('.select2').select2({ minimumResultsForSearch: -1 }); $('.select2-search').select2(); },
        addDefinition = function () {
            r = document;
            let _condition = r.createElement('select', { name: "type", class: "form-select", style: "width:100%" }, '<option value="" selected>Select a condition…</option>');
            var p = r.getElementById("definition"), d = r.createElement('div', { class: 'definition__container mb-2', },
                r.createElement('div', { class: 'card card-body mb-2' },
                    r.createElement('div', { class: 'definition-row d-flex' },
                        r.createElement('div', { class: 'definition-col flex-grow-1' },
                            r.createElement('div', { class: 'CriterionTypeSelectm cw-400 mb-2' },
                                _condition
                            )
                        ),
                        r.createElement('div', { class: 'definition-col-action' }, r.createElement('button', { name: "remove-definition", class: 'btn btn-outline-primary waves-effect waves-light' }, '<i class="fa fa-trash"></i>')),
                    )
                ),
                r.createElement('button', { name: 'add-definition', class: 'btn btn-outline-primary waves-effect waves-light' }, '<i class="fa fa-plus"></i> AND')
            );
            p.append(d);
            //$(d).find('[name="type"]').select2({ minimumResultsForSearch: -1 });

            let requestOptions = { method: 'GET', headers: {} };
            fetch("/api/lists/criteria/type", requestOptions).then(response => response.json())
                .then(result => {
                    for (var key in result) { _condition.appendChild(r.createElement('option', { 'value': key }, result[key])); }
                }).catch(error => console.log('error', error));

            _condition.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); addFilter(this); });
        },
        removeDefinition = function (c) {
            let r = document, t = $(c).closest('.definition__container'), i = t.find('.definition-row').index($(c).closest('.definition-row'));
            t.find('div.CriterionDivider').eq(i > 0 ? i - 1 : i).remove();
            if (t.find('.definition-row').length <= 1) t.remove(); else $(c).closest('.definition-row').remove();
            if ($('#definition .definition__container').length <= 0) addDefinition();
            $(t).find('[name="or-definition"]').remove();
            $(t).find('.definition-col-action').last().append(r.createElement('button', { name: 'or-definition', class: 'btn btn-outline-primary' }, 'OR'))
            $('[name="add-definition"]').last().prop('disabled', false);
        },
        addOrDefinition = function (c) {
            let r = document, pr = c.closest('.definition__container .card-body'); c.remove();
            var p = r.getElementById("definition"), d = r.createElement('div', { class: 'definition-row d-flex' },
                r.createElement('div', { class: 'definition-col flex-grow-1' },
                    r.createElement('div', { class: 'CriterionTypeSelectm cw-400 mb-2' },
                        r.createElement('select', { name: "type", class: "select2", style: "width:100%" }, '<option value="" selected>Select a condition…</option>')
                    )
                ),
                r.createElement('div', { class: 'definition-col-action' }, r.createElement('button', { name: "remove-definition", class: 'btn btn-outline-primary waves-effect waves-light' }, '<i class="fa fa-trash"></i>'))
            );
            pr.append(
                r.createElement('div', { class: 'CriterionDivider' },
                    r.createElement('div', { class: 'BoxedPlaceholder__Container me-3' }, r.createElement('div', null, 'OR')),
                    r.createElement('div', { class: 'CriterionDivider__LineContainer flex-grow-1' }, r.createElement('div'), r.createElement('div'))
                )
            );
            pr.append(d);
            let t = $(d).find('[name="type"]'); t.select2({ minimumResultsForSearch: -1 });
            for (var l in L) { t.append(`<option value="${L[l].value}">${L[l].name}</option>`); }
        },
        addFilter = function (t) {
            let r = document, v = t.value, d = t.closest(dc), pr = t.closest('.definition__container');
            d.querySelectorAll('div:nth-child(n+2)').forEach(e => e.remove());
            if (v === 'customer-statistic-value') {
                let _metric = r.createElement('select', { name: "statistic", class: "select2", style: "width:100%" }, '<option value="" selected>Choose metric...</option>'),
                    _operator = r.createElement('select', { name: "operator", class: "select2", style: "width:100%" });

                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        r.createElement('div', { class: "fix-label" }, '<h6>Has</h6>'),
                        r.createElement('div', { class: "cw-175" }, _metric),
                        r.createElement('div', { class: "cw-175" }, _operator),
                        r.createElement('div', { class: "fix-label" }, '<h6>in</h6>'),
                        r.createElement('div', { class: "cw-300" }, r.createElement('select', { name: "group", class: "form-control select2", style: "width:100%", required: '' }, '<option selected=""></option>')),
                    )
                );
                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        r.createElement('button', { name: "add-filter-row", class: "btn btn-outline-primary", style: "margin-left: 52px; grid-column: span 1 / auto;" }, '<i class="fas fa-filter"></i> By Date Added')
                    )
                );
                getMetrics(_metric); $(d).find('[name="statistic"]').select2({ minimumResultsForSearch: 0 });
                getOperator(_operator, v); $(d).find('[name="operator"]').select2({ minimumResultsForSearch: -1 });
                //getLists($(d).find('[name="group"]'));
                //$(d).find('[name="operator"]').select2({ minimumResultsForSearch: -1 }); $(d).find('[name="group"]').select2({ placeholder: "Choose a list.." });
            }
            else if (v === 'customer-group-membership') {
                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        r.createElement('div', { class: "fix-label" }, '<h6>Person</h6>'),
                        r.createElement('div', { class: "cw-175" }, r.createElement('select', { name: "operator", class: "select2", style: "width:100%" }, fillSelect(O))),
                        r.createElement('div', { class: "fix-label" }, '<h6>in</h6>'),
                        r.createElement('div', { class: "cw-300" }, r.createElement('select', { name: "group", class: "form-control select2", style: "width:100%", required: '' }, '<option selected=""></option>')),
                    )
                );
                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        r.createElement('button', { name: "add-filter-row", class: "btn btn-outline-primary", style: "margin-left: 52px; grid-column: span 1 / auto;" }, '<i class="fas fa-filter"></i> By Date Added')
                    )
                );
                getLists($(d).find('[name="group"]'));
                $(d).find('[name="operator"]').select2({ minimumResultsForSearch: -1 }); $(d).find('[name="group"]').select2({ placeholder: "Choose a list.." });
            }
            else if (v === 'customer-exclusion') {
                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        r.createElement('div', { class: "fix-label" }, '<h6>Person</h6>'),
                        r.createElement('div', { class: "cw-175" }, r.createElement('select', { name: "operator", class: "select2", style: "width:100%" }, fillSelect(O))),
                        r.createElement('div', { class: "fix-label" }, '<h6>suppressed</h6>')
                    )
                );
                $(d).find('[name="operator"]').select2({ minimumResultsForSearch: -1 });
            }
            else if (v === 'customer-location') {
                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        r.createElement('div', { class: "fix-label" }, '<h6>Location</h6>'),
                        r.createElement('div', { class: "cw-175" }, r.createElement('select', { name: "operator", class: "select2", style: "width:100%" }, fillSelect(O))),
                        r.createElement('div', { class: "fix-label" }, '<h6>within</h6>'),
                        r.createElement('div', { class: "cw-300" }, r.createElement('select', { name: "country", class: "select2", style: "width:100%" }, '<option value=""></option>'))
                    )
                );
                getCountries($(d).find('[name="country"]'));
                $(d).find('[name="operator"]').select2({ minimumResultsForSearch: -1 }); $(d).find('[name="country"]').select2({ placeholder: "Choose a country..." });
            }
            pr.querySelectorAll('button[name="or-definition"]').forEach(e => e.remove());
            $(pr).find('.definition-col-action').last().append(r.createElement('button', { name: 'or-definition', class: 'btn btn-outline-primary' }, 'OR'))
        },
        addTimeFrame = function (t) {
            let r = document, v = t.value, d = t.closest('[data-filterid="filter-row"]');
            d.querySelectorAll('div:nth-child(n+3)').forEach(e => e.remove());
            if (v === 'in-the-last') {
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "quantity", class: "form-control", type: "number", value: "30" })));
                d.append(r.createElement('div', { class: 'InputContainer cw-80', }, r.createElement('select', { name: "units", class: "select2", style: "width:100%" }, fillSelect(U))));
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));
                $(d).find('[name="units"]').select2({ minimumResultsForSearch: -1 });
            }
            else if (v === 'more-than' || v === 'at-least') {
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "quantity", class: "form-control", type: "number", value: "30" })));
                d.append(r.createElement('div', { class: 'InputContainer cw-80', }, r.createElement('select', { name: "units", class: "select2", style: "width:100%" }, fillSelect(U))));
                d.append(r.createElement('div', { class: 'fix-label', }, '<h6>ago</h6>'));
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));
                $(d).find('[name="units"]').select2({ minimumResultsForSearch: -1 });
            }
            else if (v === 'between') {
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "start_quantity", class: "form-control", type: "number", value: "0" })));
                d.append(r.createElement('div', { class: 'fix-label', }, '<h6>and</h6>'));
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "end_quantity", class: "form-control", type: "number", value: "30" })));
                d.append(r.createElement('div', { class: 'InputContainer cw-80', }, r.createElement('select', { name: "units", class: "select2", style: "width:100%" }, fillSelect(U))));
                d.append(r.createElement('div', { class: 'fix-label', }, '<h6>ago</h6>'));
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));
                $(d).find('[name="units"]').select2({ minimumResultsForSearch: -1 });
            }
            else if (v === 'before' || v === 'after') {
                d.append(r.createElement('div', { class: 'fix-label', }, r.createElement('input', { name: "date", class: "form-control", type: "text", value: moment().format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));
                $(d).find('[name="date"]').inputmask("mm/dd/yyyy");
            }
            else if (v === 'between-static') {
                d.append(r.createElement('div', { class: 'fix-label', }, r.createElement('input', { name: "start_date", class: "form-control", type: "text", value: moment().subtract(1, "days").format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
                d.append(r.createElement('div', { class: 'fix-label', }, '<h6>and</h6>'));
                d.append(r.createElement('div', { class: 'fix-label', }, r.createElement('input', { name: "end_date", class: "form-control", type: "text", value: moment().format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));
                $(d).find('[name="start_date"],[name="end_date"]').inputmask("mm/dd/yyyy");
            }
        },
        addFilterRow = function (t) {
            let r = document, $div = t.closest(dc); t.closest('div').remove();
            let c = r.createElement('div', { "data-filterid": "filter-row", class: 'FilterRowContainer d-flex mb-2', style: "margin-left: 52px;" },
                r.createElement('div', { class: 'fix-label', }, '<h6>and was added</h6>'),
                r.createElement('div', { class: 'InputContainer cw-175', }, r.createElement('select', { name: "timeframe", class: "select2", style: "width:100%" }, fillSelect(T))),
                r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "quantity", class: "form-control", type: "number", value: "30" })),
                r.createElement('div', { class: 'InputContainer cw-80', }, r.createElement('select', { name: "units", class: "select2", style: "width:100%" }, fillSelect(U))),
                r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X'))
            );
            $(c).find('.select2').select2({ minimumResultsForSearch: -1 });
            $div.append(c);
        },
        removeFilterRow = function (t) {
            let r = document, d = t.closest('.definition-col');
            t.closest('[data-filterid="filter-row"]').remove();
            d.append(
                r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                    r.createElement('button', { name: "add-filter-row", class: "btn btn-outline-primary", style: "margin-left: 52px; grid-column: span 1 / auto;" }, '<i class="fas fa-filter"></i> By Date Added')
                )
            );
        },
        fillSelect = function (d) {
            let _ = '';
            for (var i in d) { _ += `<option value="${d[i].value}" ${d[i].select ? 'selected' : ''}>${d[i].name}</option>`; }
            return _;
        },
        getMetrics = function (ctr) {
            let requestOptions = { method: 'GET', headers: {} };
            fetch("/api/lists/metrics", requestOptions).then(response => response.json())
                .then(result => {
                    for (var i in result) { ctr.appendChild(r.createElement('option', { 'value': result[i].metric_id }, result[i].metric_name)); }
                }).catch(error => console.log('error', error));


            //$.get(`/api/lists/static-group`, {}).done(function (result) {
            //    for (var i in result) { c.append(`<option value="${result[i].group_id}">${result[i].name}</option>`); }
            //});
        },
        getOperator = function (ctr, type) {
            let requestOptions = { method: 'GET', headers: {} };
            fetch(`/api/lists/criteria/operator/${type}`, requestOptions).then(response => response.json())
                .then(result => {
                    console.log(type, result)
                    for (var key in result) { ctr.appendChild(r.createElement('option', { 'value': key }, result[key])); }
                }).catch(error => console.log('error', error));
        },
        getLists = function (c) {
            $.get(`/api/lists/static-group`, {}).done(function (result) {
                for (var i in result) { c.append(`<option value="${result[i].group_id}">${result[i].name}</option>`); }
            });
        },
        getCountries = function (c) {
            $.get(`/api/lists/countries`, {}).done(function (result) {
                for (var i in result) { c.append(`<option value="${result[i].code}">${result[i].name}</option>`); }
            });
        },
        postDetails = function (t) {
            let s = !0, z = $(t).data('company-key'), _definition = [], _o = { list_id: parseInt($(t).data('id')) || 0, list_name: $('#txtlist-name').val(), group_type_id: 2 };
            document.querySelectorAll('.definition__container').forEach(e => {
                let c = { criteria: [] };
                e.querySelectorAll('.definition-row').forEach(r => {
                    let sc = { type: r.querySelector('[name="type"]').value, operator: r.querySelector('[name="operator"]').value };
                    r.querySelector('[name="group"]') ? sc.group = parseInt(r.querySelector('[name="group"]').value) || 0 : void 0;
                    r.querySelector('[name="country"]') ? sc.country_id = r.querySelector('[name="country"]').value : void 0;
                    if (sc.group === 0 && !sc.group) { swal('Error!', 'Please select list.', 'error').then(function () { swal.close(); r.querySelector('[name="group"]').focus(); }); return s = !1, false; }
                    if (sc.country_id === '' && !sc.country_id) { swal('Error!', 'Please select country.', 'error').then(function () { swal.close(); r.querySelector('[name="country"]').focus(); }); return s = !1, false; }
                    if (r.querySelector('[name="timeframe"]')) {
                        sc.timeframe = r.querySelector('[name="timeframe"]').value, sc.timeframeOptions = {};
                        r.querySelector('[name="quantity"]') ? sc.timeframeOptions.quantity = parseInt(r.querySelector('[name="quantity"]').value) || 0 : void 0;
                        r.querySelector('[name="start_quantity"]') ? sc.timeframeOptions.start = parseInt(r.querySelector('[name="start_quantity"]').value) || 0 : void 0;
                        r.querySelector('[name="end_quantity"]') ? sc.timeframeOptions.end = parseInt(r.querySelector('[name="end_quantity"]').value) || 0 : void 0;
                        r.querySelector('[name="units"]') ? sc.timeframeOptions.units = r.querySelector('[name="units"]').value : void 0;
                        r.querySelector('[name="date"]') ? sc.timeframeOptions.value = r.querySelector('[name="date"]').value : void 0;
                        r.querySelector('[name="start_date"]') ? sc.timeframeOptions.start = r.querySelector('[name="start_date"]').value : void 0;
                        r.querySelector('[name="end_date"]') ? sc.timeframeOptions.end = r.querySelector('[name="end_date"]').value : void 0;

                        if (sc.timeframeOptions.value === '' && !sc.timeframeOptions.value) { swal('Error!', 'Please enter date.', 'error').then(function () { swal.close(); r.querySelector('[name="date"]').focus(); }); return s = !1, false; }
                        if (sc.timeframeOptions.start === '' && !sc.timeframeOptions.start && sc.timeframe === 'between-static') { swal('Error!', 'Please enter date.', 'error').then(function () { swal.close(); r.querySelector('[name="start_date"]').focus(); }); return s = !1, false; }
                        if (sc.timeframeOptions.end === '' && !sc.timeframeOptions.end && sc.timeframe === 'between-static') { swal('Error!', 'Please enter date.', 'error').then(function () { swal.close(); r.querySelector('[name="end_date"]').focus(); }); return s = !1, false; }
                    }
                    c.criteria.push(sc);

                });
                _definition.push(c);
            });
            _o.definition = JSON.stringify(_definition);
            if (s) {
                $(t).prop('disabled', true);
                //console.log(_o)
                $.post(`/api/lists?api_key=${z}`, _o, function (result, status, xhr) {
                    console.log(result);
                    if (parseInt(result.list_id) > 0) {
                        window.location = window.location.origin + `/list/${result.list_id}/members`
                        //var $detailDiv = $('#root'), url = `/lists/listmembers/${result.list_id}`;
                        //$.get(url, function (data) { $detailDiv.replaceWith(data); });
                    }
                    else { swal('Error!', result.message, 'error'); }
                }).fail(function (xhr, status, error) { $(t).prop('disabled', false); swal('Error!', xhr.responseJSON.message, 'error'); }).always(function () { $(t).prop('disabled', false); });
            }
        };
    var load = function () { addDefinition(); }();
})();