unlayer.registerTool({
    name: 'my_tool',
    label: 'My Tool',
    icon: 'fa-smile',
    supportedDisplayModes: ['web', 'email'],
    options: {
        colors: { // Property Group
            title: "Colors", // Title for Property Group
            position: 1, // Position of Property Group
            options: {
                "textColor": { // Property: textColor
                    "label": "Text Color", // Label for Property
                    "defaultValue": "#FF0000",
                    "widget": "color_picker" // Property Editor Widget: color_picker
                },
                "backgroundColor": { // Property: backgroundColor
                    "label": "Background Color", // Label for Property
                    "defaultValue": "#FF0000",
                    "widget": "color_picker" // Property Editor Widget: color_picker
                }
            }
        }
    },
    values: {},
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
            }
        }),
        exporters: {
            web: function (values) {
                return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
            },
            email: function (values) {
                return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
            }
        },
        head: {
            css: function (values) { },
            js: function (values) { }
        }
    },
    validator(data) {
        const { defaultErrors, values } = data;
        return [];
    },
});
unlayer.registerPropertyEditor({
    name: 'my_color_picker',
    Widget: unlayer.createWidget({
        render(value, updateValue, data) {
            return `
        <input class="color-value" value=${value} />
        <button class="red">Red</button>
        <button class="green">Green</button>
        <button class="blue">Blue</button>
      `
        },
        mount(node, value, updateValue, data) {
            var input = node.getElementsByClassName('color-value')[0]
            input.onchange = function (event) {
                updateValue(event.target.value)
            }

            var redButton = node.getElementsByClassName('red')[0]
            redButton.onclick = function () {
                updateValue('#f00')
            }

            var greenButton = node.getElementsByClassName('green')[0]
            greenButton.onclick = function () {
                updateValue('#0f0')
            }

            var blueButton = node.getElementsByClassName('blue')[0]
            blueButton.onclick = function () {
                updateValue('#00f')
            }
        }
    })
});