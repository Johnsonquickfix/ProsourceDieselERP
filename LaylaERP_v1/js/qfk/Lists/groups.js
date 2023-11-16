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
                tr.find('.details-control').empty().append('<i class="fas fa-angle-right"></i> View definition');
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                tr.find('.details-control').empty().append('<i class="fas fa-angle-down"></i> View definition');
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        });
    });

    var $tb = $('#datatable'), bm = 'modalEdit',
        loaddata = function () {
            $tb.DataTable({
                lengthMenu: [[25, 50, 100], [25, 50, 100]], order: [[2, "desc"]],
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
                        data: 'name', title: 'List', sWidth: "60%", orderable: false, render: function (data, type, row, meta) {
                            return `<div class="mb-2"><a data-add="false" data-url='/lists/listmembers/${row.group_id}' href="/list/${row.group_id}/members">${data}</a> <span class="bg-primary bg-soft text-primary badge font-size-12 me-2"><i class="fas ${row.group_type_id === 1 ? 'fa-list-ul' : 'fa-bolt'}"></i> ${row.group_type_name}</span> <a href="#"><i class="fas fa-star ${row.is_flagged === !1 ? 'text-light' : 'text-warning'}"></i></a></div>`
                                + `${row.group_type_id === 2 ? '<div><a href="javascript:void(0);" class="details-control" data-toggle="tooltip" title="View definition."><i class="fas fa-angle-right"></i> View definition</a></div>' : ''} `
                        }
                    },
                    { data: 'slug', title: 'Members', sWidth: "10%", class: 'text-end', orderable: false, render: function (data, type, row, meta) { return `<a href="/lists/listmembers/${row.slug}" id="${row.group_id}" data-member-count="true">0</a>`; } },
                    { data: 'created', title: 'Created', sWidth: "20%", render: function (data, type, full, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    { data: 'created', title: 'Action', sWidth: "10%", orderable: false, render: function (data, type, row, meta) { return _template('action', row); } }
                ],
                initComplete: function (settings, json) {
                    countMember();
                },
            });
        },
        countMember = function () {
            $('a[data-member-count="true"]').each(function (key, val) {
                $.get(`/api/lists/${$(val).attr('id')}/member_count`, {}).done(function (result) { $(val).html(result); });
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
            r = document, j = JSON.parse(d.definition);
            var d = r.createElement('ul', { class: 'mb-2', });
            let g = null, c = null;

            $.each(j, function (i, row) {
                let _ = r.createElement('li', { class: '' });
                $.each(row.criteria, function (si, s) {
                    console.log('customer-attribute ', s)
                    if (s.type === 'customer-statistic-value') {
                        //(g === null ? getGroup().done(function (data) { g = data }) : void (0));
                        //let _n = g.find(el => el.group_id === s.group); _n = _n ? _n.name : '';
                        let _w = s.statistic_filters ? ` where <b>${s.statistic_filters.dimension}</b> ${s.statistic_filters.operator} <b>${s.statistic_filters.value.join(', ')}</b>` : '';
                        _.append(r.createElement('span', { class: '' }, `${s.statistic} ${s.operator} ${s.timeframe} ${_w}`
                            //(si > 0 ? 'OR ' : '') + (s.operator === 'eq' ? 'Is' : 'Is not') + ' in <b>' + _n + '</b> and was added ' + info(s)
                        ));
                    }
                    else if (s.type === 'customer-attribute') {
                        (g === null ? getGroup().done(function (data) { g = data }) : void (0));
                        let _n = g.find(el => el.group_id === s.group); _n = _n ? _n.name : '';
                        _.append(r.createElement('span', { class: '' },
                            (si > 0 ? 'OR ' : '') + (s.operator === 'eq' ? 'Is' : 'Is not') + ' in <b>' + _n + '</b> and was added ' + info(s)
                        ));
                    }
                    else if (s.type === 'customer-exclusion') {
                        _.append(r.createElement('span', { class: '' },
                            'Person <b>' + (s.operator === 'eq' ? 'Is' : 'Is not') + '</b> suppressed for email'
                        ));
                    }
                    else if (s.type === 'customer-location') {
                        (c === null ? getCountries().done(function (data) { c = data }) : void (0));
                        let _n = c.find(el => el.code === s.country_id); _n = _n ? _n.name : '';
                        _.append(r.createElement('span', { class: '' },
                            'Location <b>' + (s.operator === 'eq' ? 'Is' : 'Is not') + '</b> within <b>' + _n + '</b>'
                        ));
                    }
                    
                    _.append(r.createElement('br'));
                });
                d.append(_);
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
                    return _d = '';
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
})();