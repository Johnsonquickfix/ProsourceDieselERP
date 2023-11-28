!(function (r) {
    "use strict";
    function useState(obj) {
        const isFunction = value => typeof value === 'function';
        let initialState = obj;
        const reducer = fn => {
            let newState;
            if (isFunction(fn)) { newState = fn(initialState); }
            else { newState = fn; }
            Object.assign(initialState, newState);
        };
        return [initialState, reducer];
    }
    const [segment, setSegment] = useState([]);

    document.querySelector('#create-Segments')?.addEventListener("click", function (evt) {
        evt.preventDefault(), evt.stopPropagation(); postDetails(this);
    });

    var r = r || document,
        __criteria = { 1000: 'customer-statistic-value', 1001: 'customer-attribute', 1002: 'customer-location', 1003: 'customer-distance', 1004: 'customer-group-membership', 1005: 'customer-exclusion' },
        addDefinition = function () {
            let d = r.getElementById("definition"), dr = r.createElement('div', { class: 'definition-row d-flex', }),
                _and = r.createElement('button', { name: 'add-definition', class: 'btn btn-outline-dark fw-bold' }, '<i class="fa fa-plus"></i> AND');
            _and.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); this.disabled = true, addDefinition(); });
            createCriteria(dr), d.appendChild(r.createElement('div', { class: 'definition__container mb-2', }, r.createElement('div', { class: 'boxed_style card card-body my-2' }, dr), _and));
            //setSegment((val) => ([...val, { criteria: [] }]));
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
            let dc = c.closest('.definition__container'), dc_i = [...dc.parentElement.children].indexOf(dc),
                dr = c.closest('.definition-row'), dr_i = [...dc.querySelectorAll('.definition-row')].indexOf(dr);
            //i = $(t).find('.definition-row').index(c.closest('.definition-row'));
            if (dr_i <= 1) {
                dc.remove(), segment.splice(dc_i, 1);
            }
            else {
                dr.remove(), segment[dc_i].splice(dr_i, 1);
            }

            //segment.splice(i, 1), console.log(segment);
            //$(t).find('div.CriterionDivider').eq(i > 0 ? i - 1 : i).remove();
            //$(t).find('.definition-row').length <= 1 ? t.remove() : c.closest('.definition-row').remove()
            //$('#definition .definition__container').length <= 0 && addDefinition();
            //$(t).find('[name="or-definition"]').remove();
            //$(t).find('.definition-col-action').last().append(r.createElement('button', { name: 'or-definition', class: 'btn btn-outline-dark' }, 'OR'))
            //$('[name="add-definition"]').last().prop('disabled', false);
        },
        addFilter = function (t) {
            let dc = t.closest('.definition__container'), di = [...dc.parentElement.children].indexOf(dc),
                dr = t.closest('.definition-row'), ri = [...dc.querySelectorAll('.definition-row')].indexOf(dr),
                v = t.value, d = t.closest('.definition-col');
            d.replaceChildren(d.firstElementChild);
            if (v === __criteria[1000]) {
                let _metric = r.createElement('select', { name: "statistic" }), _operator = r.createElement('select', { name: "operator" }), _timeframe = r.createElement('select', { name: "timeframe" });
                _metric.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); let v = parseInt(this.value) || 0; createFilterRow(d, v); });
                _operator.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); createOperatorValue(this); });
                _timeframe.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); addTimeFrame(this); });

                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', }, createLabelCol('Has'),
                        r.createElement('div', { class: "InputContainer cw-225" }, _metric),
                        r.createElement('div', { class: "InputContainer cw-175" }, _operator),
                        r.createElement('div', { class: "InputContainer cw-175" }, _timeframe),
                    )
                ), getMetrics(_metric), getOperator(_operator, _timeframe, v);
            }
            else if (v === __criteria[1001]) {
                let _key = r.createElement('select', { name: "key" }), _operator = r.createElement('select', { name: "operator" }), _value = r.createElement('input', { "type": 'text', name: "value", class: "form-control", disabled: 'disabled' }),
                    dr = r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', });
                _key.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); let v = parseInt(this.value) || 0; createProfilePropertyValue(this); });
                _operator.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); createOperatorValue(this); });

                createProfileProperty(dr),
                    dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, _operator)),
                    dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, _value));
                d.appendChild(dr), getOperator(_operator, null, v);
                //_criteria = { type: v, key_type: 'string', operator: _operator.value, key: '', value: '' };
            }
            else if (v === __criteria[1002]) {
                let _operator = r.createElement('select', { name: "operator" }), _region = r.createElement('select', { name: "region_id" });
                d.append(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        createLabelCol('Location'), r.createElement('div', { class: "cw-175" }, _operator),
                        createLabelCol('within'), r.createElement('div', { class: "cw-300" }, _region)
                    )
                ), getOperator(_operator, _region, v);
                //_criteria = { type: v, operator: _operator.value, region_id: _region.value };
            }
            else if (v === __criteria[1003]) {
                let _operator = r.createElement('select', { name: "operator" }), _unit = r.createElement('select', { name: "units" }),
                    dr = r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', });
                dr.appendChild(createLabelCol('Person')), dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, _operator)),
                    dr.appendChild(createLabelCol('within')), dr.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "distance", class: "form-control", type: "number" }))),
                    dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, _unit)),
                    dr.appendChild(createLabelCol('of')), dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, r.createElement('input', { name: "postal_code", class: "form-control", type: "text", placeholder: "Postal/Zip Code", maxlength: 10 }))),
                    dr.appendChild(createLabelCol('in')), createCountryCol(dr);
                d.appendChild(dr), getOperator(_operator, _unit, v);
                //_criteria = { type: v, operator: _operator.value, units: _unit.value, country_code: '', distance: 1, postal_code: '' };
            }
            else if (v === __criteria[1004]) {
                let _operator = r.createElement('select', { name: "operator" }), dr = r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', });
                dr.appendChild(createLabelCol('Person')), dr.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, _operator));
                dr.appendChild(createLabelCol('in')), createGroup(dr);
                d.appendChild(dr), getOperator(_operator, null, v);
                // Create date filter
                const btn_cl = r.createElement('a', { class: "btn fw-bold" }, 'X');
                btn_cl.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); evt.target.closest('div.FilterRowContainer').remove(), _dateFilter(d); });
                const _dateFilter = function (e) {
                    let btn = r.createElement('button', { class: "btn btn-outline-dark fw-bold" }, '<i class="fas fa-filter"></i> By Date Added');
                    e.appendChild(r.createElement('div', { "data-filterid": "filter-row", class: "FilterRowContainer d-flex mb-2", style: "margin-left: 38px;" }, btn));
                    btn.addEventListener("click", function (evt) {
                        evt.preventDefault(), evt.stopPropagation();
                        let div = this.parentNode, s = r.createElement('select', { name: "timeframe" });
                        s.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); addTimeFrame(this); });

                        div.replaceChildren(createLabelCol('and was added')), div.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, s)), getOperator(null, s, v);
                        div.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "timeframe_options.quantity", class: "form-control", type: "number", value: "30" })));
                        createUnit(div), div.appendChild(r.createElement('div', { class: "fix-label" }, btn_cl));
                    });
                }; _dateFilter(d);
                //_criteria = { type: v, operator: _operator.value, group: '' };
            }
            else if (v === __criteria[1005]) {
                let _operator = r.createElement('select', { name: "operator" });
                d.appendChild(
                    r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                        createLabelCol('Person'), r.createElement('div', { class: "InputContainer cw-175" }, _operator),
                        createLabelCol('suppressed')
                    )
                ), getOperator(_operator, null, v);
                //_criteria = { type: v, operator: _operator.value };
            }

            //setSegment((val) => {
            //    const copy = val[di].criteria;
            //    (copy[ri] ? copy[ri] = _criteria : copy.push(_criteria));
            //}), console.log(segment);
            // or condition
            dc.querySelectorAll('a[name="or-definition"]').forEach(e => e.remove());
            let _or = r.createElement('a', { name: 'or-definition', class: 'btn btn-outline-dark' }, 'OR');
            dc.querySelectorAll(".definition-col-action:last-child").forEach(e => e.append(_or));
            _or.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); addOrDefinition(this); });
        },
        addTimeFrame = function (t) {
            let v = t.value, d = t.closest('.InputContainer'), p = d.parentNode;
            while (!!d.nextElementSibling) { d.nextElementSibling.remove(); }
            if (v === 'in-the-last') {
                p.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "timeframe_options.quantity", class: "form-control", type: "number", value: "30" })));
                createUnit(p);
            }
            else if (v === 'more-than' || v === 'at-least') {
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "timeframe_options.quantity", class: "form-control", type: "number", value: "30" }))), createUnit(p);
                p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'ago')));
            }
            else if (v === 'between') {
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "timeframe_options.start", class: "form-control", type: "number", value: "0" })));
                p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'and')));
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "timeframe_options.end", class: "form-control", type: "number", value: "30" })));
                createUnit(p);
                p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'ago')));

            }
            else if (v === 'before' || v === 'after') {
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "timeframe_options.date", class: "form-control", type: "text", value: moment().format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
            }
            else if (v === 'between-static') {
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "timeframe_options.start", class: "form-control", type: "text", value: moment().subtract(1, "days").format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
                p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'and')));
                p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "timeframe_options.end", class: "form-control", type: "text", value: moment().format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
            }
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
            const $_operator_ctr = operator_ctr ? new Choices(operator_ctr, { allowHTML: true, searchEnabled: false, itemSelectText: '', shouldSort: false }) : null,
                $_timeframe_ctr = timeframe_ctr ? new Choices(timeframe_ctr, { allowHTML: true, searchEnabled: false, itemSelectText: '', shouldSort: false }) : null;
            let requestOptions = { method: 'GET', headers: {} };
            fetch(`/api/lists/criteria/operator/${type}`, requestOptions).then(response => response.json())
                .then(result => {
                    (result.operators && $_operator_ctr) && $_operator_ctr.setChoices(result.operators),
                        (result.timeframes && $_timeframe_ctr) && $_timeframe_ctr.setChoices(result.timeframes),
                        (result.region && $_timeframe_ctr) && $_timeframe_ctr.setChoices(result.region),
                        (result.unit && $_timeframe_ctr) && $_timeframe_ctr.setChoices(result.unit);
                }).catch(error => console.log('error', error));
        },
        createCriteria = function (e) {
            let s = r.createElement('select', { name: "type" }), _remove = r.createElement('button', { name: 'remove-definition', class: 'btn btn-outline-dark' }, r.createElement('i', { class: 'fa fa-trash' }));
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
                let s = r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "value", class: "form-control", type: "number", value: "1" }));
                !d.nextElementSibling.querySelector('[name="operator_value"]') && d.insertAdjacentElement("afterEnd", s);
            }(d) : function (e) { d.nextElementSibling.querySelector('[name="operator_value"]') && d.nextElementSibling.querySelector('[name="operator_value"]').parentNode.remove() }(d);
        },
        createUnit = function (e) {
            let s = r.createElement('select', { name: "timeframe_options.units" });
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
            const btn_cl = r.createElement('a', { class: "btn fw-bold" }, 'X');
            btn_cl.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); createFilterRow(e, v); });

            b.addEventListener("click", function (evt) {
                evt.preventDefault(), evt.stopPropagation();
                let div = this.parentNode, s = r.createElement('select', { name: "statistic_filters.dimension" }), i = r.createElement('input', { "type": 'text', name: "statistic_filters.value", class: "form-control", disabled: 'disabled' });
                div.replaceChildren(createLabelCol('where')), div.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, s));
                div.appendChild(createLabelCol('equals')), div.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, i));
                div.appendChild(r.createElement('div', { class: "fix-label" }, btn_cl));
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
                            let sv = r.createElement('select', { multiple: 'multiple', name: "statistic_filters.value" });
                            p.parentNode.appendChild(createLabelCol('contains')), p.parentNode.appendChild(r.createElement('div', { class: "InputContainer cw-400" }, sv));
                            (function (a, v1, v2) {
                                new Choices(a, { allowHTML: false, placeholder: true, delimiter: ',', editItems: true, maxItemCount: 5, removeItemButton: true, shouldSort: false, itemSelectText: '', classNames: { containerOuter: 'choices cw-400', } })
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
                            let sv = r.createElement('select', { name: "statistic_filters.value" });
                            p.parentNode.appendChild(createLabelCol('equals')), p.parentNode.appendChild(r.createElement('div', { class: "InputContainer cw-400" }, sv));
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
                    });
                })(s, v);
            });
        },
        createGroup = function (e) {
            let s = r.createElement('select', { name: "group" });
            e.appendChild(r.createElement('div', { class: "InputContainer cw-300" }, s));
            (function (s) {
                new Choices(s, { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: 'Select a list…', itemSelectText: '', shouldSort: false })
                    .setChoices(async () => {
                        try {
                            return await fetch('/api/lists/static-group', { method: 'GET' }).then(response => response.json())
                                .then(function (data) { return data ? data.map(function (row) { return { value: row.group_id, label: row.name }; }) : []; });
                        } catch (err) { console.error(err); }
                    });
            })(s);
        },
        createProfileProperty = function (e) {
            let s = r.createElement('select', { name: "key" });
            s.addEventListener("change", function (evt) {
                evt.preventDefault(), evt.stopPropagation();
                let p = evt.target.closest('.FilterRowContainer'), v = this.value;
                p.removeChild(p.lastElementChild), createProfilePropertyValue(p, v);
            });
            e.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, s));
            (function (s) {
                new Choices(s, { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: 'Select a property…', itemSelectText: '', shouldSort: false })
                    .setChoices(async () => {
                        try {
                            return await fetch('/api/lists/people/property', { method: 'GET' }).then(response => response.json());
                        } catch (err) { console.error(err); }
                    });
            })(s);
        },
        createProfilePropertyValue = function (e, v) {
            let sv = r.createElement('select', { name: "value" });
            e.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, sv));
            (function (s, v) {
                new Choices(s, { allowHTML: false, itemSelectText: '', shouldSort: false })
                    .setChoices(async () => {
                        try {
                            return await fetch(`/api/lists/people/property/values?property=${v}`, { method: 'GET' }).then(response => response.json());
                        } catch (err) { console.error(err); }
                    });
            })(sv, v);
        },
        createLabelCol = function (val) {
            return r.createElement('div', { class: "fix-label" }, r.createElement('span', { class: "h4_title" }, val));
        },
        createCountryCol = function (e) {
            let s = r.createElement('select', { name: "country_code" });
            e.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, s));
            (function (s) {
                new Choices(s, { allowHTML: false, placeholder: true, placeholderValue: 'Choose a country...', itemSelectText: '', shouldSort: false })
                    .setChoices(async () => {
                        try {
                            return await fetch('/api/lists/countries', { method: 'GET' }).then(response => response.json())
                                .then(function (data) { return data ? data.map(function (row) { return { value: row.code, label: row.name }; }) : []; })
                        } catch (err) { console.error(err); }
                    });
            })(s);
        },
        postDetails = function (t) {
            let s = !0, _o = { list_id: parseInt($(t).data('id')) || 0, list_name: $('#txtlist-name').val(), group_type_id: 2, definition: [] };
            document.querySelectorAll('.definition__container').forEach(e => {
                let c = { criteria: [] };
                e.querySelectorAll('.definition-row').forEach(r => {
                    let JsonVar = {}, inputElements = r.querySelectorAll('input[type="number"],input[type="text"], select, checkbox, textarea');
                    inputElements.forEach(r => {
                        if (isCheckbox(r)) { stringToObj(r.name, r.value, JsonVar); }
                        else if (isMultiSelect(r)) { stringToObj(r.name, getSelectValues(r), JsonVar); }
                        else { stringToObj(r.name, r.value, JsonVar); }
                    });
                    c.criteria.push(JsonVar);
                });
                _o.definition.push(c);
            });
            if (s) {
                t.disabled = true;
                fetch(`/api/lists`, { method: 'POST', body: JSON.stringify(_o), headers: { 'Content-Type': 'application/json;charset=UTF-8' } }).then(response => response.json())
                    .then(function (result) {
                        t.disabled = false;
                        if (parseInt(result.list_id) > 0) window.location = window.location.origin + `/list/${result.list_id}/members`;
                        else swal('Error!', result.message, 'error');
                    }).catch(error => { console.log('error', error); t.disabled = false; swal('Error!', error, 'error'); });
            }
        };
    var load = function () { addDefinition(); }();
})();