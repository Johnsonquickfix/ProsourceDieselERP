
//import 'easy-email-editor/lib/style.css';
//import 'easy-email-extensions/lib/style.css';
//// theme, If you need to change the theme, you can make a duplicate in https://arco.design/themes/design/1799/setting/base/Color
//import '@arco-themes/react-easy-email-theme/css/arco.css';

function SelectBox() {
    const [selectedValue, setSelectedValue] = React.useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ];

    return (
        <select

            value={selectedValue} onChange={handleChange}>
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

function App() {
    //const [options, setOptions] = React.useState([
    //    { value: 'Jan', label: 'Jan' },
    //    { value: 'Feb', label: 'Feb' },
    //    { value: 'Mar', label: 'Mar' }
    //])

    //const [option, setOption] = React.useState({ value: 'Jan', label: 'Jan' });
    //React.useEffect(() => {
    //    console.log(options)

    //}, [options]);
    //return <div className="container">
    //    Select the one
    //    <Select
    //        value={option}
    //        options={options}
    //    />
    //    <button onClick={() => {
    //        console.log('click')
    //        setOptions(values => {
    //            const val = [...values];
    //            val.push({ value: 'Apr', label: 'Apr' });
    //            return val;
    //        });
    //    }}>Update</button>
    //    <div className="small">Option selected: </div>
    //    {option && option.label}
    //    <SelectBox />
    //</div>;

    React.useEffect(() => {
        // call api or anything
        //console.log('DOMContentLoaded', document.querySelector('#editor-container'));
        let editor = new Editor();
        setTimeout(editor.inti(), 500);
        
        //unlayer.addEventListener('design:updated', function (updates) {
        //    // Design is updated by the use
        //    unlayer.exportHtml(function (data) { });
    });

    return (<div >
        <div className="page-header">
            <div className="breadcrumb-bar">
                <a href="index" className="crumb" > Sign-up forms
                </a>
            </div>
            <div className="breadcrumb-bar">
                <input type="button" className="white_btn me-2" value="Exit" onClick={(e) => { }} />
                <input type="button" className="white_btn me-2" value="Publish" onClick={(e) => { }} />
            </div>
        </div>
        <div className="editorMain">
            <div id="editor-container">

            </div>
        </div>
    </div>);
}


ReactDOM.createRoot(document.querySelector("#root")).render(<App />);
var e = e || document;
//console.log('DOMContentLoaded', document.querySelector('#editor-container'));
//e.addEventListener("DOMContentLoaded", function () {
//    console.log('DOMContentLoaded', e.querySelector('#editor-container'))
//    //inti();
//    //let editor = new Editor(); editor.inti()
//    //    unlayer.addEventListener('design:updated', function (updates) {
//    //        // Design is updated by the user
//    //        unlayer.exportHtml(function (data) {

//    //    });
//});
function inti() {
    let r = e.querySelector('#root');
    r.replaceChildren(
        e.createElement('div', { class: "page-header" },
            e.createElement('div', { class: "breadcrumb-bar" },
                e.createElement('a', { href: "index", class: "crumb" }, 'Sign-up forms'),
                //e.createElement('span', { class: "icon-wrapper" }, e.createElement('i', { class: "fa fa-angle-right fa-lg" })),
                //e.createElement('a', { class: "crumb" }, 'Create Form')
            ),
            e.createElement('div', { class: "" },
                e.createElement('input', { class: "white_btn me-2", type: "button", value: "Exit", click: (event) => { } }),
                e.createElement('input', { class: "white_btn me-2", type: "button", value: "Publish", click: (event) => { } }),
            )
        ),
        e.createElement('div', { class: "editorMain" }, e.createElement('div', { id: "editor-container" }))
    )
}

class Editor {
    baseURL = window.location.origin;
    inti() {

        unlayer.init({
            id: "#editor-container",
            locale: 'en-US', displayMode: "email", projectId: 167,//projectId: 158371,
            appearance: { panels: { tools: { dock: 'left' } } },
            tools: {
                'custom#product_tool': {
                    //data: { products, },
                    //properties: { productLibrary: { editor: { data: { products, }, }, }, },
                },
            },
            customCSS: [this.baseURL + "/js/qfk/HtmlEditor/product-library-tool/productTool.css"],
            customJS: [this.baseURL + "/js/qfk/HtmlEditor/product-library-tool/productTool.js"],
            mergeTags: {
                organization: { name: 'organization.name', value: '{{ organization.name }}' },
                organization_address: { name: 'organization.full_address', value: '{{ organization.full_address }}', },
                organization_url: { name: 'organization.url', value: '{{ organization.url }}' },
                unsubscribe: { name: 'unsubscribe', value: '{% unsubscribe %}' },
                person_first_name: { name: 'first_name', value: '{{ first_name }}' },
                person_last_name: { name: 'last_name', value: '{{ last_name }}' },
                person_phone_number: { name: 'person.phone_number', value: '{{ person.phone_number }}' },
                person_organization: { name: 'person.organization', value: '{{ person.organization }}' },
                person_title: { name: 'person.title', value: '{{ person.title }}' },
            },
            editor: { confirmOnDelete: true }
        });
    }
    create(event, modal) {
        event.preventDefault(), event.stopPropagation();
        let j = {
            name: modal.querySelector('[name="name"]').value,
            list_id: parseInt(modal.querySelector('[name="list"]').value) || 0,
            form_type: modal.querySelector('[name="formType"]:checked').value
        }
        console.log(j)
        if (j.name === '') { swal('Error!', "'name' is required.", 'error').then(function () { swal.close(); modal.querySelector('[name="name"]').focus() }); return false; }
        else if (j.list_id <= 0) { swal('Error!', "'list' is required.", 'error').then(function () { swal.close(); modal.querySelector('[name="list"]').focus() }); return false; }
        else {
            Http.post('/api/form/create', { body: j })
                .then(response => {
                    if (!response.ok) { return response.json().then(json => { throw new Error(json.message); }) }
                    else return response.json();
                })
                .then(response => {
                    if (response.status === 200) window.location = window.location.origin + `/form/${response.id}/edit`
                    console.log('Post =>', response);
                    //list.add(data ? data.map(function (row) { return { value: row.group_id, text: row.name } }) : []);
                }).catch(error => { alert(error); });
            // ;swal('Error!', error, 'error')
        }
    }
}