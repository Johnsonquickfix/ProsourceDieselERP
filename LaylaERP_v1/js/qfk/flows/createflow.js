﻿import Http from '../../http/index.js';
import flowConfig, { loader } from '../../qfk/flows/flowconfig.js';

var doc = doc || document, dragged = null, lt = {};

doc.addEventListener("DOMContentLoaded", function () {
    load();
    //enums(lt);
    //console.log('ENUM => ', lt)
    //initTrigger({ trigger_id: 1 });

    //config_panel({ actionType: lt.panel.TRIGGER_AND_FILTERS_INITIAL, title: 'Trigger Setup', displayFooter: false });
    //config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, title: '', displayFooter: false });

    //addEventListenerMulti("dragover", (event) => { event.preventDefault(); }, true, ".droppable-target");
    //addEventListenerMulti("drop", (event) => { console.log(event, dragged); dropAction(event) }, true, ".droppable-target");


    //addEventListenerMulti("dragstart", onDragStart, false, ".draggable-flow-action-component");
    //addEventListenerMulti("dragend", onDragStart, false, ".draggable-flow-action-component");
    //addEventListenerMulti("mousedown", () => { dropActive(true); }, false, ".draggable-flow-action-component");
    //addEventListenerMulti("mouseup", () => { dropActive(false); }, false, ".draggable-flow-action-component");
    //addEventListenerMulti("drop", () => { dropActive(false); }, false, ".draggable-flow-action-component");
});
export const addEvent = function (element, type, listener, capture) { element.addEventListener(type, listener, capture); },
    removeEvent = function (selector, type) { element.removeEventListener(type); },
    addEventListenerMulti = function (type, listener, capture, selector) {
        let nodes = doc.querySelectorAll(selector);
        for (let i = 0; i < nodes.length; i++) { nodes[i].addEventListener(type, listener, capture); }
    },
    draggableDiv = (actionType, actionID) => {
        let d = doc.createElement('div', { class: lt.draggable[actionType], draggable: !0 });
        d.addEventListener('drag', () => { }), d.addEventListener('dragend', () => { }),
            d.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/json', JSON.stringify({ action: 'move', actionType: actionType, id: actionID })); });
        return d;
    },
    dropTarget = (pathId) => {
        let t = doc.createElement('div', { class: "droppable-target droppable-node" });
        t.replaceChildren(doc.createElement('div', { class: "component-node-container" }, doc.createElement('div', { class: "add-component-node" }, doc.createElement('i', { class: "fas fa-plus" }))));
        t.addEventListener("dragover", (e) => {
            e.preventDefault(), e.stopPropagation();
            t.querySelector('.add-component-node') &&
                t.replaceChildren(doc.createElement('div', { class: "component-node-container" }),
                    doc.createElement('div', { class: "placeholder" }, doc.createElement('div', { class: "placed-component action" })),
                    doc.createElement('div', { class: "component-node-container" }),
                );
        });
        t.addEventListener("dragleave", (e) => {
            e.preventDefault(), e.stopPropagation();
            t.replaceChildren(doc.createElement('div', { class: "component-node-container" }, doc.createElement('div', { class: "add-component-node" }, doc.createElement('i', { class: "fas fa-plus" }))));
        });
        t.addEventListener("drop", (e) => {
            e.preventDefault(), e.stopPropagation();
            let j = e.dataTransfer.getData("text/json"), { action: a, actionType: t, id: i } = JSON.parse(j);
            a && dropAction(e, a, t, pathId, i);
        });
        return t;
    },
    dropAction = (ctr, mode, type, pathId, actionId) => {
        let root = doc.querySelector(`.${lt.controls.ROOT}`), _c = [...root.childNodes],
            e = { canDrop: !0, actionType: type, index: _c.indexOf(ctr.target.closest('.placed-component-container')) },
            action = { id: actionId || 0, path: pathId, type: type, rank: e.index };
        _c[e.index].querySelector('.droppable-target .placeholder .action')?.replaceChildren(doc.createElement('div', { class: "loader" }));
        //console.log('Move', ctr.target, _c[e.index]); return;
        const onAdd = () => {
            Http.post(mode === 'add' ? lt.urls.addAction(action.path) : lt.urls.moveAction(action.id), { body: action }).then(res => res.json()).
                then(res => {
                    if (res.status === 200 && mode === 'add') {
                        let ele = drawComponent(e, res.data);
                        _c[e.index].querySelector('.droppable-target').replaceChildren(doc.createElement('div', { class: "component-node-container" }, doc.createElement('div', { class: "add-component-node" }, doc.createElement('i', { class: "fas fa-plus" }))));
                        ele && root.insertBefore(ele, _c[e.index]);
                    }
                    else if (res.status === 200 && mode === 'move') { load(); }
                });
        }
        e.actionType && e.index > 0 && onAdd();
    },
    targetDiv = (pathId) => {
        debugger
        let t = doc.createElement('div', { class: "droppable-target droppable-node" });
        t.replaceChildren(doc.createElement('div', { class: "component-node-container" }),
            doc.createElement('div', { class: "placed-component-container placeholder" }, doc.createElement('div', { class: "placed-component send-email action" })),
            doc.createElement('div', { class: "component-node-container " }),
        );
        return t;
    },
    onDrag = (event) => { },
    onDragStart = (event) => {
        let a = { action: 'add', actionType: '' };
        a.actionType = event.target.firstChild.getAttribute('data-type');
        event.target.classList.add("dragging");
        event.dataTransfer.setData('text/json', JSON.stringify(a));
    },
    onDragEnd = (event) => { event.target.classList.remove("dragging"); };

const componentIcon = (_icon) => { return doc.createElement('div', { class: "placed-component-icon-container" }, `<div class="placed-component-icon-background"><i class="${_icon}"></i></div>`); },
    drawComponent = (e, n) => {
        let nb, { actionType: t, canDrop: d, index: i } = e,
            pc = lt.controls.PLACED_COMPONENT, o = t === lt.events.REJOIN, r = o ? "path-exit" : `${pc}-container`, l = lt.events_action[t],
            container = doc.createElement('div', { class: `${r} ${t}` }), $btn = doc.createElement('div', { role: 'button', tabindex: '-1' });

        const config = new Panel(),
            addNode = () => {
                let node = doc.createElement('div', { role: 'button', tabindex: '-1', class: `${pc} ${l}`.trim() });
                addEvent(node, 'click', (event) => {
                    event.preventDefault(), event.stopPropagation();
                    doc.querySelectorAll('.root-branch [role="button"].selected').forEach((el) => { el.classList.remove("selected"); });
                    node.classList.add("selected"), config.panel_setup(n);
                }); return node;
            }, removeNode = () => {
                let remove = doc.createElement("button", { type: "button", class: 'btn btn-alt' }, '<i class="fa fa-trash"></i>');
                addEvent(remove, 'click', (event) => {
                    event.preventDefault(), event.stopPropagation(); loader();
                    n && Http.post(lt.urls.deleteAction(n.id)).then(res => res.json()).then(res => { loader(); res.status === 200 && container.remove(); });
                }); return remove;
            };

        i > 0 && container.appendChild(dropTarget(n.path));
        switch (t) {
            case lt.events.EXIT_NODE: {
                $btn.appendChild(doc.createElement('div', { class: `path-exit` }, doc.createElement('div', { class: `flow-exit-node exit-node` }, 'Exit')));
            }; break;
            case lt.events.TRIGGER: {
                nb = addNode();
                const m = (n) => {
                    let _t = (n.trigger_type === 0 ? n.trigger_statistic && n.trigger_statistic.name : (n.trigger_type === 1 ? n.trigger_group && n.trigger_group.name : ''));
                    return (n && n.trigger_id > 0) && doc.createElement('p', null, `<span>When someone </span><span class="highlighted-text">${_t}</span><span>.</span>`);
                };
                nb.replaceChildren(doc.createElement('div', { class: `${pc}-body` }, componentIcon('fa fa-bolt'),
                    doc.createElement('div', { class: `${pc}-content` },
                        doc.createElement('div', { class: `${pc}-header` },
                            doc.createElement('div', { class: `${pc}-title` }, 'Trigger'),
                            doc.createElement('div', { class: `${pc}-dropdown-container` })
                        ),
                        doc.createElement('div', { class: `${pc}-main` }, m(n))
                    ),
                    doc.createElement('div', { class: `${pc}-footer` })
                )), (nb && $btn.children.length > 0 ? $btn.children[0].appendChild(nb) : $btn.appendChild(nb));
            }; break;
            case lt.events.EMAIL: {
                nb = addNode(), (d === true && $btn.appendChild(draggableDiv(t, n.id)));

                nb.replaceChildren(doc.createElement('div', { class: `${pc}-body` }, componentIcon('fa fa-envelope'),
                    doc.createElement('div', { class: `${pc}-content` },
                        doc.createElement('div', { class: `${pc}-header` },
                            doc.createElement('div', { class: `${pc}-title` }, (n.message && n.message.name)),
                            doc.createElement('div', { class: `${pc}-dropdown-container` }, removeNode())
                        ),
                        doc.createElement('div', { class: `${pc}-main` }, (n.message && n.message.subject))
                    ),
                    //doc.createElement('div', { class: `${pc}-footer` })
                )), (nb && $btn.children.length > 0 ? $btn.children[0].appendChild(nb) : $btn.appendChild(nb));
            }; break;
            case lt.events.TIME_DELTA: {
                nb = addNode(), (d === true && $btn.appendChild(draggableDiv(t, n.id)));
                let _t = 'Configure Time Delay…';
                if (n.after_seconds_unit === 'day') _t = `Wait ${n.after_seconds / 86400} ${n.after_seconds_unit}s`;
                else if (n.after_seconds_unit === 'hour') {
                    let hours = (n.after_seconds / 3600), rhours = Math.floor(hours), minutes = (hours - rhours) * 60, rminutes = Math.round(minutes);
                    _t = minutes > 0 ? `Wait ${rhours}h ${rminutes}m` : `Wait ${rhours} hours`
                }
                else if (n.after_seconds_unit === 'minute') _t = `Wait ${n.after_seconds / 60} ${n.after_seconds_unit}s`;
                nb.replaceChildren(doc.createElement('div', { class: `${pc}-body` }, componentIcon('fa fa-clock'),
                    doc.createElement('div', { class: `${pc}-content` },
                        doc.createElement('div', { class: `${pc}-header` },
                            doc.createElement('div', { class: `${pc}-title` }, _t),
                            doc.createElement('div', { class: `${pc}-dropdown-container` }, removeNode())
                        )
                    )
                )), (nb && $btn.children.length > 0 ? $btn.children[0].appendChild(nb) : $btn.appendChild(nb));
            }; break;
        }
        container.appendChild($btn); return container;
    },
    initTrigger = (e) => {
        console.log('start', e)
        let root = doc.querySelector(`.${lt.controls.ROOT}`), j = {}; root.replaceChildren();
        if (e.trigger_id > 0) {
            j = { actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 }; config_panel(j);
            let n = drawComponent({ actionType: 'trigger', canDrop: !1, index: 0 }, e);
            root.appendChild(n);
            e.paths.forEach((v, i) => {
                if (v.actions && v.actions.length > 0) {
                    v.actions.forEach((a, j) => {
                        let c = drawComponent({ actionType: a.type, canDrop: !0, index: root.children.length }, a);
                        root.appendChild(c);
                    })
                }
                n = drawComponent({ actionType: 'exit_node', canDrop: !1, index: root.children.length }, { path: v.id });
                root.appendChild(n);
            });
        }
        else {
            j = { actionType: lt.panel.TRIGGER_AND_FILTERS_INITIAL, title: 'Trigger Setup', displayFooter: false };
            config_panel(j);

            let container = doc.createElement('div', { class: `placed-component-container ${lt.events.TRIGGER} unconfigured` }),
                b = doc.createElement('div', { role: 'button', tabindex: '-1', class: `placed-component ${lt.events.TRIGGER} logic selected`.trim() },
                    doc.createElement('div', { class: 'placed-component-body' }, componentIcon('fa fa-bolt'),
                        doc.createElement('div', { class: 'placed-component-content' },
                            doc.createElement('div', { class: 'placed-component-header' }, doc.createElement('div', { class: 'placed-component-title' }, 'Trigger')),
                            doc.createElement('div', { class: 'placed-component-main' }, doc.createElement('p', null, doc.createElement('span', null, 'Select a flow trigger on the left to get started.')))
                        )
                    )
                );
            container.appendChild(doc.createElement('div', { role: 'button', tabindex: '-1' }, b));
            root.appendChild(container);
        }
    };

function config_panel(e) {
    let { actionType: a, title: t, displayFooter: f } = e;
    let _class = 'configuration-panel', _config = doc.querySelector(`.${_class}`), _header, _body, _footer;
    _header = doc.createElement('div', { class: `${_class}-header`.trim() }, doc.createElement('div', { class: `${_class}-title`.trim() }, t));
    _body = doc.createElement('div', { class: `${_class}-body ${!f ? 'no-footer' : ''} `.trim() });
    _footer = doc.createElement('div', { class: `${_class}-footer`.trim() });
    if (lt.panel.TRIGGER_AND_FILTERS_INITIAL === a) {
        let _p = doc.createElement("div", { class: "trigger-select-panel" }, doc.createElement("p", null, "What will trigger this flow?"), triggerInitial({ triggers: lt.triggers }));
        _body.replaceChildren(_p);
    }
    else if (lt.panel.FLOWS_COMPONENTS_PANEL === a) {
        _body.replaceChildren(flowComponentsInitial({ flowAction: lt.flowAction }));
    }
    f && _body.appendChild(_footer);
    _config.replaceChildren(_header, _body);
}
function triggerInitial(e) {
    let { triggers: t = [] } = e, $ul = doc.createElement("ul", { class: "trigger-type-buttons" });
    t.map(e => {
        let _b = doc.createElement("button", { class: "trigger-type-button", 'data-type': e.triggerType },
            doc.createElement("div", { class: "icon-container" }, doc.createElement("i", { class: e.icon })),
            doc.createElement("div", null, doc.createElement("span", null, doc.createElement("h2", null, e.text)), doc.createElement("p", null, e.description))
        );
        _b.addEventListener('click', (event) => { event.preventDefault(), triggerConfiguration(e); });
        $ul.appendChild(doc.createElement("li", null, _b));
    });
    return $ul;
}
function triggerConfiguration(e) {
    let p = 'configuration-panel', _config = doc.querySelector(`.${p}`), _h;
    _h = doc.createElement('div', { class: `${p}-header`.trim() }, doc.createElement('div', { class: `${p}-title`.trim() }, `Trigger Setup`));

    let _back = doc.createElement("button", { type: "button", class: 'btn btn-alt' }, '<i class="fa fa-arrow-left me-2"></i>Back'),
        _done = doc.createElement("input", { type: "button", class: 'btn btn-primary', value: "Done" }),
        _cancel = doc.createElement("input", { type: "button", class: 'btn btn-alt', value: "Cancel" });
    let a, h, ul, li, f;
    h = doc.createElement("div", null, _back);
    ul = doc.createElement("ul", { class: 'configuration-commands' });
    f = doc.createElement("div", { class: 'configuration-panel-footer' }, doc.createElement("span", { class: 'button-set' }, _done, _cancel));
    //group 
    let $s = doc.createElement('select', { name: "group" });
    li = doc.createElement("li", null, doc.createElement("div", null,
        doc.createElement("h2", null, `Flow Trigger <span class="weak">${e.text}</span>`),
        doc.createElement("p", null, `Which ${e.triggerName} will trigger this flow?`),
        doc.createElement('div', { class: "InputContainer cw-300" }, $s)
    ));
    ul.replaceChildren(li);
    a = doc.createElement("div", { class: `${p}-body`.trim() }, doc.createElement("div", { class: "trigger-select-panel" }, h, ul, f));
    _config.replaceChildren(_h, a);
    [_back, _cancel].forEach(function (ele) { ele.addEventListener("click", (event) => { event.preventDefault(), initTrigger({ trigger_id: 0 }); }); });

    (() => {
        let { triggerName: n, triggerType: t } = e, dd = new Choices($s, { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: `Select a ${e.triggerName}…`, itemSelectText: '', shouldSort: false });
        dd.setChoices(async () => {
            try {
                switch (t) {
                    case 0: return await Http.get(lt.urls.triggerOptions[n]).then(response => response.json()).then(function (data) { return data ? data.map(function (row) { return { value: row.metric_id, label: row.metric_name } }) : []; });
                    case 1: return await Http.get(lt.urls.triggerOptions[n]).then(response => response.json()).then(function (data) { return data ? data.map(function (row) { return { value: row.group_id, label: row.name } }) : []; });
                    case 3: return await Http.get(lt.urls.triggerOptions[n]).then(response => response.json());
                }
            } catch (err) { console.error(err); }
        });
    })();
    const onSave = () => {
        let j = {
            id: parseInt(lt.flow()) || 0, trigger_type: e.triggerType, trigger_id: parseInt($s.value) || 0,
            //triggerFilter: null != e.triggerFilterStanzas ? { stanzas: e.triggerFilterStanzas } : null,
            //customerFilter: null != e.customerFilterStanzas ? { tanzas: e.customerFilterStanzas } : null,
        }
        Http.post(lt.urls.configureFlowTrigger(j.id), { body: j }).then(response => response.json()).
            then(response => { response.status === 200 && load(); });
    }
    _done.addEventListener('click', (event) => { event.preventDefault(), onSave(); });
}
function flowComponentsInitial(e) {
    let { flowAction: t = [] } = e;
    let $ul = doc.createElement("ul", { class: "flow-action-panel" });
    t.map(e => {
        let $li = doc.createElement("li", { class: `component-section ${e.type}` }, doc.createElement("div", { class: `component-section-title` }, e.text));
        e.group.map(g => {
            let $ch = doc.createElement("div", { class: "draggable-flow-action-component", draggable: true },
                doc.createElement("div", { class: "flow-action-component", 'data-type': g.type },
                    doc.createElement("div", { class: "placed-component-icon-container" }, `<div class="placed-component-icon-background"><i class="${g.icon}"></i></div>`),
                    doc.createElement("div", { class: 'flow-action-component-title' }, g.text)
                )
            );
            $ch.addEventListener('drag', onDrag);
            $ch.addEventListener('dragstart', onDragStart);
            $ch.addEventListener('dragend', onDragEnd);
            $li.appendChild($ch);
        });
        $ul.appendChild($li);
    });
    return $ul;
}

class Panel {
    panel_setup(e) {
        console.log(e)
        let { type: t = 'trigger' } = e, _class = 'configuration-panel', _config = doc.querySelector(`.${_class}`), _header, _body,
            buttonOk = doc.createElement("input", { type: "button", class: "btn btn-primary", value: "Save" }),
            buttonCancel = doc.createElement("input", { type: "button", class: "btn btn-alt", value: "Cancel" });
        _body = doc.createElement('div', { class: `${_class}-body`.trim() });
        buttonCancel.addEventListener('click', (event) => { event.preventDefault(), config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 }); });
        switch (t) {
            case lt.events.TRIGGER: {
                buttonOk.value = "Done", _header = doc.createElement('div', { class: `${_class}-header`.trim() }, `<div class="configuration-panel-title">Trigger Setup</div>`);
                buttonOk.addEventListener('click', (event) => { event.preventDefault(), config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 }); });
                _body.appendChild(
                    doc.createElement("div", { class: "trigger-setup-panel" },
                        doc.createElement("ul", { class: "configuration-commands" },
                            doc.createElement("li", null,
                                doc.createElement("div", null, `<h2>Flow Trigger<br><span class="weak">Metric</span></h2>`),
                                doc.createElement("div", { class: "flow-trigger-description" }, `<div class="flow-text-description"><p><a href="#" target="_blank" rel="noopener noreferrer">Started Checkout </a></p></div>`)
                            ),
                            //doc.createElement("li", null,
                            //    doc.createElement("a", { href: "#", class: "panel-nav-link" },
                            //        doc.createElement("div", null, `<span><h2>Trigger Filters</h2></span><p class="nav-link-desc">Filter on properties of the trigger.</p>`),
                            //        doc.createElement("div", null, `<i class="fa fa-angle-right pull-right"></i>`)
                            //    )
                            //),
                            doc.createElement("li", null,
                                doc.createElement("a", { href: "#", class: "panel-nav-link" },
                                    doc.createElement("div", null, `<span><h2>Flow Filters</h2></span><p class="nav-link-desc">Restrict the flow to only certain people.</p>`),
                                    doc.createElement("div", null, `<i class="fa fa-angle-right pull-right"></i>`)
                                )
                            )
                        ),
                        doc.createElement("div", { class: "configuration-panel-footer" }, doc.createElement("span", { class: "button-set" }, buttonOk))
                    )
                );
            }; break;
            case lt.events.EMAIL: {
                _header = doc.createElement('div', { class: `${_class}-header`.trim() }, `<div class="configuration-panel-title">${e.message && e.message.name}</div>`);
                _body.appendChild(this.panel_setup_mail(e));
            }; break;
            case lt.events.TIME_DELTA: {
                _header = doc.createElement('div', { class: `${_class}-header`.trim() }, `<div class="configuration-panel-title">Time Delay</div>`);
                _body.appendChild(this.panel_setup_time(e));
            }; break;
        }
        _config.replaceChildren(_header, _body);
    }
    panel_setup_time(e) {
        let buttonOk = doc.createElement("input", { type: "button", class: "btn btn-primary", value: "Save" }),
            buttonCancel = doc.createElement("input", { type: "button", class: "btn btn-alt", value: "Cancel" });
        addEvent(buttonCancel, 'click', (event) => { event.preventDefault(); event.stopPropagation(); config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 }); });
        const Re = (ele, selected_value) => {
            let i = [{ value: 'day', label: "day(s)" }, { value: 'hour', label: "hour(s)" }, { value: 'minute', label: "minute(s)" }];
            let unit = new Choices(ele, { allowHTML: false, searchEnabled: false, placeholder: false, itemSelectText: '', shouldSort: false });
            unit.setChoices(i.map(function (row) { return { value: row.value, label: row.label, selected: (row.value === selected_value) } }));
        };
        let hours = 0, rhours = 0, minutes = 0, rminutes = 0;
        if (e.after_seconds_unit === 'day') rhours = e.after_seconds / 86400;
        else if (e.after_seconds_unit === 'hour') hours = (e.after_seconds / 3600), rhours = Math.floor(hours), minutes = (hours - rhours) * 60, rminutes = Math.round(minutes);
        else if (e.after_seconds_unit === 'minute') hours = e.after_seconds / 60;

        let select = doc.createElement('select', { name: "time-delay-unit" }),
            $body = doc.createElement("div", { class: "configuration-panel-body flow-action-panel-body" },
                doc.createElement("div", { class: "schedule-panel" },
                    doc.createElement("ul", { class: "configuration-sections" },
                        doc.createElement("li", null, doc.createElement("p", null, "Set this delay for"),
                            doc.createElement("div", { class: "control-group" }, doc.createElement("div", { class: "controls" }, doc.createElement("input", { type: "number", name: "delay-unit-value", value: rhours }), select)),
                            doc.createElement("div", { class: "timing-hint" }, doc.createElement("div", { class: "hint-text" }, `<span>Steps following this Time Delay occur on </span><strong>Day 0</strong><span> after the trigger</span><strong></strong><span></span>`))
                        )
                    ),
                    doc.createElement("div", { class: "configuration-panel-footer" }, doc.createElement("span", { class: "button-set" }, buttonOk, buttonCancel))
                )
            );
        Re(select, 'hour');

        addEvent(select, 'change', (event) => {
            event.preventDefault();
            let p = select.closest('.control-group'), sibling = p.nextSibling;
            sibling && sibling.matches('.control-group') && sibling.remove();
            if (select.value === 'hour') {
                p.parentNode.insertBefore(
                    doc.createElement("div", { class: "control-group" },
                        doc.createElement("p", null, 'and'),
                        doc.createElement("div", { class: "controls timing-minutes" }, doc.createElement("input", { type: "number", name: "secondary-value", value: rminutes }), doc.createElement("span", null, 'minute(s)')),
                        doc.createElement("p", null, 'after the trigger')
                    ),
                    p.nextSibling
                )
            }
        });
        let changeEvent = new Event('change'); select.dispatchEvent(changeEvent);
        addEvent(buttonOk, 'click', (event) => {
            event.preventDefault(); event.stopPropagation();
            let JsonVar = { id: e.id, delay_units: select.value };
            $body.querySelectorAll('input[type="number"]').forEach(r => { stringToObj(r.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "_"), parseInt(r.value) || 0, JsonVar); });
            Http.post(lt.urls.updateTiming(JsonVar.id), { body: JsonVar }).then(res => res.json()).then(res => { res.status === 200 && load(); });
        });
        return $body;
    }
    panel_setup_mail(e) {
        let buttonOk = doc.createElement("input", { type: "button", class: "btn btn-primary", value: "Save" }),
            buttonCancel = doc.createElement("input", { type: "button", class: "btn btn-alt", value: "Cancel" });
        addEvent(buttonCancel, 'click', (event) => { event.preventDefault(); event.stopPropagation(); config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 }); });

        let $body = doc.createElement("div", { class: "configuration-panel-body flow-action-panel-body" },
            doc.createElement("div", { class: "send-email-panel" },
                doc.createElement("ul", { class: "configuration-sections" },
                    doc.createElement("li", null,
                        doc.createElement("div", { class: "configuration-subtitle" }, doc.createElement("h2", null, 'Content')),
                        doc.createElement("div", { class: "message-content" },
                            doc.createElement("ul", { class: 'message-detail' },
                                doc.createElement("li", { class: 'message-detail' }, `<span class="descriptor">Subject:</span><span class="from-label">${e.message && e.message.subject}</span>`),
                                doc.createElement("li", { class: 'message-detail' }, `<span class="descriptor">From:</span><span class="from-label">${e.message && e.message.from_label} &lt;${e.message && e.message.from_email}&gt;</span>`)
                            ),
                            doc.createElement("div", { class: 'message-actions' }, doc.createElement("button", { class: 'btn btn-alt', type: "button", title: "Configure Content" }, 'Configure Content'))
                        )
                    ),
                    doc.createElement("li", null,
                        doc.createElement("div", { class: 'configuration-subtitle' }, `<span><h2>Settings</h2></span><i class="fa fa-cog"></i>`),
                        doc.createElement("ul", { class: 'settings-list' },
                            doc.createElement("li", { class: 'message-detail' }, `<span role="button" tabindex="-1"><span class="underline">Smart Sending</span><span data-testid="configuration-panel-settings-list-item-0" class="setting-${e.message && e.message.is_ignoring_throttling ? 'off' : 'on'}"></span></span>`),
                            doc.createElement("li", { class: 'message-detail' }, `<span role="button" tabindex="-1"><span class="underline">UTM Tracking</span><span data-testid="configuration-panel-settings-list-item-0" class="setting-${e.message && e.message.is_add_utm ? 'on' : 'off'}"></span></span>`),
                            doc.createElement("li", { class: 'message-detail' }, `<span role="button" tabindex="-1"><span class="underline">Additional Filters</span><span data-testid="configuration-panel-settings-list-item-0" class="setting-off"></span></span>`)
                        )
                    )
                ),
                doc.createElement("div", { class: "configuration-panel-footer" }, doc.createElement("span", { class: "button-set" }, buttonOk, buttonCancel))
            )
        );
        //Re(select, 'hour');

        //addEvent(select, 'change', (event) => {
        //    event.preventDefault();
        //    let p = select.closest('.control-group'), sibling = p.nextSibling;
        //    sibling && sibling.matches('.control-group') && sibling.remove();
        //    if (select.value === 'hour') {
        //        p.parentNode.insertBefore(
        //            doc.createElement("div", { class: "control-group" },
        //                doc.createElement("p", null, 'and'),
        //                doc.createElement("div", { class: "controls timing-minutes" }, doc.createElement("input", { type: "number", name: "secondary-value", value: rminutes }), doc.createElement("span", null, 'minute(s)')),
        //                doc.createElement("p", null, 'after the trigger')
        //            ),
        //            p.nextSibling
        //        )
        //    }
        //});
        //let changeEvent = new Event('change'); select.dispatchEvent(changeEvent);
        //addEvent(buttonOk, 'click', (event) => {
        //    event.preventDefault(); event.stopPropagation();
        //    let JsonVar = { id: e.id, delay_units: select.value };
        //    $body.querySelectorAll('input[type="number"]').forEach(r => { stringToObj(r.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "_"), parseInt(r.value) || 0, JsonVar); });
        //    Http.post(lt.urls.updateTiming(JsonVar.id), { body: JsonVar }).then(res => res.json()).then(res => { res.status === 200 && load(); });
        //});
        return $body;
    }
}

function load() {
    lt = flowConfig(1000), loader();
    Http.get(lt.urls.getFlow(parseInt(lt.flow()) || 0)).then(response => response.json())
        .then((response) => {
            if (response.status === 200) {
                loader(), doc.querySelector('[name="flow-title"]').innerHTML = response.data.name, initTrigger(response.data);
            }
            else {
                loader() && doc.querySelector('#root').replaceChildren(doc.createElement('h1', {}, `Sorry, that page isn't actually here.`));
            }
        }).catch(error => {
            console.log('error', error); loader();
            doc.querySelector('#root').replaceChildren(doc.createElement('h1', {}, `Sorry, that page isn't actually here.`));
        });
};
