import Http from '../../http/index.js';
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
                ),
                    doc.createElement('div', { class: `${pc}-footer` },
                        doc.createElement('div', { class: `card-status-switcher-wrapper` }, doc.createElement('div', { class: `card-status-switcher no-drop ${config.c[n.status]}` }, config.l[n.status])),
                        doc.createElement('div', { class: `action-settings` }, `<i class="fa fa-envelope ${(n.message && n.message.is_ignoring_throttling) ? 'draft' : 'live'}"></i><i class="fa fa-map-signs ${(n.message && n.message.is_add_utm) ? 'live' : 'draft'}"></i><i class="fa fa-filter"></i>`)
                    )
                ), (nb && $btn.children.length > 0 ? $btn.children[0].appendChild(nb) : $btn.appendChild(nb));
            }; break;
            case lt.events.UPDATE_CUSTOMER: {
                nb = addNode(), (d === true && $btn.appendChild(draggableDiv(t, n.id)));
                let b = doc.createElement('div', { class: `${pc}-main` }, 'Configure Update...');
                if (n.settings) {
                    let i = n.settings.length - 1;
                    b.replaceChildren(doc.createElement('p', { class: `summary-text` },
                        (n.settings[0].operator ? doc.createElement('span', null, `${lt.propercase(n.settings[0].operator)} `) : null),
                        (n.settings[0].property_key ? doc.createElement('span', { class: "highlighted-text" }, `${lt.propercase(n.settings[0].property_key)} `) : null),
                        (n.settings[0].property_value ? doc.createElement('span', { class: "highlighted-text" }, `to ${lt.propercase(n.settings[0].property_value)}`) : null)
                    ));
                    (i > 0) && (_t.appendChild(doc.createElement('span', { class: 'additional-actions' }, `+${i} step${i > 1 ? 's' : ''}`)));
                }
                nb.replaceChildren(doc.createElement('div', { class: `${pc}-body` }, componentIcon('fa fa-user'),
                    doc.createElement('div', { class: `${pc}-content` },
                        doc.createElement('div', { class: `${pc}-header` },
                            doc.createElement('div', { class: `${pc}-title` }, 'Update Profile Property'),
                            doc.createElement('div', { class: `${pc}-dropdown-container` }, removeNode())
                        ), b),
                ),
                    doc.createElement('div', { class: `${pc}-footer` }, doc.createElement('div', { class: `card-status-switcher-wrapper` }, doc.createElement('div', { class: `card-status-switcher no-drop ${config.c[n.status]}` }, config.l[n.status])))
                ), (nb && $btn.children.length > 0 ? $btn.children[0].appendChild(nb) : $btn.appendChild(nb));
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
    _header = doc.createElement('div', { class: `${_class}-header`.trim() }, doc.createElement('div', { class: `${_class}-title`.trim() }, t || ''));
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
        let { triggerName: n, triggerType: t } = e;
        //    dd = new Choices($s, { allowHTML: false, searchEnabled: false, placeholder: true, placeholderValue: `Select a ${e.triggerName}…`, itemSelectText: '', shouldSort: false });
        //dd.setChoices(async () => {
        //    try {
        //        switch (t) {
        //            case 0: return await Http.get(lt.urls.triggerOptions[n]).then(response => response.json()).then(function (data) { return data ? data.map(function (row) { return { value: row.metric_id, label: row.metric_name } }) : []; });
        //            case 1: return await Http.get(lt.urls.triggerOptions[n]).then(response => response.json()).then(function (data) { return data ? data.map(function (row) { return { value: row.group_id, label: row.name } }) : []; });
        //            case 3: return await Http.get(lt.urls.triggerOptions[n]).then(response => response.json());
        //        }
        //    } catch (err) { console.error(err); }
        //});
        const dd = new Selectr($s, { searchable: !1, defaultSelected: !1 });
        switch (t) {
            case 0:
                {
                    Http.get(lt.urls.triggerOptions[n]).then(res => res.json()).then(function (res) {
                        let j = res.map(function (r) { return { value: r.metric_id.toString(), text: r.metric_name } });
                        dd.add(j, !0);//, s.setValue(value)
                    });
                } break;
            case 1:
                {
                    Http.get(lt.urls.triggerOptions[n]).then(res => res.json()).then(function (res) {
                        let j = res.map(function (r) { return { value: r.group_id.toString(), text: r.name } });
                        dd.add(j, !0);//, s.setValue(value)
                    });
                } break;
            case 3:
                {
                    Http.get(lt.urls.triggerOptions[n]).then(res => res.json()).then(function (res) {
                        let j = res.map(function (r) { return { value: r.value.toString(), text: r.label } });
                        dd.add(j, !0);//, s.setValue(value)
                    });
                } break;
        }
        //dd.data
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
    let { flowAction: t = [] } = e, $ul = doc.createElement("ul", { class: "flow-action-panel" });
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
    spanSwitch(e, a, v) {
        let txt = e.target.innerText, element = e.target.parentNode, input = doc.createElement('input', { class: 'form-control', value: txt, blur: (event) => { this.spanReset(event, a, v) } });
        element.replaceChildren(input), input.focus();
    }
    spanReset(e, a, v) {
        let txt = e.target.value, element = e.target.parentNode,
            span = doc.createElement('span', { click: (event) => { this.spanSwitch(event, a, v) } }, txt),
            name = document.querySelector(`[role="button"].send-email.selected .${lt.controls.PLACED_COMPONENT}-title`),
            subject = document.querySelector(`[role="button"].send-email.selected .${lt.controls.PLACED_COMPONENT}-main`);
        element.replaceChildren(span, doc.createElement('i', { class: "fa fa-pen ms-2" }));
        (async () => {
            switch (a) {
                case 'name': {
                    await Http.post(lt.urls.updateFlowMessageName(v), { body: { name: txt } }).then(res => res.json()).then(res => { res.status === 200 && (name.innerText = res.data.name) });
                } break;
                case 'subject': {
                    await Http.post(lt.urls.updateFlowMessageSubject(v), { body: { subject: txt } }).then(res => res.json()).then(res => { res.status === 200 && (subject.innerText = res.data.subject) });
                } break;
            }
        })();
    }
    panel_setup(e) {
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
                _header = doc.createElement('div', { class: `${_class}-header`.trim() },
                    doc.createElement('div', { class: `${_class}-title w-100`.trim() },
                        doc.createElement('span', { click: (event) => { this.spanSwitch(event, 'name', e.message.content_id) } }, e.message && e.message.name),
                        doc.createElement('i', { class: "fa fa-pen ms-2" })
                    )
                );
                _body.appendChild(this.panel_setup_mail(e));
            }; break;
            case lt.events.UPDATE_CUSTOMER: {
                _header = doc.createElement('div', { class: `${_class}-header`.trim() }, doc.createElement('div', { class: `${_class}-title`.trim() }, 'Update Profile Property'));
                _body.appendChild(this.panel_setup_update_customer(e));
            }; break;
            case lt.events.TIME_DELTA: {
                _header = doc.createElement('div', { class: `${_class}-header`.trim() }, `<div class="configuration-panel-title">Time Delay</div>`);
                _body.appendChild(this.panel_setup_time(e));
            }; break;
        }
        _config.replaceChildren(_header, _body);
    }
    panel_setup_time(e) {
        let buttonOk = doc.createElement("input", { type: "button", class: "btn btn-primary", value: "Save" });
        const Re = (ele, selected_value) => {
            let i = [{ value: 'day', text: "day(s)" }, { value: 'hour', text: "hour(s)" }, { value: 'minute', text: "minute(s)" }];
            let unit = new Selectr(ele, { data: i, searchable: !1, width: '50%', selectedValue: selected_value });
        };
        let hours = 0, rhours = 0, minutes = 0, rminutes = 0;
        if (e.after_seconds_unit === 'day') rhours = e.after_seconds / 86400;
        else if (e.after_seconds_unit === 'hour') hours = (e.after_seconds / 3600), rhours = Math.floor(hours), minutes = (hours - rhours) * 60, rminutes = Math.round(minutes);
        else if (e.after_seconds_unit === 'minute') rhours = e.after_seconds / 60;

        let select = doc.createElement('select', { name: "time-delay-unit" }),
            $body = doc.createElement("div", { class: "configuration-panel-body flow-action-panel-body" },
                doc.createElement("div", { class: "schedule-panel" },
                    doc.createElement("ul", { class: "configuration-sections" },
                        doc.createElement("li", null, doc.createElement("p", null, "Set this delay for"),
                            doc.createElement("div", { class: "control-group" }, doc.createElement("div", { class: "controls" }, doc.createElement("input", { type: "number", name: "delay-unit-value", value: rhours }), select)),
                            doc.createElement("div", { class: "timing-hint" }, doc.createElement("div", { class: "hint-text" }, `<span>Steps following this Time Delay occur on </span><strong>Day 0</strong><span> after the trigger</span><strong></strong><span></span>`))
                        )
                    ),
                    doc.createElement("div", { class: "configuration-panel-footer" },
                        doc.createElement("span", { class: "button-set" },
                            buttonOk,
                            doc.createElement("input", { type: "button", class: "btn btn-alt", value: "Cancel", click: (t) => { t.preventDefault(), t.stopPropagation(); config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 }) } })
                        )
                    )
                )
            );

        addEvent(select, 'change', (event) => {
            event.preventDefault();
            let p = select.closest('.control-group'), sibling = p.nextSibling;
            sibling && sibling.matches('.control-group') && sibling.remove();
            if (select.value === 'hour') {
                p.parentNode.insertBefore(
                    doc.createElement("div", { class: "control-group" },
                        doc.createElement("p", null, 'and'),
                        doc.createElement("div", { class: "controls timing-minutes" }, doc.createElement("input", { type: "number", name: "secondary-value", value: rminutes }), doc.createElement("span", null, 'minute(s)')),
                        doc.createElement("p", null, (e.rank <= 1 ? 'after the trigger' : 'after the previous step'))
                    ),
                    p.nextSibling
                )
            }
            else {
                p.parentNode.insertBefore(
                    doc.createElement("div", { class: "control-group" }, doc.createElement("p", null, (e.rank <= 1 ? 'after the trigger' : 'after the previous step'))),
                    p.nextSibling
                )
            }
        }), Re(select, e.after_seconds_unit);
        addEvent(buttonOk, 'click', (event) => {
            event.preventDefault(); event.stopPropagation();
            let JsonVar = { id: e.id, delay_units: select.options[select.selectedIndex].value };
            $body.querySelectorAll('input[type="number"]').forEach(r => { stringToObj(r.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "_"), parseInt(r.value) || 0, JsonVar); });
            Http.post(lt.urls.updateTiming(JsonVar.id), { body: JsonVar }).then(res => res.json()).then(res => { res.status === 200 && load(); });
        });
        return $body;
    }
    panel_setup_mail(e) {
        let buttonOk = doc.createElement("input", { type: "button", class: "btn btn-alt", value: "Done" }),
            buttonEdit = doc.createElement("button", { type: "button", class: "btn btn-alt", title: "Configure Content" }, "Configure Content");
        addEvent(buttonOk, 'click', (event) => { event.preventDefault(); event.stopPropagation(); config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 }); });
        addEvent(buttonEdit, 'click', (event) => {
            event.preventDefault(); event.stopPropagation(); window.location = `${window.location.origin}/flows/${e.message.content_id}/content`;
        });
        let select = doc.createElement('select', { name: "status", width: '120px' }),
            $body = doc.createElement("div", { class: "configuration-panel-body flow-action-panel-body" },
                doc.createElement("div", { class: "send-email-panel" },
                    doc.createElement("ul", { class: "configuration-sections" },
                        doc.createElement("li", null,
                            doc.createElement("div", { class: "configuration-subtitle" }, doc.createElement("h2", null, 'Content')),
                            doc.createElement("div", { class: "message-content" },
                                doc.createElement("ul", { class: 'message-detail' },
                                    doc.createElement("li", null,
                                        doc.createElement("span", { class: 'descriptor' }, 'Subject:'),
                                        doc.createElement("span", { class: 'from-label' },
                                            doc.createElement("span", { click: (t) => { this.spanSwitch(t, 'subject', e.message.content_id) } }, e.message && e.message.subject),
                                            doc.createElement('i', { class: "fa fa-pen ms-2" })
                                        )
                                    ),
                                    doc.createElement("li", null, `<span class="descriptor">From:</span><span class="from-label">${e.message && e.message.from_label} &lt;${e.message && e.message.from_email}&gt;</span>`)
                                ),
                                doc.createElement("div", { class: 'message-actions' }, buttonEdit)
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
                    doc.createElement("div", { class: "configuration-panel-footer flow-action-footer" },
                        doc.createElement("span", { class: "button-set" }, buttonOk),
                        doc.createElement("div", { class: "flow-action-status" }, doc.createElement("span", null, doc.createElement("h2", null, 'Send Status')), select)
                    )
                )
            );
        this.bindStatus(select, e.id, e.status);
        return $body;
    }
    panel_setup_update_customer(e) {
        let _ok = doc.createElement("input", { type: "button", class: "btn btn-primary", value: 'Save' }),
            _cancel = doc.createElement("input", { type: "button", class: "btn btn-alt", value: 'Cancel' });
        _cancel.onclick = () => { config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 }); }
        let select = doc.createElement('select', { name: "status", width: '120px' }),
            filter = doc.createElement("div", null,);//

        if (e.settings) e.settings.forEach((r, i) => { filter.appendChild(this.addCustomerFilters(r)) });
        else filter.appendChild(this.addCustomerFilters({}));
        let body = doc.createElement("div", { class: "configuration-panel-body flow-action-panel-body" },
            doc.createElement("div", { class: "send-email-panel" },
                doc.createElement("ul", { class: "configuration-sections" },
                    doc.createElement("li", null,
                        doc.createElement("div", { class: "configuration-subtitle" }, doc.createElement("h2", null, 'Activity (Last 30 Days)')),
                        doc.createElement("ul", { class: 'settings-list' },
                            doc.createElement("li", { class: '' }, `<span>Waiting</span><span class="setting-status">0</span>`),
                            doc.createElement("li", { class: '' }, `<span>Profiles Updated</span><span class="setting-status">0</span>`),
                        ),
                    ),
                    doc.createElement("li", null, doc.createElement("h2", { class: '' }, `Configuration`), filter)
                ),
                doc.createElement("div", { class: "configuration-panel-footer flow-action-footer" },
                    doc.createElement("span", { class: "button-set" }, _ok, _cancel),
                    doc.createElement("div", { class: "flow-action-status" }, doc.createElement("span", null, doc.createElement("h2", null, 'Send Status')), select)
                )
            )
        );
        this.bindStatus(select, e.id, e.status);
        _ok.onclick = (evt) => {
            event.preventDefault(); event.stopPropagation();
            let s = !0, v = [];
            [...filter.children].forEach((r, i) => {
                let para = {};
                r.querySelectorAll('input[type="text"],select').forEach(el => {
                    if (isSelect(el)) {
                        if (!isValidElement(el)) { s = !1; return this.addError(el) };
                        this.removeError(el), stringToObj(el.name, el.value, para);
                    }
                    else {
                        if (!isValidElement(el)) { s = !1; el.classList.add('parsley-error'); }
                        el.classList.remove('parsley-error'), stringToObj(el.name, el.value, para);
                    }
                }), v.push(para);
            })
            let option = { id: e.id, type: e.type, settings: JSON.stringify(v) };
            s && Http.post(lt.urls.updateAction(option.id), { body: option }).then(res => res.json()).then(res => { res.status === 200 && load(); });
            //console.log(option)
            //let JsonVar = { id: e.id, delay_units: select.value };
            //$body.querySelectorAll('input[type="number"]').forEach(r => { stringToObj(r.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "_"), parseInt(r.value) || 0, JsonVar); });
            //Http.post(lt.urls.updateTiming(JsonVar.id), { body: JsonVar }).then(res => res.json()).then(res => { res.status === 200 && load(); });
            //config_panel({ actionType: lt.panel.FLOWS_COMPONENTS_PANEL, displayFooter: !1 });
        }
        return body;
    }
    addCustomerFilters(e) {
        let operator = doc.createElement('select', { name: "operator" }), property_key = doc.createElement('select', { name: "property_key" }),
            u = [{ value: 'update', text: "Update Existing Property" }, { value: 'delete', text: "Remove Existing Property" }, { value: 'create', text: "Create New Property" }];
        let $d = doc.createElement('div', { class: "draggable-operation-builder", draggable: "true" },
            doc.createElement('div', { class: "update-profile-operation" },
                doc.createElement('div', { class: "update-profile-operation-drag" }, doc.createElement('i', { class: "fa fa-user" })),
                doc.createElement('div', { class: "update-profile-operation-content" }, doc.createElement('div', { class: "update-profile-operation-header" }, operator))
            ));
        operator.onchange = (evt) => {
            let p = evt.target.closest('.update-profile-operation-content');
            p.querySelector('.property-operation')?.remove();
            switch (evt.target.value) {
                case 'update':
                    {
                        p.appendChild(doc.createElement('div', { class: "property-operation" },
                            doc.createElement('div', { class: "property-operation-row" }, property_key),
                            doc.createElement('div', { class: "property-operation-row" }, doc.createElement('input', { type: "text", name: 'property_value', class: "property-key-field", placeholder: "Property Value", value: (e && e.property_value) }))
                        ));
                        this.getProperties(property_key, (e && e.property_key));
                    }
                    break;
                case 'delete':
                    {
                        p.appendChild(doc.createElement('div', { class: "property-operation" }, doc.createElement('div', { class: "property-operation-row" }, property_key)));
                        this.getProperties(property_key, (e && e.property_key));
                    }
                    break;
                case 'create':
                    {
                        p.appendChild(doc.createElement('div', { class: "property-operation" },
                            doc.createElement('div', { class: "property-operation-row" }, doc.createElement('input', { type: "text", name: 'property_key', class: "property-key-field", placeholder: "Property Label", value: (e && e.property_key) })),
                            doc.createElement('div', { class: "property-operation-row" }, doc.createElement('input', { type: "text", name: 'property_value', class: "property-key-field", placeholder: "Property Value", value: (e && e.property_value) }))
                        ));
                    }
                    break;
            }
        }
        new Selectr(operator, { data: u, searchable: !1, defaultSelected: !1, placeholder: 'Choose property action...', selectedValue: (e && e.operator) });
        return $d;
    }
    getProperties(ele, value) {
        let s = new Selectr(ele, { searchable: !1, defaultSelected: !1, placeholder: 'Choose a property...' });
        Http.get('/api/lists/people/property').then(res => res.json()).then(function (data) {
            let j = data.map(function (r) { return { value: r.value, text: r.label } });
            s.add(j, !0), s.setValue(value);
        });
    }
    addError(e) {
        let classesToAdd = ['parsley-error'], t = e.closest('div.selectr-container');
        t.querySelector('div.selectr-selected').classList.add(...classesToAdd);
        return false;
    }
    removeError(e) {
        let classesToAdd = ['parsley-error'], t = e.closest('div.selectr-container');
        t.querySelector('div.selectr-selected').classList.remove(...classesToAdd);
    }
    bindStatus(ele, id, value) {
        let i = [{ value: 0, text: "Draft" }, { value: 1, text: "Manual" }, { value: 2, text: "Live" }];
        new Selectr(ele, { data: i, searchable: !1, selectedValue: value });
        ele.onchange = (t) => {
            t.preventDefault(); t.stopPropagation();
            let option = { id: parseInt(id) || 0, status: ele.value };
            Http.post(lt.urls.updateActionStatus(option.id), { body: option }).then(res => res.json()).then(res => { res.status === 200 && load(); });
        }
    }
    s = { DRAFT: 0, MANUAL_MODE: 1, LIVE: 2 }
    l = { [this.s.DRAFT]: "Draft", [this.s.MANUAL_MODE]: "Manual", [this.s.LIVE]: "Live", }
    c = { [this.s.DRAFT]: "draft", [this.s.MANUAL_MODE]: "manual", [this.s.LIVE]: "live" }
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
