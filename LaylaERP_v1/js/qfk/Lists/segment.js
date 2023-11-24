!(function (r) {
    "use strict"; r = r || document;
    $(document).ready(function () {
        //renderSelect();
        //$(document).on('change', 'select[name="type"]', function (evt) {
        //    evt.preventDefault(), evt.stopPropagation(); addFilter(this);
        //});
        //$(document).on('click', '[name="add-definition"]', function (evt) {
        //    evt.preventDefault(), evt.stopPropagation(), $(this).prop('disabled', true); addDefinition();
        //});
        //$(document).on('click', '[name="remove-definition"]', function (evt) {
        //    evt.preventDefault(), evt.stopPropagation(), removeDefinition(this);
        //});
        //$(document).on('click', '[name="or-definition"]', function (evt) {
        //    evt.preventDefault(), evt.stopPropagation(), addOrDefinition(this);
        //});
        $(document).on('click', '[name="add-filter-row"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), addFilterRow(this);
        });
        $(document).on('click', '[name="close-filter-row"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), removeFilterRow(this);
        });
        //$(document).on('change', '[name="timeframe"]', function (evt) {
        //    evt.preventDefault(), evt.stopPropagation(), addTimeFrame(this);
        //});
        $(document).on('click', '#create-Segments', function (evt) {
            evt.preventDefault(), evt.stopPropagation(), postDetails(this);
        });
    });
    const L = [{ value: 'customer-group-membership', name: 'If someone is in or not in a list' }, { value: 'customer-exclusion', name: 'If someone is or is not suppressed for email' }, { value: 'customer-location', name: 'If someone is or is not within the country' }];
    const T = [{ value: 'in-the-last', name: 'in the last', select: true }, { value: 'more-than', name: 'more than' }, { value: 'at-least', name: 'at least' }, { value: 'between', name: 'between' }, { value: 'before', name: 'before' }, { value: 'after', name: 'after' }, { value: 'between-static', name: 'between dates' }];
    const O = [{ value: 'eq', name: 'is', select: true }, { value: 'neq', name: 'is not' }];
    var dr = '.definition-row', dc = '.definition-col', dcfr = '.FilterRowContainer',
        addDefinition = function () {
            let d = r.getElementById("definition"), dr = r.createElement('div', { class: 'definition-row d-flex', }),
                _and = r.createElement('button', { name: 'add-definition', class: 'btn btn-outline-dark fw-bold' }, '<i class="fa fa-plus"></i> AND');
            _and.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); this.disabled = true, addDefinition(); });
            createCriteria(dr), d.appendChild(r.createElement('div', { class: 'definition__container mb-2', }, r.createElement('div', { class: 'boxed_style card card-body my-2' }, dr), _and));
        },
        addOrDefinition = function (c) {
            let pr = c.closest('.definition__container .card-body'), dr = r.createElement('div', { class: 'definition-row d-flex', });
            c.remove(), createCriteria(dr),
                pr.append(
                    r.createElement('div', { class: 'CriterionDivider' },
                        r.createElement('div', { class: 'BoxedPlaceholder__Container me-3' }, r.createElement('div', null, r.createElement('span', { class: "h4_title" }, 'OR'))),
                        r.createElement('div', { class: 'CriterionDivider__LineContainer flex-grow-1' }, r.createElement('div'), r.createElement('div'))
                    )
                ), pr.append(dr);
        },
        removeDefinition = function (c) {
            let r = document, t = c.closest('.definition__container'), i = $(t).find('.definition-row').index(c.closest('.definition-row'));
            $(t).find('div.CriterionDivider').eq(i > 0 ? i - 1 : i).remove();
            $(t).find('.definition-row').length <= 1 ? t.remove() : c.closest('.definition-row').remove()
            $('#definition .definition__container').length <= 0 && addDefinition();
            $(t).find('[name="or-definition"]').remove();
            $(t).find('.definition-col-action').last().append(r.createElement('button', { name: 'or-definition', class: 'btn btn-outline-dark' }, 'OR'))
            $('[name="add-definition"]').last().prop('disabled', false);
        },
        addFilter = function (t) {
            let v = t.value, d = t.closest('.definition-col'), pr = t.closest('.definition__container');
            d.replaceChildren(d.firstElementChild);
            if (v === 'customer-statistic-value') {
                let _metric = r.createElement('select', { name: "statistic", class: "cw-175", style: "width:100%" }),
                    _operator = r.createElement('select', { name: "operator", class: "select2", style: "width:100%" }),
                    _timeframe = r.createElement('select', { name: "timeframe", class: "select2", style: "width:100%" });
                _metric.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); let v = parseInt(this.value) || 0; createFilterRow(d, v); });
                _operator.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); createOperatorValue(this); });
                _timeframe.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); addTimeFrame(this); });

                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        r.createElement('div', { class: "fix-label" }, r.createElement('span', { class: "h4_title" }, 'Has')),
                        r.createElement('div', { class: "InputContainer cw-225" }, _metric),
                        r.createElement('div', { class: "InputContainer cw-175" }, _operator),
                        r.createElement('div', { class: "InputContainer cw-175" }, _timeframe),
                    )
                ), getMetrics(_metric), getOperator(_operator, _timeframe, v);
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
            // or condition
            let _or = r.createElement('a', { name: 'or-definition', class: 'btn btn-outline-dark' }, 'OR');
            pr.querySelectorAll(".definition-col-action:last-child").forEach(e => e.append(_or));
            _or.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); addOrDefinition(this); });
        },
        addTimeFrame = function (t) {
            let v = t.value, d = t.closest('.InputContainer'), p = d.parentNode;
            while (!!d.nextElementSibling) { d.nextElementSibling.remove(); }
            if (v === 'in-the-last') {
                p.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "quantity", class: "form-control", type: "number", value: "30" })));
                createUnit(p);
            }
            else if (v === 'more-than' || v === 'at-least') {
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "quantity", class: "form-control", type: "number", value: "30" })));
                d.append(r.createElement('div', { class: 'InputContainer cw-80', }, r.createElement('select', { name: "units", class: "select2", style: "width:100%" }, fillSelect(U))));
                d.append(r.createElement('div', { class: 'fix-label', }, '<h6>ago</h6>'));
                d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));
                $(d).find('[name="units"]').select2({ minimumResultsForSearch: -1 });
            }
            else if (v === 'between') {
                let _unit = r.createElement('select', { style: "width:100%" });
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "start_quantity", class: "form-control", type: "number", value: "0" })));
                p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'and')));
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "end_quantity", class: "form-control", type: "number", value: "30" })));
                createUnit(p);
                p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'ago')));
                //d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));

            }
            else if (v === 'before' || v === 'after') {
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "date", class: "form-control", type: "text", value: moment().format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
                //p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));
                //$(d).find('[name="date"]').inputmask("mm/dd/yyyy");
            }
            else if (v === 'between-static') {
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "start_date", class: "form-control", type: "text", value: moment().subtract(1, "days").format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
                p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'and')));
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "end_date", class: "form-control", type: "text", value: moment().format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
                //d.append(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-primary", type: "button" }, 'X')));
                //$(d).find('[name="start_date"],[name="end_date"]').inputmask("mm/dd/yyyy");
            }
        },
        addFilterRow = function (t) {
            let $div = t.closest(dc); t.closest('div').remove();
            let c = r.createElement('div', { "data-filterid": "filter-row", class: 'FilterRowContainer d-flex mb-2', style: "margin-left: 52px;" },
                r.createElement('div', { class: 'fix-label', }, '<h6>and was added</h6>'),
                r.createElement('div', { class: 'InputContainer cw-175', }, r.createElement('select', { name: "timeframe", class: "select2", style: "width:100%" }, fillSelect(T))),
                r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "quantity", class: "form-control", type: "number", value: "30" })),
                r.createElement('div', { class: 'InputContainer cw-80', }, r.createElement('select', { name: "units", class: "select2", style: "width:100%" }, fillSelect(U))),
                r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('button', { name: "close-filter-row", class: "btn btn-outline-dark", type: "button" }, 'X'))
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
            var multipleFetch = new Choices(ctr, { allowHTML: false, placeholder: true, placeholderValue: 'Choose metric...', itemSelectText: '', shouldSort: false })
                .setChoices(async () => {
                    try {
                        return await fetch('/api/lists/metrics', { method: 'GET' }).then(response => response.json())
                            .then(function (data) {
                                return data.map(function (row) { return { value: row.metric_id, label: row.metric_name }; });
                            });
                    } catch (err) { console.error(err); }
                });
        },
        getOperator = function (operator_ctr, timeframe_ctr, type) {
            const $_operator_ctr = new Choices(operator_ctr, { allowHTML: true, searchEnabled: false, itemSelectText: '', shouldSort: false }),
                $_timeframe_ctr = new Choices(timeframe_ctr, { allowHTML: true, searchEnabled: false, itemSelectText: '', shouldSort: false });

            let requestOptions = { method: 'GET', headers: {} };
            fetch(`/api/lists/criteria/operator/${type}`, requestOptions).then(response => response.json())
                .then(result => {
                    $_operator_ctr.setChoices(result.operators), $_timeframe_ctr.setChoices(result.timeframes);
                    //if (operator_ctr) for (var key in result.operators) { operator_ctr.appendChild(r.createElement('option', { 'value': key }, result.operators[key])); }
                    //if (timeframe_ctr) for (var key in result.timeframes) { timeframe_ctr.appendChild(r.createElement('option', { 'value': key }, result.timeframes[key])); }
                }).catch(error => console.log('error', error));
        },
        createCriteria = function (e) {
            let s = r.createElement('select', { style: "width:100%" }), _remove = r.createElement('button', { name: 'remove-definition', class: 'btn btn-outline-dark' }, r.createElement('i', { class: 'fa fa-trash' }));
            s.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); addFilter(this); });
            _remove.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); removeDefinition(this); });

            e.appendChild(r.createElement('div', { class: 'definition-col flex-grow-1' }, r.createElement('div', { class: 'CriterionTypeSelectm cw-400 mb-2' }, s)));
            e.appendChild(r.createElement('div', { class: 'definition-col-action' }, _remove));
            (function (s) {
                new Choices(s, { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: 'Select a condition…', itemSelectText: '', shouldSort: false })
                    .setChoices(async () => {
                        try {
                            return await fetch('/api/lists/criteria/type', { method: 'GET' }).then(response => response.json());
                        } catch (err) { console.error(err); }
                    });
            })(s);
        },
        createOperatorValue = function (e) {
            let v = e.value, d = e.closest('.InputContainer');
            !v.includes('-zero') ? function (e) {
                let s = r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "operator_value", class: "form-control", type: "number", value: "1" }));
                !d.nextElementSibling.querySelector('[name="operator_value"]') && d.insertAdjacentElement("afterEnd", s);
            }(d) : function (e) { d.nextElementSibling.querySelector('[name="operator_value"]') && d.nextElementSibling.querySelector('[name="operator_value"]').parentNode.remove() }(d);
        },
        createUnit = function (e) {
            let s = r.createElement('select', { style: "width:100%" });
            e.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, s));
            (function (a) {
                const u = [{ value: 'hour', label: 'hours' }, { value: 'day', label: 'days', selected: true }, { value: 'week', label: 'weeks' }];
                new Choices(a, { allowHTML: true, searchEnabled: false, itemSelectText: '', shouldSort: false }).setChoices(u);
            })(s);
        },
        createFilterRow = function (e, v) {
            if (e.childNodes.length > 2) e.removeChild(e.lastChild);
            let b = r.createElement('button', { name: "add-filter-row", class: "btn btn-outline-dark fw-bold" }, '<i class="fas fa-filter"></i> Add Filter');
            e.appendChild(r.createElement('div', { "data-filterid": "filter-row", class: "FilterRowContainer d-flex mb-2", style: "margin-left: 38px;" }, b));

            b.addEventListener("click", function (evt) {
                evt.preventDefault(), evt.stopPropagation();
                let div = this.parentNode, s = r.createElement('select', { style: "width:100%" }), i = r.createElement('input', { "type": 'text', style: "width:100%", class: "form-control", disabled: 'disabled' });
                div.replaceChildren(r.createElement('div', { class: 'fix-label' }, r.createElement('span', { class: "h4_title" }, 'where')));
                div.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, s));
                div.appendChild(r.createElement('div', { class: "fix-label" }, r.createElement('span', { class: "h4_title" }, 'equals')));
                div.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, i));
                div.appendChild(r.createElement('div', { class: "fix-label" }, '<span>X</span>'));
                (function (a, v) {
                    const dimensions = new Choices(a, { allowHTML: false, placeholder: true, placeholderValue: 'Choose property', itemSelectText: '', shouldSort: false })
                        .setChoices(async () => {
                            try {
                                return await fetch(`/api/lists/metric/dimensions?statistic=${v}`, { method: 'GET' }).then(response => response.json())
                                    .then(function (data) {
                                        return data ? data.map(function (row) { return { value: row.meta_key, label: row.meta_key, customProperties: row.meta_type }; }) : [];
                                    });
                            } catch (err) { console.error(err); }
                        });
                    a.addEventListener("change", function (evt) {
                        evt.preventDefault(), evt.stopPropagation();
                        let p = evt.target.closest('.InputContainer'), _type = evt.target[0]?.getAttribute('data-custom-properties');
                        while (!!p.nextElementSibling) { p.nextElementSibling.remove(); }
                        if (_type === 'list') {
                            let sv = r.createElement('select', { multiple: 'multiple', style: "width:100%" });
                            p.parentNode.appendChild(r.createElement('div', { class: "fix-label" }, r.createElement('span', { class: "h4_title" }, 'contains')));
                            p.parentNode.appendChild(r.createElement('div', { class: "InputContainer cw-400" }, sv));

                            (function (a, v1, v2) {
                                new Choices(a, { allowHTML: false, placeholder: true, delimiter: ',', editItems: true, maxItemCount: 5, removeItemButton: true, shouldSort: false, itemSelectText: '', classNames: { containerOuter: 'choices cw-400',} })
                                    .setChoices(async () => {
                                        try {
                                            return await fetch(`/api/lists/metric/dimension-values?statistic=${v1}&dimension=${v2}`, { method: 'GET' }).then(response => response.json())
                                                .then(function (data) {
                                                    return data ? data.map(function (row) { return { value: row.meta_value, label: row.meta_value }; }) : [];
                                                });
                                        } catch (err) { console.error(err); }
                                    });
                            })(sv, v, this.value);
                        }
                        else {
                            let sv = r.createElement('select', { style: "width:100%" });
                            p.parentNode.appendChild(r.createElement('div', { class: "fix-label" }, r.createElement('span', { class: "h4_title" }, 'equals')));
                            p.parentNode.appendChild(r.createElement('div', { class: "InputContainer cw-400" }, sv));
                            (function (a, v1, v2) {
                                new Choices(a, { allowHTML: false, shouldSort: false, itemSelectText: '', classNames: { containerOuter: 'choices cw-400', } })
                                    .setChoices(async () => {
                                        try {
                                            return await fetch(`/api/lists/metric/dimension-values?statistic=${v1}&dimension=${v2}`, { method: 'GET' }).then(response => response.json())
                                                .then(function (data) {
                                                    return data ? data.map(function (row) { return { value: row.meta_value, label: row.meta_value }; }) : [];
                                                });
                                        } catch (err) { console.error(err); }
                                    });
                            })(sv, v, this.value);
                        }

                        //console.log(evt.target.parentNode.nextElementSibling.querySelector('[name="operator_value"]'))
                        //removeDefinition(this);
                        //const example = new Choices(a);
                        //const values = example.getValue(true);
                        //console.log(values)
                    });
                })(s, v);
            });
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