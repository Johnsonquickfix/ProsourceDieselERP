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
 * Checks that an element has a non-empty `name` and `value` property.
 * @param  {Element} element  the element to check
 * @return {Bool}             true if the element is an input, false if not
 */
const isValidElement = (element) => {
    return element.name && element.value;
};

/**
 * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the value should be added, false if not
 */
const isValidValue = (element) => {
  return !['checkbox', 'radio'].includes(element.type) || element.checked;
};

/**
 * Checks if an input is a checkbox, because checkboxes allow multiple values.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a checkbox, false if not
 */
const isCheckbox = (element) => element.type === 'checkbox';

/**
 * Checks if an input is a `select` with the `multiple` attribute.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a multiselect, false if not
 */
const isMultiSelect = (element) => element.options && element.multiple;

/**
 * Checks if an input is a `select` with the `multiple` attribute.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a multiselect, false if not
 */
const isSelect = (element) => element.options && !element.multiple;;

/**
 * Retrieves the selected options from a multi-select as an array.
 * @param  {HTMLOptionsCollection} options  the options for the select
 * @return {Array}                          an array of selected option values
 */
const getSelectValues = (options) =>
  [].reduce.call(
    options,
    (values, option) => {
      return option.selected ? values.concat(option.value) : values;
    },
    []
  );

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