!(function () {
    $(document).ready(function () {
        $("#loader").hide(), loaddata();
        $(document).on('click', 'button[data-action="edit"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            $(`#${bm} .modal-title`).html(`Edit Template Name`), $(`#update-name`).html('Update Template');
            let d = $tb.DataTable().row($(this).closest('tr')).data();
            $('#txtname').val(d.name), $(`#update-name`).data('id', d.template_id), $(`#update-name`).data('action', 'rename'), $(`#txtname`).focus();
        });
        $(document).on('click', 'button[data-action="clone"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            $(`#${bm} .modal-title`).html(`Clone Template`), $(`#update-name`).html('Clone Template');
            let d = $tb.DataTable().row($(this).closest('tr')).data();
            $('#txtname').val(d.name), $(`#update-name`).data('id', d.template_id), $(`#update-name`).data('action', 'clone'), $(`#txtname`).focus();
        });
        $(document).on('click', '#update-name', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            let id = parseInt($(this).data('id')) || 0, name = $(`#txtname`).val();
            updateName($(this).data('action'), id, name);
        });
        $(document).on('click', 'button[data-action="export"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            let d = $tb.DataTable().row($(this).closest('tr')).data();
            get(d.template_id);
        });

        $(document).on('click', 'button[data-action="delete"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation();
            let d = $tb.DataTable().row($(this).closest('tr')).data();
            swal({
                title: `Delete Template`, text: `You are about to delete this template. Are you sure you want to proceed?`,
                type: 'question', allowOutsideClick: false, showCancelButton: true, showConfirmButton: true, confirmButtonText: 'Yes, do it!'
            }).then((result) => {
                if (result.value) { updateName('delete', d.template_id, d.name); }
            });
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
                sAjaxSource: "/api/email-templates/list",
                fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                    if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                    oSettings.jqXHR = $.ajax({
                        url: sSource, data: aoData,// dataType: 'json', type: "get", 
                        success: function (result) {
                            //let _recordsTotal = data.length > 0 ? data[0].totalcount : 0;
                            return fnCallback({ sEcho: aoData.find(el => el.name === "sEcho").value, recordsTotal: result.total, recordsFiltered: result.total, aaData: result.data });
                        }
                    });
                },
                columns: [
                    {
                        data: 'name', title: 'Name', sWidth: "40%", render: function (data, type, row, meta) {
                            //return `<div class="d-flex"><img src="${row.thumbnail_url}" alt="" height="40" class="rounded"><div class="ms-3 align-self-center overflow-hidden me-auto"><a href="/emailtemplates/editor/${row.template_id}">${data}</a></div>`;
                            return `<div class="d-flex"><img src="${row.thumbnail_url != null ? row.thumbnail_url : '/content/images/logo.png'}" alt="" height="40" width="40" class="rounded"><div class="ms-3 align-self-center overflow-hidden me-auto"><a href="/emailtemplates/editor/${row.template_id}">${data}</a></div>`;
                        }
                    },
                    { data: 'created', title: 'Added On', sWidth: "15%", render: function (data, type, row, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    { data: 'updated', title: 'Last Update', sWidth: "15%", render: function (data, type, row, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    { data: 'template_id', title: 'Action', sWidth: "10%", orderable: false, render: function (data, type, row, meta) { return action(row); } }
                ]
            });
        },
        action = function (t) {
            r = document;
            var _ = r.createElement('div', { class: 'dropdown', },
                r.createElement('a', { class: 'text-muted font-size-16', role: "button", "data-bs-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false" }, '<i class="mdi mdi-dots-horizontal"></i>'),
                r.createElement('div', { class: 'dropdown-menu dropdown-menu-end', },
                    r.createElement('a', { class: 'dropdown-item', href: `/emailtemplates/editor/${t.template_id}`, title: 'Edit Template' }, 'Edit Template'),
                    r.createElement('button', { class: 'dropdown-item', title: 'Edit Name', "data-action": "edit", "data-bs-toggle": "modal", "data-bs-target": "#modalEdit" }, 'Edit Name'),
                    r.createElement('button', { class: 'dropdown-item', title: 'Export', "data-action": "export", "data-bs-toggle": "modal", "data-bs-target": "#modalExport" }, 'Export'),
                    r.createElement('button', { class: 'dropdown-item', title: 'Clone', "data-action": "clone", "data-bs-toggle": "modal", "data-bs-target": "#modalEdit" }, 'Clone'),
                    r.createElement('div', { class: 'dropdown-divider' }),
                    r.createElement('button', { class: 'dropdown-item', title: 'Delete', "data-action": "delete" }, 'Delete'),
                )
            );
            return _.outerHTML;
        },
        updateName = function (action, id, name) {
            let _ = action === 'rename' ? 'put' : (action === 'delete' ? 'delete' : (action === 'clone' ? 'post' : ''));
            //let _ = action === 'put' ? 'rename' : (action === 'delete' ? 'delete' : 'clone');
            if (_ !== '') {
                $.ajax({
                    dataType: 'json', type: _, url: `/api/email-templates/${id}/${action}`, data: { name: name },
                    success: function (result) {
                        if (parseInt(result.id) > 0) { $(`#${bm}`).modal('hide'); $tb.DataTable().ajax.reload(null, false); }
                        else { swal('Error!', result.message, 'error'); }
                    },
                    error: function (xhr, textStatus, error) { swal('Error!', xhr.responseJSON.message, 'error'); },
                    always: function () { }
                });
            }
            else { swal('Error!', 'Invalid action type.', 'error'); }
        },
        get = function (id) {
            $(`#modalExport .modal-body`).empty().append(r.createElement('p', {}, 'Loding......'));
            $.get(`/api/email-templates/template/${id}`).done(function (data) {
                $.each(data, function (index, value) {
                    r = document;
                    $(`#modalExport .modal-body`).empty().append(r.createElement('label', { class: 'form-label', }, 'Copy the HTML for your email template below.'));
                    $(`#modalExport .modal-body`).append(r.createElement('textarea', { class: 'form-control', readonly: 'true', rows: 9 }, value.data_html));
                });
            }).fail(function (jqxhr, settings, ex) { });
        }
        ;
})();