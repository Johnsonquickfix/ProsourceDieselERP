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

Document.prototype.createElement = function (tagName, props, children0, children1, children2, children3, children4, children5) {
    var splitTagName = tagName.match(/(^|[\.\#])[^\.\#]*/g);
    var element = cachedCreateElement.call(this, splitTagName[0]);
    for (var i = 0, l = splitTagName.length; i < l; i++) {
        var str = splitTagName[i];
        if (str[0] === '#') {
            element.id = str.slice(1);
        } else if (str[0] === '.') {
            element.classList.add(str.slice(1));
        }
    }
    for (var prop in props) {
        element.setAttribute(prop, props[prop]);
    }
    if (children0 != null) typeof (children0) === 'string' ? element.innerHTML = children0 : element.append(children0);
    if (children1 != null) typeof (children1) === 'string' ? element.innerHTML = children1 : element.append(children1);
    if (children2 != null) typeof (children2) === 'string' ? element.innerHTML = children2 : element.append(children2);
    if (children3 != null) typeof (children3) === 'string' ? element.innerHTML = children3 : element.append(children3);
    if (children4 != null) typeof (children4) === 'string' ? element.innerHTML = children4 : element.append(children4);
    if (children5 != null) typeof (children5) === 'string' ? element.innerHTML = children5 : element.append(children5);
    return element;
}