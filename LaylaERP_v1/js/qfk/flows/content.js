import Http from '../../http/index.js';
import flowConfig, { loader } from '../../qfk/flows/flowconfig.js';
var e = e || document, lt = {};

e.addEventListener("DOMContentLoaded", function () {
    lt = flowConfig(1000);
    e.querySelector("#change-template")?.addEventListener("click", (evt) => {
        evt.preventDefault(), evt.stopPropagation();
        let p = e.getElementById("template_type"); e.getElementById("btn-action").replaceChildren();
        p.replaceChildren(e.createElement('div', { class: 'alert alert-warning' }, '<i class="fas fa-exclamation-triangle me-2"></i>Selecting a new template will permanently delete existing content for your campaign. To avoid losing any work, <a href="">return to your current template</a>'));
        p.append(e.createElement('div', { class: 'row' }, e.createElement('div', { class: 'col-sm-12 d-grid gap-2 mb-2' },
            e.createElement('a', { id: 'email-editor', class: 'btn p-0', href: 'javascript:void(0);', style: "width: -webkit-fill-available;"},
                e.createElement('div', { class: 'card-radio text-center' },
                    e.createElement('i', { class: 'fas fa-laptop-code font-size-24 text-warning align-middle mt-4 mb-2' }),
                    e.createElement('h5', { class: 'font-size-14 mb-0' }, 'Drag and Drop'),
                    e.createElement('p', { class: 'text-muted my-3 text-wrap' }, 'Create an email using our drag-and-drop editor.')
                )))));
        p.append(e.createElement('div', { class: 'row' }, e.createElement('div', { class: 'col-sm-6' },
            e.createElement('a', { id: "text-editor", class: 'btn p-0', href: 'javascript:void(0);', style: "width: -webkit-fill-available;" },
                e.createElement('div', { class: 'card-radio text-center' },
                    e.createElement('i', { class: 'fas fa-laptop-code font-size-24 text-warning align-middle mt-4 mb-2' }),
                    e.createElement('h5', { class: 'font-size-14 mb-0' }, 'Text Only'),
                    e.createElement('p', { class: 'text-muted my-3 text-wrap' }, 'Send a plain text email for a more personal feel.')
                ))),
            e.createElement('div', { class: 'col-sm-6' }, e.createElement('a', { id: "html-editor", class: 'btn p-0', href: 'javascript:void(0);', style: "width: -webkit-fill-available;" },
                e.createElement('div', { class: 'card-radio text-center' },
                    e.createElement('i', { class: 'fas fa-laptop-code font-size-24 text-warning align-middle mt-4 mb-2' }),
                    e.createElement('h5', { class: 'font-size-14 mb-0' }, 'HTML'),
                    e.createElement('p', { class: 'text-muted my-3 text-wrap' }, 'Custom-code your email for complete control.')
                ))
            )));

        e.querySelector("#text-editor")?.addEventListener("click", (evt) => { evt.preventDefault(), evt.stopPropagation(), setContent('text'); });
        e.querySelector("#html-editor")?.addEventListener("click", (evt) => { evt.preventDefault(), evt.stopPropagation(), setContent('html'); });
        e.querySelector("#email-editor")?.addEventListener("click", (evt) => { evt.preventDefault(), evt.stopPropagation(), setContent('email'); });
    });
    e.querySelector("#text-editor")?.addEventListener("click", (evt) => {
        evt.preventDefault(), evt.stopPropagation(), setContent('text');
    });
    e.querySelector("#html-editor")?.addEventListener("click", (evt) => {
        evt.preventDefault(), evt.stopPropagation(), setContent('html');
    });
    e.querySelector("#email-editor")?.addEventListener("click", (evt) => {
        evt.preventDefault(), evt.stopPropagation(), setContent('email');
    });
    e.querySelector("#save-content")?.addEventListener("click", (evt) => {
        evt.preventDefault(), evt.stopPropagation(), Post();
    });
});

const ValidateEmail = function (v) { let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; return v.match(regex); },
    fr = function (e) {
        let id = parseInt(e.getElementById('subject').getAttribute('data-id')) | 0;
        let p = e.getElementsByTagName("footer")[0], $a = e.createElement('button', { class: 'btn btn-primary float-end' }, 'Continue to Review');
        let _back = e.createElement('a', { class: 'btn btn-outline-dark', href: window.location.origin + '/campaigns/create/' + id }, 'Back');
        p.replaceChildren(), p.append(_back), p.append($a), $a.onclick = function () { Post(); }
    };
function setContent(_type) {
    let j = { id: parseInt(lt.flow()) || 0, content_type: _type };
    e.querySelector('#root').querySelectorAll('input[type="text"]').forEach(r => { stringToObj(r.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "_"), r.value, j); });

    if (j.id === 0) { swal('Error!', 'Invalid content.', 'error').then(function () { swal.close(); }); return false; }
    else {
        Http.post(lt.urls.flowMessageContentType(j.id), { body: j }).then(response => response.json())
            .then((response) => {
                if (response.status === 200) {
                    if (_type === 'text') window.location = window.location.origin + lt.urls.flowMessageContentText(j.id);
                    else if (_type === 'html') window.location = window.location.origin + lt.urls.flowMessageContentHtml(j.id);
                    else if (_type === 'email') window.location = window.location.origin + lt.urls.flowMessageContentEmail(j.id);
                }
                else { swal('Error!', response.message, 'error'); }
            }).catch(error => { console.log('error', error); });
    }
}
function Post() {
    let j = { campaign_id: parseInt(e.getElementById('subject').getAttribute('data-id')) | 0, action: 'content' };
    j.content = {
        subject: e.getElementById('subject').value, preview_text: e.getElementById('preview_text').value, from_label: e.getElementById('from_label').value, from_email: e.getElementById('from_email').value, reply_to_email: e.getElementById('reply_to_email').value,
        content_type: e.getElementById('subject').getAttribute('data-content-type'), template_id: 0
    };
    if (j.campaign_id === 0) { swal('Error!', 'Invalid campaign.', 'error').then(function () { swal.close(); }); return false; }
    else if (j.content.subject === '') { swal('Error!', 'Please enter subject line.', 'error').then(function () { swal.close(); e.getElementById('subject').focus(); }); return false; }
    else if (j.content.from_label === '') { swal('Error!', 'Please enter sender name.', 'error').then(function () { swal.close(); e.getElementById('from_label').focus(); }); return false; }
    else if (j.content.from_email === '') { swal('Error!', 'Please enter sender email address.', 'error').then(function () { swal.close(); e.getElementById('from_email').focus(); }); return false; }
    else if (!ValidateEmail(j.content.from_email)) { swal('Error!', 'Please enter valid sender email address.', 'error').then(function () { swal.close(); e.getElementById('from_email').focus(); }); return false; }
    else if (!ValidateEmail(j.content.reply_to_email) && j.content.reply_to_email !== '') { swal('Error!', 'Please enter valid reply-to email address.', 'error').then(function () { swal.close(); e.getElementById('from_email').focus(); }); return false; }
    //else if (j.content.template_id === 0) { swal('Error!', 'Your changes have been saved. Select a template to continue.', 'error').then(function () { swal.close(); e.getElementById('from_email').focus(); }); return false; }
    else {
        $.ajax({
            type: 'PATCH', url: '/api/campaigns',
            contentType: "application/json",
            data: JSON.stringify(j),
            success: function (result) {
                if (result.status > 0 && j.content.content_type) {
                    window.location = window.location.origin + `/campaigns/${result.id}/schedule`;
                }
                else if (result.status > 0 && !j.content.content_type) { swal('Info!', 'Your changes have been saved. Select a template to continue.', 'info'); }
                else { swal('Info!', result.response, 'info'); }
            },
            error: function (jqXHR, exception) { swal('Error!', jqXHR.responseJSON.message, 'error'); }
        });
    }
}
const st = function (i) {
    e = document; let p = e.getElementById("template"), $a = e.createElement('button', { class: 'btn btn-light btn-sm' }, 'Change Template');
    e.getElementById("btn-action").replaceChildren($a), $a.onclick = function () { tp(e); };
    p.replaceChildren(), p.setAttribute("data-id", i); $.ajaxSetup({ async: false });
    $.get(`/api/email-templates/template/${i}`, {}).done(function (result) {
        $.each(result, function (i, r) {
            p.append(e.createElement('iframe', { srcdoc: r.data_html, frameborder: 0, style: 'width: 100%; min-height:400px', sandbox: 'allow-same-origin allow-scripts allow-popups allow-forms' }));
        });
    });
},
    tp = function (e) {
        let p = e.getElementById("template"); p.replaceChildren(), p.setAttribute("data-id", 0), e.getElementById("btn-action").replaceChildren();
        p.append(e.createElement('ul', { class: 'template-list d-flex align-content-end flex-wrap' }));
        p.append(e.createElement('div', { class: 'col-12' }, e.createElement('div', { id: 'page' }, e.createElement('ul', { class: 'pagination' }))));
        searchdata('', 0), createPagination();
    };
function searchdata(_query, _page) {
    let $ul = $('.template-list').empty();
    let o = [{ name: 'sSearch', value: '' }, { name: 'iDisplayStart', value: _page }, { name: 'iDisplayLength', value: 12 }, { name: 'sSortColName', value: 'name' }, { name: 'sSortDir_0', value: 'asc' }];
    $.ajaxSetup({ async: false });
    $.get(`/api/email-templates/list`, o).done(function (result) {
        d = document, $('#page').data('size', result.total);
        $.each(result.data, function (i, r) {
            let $a = d.createElement('a', { class: 'btn btn-primary', "data-id": r.template_id }, 'Use template'), $li = d.createElement('li', { class: 'col-xl-3 col-sm-6' },
                d.createElement('div', { class: 'card' },
                    d.createElement('div', { class: 'card-body' },
                        d.createElement('div', { class: 'product-img text-center', style: 'min-height: 120px;' },
                            d.createElement('img', { class: 'img-fluid mx-auto', src: (r.thumbnail_url != null ? r.thumbnail_url : '/content/images/logo.png'), alt: r.name, style: 'max-height: 200px;' },)
                        ),
                        d.createElement('div', { class: 'mt-4 text-center' },
                            d.createElement('h5', { class: 'mb-3 text-truncate' }, d.createElement('a', { class: 'text-dark' }, r.name)),
                            $a
                        )
                    )
                )
            );
            $a.onclick = function () { st(r.template_id); }
            $ul.append($li);
        });
    });
}
function createPagination() {
    let _size = parseInt($('#page').data('size')) || 12, _limit = 12;
    $('#page').Pagination({
        size: _size, pageShow: 5, page: 1, limit: _limit,
    }, function (obj) { searchdata('', (obj.page - 1) * _limit); });
}