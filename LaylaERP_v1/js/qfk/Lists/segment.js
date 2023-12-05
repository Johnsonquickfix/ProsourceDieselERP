import Http from '../../http/index.js';
import Cache from '../../http/cache.js';
var r = r || document;
const segments = function (r) {
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
    addDefinition();
};


function getCriteria() { return Http.get('/api/lists/criteria/type').then(response => response.json()); }
function getStatistic() { return Http.get('/api/lists/metrics').then(response => response.json()); }
function getProperties() { return Http.get('/api/lists/people/property').then(response => response.json()); }
function getPropertyValue(_key, _value) { return Http.post('/api/lists/people/property/values', { params: {}, body: { key: _key, value: _value } }).then(response => response.json()); }
function getGroups() { return Http.get('/api/lists/static-group').then(response => response.json()); }
function getCountry() { return Http.get(`/api/lists/countries`).then(response => response.json()); }
function getDimensions(_statistic) { return Http.get(`/api/lists/metric/dimensions`, { params: { statistic: _statistic } }).then(response => response.json()); }
function getDimensionsValues(_statistic, _dimension, value) { return Http.post(`/api/lists/metric/dimension-values`, { params: {}, body: { statistic: _statistic, statistic_filters: { dimension: _dimension, value: value } } }).then(response => response.json()); }

const criteriaData = new Cache(getCriteria), statisticData = new Cache(getStatistic), propertyData = new Cache(getProperties), groupData = new Cache(getGroups), countryData = new Cache(getCountry);

export function addDefinition() {
    let d = r.getElementById("definition"), dr = r.createElement('div', { class: 'definition-row d-flex', }),
        _and = r.createElement('button', { name: 'add-definition', class: 'btn btn-outline-dark fw-bold' }, '<i class="fa fa-plus"></i> AND');
    _and.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); this.disabled = true, addDefinition(); });
    createCriteria(dr), d.appendChild(r.createElement('div', { class: 'definition__container mb-2', }, r.createElement('div', { class: 'boxed_style card card-body my-2' }, dr), _and));
    //setSegment((val) => ([...val, { criteria: [] }]));
}
export const __criteria = { 1000: 'customer-statistic-value', 1001: 'customer-attribute', 1002: 'customer-location', 1003: 'customer-distance', 1004: 'customer-group-membership', 1005: 'customer-exclusion' },
    __tags = { t: 'div.definition__container', r: 'div.definition-row', d: 'div.CriterionDivider', a: 'div.definition-col-action' },
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
        let con = c.closest(__tags.t).parentElement, groups = [...con.children], gi = groups.indexOf(c.closest(__tags.t)),
            rows = [...groups[gi].querySelectorAll(__tags.r)], ri = rows.indexOf(c.closest(__tags.r));
        if (rows.length <= 1) { groups[gi].remove(), groups.length <= 1 && addDefinition(); }
        else { rows[ri].remove(), [...groups[gi].querySelectorAll(__tags.d)][ri > 0 ? ri - 1 : ri].remove(); }
        let col = [...groups[gi].querySelectorAll(__tags.a)], _or = r.createElement('a', { name: 'or-definition', class: 'btn btn-outline-dark' }, 'OR');
        _or.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); addOrDefinition(this); });
        if (!col[col.length - 1].querySelector('[name="or-definition"]')) col[col.length - 1].appendChild(_or);
        let _and = [...con.querySelectorAll('[name="add-definition"]')]; _and[_and.length - 1].disabled = false;
    },
    addFilter = function (t, o) {
        let dc = t.closest(__tags.t), di = [...dc.parentElement.children].indexOf(dc),
            dr = t.closest(__tags.r), ri = [...dc.querySelectorAll(__tags.r)].indexOf(dr),
            v = (o && o.type) || t.value, d = t.closest('.definition-col');
        (!o && (o = {}, o.type = v)), d.replaceChildren(d.firstElementChild);
        if (v === __criteria[1000]) {
            let _metric = r.createElement('select', { name: "statistic" }), _operator = r.createElement('select', { name: "operator" }), _timeframe = r.createElement('select', { name: "timeframe" });
            _metric.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); o.statistic = parseInt(this.value) || 0, createFilterRow(d, o); });
            _operator.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); createOperatorValue(this); });
            _timeframe.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); addTimeFrame(this); });

            d.append(
                r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', }, createLabelCol('Has'),
                    r.createElement('div', { class: "InputContainer cw-225" }, _metric),
                    r.createElement('div', { class: "InputContainer cw-175" }, _operator),
                    r.createElement('div', { class: "InputContainer cw-175" }, _timeframe),
                )
            ), getMetrics(_metric, (o && o.statistic)), getOperator(_operator, _timeframe, o);
        }
        else if (v === __criteria[1001]) {
            let _operator = r.createElement('select', { name: "operator" }), dr = r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', });
            _operator.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); createOperatorValue(this); });

            createProfileProperty(dr, o), dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, _operator));
            createProfilePropertyValue(dr, o), d.appendChild(dr), getOperator(_operator, null, o);
        }
        else if (v === __criteria[1002]) {
            let _operator = r.createElement('select', { name: "operator" }), _region = r.createElement('select', { name: "region_id" });
            d.append(
                r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                    createLabelCol('Location'), r.createElement('div', { class: "cw-175" }, _operator),
                    createLabelCol('within'), r.createElement('div', { class: "cw-300" }, _region)
                )
            ), getOperator(_operator, _region, o);
        }
        else if (v === __criteria[1003]) {
            let _operator = r.createElement('select', { name: "operator" }), _unit = r.createElement('select', { name: "units" }),
                dr = r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', });
            dr.appendChild(createLabelCol('Person')), dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, _operator)),
                dr.appendChild(createLabelCol('within')), dr.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "distance", class: "form-control", type: "number", value: o.distance }))),
                dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, _unit)),
                dr.appendChild(createLabelCol('of')), dr.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, r.createElement('input', { name: "postal_code", class: "form-control", type: "text", placeholder: "Postal/Zip Code", maxlength: 10, value: o.postal_code }))),
                dr.appendChild(createLabelCol('in')), createCountryCol(dr, o);
            d.appendChild(dr), getOperator(_operator, _unit, o);
            //_criteria = { type: v, operator: _operator.value, units: _unit.value, country_code: '', distance: 1, postal_code: '' };
        }
        else if (v === __criteria[1004]) {
            let _operator = r.createElement('select', { name: "operator" }), dr = r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', });
            dr.appendChild(createLabelCol('Person')), dr.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, _operator));
            dr.appendChild(createLabelCol('in')), createGroup(dr, o);
            d.appendChild(dr), getOperator(_operator, null, o);
            // Create date filter
            const $bAdd = r.createElement('button', { class: "btn btn-outline-dark fw-bold" }, '<i class="fas fa-filter"></i> By Date Added'),
                $fr = r.createElement('div', { "data-filterid": "filter-row", class: "FilterRowContainer d-flex mb-2", style: "margin-left: 38px;" }),
                closeOption = function ($fr) {
                    let $bClose = r.createElement('a', { class: "btn fw-bold" }, 'X');
                    $bClose.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(), o.timeframe = null, createDateOption(d); });
                    $fr.appendChild(r.createElement('div', { class: "fix-label" }, $bClose));
                },
                dateOption = function ($fr) {
                    let $s = r.createElement('select', { name: "timeframe" });
                    $s.addEventListener("change", function (evt) {
                        console.log('dateOption => change')
                        evt.preventDefault(), evt.stopPropagation(); addTimeFrame(this), closeOption($fr);
                    });
                    $fr.replaceChildren(createLabelCol('and was added')), $fr.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, $s)), getOperator(null, $s, o);
                    if (o.timeframe) { addTimeFrame($s, o), closeOption($fr) };
                },
                createDateOption = function (e) {
                    $fr.replaceChildren($bAdd), e.appendChild($fr);
                    $bAdd.addEventListener("click", function (evt) {
                        evt.preventDefault(), evt.stopPropagation(), dateOption($fr);
                        $fr.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "timeframe_options.quantity", class: "form-control", type: "number", value: "30" })));
                        createUnit($fr), closeOption($fr);
                    });
                    o.timeframe && dateOption($fr);
                }; createDateOption(d);
        }
        else if (v === __criteria[1005]) {
            let _operator = r.createElement('select', { name: "operator" });
            d.appendChild(
                r.createElement('div', { class: 'FilterRowContainer d-flex mb-2', },
                    createLabelCol('Person'), r.createElement('div', { class: "InputContainer cw-175" }, _operator),
                    createLabelCol('suppressed')
                )
            ), getOperator(_operator, null, o);
        }
        // or condition
        dc.querySelectorAll('a[name="or-definition"]').forEach(e => e.remove());
        let _or = r.createElement('a', { name: 'or-definition', class: 'btn btn-outline-dark' }, 'OR');
        dc.querySelectorAll(".definition-col-action:last-child").forEach(e => e.append(_or));
        _or.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); addOrDefinition(this); });
    },
    addTimeFrame = function (t, o) {
        let v = (o && o.timeframe) || t.value, d = t.closest('.InputContainer'), p = d.parentNode;
        while (!!d.nextElementSibling) { d.nextElementSibling.remove(); }
        if (v === 'in-the-last') {
            p.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "timeframe_options.quantity", class: "form-control", type: "number", value: (o && o.timeframe_options?.quantity) || 30 })));
            createUnit(p);
        }
        else if (v === 'more-than' || v === 'at-least') {
            p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "timeframe_options.quantity", class: "form-control", type: "number", value: (o && o.timeframe_options?.quantity) || 30 }))), createUnit(p);
            p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'ago')));
        }
        else if (v === 'between') {
            p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "timeframe_options.start", class: "form-control", type: "number", value: (o && o.timeframe_options?.start) || 0 })));
            p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'and')));
            p.appendChild(r.createElement('div', { class: 'InputContainer cw-75', }, r.createElement('input', { name: "timeframe_options.end", class: "form-control", type: "number", value: (o && o.timeframe_options?.end) || 30 })));
            createUnit(p);
            p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'ago')));
        }
        else if (v === 'before' || v === 'after') {
            p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "timeframe_options.value", class: "form-control", type: "text", value: (o && new Date(o.timeframe_options?.value).toLocaleDateString()) || moment().format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
        }
        else if (v === 'between-static') {
            p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "timeframe_options.start", class: "form-control", type: "text", value: (o && new Date(o.timeframe_options?.start).toLocaleDateString()) || moment().subtract(1, "days").format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
            p.appendChild(r.createElement('div', { class: 'fix-label', }, r.createElement('span', { class: "h4_title" }, 'and')));
            p.appendChild(r.createElement('div', { class: 'InputContainer cw-125', }, r.createElement('input', { name: "timeframe_options.end", class: "form-control", type: "text", value: (o && new Date(o.timeframe_options?.end).toLocaleDateString()) || moment().format('MM/DD/YYYY'), placeholder: "mm/dd/yyyy" })));
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
    getMetrics = function (ctr, setValue = 0) {
        var multipleFetch = new Choices(ctr, { allowHTML: false, placeholder: true, placeholderValue: 'Choose metric...', itemSelectText: '', shouldSort: false })
            .setChoices(async () => {
                try {
                    return await statisticData.getData().then(function (data) {
                        return data.map(function (row) { return { value: row.metric_id, label: row.metric_name, selected: row.metric_id == setValue ? true : false }; });
                    });
                    //return await fetch('/api/lists/metrics', { method: 'GET' }).then(response => response.json())
                    //    .then(function (data) {
                    //        return data.map(function (row) { return { value: row.metric_id, label: row.metric_name }; });
                    //    });
                } catch (err) { console.error(err); }
            });
    },
    getOperator = function (operator_ctr, timeframe_ctr, o) {
        const $_operator_ctr = operator_ctr ? new Choices(operator_ctr, { allowHTML: true, searchEnabled: false, itemSelectText: '', shouldSort: false }) : null,
            $_timeframe_ctr = timeframe_ctr ? new Choices(timeframe_ctr, { allowHTML: true, searchEnabled: false, itemSelectText: '', shouldSort: false }) : null;
        let requestOptions = { method: 'GET', headers: {} };
        fetch(`/api/lists/criteria/operator/${(o && o.type)}`, requestOptions).then(response => response.json())
            .then(result => {
                if (result.operators && $_operator_ctr) {
                    $_operator_ctr.setChoices(result.operators.map(row => { return { value: row.value, label: row.label, selected: (o.operator ? row.value == o.operator : row.selected) } }));
                }
                if (result.timeframes && $_timeframe_ctr) {
                    $_timeframe_ctr.setChoices(result.timeframes.map(row => { return { value: row.value, label: row.label, selected: (o.timeframe ? row.value == o.timeframe : row.selected) } }));
                }
                if (result.region && $_timeframe_ctr) {
                    $_timeframe_ctr.setChoices(result.region.map(row => { return { value: row.value, label: row.label, selected: (o.region_id ? row.value == o.region_id : row.selected) } }));
                }
                if (result.unit && $_timeframe_ctr) {
                    $_timeframe_ctr.setChoices(result.unit.map(row => { return { value: row.value, label: row.label, selected: (o.units ? row.value == o.units : row.selected) } }));
                }
            }).catch(error => console.log('error', error));
    },
    createCriteria = function (e, setValue = '') {
        let s = r.createElement('select', { name: "type" }), _remove = r.createElement('button', { name: 'remove-definition', class: 'btn btn-outline-dark' }, r.createElement('i', { class: 'fa fa-trash' }));
        s.addEventListener("change", function (evt) { evt.preventDefault(), evt.stopPropagation(); addFilter(this); });
        _remove.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); removeDefinition(this); });

        e.appendChild(r.createElement('div', { class: 'definition-col flex-grow-1' }, r.createElement('div', { class: 'CriterionTypeSelectm cw-400 mb-2' }, s)));
        e.appendChild(r.createElement('div', { class: 'definition-col-action' }, _remove));
        (function (s, setVal) {
            const _ = new Choices(s, { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: 'Select a condition…', itemSelectText: '', shouldSort: false });
            _.setChoices(async () => {
                try {
                    return await criteriaData.getData().then(function (data) { return data ? data.map(function (row) { return { value: row.value, label: row.label, selected: row.value == setValue ? true : false } }) : []; });
                } catch (err) { console.error(err); }
            });
        })(s, setValue);
    },
    createOperatorValue = function (e, o) {
        let v = (o && o.operator) || e.value, d = e.closest('.InputContainer');
        d && !v.includes('-zero') ? function (e) {
            let s = r.createElement('div', { class: "InputContainer cw-75" }, r.createElement('input', { name: "value", class: "form-control", type: "number", value: (o && o.value) || 1 }));
            !d.nextElementSibling?.querySelector('[name="operator_value"]') && d.insertAdjacentElement("afterEnd", s);
        }(d) : function (e) { d?.nextElementSibling?.querySelector('[name="operator_value"]') && d?.nextElementSibling?.querySelector('[name="operator_value"]').parentNode.remove() }(d);
    },
    createUnit = function (e, setValue = '') {
        let s = r.createElement('select', { name: "timeframe_options.units" });
        e.appendChild(r.createElement('div', { class: "InputContainer cw-75" }, s));
        (function (a) {
            const u = [{ value: 'hour', label: 'hours' }, { value: 'day', label: 'days', selected: true }, { value: 'week', label: 'weeks' }];
            new Choices(a, { allowHTML: true, searchEnabled: false, itemSelectText: '', shouldSort: false }).setChoices(u.map(row => { return { value: row.value, label: row.label, selected: row.value == setValue || row.selected ? true : false } }));
        })(s);
    },
    createFilterRow = function (e, o, showButton = true) {
        if (e.childNodes.length > 2) e.removeChild(e.lastChild);
        let b = r.createElement('button', { name: "add-filter-row", class: "btn btn-outline-dark fw-bold" }, '<i class="fas fa-filter"></i> Add Filter'),
            fr = r.createElement('div', { "data-filterid": "filter-row", class: "FilterRowContainer d-flex mb-2", style: "margin-left: 38px;" });
        fr.replaceChildren(b), e.appendChild(fr);
        showButton ? b.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(), createFilterRowData(fr, o) }) : createFilterRowData(fr, o);
    },
    createFilterRowData = function (div, o) {
        const btn_cl = r.createElement('a', { class: "btn fw-bold" }, 'X');
        btn_cl.addEventListener("click", function (evt) { evt.preventDefault(), evt.stopPropagation(); createFilterRow(div.parentNode, { type: o.type, statistic: o.statistic }); });
        let $s = r.createElement('select', { name: "statistic_filters.dimension" }), i = r.createElement('input', { "type": 'text', name: "statistic_filters.value", class: "form-control", disabled: 'disabled' });
        div.replaceChildren(createLabelCol('where')), div.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, $s));
        div.appendChild(r.createElement('input', { type: "hidden", name: "statistic_filters.operator", value: 'eq' }), r.createElement('input', { type: "hidden", name: "statistic_filters.dimension_type", value: 'string' }));
        div.appendChild(createLabelCol('equals')), div.appendChild(r.createElement('div', { class: "InputContainer cw-175" }, i));
        div.appendChild(r.createElement('div', { class: "fix-label" }, btn_cl));
        //bind dimensions
        const dimensions = new Choices($s, { allowHTML: false, placeholder: true, placeholderValue: 'Choose property', itemSelectText: '', shouldSort: false });
        dimensions.setChoices(async () => {
            try {
                return await getDimensions(o.statistic).then(function (data) {
                    return data ? data.map(function (row) { return { value: row.meta_key, label: row.meta_key, customProperties: row.meta_type, selected: row.meta_key == (o.statistic_filters && o.statistic_filters.dimension) ? true : false }; }) : [];
                });
            } catch (err) { console.error(err); }
        });
        const set = ($e, dimension_type, dimension, value) => {
            let $sv = null, config = {}, p = $e.closest('.InputContainer');
            while (!!p.nextElementSibling) { p.nextElementSibling.remove(); }
            if (dimension_type === 'list') {
                $sv = r.createElement('select', { multiple: 'multiple', name: "statistic_filters.value" }),
                    config = { allowHTML: false, placeholder: true, delimiter: ',', editItems: true, maxItemCount: 5, removeItemButton: true, shouldSort: false, itemSelectText: '', classNames: { containerOuter: 'choices cw-400', } };
                p.parentNode.appendChild(createLabelCol('contains')), p.parentNode.appendChild(r.createElement('div', { class: "InputContainer cw-400" }, $sv));
                p.parentNode.appendChild(r.createElement('input', { type: "hidden", name: "statistic_filters.operator", value: 'contains' }));
                p.parentNode.appendChild(r.createElement('input', { type: "hidden", name: "statistic_filters.dimension_type", value: 'list' }));
            }
            else {
                $sv = r.createElement('select', { name: "statistic_filters.value" }),
                    config = { allowHTML: false, shouldSort: false, itemSelectText: '', classNames: { containerOuter: 'choices cw-400', } };
                p.parentNode.appendChild(createLabelCol('equals')), p.parentNode.appendChild(r.createElement('div', { class: "InputContainer cw-400" }, $sv));
                p.parentNode.appendChild(r.createElement('input', { type: "hidden", name: "statistic_filters.operator", value: 'eq' }));
                p.parentNode.appendChild(r.createElement('input', { type: "hidden", name: "statistic_filters.dimension_type", value: dimension_type }));
            }
            p.parentNode.appendChild(r.createElement('div', { class: "fix-label" }, btn_cl));
            let _ = new Choices($sv, config).setChoices(async () => {
                try {
                    return await getDimensionsValues(o.statistic, dimension, value).then(function (data) {
                        return data ? data.map(function (row) { return { value: row.meta_value, label: row.meta_value, selected: row.selected }; }) : [];
                    });
                } catch (err) { console.error(err); }
            });
        }
        $s.addEventListener("change", function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            let _type = evt.target[0]?.getAttribute('data-custom-properties');
            set($s, _type, this.value, []);
        });
        if (o.statistic_filters) set($s, o.statistic_filters.dimension_type, o.statistic_filters.dimension, o.statistic_filters.value);
    },
    createGroup = function (e, o) {
        let $s = r.createElement('select', { name: "group" });
        e.appendChild(r.createElement('div', { class: "InputContainer cw-300" }, $s));
        new Choices($s, { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: 'Select a list…', itemSelectText: '', shouldSort: false })
            .setChoices(async () => {
                try {
                    return await groupData.getData().then(function (data) { return data ? data.map(function (row) { return { value: row.group_id, label: row.name, selected: row.group_id == (o && o.group) ? true : false }; }) : []; });
                } catch (err) { console.error(err); }
            });
    },
    createProfileProperty = function (e, o) {
        let $s = r.createElement('select', { name: "key" });
        $s.addEventListener("change", function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            e.removeChild(e.lastElementChild), createProfilePropertyValue(e, { key: this.value });
        });
        e.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, $s));

        let _ = new Choices($s, { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: 'Select a property…', itemSelectText: '', shouldSort: false });
        _.setChoices(async () => {
            try {
                return await propertyData.getData().then(function (data) { return data.map(function (row) { return { value: row.value, label: row.label, selected: row.value == o.key ? true : false } }) });
            } catch (err) { console.error(err); }
        });
    },
    createProfilePropertyValue = function (e, o) {
        let $s = r.createElement('select', { name: "value" });
        e.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, $s));
        new Choices($s, { allowHTML: false, placeholder: true, placeholderValue: 'Select a value…', itemSelectText: '', shouldSort: false })
            .setChoices(async () => {
                try {
                    return await getPropertyValue(o.key, o.value);
                } catch (err) { console.error(err); }
            });
    },
    createLabelCol = function (val) {
        return r.createElement('div', { class: "fix-label" }, r.createElement('span', { class: "h4_title" }, val));
    },
    createCountryCol = function (e, o) {
        let s = r.createElement('select', { name: "country_code" });
        e.appendChild(r.createElement('div', { class: "InputContainer cw-225" }, s));
        (function (e, o) {
            new Choices(e, { allowHTML: false, placeholder: true, placeholderValue: 'Choose a country...', itemSelectText: '', shouldSort: false })
                .setChoices(async () => {
                    try {
                        return await countryData.getData().then(function (data) { return data ? data.map(function (row) { return { value: row.code, label: row.name, selected: row.code == (o && o.country_code) ? true : false }; }) : []; })
                    } catch (err) { console.error(err); }
                });
        })(s, o);
    },
    showLoader = function () {
        let x = r.getElementById("loader");
        if (x.style.display === "none") { x.style.display = "block"; }
        else { x.style.display = "none"; }
    },
    addError = function (e) {
        let classesToAdd = ['parsley-error'], t = e.closest('div.choices');
        e.closest('div.choices').focus(), e.closest('div.choices__inner').classList.add(...classesToAdd);
        return false;
    },
    removeError = function (e) {
        let classesToAdd = ['parsley-error'];
        e.closest('div.choices__inner').classList.remove(...classesToAdd);
    },
    postDetails = function (t) {
        let s = !0, _o = { list_id: parseInt($(t).data('id')) || 0, list_name: $('#txtlist-name').val(), group_type_id: 2, definition: [] };
        document.querySelectorAll(__tags.t).forEach(e => {
            let c = { criteria: [] };
            e.querySelectorAll(__tags.r).forEach(r => {
                let JsonVar = {}, inputElements = r.querySelectorAll('input[type="number"],input[type="text"],input[type="hidden"], select, checkbox, textarea');
                inputElements.forEach(r => {
                    if (isCheckbox(r) && r.value != '') { stringToObj(r.name, r.value, JsonVar); }
                    else if (isSelect(r)) {
                        if (!isValidElement(r)) { s = 0; return addError(r) };
                        removeError(r), stringToObj(r.name, r.value, JsonVar);
                    }
                    else if (isMultiSelect(r)) {
                        let _values = getSelectValues(r);
                        if (_values.length === 0) { s = 0; return addError(r) };
                        removeError(r), stringToObj(r.name, getSelectValues(r), JsonVar);
                    }
                    else {
                        if (!isValidElement(r)) { s = 0; r.classList.add('parsley-error'), r.focus(); return; }
                        r.classList.remove('parsley-error'), stringToObj(r.name, r.value, JsonVar);
                    }
                });
                c.criteria.push(JsonVar);
            });
            _o.definition.push(c);
        });
        if (s) {
            showLoader(), t.disabled = true;
            Http.post(`/api/lists`, { body: _o }).then(response => response.json())
                .then(function (result) {
                    t.disabled = false;
                    if (parseInt(result.list_id) > 0) window.location = window.location.origin + `/list/${result.list_id}/members`;
                    else swal('Error!', result.message, 'error');
                }).then(() => { showLoader(); }).catch(error => { console.log('error', error); showLoader(), t.disabled = false; swal('Error!', error, 'error'); });
        }
    };

//var load = function () { addDefinition(); }();
export default segments;