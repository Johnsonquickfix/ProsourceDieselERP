import Http from '../../http/index.js';
import Cache from '../../http/cache.js';

function getCriteria() { return Http.get('/api/lists/criteria/type').then(response => response.json()); }
function getStatistic() { return Http.get('/api/lists/metrics').then(response => response.json()); }
function getProperties() { return Http.get('/api/lists/people/property').then(response => response.json()); }
function getGroups() { return Http.get('/api/lists/static-group').then(response => response.json()); }
function getCountry() { return Http.get(`/api/lists/countries`).then(response => response.json()); }
const criteriaData = new Cache(getCriteria), statisticData = new Cache(getStatistic), propertyData = new Cache(getProperties), groupData = new Cache(getGroups), countryData = new Cache(getCountry);

!(function () {
    $(document).ready(function () {
        $("#loader").hide();
        loaddata();
        $(document).on('click', 'a[data-add="true"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            var $detailDiv = $('#root'), url = $(this).data('url');
            $detailDiv.load(url);
        });
        $(document).on('click', 'a[data-action="edit"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            let d = $tb.DataTable().row($(this).closest('tr')).data();
            $(`#${bm} .modal-title`).html(`Edit ${d.group_type_name} Name`);
            $(`#${bm} .modal-body`).empty().append(`<label class="form-label">Update the name of this ${d.group_type_name.toLowerCase()}:</label>`);
            $(`#${bm} .modal-body`).append(`<input id="txtlist-name" class="form-control" type="text" placeholder="${d.group_type_name} Name" value="${d.name}">`);
            $(`#update-name`).data('id', d.group_id); $(`#txtlist-name`).focus();
        });
        $(document).on('click', 'a[data-action="delete"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            let d = $tb.DataTable().row($(this).closest('tr')).data();
            swal({
                title: `Delete ${d.group_type_name}`, text: `You are about to delete this ${d.group_type_name.toLowerCase()}. Are you sure you want to proceed?`,
                type: 'question', allowOutsideClick: false, showCancelButton: true, showConfirmButton: true, confirmButtonText: 'Yes, do it!'
            }).then((result) => {
                if (result.value) {
                    updateName('delete', d.group_id, d.name, $('#root').data('key'));
                }
            });
        });
        $(document).on('click', '#update-name', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            let id = parseInt($(this).data('id')) || 0, name = $(`#txtlist-name`).val(), key = $('#root').data('key');
            updateName('put', id, name, key);
        });
        // Add event listener for opening and closing details
        $('#datatable tbody').on('click', '.details-control', function () {
            let tr = $(this).closest('tr');
            let row = $('#datatable').DataTable().row(tr);
            if (row.child.isShown()) {
                // This row is already open - close it
                tr.find('.details-control').empty().append('<i class="fas fa-angle-right fa-2x"></i>');
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                tr.find('.details-control').empty().append('<i class="fas fa-angle-down fa-2x"></i>');
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        });
    });
})();

var $tb = $('#datatable'), bm = 'modalEdit',
    loaddata = function () {
        $tb.DataTable({
            lengthMenu: [[25, 50, 100], [25, 50, 100]], order: [[4, "desc"]],
            destroy: true, bProcessing: true, responsive: false, bServerSide: true, bAutoWidth: true, scrollX: false,
            language: {
                lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> of _TOTAL_",
                infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
            },
            sAjaxSource: "/api/profiles/group-list",
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
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
                    data: 'group_id', title: '', sWidth: "2%", orderable: false, render: function (data, type, row, meta) {
                        return `${row.group_type_id === 2 ? '<a href="javascript:void(0);" class="details-control" data-toggle="tooltip" title="View definition."><i class="fas fa-angle-right fa-2x"></i></a>' : ''}`;
                    }
                },
                {
                    data: 'name', title: 'List', sWidth: "58%", orderable: false, render: function (data, type, row, meta) {
                        return `<div class=""><a href="#" class="me-2"><i class="fas fa-star ${row.is_flagged === !1 ? 'text-light' : 'text-warning'}"></i></a> <a data-add="false" data-url='/lists/listmembers/${row.group_id}' href="/list/${row.group_id}/members">${data}</a></div>`;
                    }
                },
                { data: 'group_type_name', title: 'Type', sWidth: "10%", class: '', orderable: false, render: function (data, type, row, meta) { return `<span class="bg-primary bg-soft text-primary badge font-size-12 me-2"><i class="fas ${row.group_type_id === 1 ? 'fa-list-ul' : 'fa-bolt'}"></i> ${row.group_type_name}</span>`; } },
                { data: 'slug', title: 'Members', sWidth: "10%", class: 'text-end', orderable: false, render: function (data, type, row, meta) { return `<a href="/lists/listmembers/${row.slug}" id="${row.group_id}" data-member-count="true">0</a>`; } },
                { data: 'created', title: 'Created', sWidth: "15%", render: function (data, type, full, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                { data: 'created', title: 'Action', sWidth: "5%", orderable: false, render: function (data, type, row, meta) { return _template('action', row); } }
            ],
            initComplete: function (settings, json) {
                countMember();
            },
        });
    },
    countMember = function () {
        $('a[data-member-count="true"]').each(function (key, val) {
            Http.get(`/api/lists/${$(val).attr('id')}/member_count`).then(response => response.json()).then(response => { val.text = response; })
            //$.get(`/api/lists/${$(val).attr('id')}/member_count`, {}).done(function (result) { $(val).html(result); });
        });
    },
    updateName = function (action, id, name, key) {
        $.ajax({
            dataType: 'json', type: action, url: `/api/lists/${id}?api_key=${key}`, data: { list_name: name },
            success: function (result) {
                if (parseInt(result.list_id) > 0) {
                    $(`#${bm}`).modal('hide'); $tb.DataTable().ajax.reload(null, false)
                }
                else { swal('Error!', result.message, 'error'); }
            },
            error: function (xhr, textStatus, error) { swal('Error!', xhr.responseJSON.message, 'error'); },
            always: function () { }
        });
    },
    format = function (d) {
        let r = document, j = JSON.parse(d.definition);
        var d = r.createElement('ul', { class: 'mb-2', });
        let g = null, c = null;

        j.forEach((container, iContainer) => {
            let _li = r.createElement('li', { class: '' });
            container.criteria.forEach((row, iRow) => {
                let $span = r.createElement('span', { class: '' });
                iRow > 0 && $span.appendChild(r.createElement('span', {}, `OR `));
                if (row.type === 'customer-statistic-value') {
                    $span.appendChild(r.createElement('span', {}, `<b>${row.metric_name}</b> `));
                    if (row.operator === 'gt-zero') $span.appendChild(r.createElement('span', {}, `at least once `));
                    else if (row.operator === 'eq-zero') $span.appendChild(r.createElement('span', {}, `zero times `));
                    else if (row.operator === 'eq') $span.appendChild(r.createElement('span', {}, `equals `));
                    else if (row.operator === 'neq') $span.appendChild(r.createElement('span', {}, `doesn't equal `));
                    else if (row.operator === 'gte') $span.appendChild(r.createElement('span', {}, `is at least `));
                    else if (row.operator === 'gt') $span.appendChild(r.createElement('span', {}, `is greater than `));
                    else if (row.operator === 'lt') $span.appendChild(r.createElement('span', {}, `is less than `));
                    else if (row.operator === 'lte') $span.appendChild(r.createElement('span', {}, `is at most `));

                    if (row.timeframe === 'alltime') {
                        $span.appendChild(r.createElement('span', {}, `over all time `));
                    }
                    else if (row.timeframe === 'in-the-last') {
                        $span.appendChild(r.createElement('span', {}, `in the last `));
                        row.timeframe_options && $span.appendChild(r.createElement('span', {}, `<b>${row.timeframe_options.quantity}</b> <b>${row.timeframe_options.units}s</b>`));
                    }
                    else if (row.timeframe === 'between') {
                        $span.appendChild(r.createElement('span', {}, `between `));
                        row.timeframe_options && $span.appendChild(r.createElement('span', {}, `<b>${row.timeframe_options.start}</b> and <b>${row.timeframe_options.end}</b>`));
                    }
                    else if (row.timeframe === 'before') {
                        $span.appendChild(r.createElement('span', {}, `before `));
                        row.timeframe_options && $span.appendChild(r.createElement('span', {}, `<b>${(new Date(row.timeframe_options.value)).toLocaleDateString()}</b>`));
                    }
                    else if (row.timeframe === 'after') {
                        $span.appendChild(r.createElement('span', {}, `after `));
                        row.timeframe_options && $span.appendChild(r.createElement('span', {}, `<b>${(new Date(row.timeframe_options.value)).toLocaleDateString()}</b>`));
                    }
                    else if (row.timeframe === 'between-static') {
                        $span.appendChild(r.createElement('span', {}, `between dates `));
                        row.timeframe_options && $span.appendChild(r.createElement('span', {}, `<b>${(new Date(row.timeframe_options.start)).toLocaleDateString()}</b> and <b>${(new Date(row.timeframe_options.end)).toLocaleDateString()}</b>`));
                    }
                    row.statistic_filters && $span.appendChild(r.createElement('span', {}, ` where <b>${row.statistic_filters.dimension}</b> ${row.statistic_filters.operator} <b>${row.statistic_filters.value.join(', ')}</b>`));
                }
                else if (row.type === 'customer-attribute') {
                    $span.appendChild(r.createElement('span', {}, `<b>${row.key}</b> `));
                    if (row.operator === 'eq') $span.appendChild(r.createElement('span', {}, `equals `));
                    else if (row.operator === 'neq') $span.appendChild(r.createElement('span', {}, `doesn't equal `));
                    else if (row.operator === 'contains') $span.appendChild(r.createElement('span', {}, `contains `));
                    else if (row.operator === 'ncontains') $span.appendChild(r.createElement('span', {}, `doesn't contain `));
                    else if (row.operator === 'starts-with') $span.appendChild(r.createElement('span', {}, `start with `));
                    else if (row.operator === 'nstarts-with') $span.appendChild(r.createElement('span', {}, `doesn't start with `));
                    else if (row.operator === 'ends-with') $span.appendChild(r.createElement('span', {}, `ends with `));
                    else if (row.operator === 'nends-with') $span.appendChild(r.createElement('span', {}, `doesn't ends with `));
                    else if (row.operator === 'exists') $span.appendChild(r.createElement('span', {}, `is set `));
                    else if (row.operator === 'nexists') $span.appendChild(r.createElement('span', {}, `is not set `));
                    $span.appendChild(r.createElement('span', {}, `<b>${row.value}</b> `));
                }
                else if (row.type === 'customer-location') {
                    $span.appendChild(r.createElement('span', {}, 'Location <b>' + (row.operator === 'eq' ? 'Is ' : 'Is not ') + '</b> within'));
                    if (row.region_id === 'EUROPEAN_UNION') $span.appendChild(r.createElement('span', {}, `<b>European Union</b>`));
                    else if (row.region_id === 'UNITED_STATES') $span.appendChild(r.createElement('span', {}, `<b>United States</b>`));
                }
                else if (row.type === 'customer-distance') {
                    $span.appendChild(r.createElement('span', {}, 'Person ' + (row.operator === 'eq' ? 'Is ' : 'Is not ')));
                    $span.appendChild(r.createElement('span', {}, `within ${row.distance} `));
                    $span.appendChild(r.createElement('span', {}, `within ${row.units} `));
                    $span.appendChild(r.createElement('span', {}, `of ${row.postal_code} `));
                    $span.appendChild(r.createElement('span', {}, `in ${row.country_code} `));
                }
                else if (row.type === 'customer-group-membership') {
                    $span.appendChild(r.createElement('span', {}, (row.operator === 'eq' ? 'Is ' : 'Is not ')));
                    $span.appendChild(r.createElement('span', {}, `in <b>${row.group_name}</b> `));
                    if (row.timeframe === 'in-the-last') $span.appendChild(r.createElement('span', {}, `and was added in the last <b>${row.timeframe_options.quantity} ${row.timeframe_options.units}s</b>`));
                    else if (row.timeframe === 'more-than') $span.appendChild(r.createElement('span', {}, `and was added more than <b>${row.timeframe_options.quantity} ${row.timeframe_options.units}s</b> ago`));
                    else if (row.timeframe === 'at-least') $span.appendChild(r.createElement('span', {}, `and was added at least <b>${row.timeframe_options.quantity} ${row.timeframe_options.units}s</b> ago`));
                    else if (row.timeframe === 'between') $span.appendChild(r.createElement('span', {}, `and was added between <b>${row.timeframe_options.start}</b> and <b>${row.timeframe_options.end} ${row.timeframe_options.units}s</b>`));
                    else if (row.timeframe === 'before') $span.appendChild(r.createElement('span', {}, `and was added before <b>${(new Date(row.timeframe_options.value)).toLocaleDateString()}</b>`));
                    else if (row.timeframe === 'after') $span.appendChild(r.createElement('span', {}, `and was added after <b>${(new Date(row.timeframe_options.value)).toLocaleDateString()}</b>`));
                    else if (row.timeframe === 'between-static') $span.appendChild(r.createElement('span', {}, `and was added between dates <b>${(new Date(row.timeframe_options.start)).toLocaleDateString()}</b> and <b>${(new Date(row.timeframe_options.end)).toLocaleDateString()}</b>`));
                }
                else if (row.type === 'customer-exclusion') {
                    $span.appendChild(r.createElement('span', {}, 'Person <b>' + (row.operator === 'eq' ? 'Is ' : 'Is not ') + '</b> suppressed for email'));
                }
                _li.appendChild($span);
                _li.append(r.createElement('br'));
            });
            d.append(_li);
        })
        return d;
    },
    info = function (s) {
        switch (s.timeframe) {
            case 'in-the-last':
                return `in the last <b>${s.timeframeOptions.quantity} ${s.timeframeOptions.units}s</b>`;
            case 'more-than':
                return `more than <b>${s.timeframeOptions.quantity} ${s.timeframeOptions.units}s</b> ago`;
            case 'at-least':
                return `at least <b>${s.timeframeOptions.quantity} ${s.timeframeOptions.units}s</b> ago`;
            case 'between':
                return `between <b>${s.timeframeOptions.start}</b> and <b>${s.timeframeOptions.end} ${s.timeframeOptions.units}s</b>`;
            case 'before':
                return `before <b>${s.timeframeOptions.value}</b>`;
            case 'after':
                return `after <b>${s.timeframeOptions.value}</b>`;
            case 'between-static':
                return `between dates <b>${s.timeframeOptions.start}</b> and <b>${s.timeframeOptions.end}</b>`;
            default:
                return '';
        }
    },
    getGroup = function () {
        return $.ajax({ url: '/api/lists/static-group', type: 'get', dataType: 'json', async: false, success: function (res) { return res } });
    },
    getCountries = function () {
        return $.ajax({ url: '/api/lists/countries', type: 'get', dataType: 'json', async: false, success: function (res) { return res } });
    },
    _template = function (t, d) {
        let h = '';
        if (t === 'action') {
            if (d.group_type_id === 2) {
                h = `<a class="dropdown-item" href="/list/${d.group_id}/edit/${d.slug}">Update Definition</a><a class="dropdown-item" href="#" data-action="edit" data-bs-toggle="modal" data-bs-target="#modalEdit">Edit Segment Name</a>
                        <div class="dropdown-divider"></div><a class="dropdown-item" href="#">View Campaigns</a>`;
            }
            else
                h = `<a class="dropdown-item" href="#" data-add="true" data-url="/lists/ImportMembers/${d.group_id}" >Import Data</a><a class="dropdown-item" href="#" data-action="edit" data-bs-toggle="modal" data-bs-target="#modalEdit">Edit List Name</a><a class="dropdown-item" href="#">List Settings</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">View Campaigns</a><a class="dropdown-item" href="#">View Excluded People</a><a class="dropdown-item" href="#">View Signup Forms</a>`;
            return `<div class="dropdown">
                            <a class="btn btn-outline-dark" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end" style="">
                                ${h}
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" data-action="delete">Delete</a>
                            </div>
                        </div>`
        }
    };