////// cache createElement
////var originalCreateElement = Document.prototype.createElement;

////// redefine createElement
////Document.prototype.createElement = function createElement(name, attrs, children) {
////	// create the element
////	var element = originalCreateElement.call(this, String(name));

////	// for each attribute
////	for (var attr in attrs) {
////		// assign the attribute, prefixing capital letters with dashes 
////		element.setAttribute(attr.replace(/[A-Z]/g, '-$&'), attrs[attr]);
////	}
////	element.appendChild(children);
////	// return the element
////	return element;
////};

var cachedCreateElement = Document.prototype.createElement;

Document.prototype.createElement = function (type, props, ...children) {
    var splitTagName = type.match(/(^|[\.\#])[^\.\#]*/g);
    var element = cachedCreateElement.call(this, splitTagName[0]);
    for (var i = 0, l = splitTagName.length; i < l; i++) {
        var str = splitTagName[i];
        if (str[0] === '#') {
            element.id = str.slice(1);
        } else if (str[0] === '.') {
            element.classList.add(str.slice(1));
        }
    }
    for (var prop in props) { element.setAttribute(prop, props[prop]); }
    children.forEach((child, index) => {
        typeof (child) === 'string' ? element.innerHTML = child : element.append(child)
    });
    return element;
}

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
const formToJSON = (elements) =>
    [].reduce.call(
        elements,
        (data, element) => {
            data[element.name] = element.value;
            return data;
        },
        {}
    );
/**
 * Checks if an input is a `select` with the `multiple` attribute.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a multiselect, false if not
 */
const isMultiSelect = (element) => element.options && element.multiple;
/**
 * Convert string with dot notation to JSON and returns it as a JSON object.
 * @param  {string} path            the form path
 * @param  {object} value           the form value
 * @param  {object} obj             the form obj
 * @return {Object}                 form data as an object literal
 */
const stringToObj = (path, value, obj) =>{
    let parts = path.split("."), part;
    let last = parts.pop();
    while (part = parts.shift()) {
        if (typeof obj[part] != "object") obj[part] = {};
        obj = obj[part]; // update "pointer"
    }
    obj[last] = value;
}

function ApiHelper(url, data = {}, headers = { 'Content-Type': 'application/json' }, method = 'POST') {
    return fetch(url, { method: method, data: data, headers: headers }).then(res => res.json()).then((result) => { return result; }, (error) => { return error; })
}