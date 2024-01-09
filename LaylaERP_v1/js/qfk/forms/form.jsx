import Http from '../../js/http/index.js';
//import Modal, { ModalHeader, ModalBody, ModalFooter } from '../../js/qfk/components/Modal.jsx';
//console.log(Http)
const r = document, a = React;
function HeaderDiv() {
    return (
        <div className="page-header">
            <div className="breadcrumb-bar">
                <a href="index" className="crumb" > Sign-up forms
                </a>
            </div>
            <div className="breadcrumb-bar">
                <input type="button" className="white_btn" value="Create new sign-up form" onClick={(e) => createForm(e)} />
            </div>
        </div>
    );
}
function exam() {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const state = {
        modal: false
    };
    const toggle = () => {
        React.setState({ modal: !state.modal });
    }
    return (
        <>
            <button
                type="button"
                className="btn btn-secondary"
                onClick={toggle}
            >
                Modal
            </button>
            <Modal isOpen={state.modal}>
                {/*<ModalHeader>*/}
                {/*    <h3>This is modal header</h3>*/}
                {/*    <button*/}
                {/*        type="button"*/}
                {/*        className="close"*/}
                {/*        aria-label="Close"*/}
                {/*        onClick={toggle}*/}
                {/*    >*/}
                {/*        <span aria-hidden="true">&times;</span>*/}
                {/*    </button>*/}
                {/*</ModalHeader>*/}
                {/*<ModalBody>*/}
                {/*    <p>This is modal body</p>*/}
                {/*</ModalBody>*/}
                {/*<ModalFooter>*/}
                {/*    <button*/}
                {/*        type="button"*/}
                {/*        className="btn btn-secondary"*/}
                {/*        onClick={toggle}*/}
                {/*    >*/}
                {/*        Close*/}
                {/*    </button>*/}
                {/*    <button*/}
                {/*        type="button"*/}
                {/*        className="btn btn-primary"*/}
                {/*        onClick={toggle}*/}
                {/*    >*/}
                {/*        Save changes*/}
                {/*    </button>*/}
                {/*</ModalFooter>*/}
            </Modal>
        </>
    );
}

function createForm(event) {
    event.preventDefault();
    let mp = new ModalPopup(), _m = mp.inti('Create sign-up form'), myModal = new bootstrap.Modal(_m),
        s = r.createElement('select', { name: "list" }); debugger
    _m.querySelector('.modal-body').replaceChildren(
        r.createElement('div', { class: "InputContainer mb-2" },
            r.createElement('label', { class: "form-label" }, 'Form name'),
            r.createElement('input', { class: "form-control", type: "text", name: "name", placeholder: "e.g. Newsletter sign-up", autocomplete: "off", value: "" })
        ),
        r.createElement('div', { class: "InputContainer mb-2" },
            r.createElement('label', { class: "form-label" }, 'Which list should subscribers be added to?'),
            r.createElement('div', {}, s)
        ),
        r.createElement('div', { class: "InputContainer mb-2" },
            r.createElement('label', { class: "form-label" }, 'Choose a form type'),
            r.createElement('div', { class: "card-box mb-2" },
                r.createElement('label', { class: "d-flex w-100" },
                    r.createElement('input', { class: "mx-4", type: "radio", id: "0277bac8-8d5b-4d03-be09-a177e4a8b116", name: "formType", value: "POPUP", checked: "" }),
                    r.createElement('div', { class: "align-self-center overflow-hidden me-auto" },
                        r.createElement('div', { class: "flex-shrink-0 align-self-center me-3" }),
                        r.createElement('div', { class: "flex-grow-1 overflow-hidden" },
                            r.createElement('h5', { class: "font-size-14 text-truncate" }, 'Popup'),
                            r.createElement('p', { class: "text-muted mb-0" }, 'Pops up in the middle of the screen')
                        )
                    )
                )
            ),
            r.createElement('div', { class: "card-box mb-2" },
                r.createElement('label', { class: "d-flex w-100" },
                    r.createElement('input', { class: "mx-4", type: "radio", id: "0277bac8-8d5b-4d03-be09-a177e4a8b116", name: "formType", value: "EMBED" }),
                    r.createElement('div', { class: "align-self-center overflow-hidden me-auto" },
                        a.createElement('div', { class: "flex-shrink-0 align-self-center me-3" }),
                        r.createElement('div', { class: "flex-grow-1 overflow-hidden" },
                            r.createElement('h5', { class: "font-size-14 text-truncate" }, 'Embed'),
                            r.createElement('p', { class: "text-muted mb-0" }, 'Embedded in your site. This requires adding a small snippet of code to your site where you want the form to appear')
                        )
                    )
                )
            )
        )
    );
    let list = new Selectr(s, { data: [], searchable: !1, defaultSelected: !1, placeholder: 'Choose a list...' });
    Http.get('/api/lists/static-group?type=1').then(response => response.json()).then(function (data) { list.add(data ? data.map(function (row) { return { value: row.group_id, text: row.name } }) : []); });
    _m.querySelector('.modal-footer').replaceChildren(
        r.createElement('button', { class: "white_btn", type: "button", title: "Cancel", "data-bs-dismiss": "modal"}, 'Cancel'),
        r.createElement('button', { class: "black_btn", type: "button", title: "Save and continue to design", click: (e) => { mp.create(e, _m) } }, 'Save and continue to design'),
    );
    myModal.show();
}
class ModalPopup {
    constructor(props) {
        //super(props);
    }
    inti(title) {
        return r.createElement('div', { class: "modal fade", backdrop: "static" ,tabindex: "-1"},//
            r.createElement('div', { class: "modal-dialog" },
                r.createElement('div', { class: "modal-content" },
                    r.createElement('div', { class: "modal-header" },
                        r.createElement('h5', { class: "modal-title" }, title),
                        r.createElement('button', { type: "button", class: "btn-close","data-bs-dismiss": "modal", "aria-label": "Close" },)
                    ),
                    r.createElement('div', { class: "modal-body" }),
                    r.createElement('div', { class: "modal-footer" })
                )
            )
        )
    }
    create(event, modal) {
        event.preventDefault(), event.stopPropagation();
        let j = {
            name: modal.querySelector('[name="name"]').value,
            list_id: parseInt(modal.querySelector('[name="list"]').value) || 0,
            form_type: modal.querySelector('[name="formType"]:checked').value
        }
        if (j.name === '') { swal('Error!', "'name' is required.", 'error').then(function () { swal.close(); modal.querySelector('[name="name"]').focus() }); return false; }
        else if (j.list_id <= 0) { swal('Error!', "'list' is required.", 'error').then(function () { swal.close(); modal.querySelector('[name="list"]').focus() }); return false; }
        else {
            Http.post('/api/form/create', { body: j })
                .then(response => {
                    if (!response.ok) { return response.json().then(json => { throw new Error(json.message); }) }
                    else return response.json();
                })
                .then(response => {
                    if (response.status === 200) window.location = window.location.origin + `/forms/${response.id}/edit`
                }).catch(error => { alert(error); });
            // ;swal('Error!', error, 'error')
        }
    }
}
function App() {
    return <HeaderDiv />;
}

ReactDOM.createRoot(document.querySelector("#root")).render(<App />);