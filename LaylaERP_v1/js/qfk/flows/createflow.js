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
export const addEventListenerMulti = function (type, listener, capture, selector) {
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
        t.addEventListener("dragover", (event) => { event.preventDefault(); });
        t.addEventListener("drop", (e) => {
            e.preventDefault(); debugger
            let j = e.dataTransfer.getData("text/json"), { action: a, actionType: t, id: i } = JSON.parse(j);
            //let s = dragged, t, a = 'add';
            //s && (t = s.firstChild.getAttribute('data-type')) && (dropAction(e, a, t, pathId), dragged = null);
            a && dropAction(e, a, t, pathId, i);
        });
        return t;
    },
    dropAction = (ctr, mode, type, pathId, actionId) => {
        let root = doc.querySelector(`.${lt.controls.ROOT}`), _c = [...root.childNodes],
            e = { canDrop: !0, actionType: type, index: _c.indexOf(ctr.target.parentElement.parentElement) },
            action = { id: actionId || 0, path: pathId, type: type, rank: e.index };
        const onAdd = () => {
            Http.post(mode === 'add' ? lt.urls.addAction(action.path) : lt.urls.moveAction(action.id), { body: action }).then(res => res.json()).
                then(res => {
                    if (res.status === 200 && mode === 'add') {
                        let ele = drawComponent(e, res.data);
                        ele && root.insertBefore(ele, ctr.target.parentElement.parentElement);
                    }
                    else if (res.status === 200 && mode === 'move') { load(); }
                });
        }
        e.actionType && onAdd();
    },
    onDrag = (event) => { },
    onDragStart = (event) => {
        let a = { action: 'add', actionType: '' };
        a.actionType = event.target.firstChild.getAttribute('data-type');
        event.target.classList.add("dragging");
        event.dataTransfer.setData('text/json', JSON.stringify(a));
    },
    onDragEnd = (event) => { event.target.classList.remove("dragging"); };

const componentIcon = (_icon) => {
    return doc.createElement('div', { class: "placed-component-icon-container" }, `<div class="placed-component-icon-background"><i class="${_icon}"></i></div>`);
},
    drawComponent = (e, n) => {
        let { actionType: t, canDrop: d, index: i } = e,
            pc = lt.controls.PLACED_COMPONENT, o = t === lt.events.REJOIN, r = o ? "path-exit" : `${pc}-container`, l = lt.events_action[t],
            container = doc.createElement('div', { class: `${r} ${t}` }), $btn = doc.createElement('div', { role: 'button', tabindex: '-1' }),
            _delete = doc.createElement("button", { type: "button", class: 'btn btn-alt' }, '<i class="fa fa-trash"></i>');
        const onDelete = () => {
            n && Http.post(lt.urls.deleteAction(n.id)).then(res => res.json()).then(res => { res.status === 200 && container.remove(); });
        }
        _delete.addEventListener("click", (event) => { event.preventDefault(), onDelete(); });
        i > 0 && container.appendChild(dropTarget(n.path));
        switch (t) {
            case lt.events.EXIT_NODE: {
                $btn.appendChild(doc.createElement('div', { class: `path-exit` }, doc.createElement('div', { class: `flow-exit-node exit-node` }, 'Exit')));
            }; break;
            case lt.events.TRIGGER: {
                //d === true && $btn.appendChild(draggableDiv(t, n.id));
                const m = (n) => {
                    let $div = doc.createElement('p');
                    n && n.trigger_id > 0 && $div.replaceChildren(doc.createElement('span', null, 'When someone '),
                        doc.createElement('span', { class: 'highlighted-text' },
                            (n.trigger_type === 0 ? n.trigger_statistic && n.trigger_statistic.name : (n.trigger_type === 1 ? n.trigger_group && n.trigger_group.name : ''))),
                        doc.createElement('span', null, '.'));
                    return $div;
                }
                let b = doc.createElement('div', { role: 'button', tabindex: '-1', class: `${pc} ${l}`.trim() },
                    doc.createElement('div', { class: `${pc}-body` }, componentIcon('fa fa-bolt'),
                        doc.createElement('div', { class: `${pc}-content` },
                            doc.createElement('div', { class: `${pc}-header` },
                                doc.createElement('div', { class: `${pc}-title` }, 'Trigger'),
                                doc.createElement('div', { class: `${pc}-dropdown-container` })
                            ),
                            doc.createElement('div', { class: `${pc}-main` }, m(n))
                        ),
                        doc.createElement('div', { class: `${pc}-footer` })
                    )
                );
                $btn.children.length > 0 ? $btn.children[0].appendChild(b) : $btn.appendChild(b);
            }; break;
            case lt.events.EMAIL: {
                d === true && $btn.appendChild(draggableDiv(t, n.id));
                const m = (n) => {
                    let $div = doc.createElement('p');
                    n && n.trigger_id > 0 && $div.replaceChildren(doc.createElement('span', null, 'When someone '),
                        doc.createElement('span', { class: 'highlighted-text' },
                            (n.trigger_type === 0 ? n.trigger_statistic && n.trigger_statistic.name : (n.trigger_type === 1 ? n.trigger_group && n.trigger_group.name : ''))),
                        doc.createElement('span', null, '.'));
                    return $div;
                }
                let b = doc.createElement('div', { role: 'button', tabindex: '-1', class: `${pc} ${l}`.trim() },
                    doc.createElement('div', { class: `${pc}-body` }, componentIcon('fa fa-bolt'),
                        doc.createElement('div', { class: `${pc}-content` },
                            doc.createElement('div', { class: `${pc}-header` },
                                doc.createElement('div', { class: `${pc}-title` }, 'Trigger'),
                                doc.createElement('div', { class: `${pc}-dropdown-container` }, _delete)
                            ),
                            doc.createElement('div', { class: `${pc}-main` }, m(n))
                        ),
                        doc.createElement('div', { class: `${pc}-footer` })
                    )
                );
                $btn.children.length > 0 ? $btn.children[0].appendChild(b) : $btn.appendChild(b);
            }; break;
            case lt.events.TIME_DELTA: {
                d === true && $btn.appendChild(draggableDiv(t, n.id));
                let b = doc.createElement('div', { role: 'button', tabindex: '-1', class: `${pc} ${l}`.trim() },
                    doc.createElement('div', { class: `${pc}-body` }, componentIcon('fa fa-clock'),
                        doc.createElement('div', { class: `${pc}-content` },
                            doc.createElement('div', { class: `${pc}-header` },
                                doc.createElement('div', { class: `${pc}-title` }, 'Configure Time Delay…'),
                                doc.createElement('div', { class: `${pc}-dropdown-container` }, _delete)
                            )
                        )
                    )
                );
                $btn.children.length > 0 ? $btn.children[0].appendChild(b) : $btn.appendChild(b);
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
                //console.log('path', v, i)
                if (v.actions && v.actions.length > 0) {
                    v.actions.forEach((a, j) => {
                        //console.log('action', a, j)
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

const showLoader = () => {
    let x = doc.getElementById("loader");
    x.style.display = (x.style.display === "none" ? "block" : "none");
};
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
            console.log('error', error); showLoader();
            doc.querySelector('#root').replaceChildren(doc.createElement('h1', {}, `Sorry, that page isn't actually here.`));
        });
};

export const fnENUM = function (t, n) {
    //t = {};
    getArray(t, {
        $e: () => U,
        Aw: () => j,
        BA: () => D,
        C$: () => ie,
        C1: () => P,
        E9: () => r,
        ED: () => A,
        EE: () => B,
        EL: () => K,
        El: () => F,
        G: () => me,
        G2: () => se,
        HI: () => d,
        HR: () => Ee,
        J$: () => l,
        J5: () => v,
        Jn: () => T,
        KT: () => he,
        Ln: () => E,
        M4: () => ye,
        Mx: () => ge,
        PN: () => k,
        PQ: () => g,
        QQ: () => b,
        SQ: () => f,
        Sg: () => ue,
        Tl: () => x,
        Tw: () => C,
        UN: () => fe,
        UR: () => u,
        UZ: () => q,
        W4: () => J,
        XZ: () => ne,
        Xe: () => le,
        Y7: () => Se,
        ZX: () => re,
        Zj: () => Z,
        b$: () => W,
        cZ: () => G,
        dW: () => S,
        eY: () => H,
        fg: () => O,
        fw: () => ce,
        g6: () => L,
        i_: () => N,
        l0: () => w,
        l5: () => V,
        m0: () => X,
        mi: () => ee,
        nG: () => de,
        pN: () => pe,
        pc: () => _,
        qn: () => Q,
        rV: () => $,
        s2: () => I,
        uA: () => y,
        uD: () => p,
        v9: () => ve,
        vO: () => z,
        vc: () => Y,
        vs: () => h,
        vu: () => R,
        w2: () => oe,
        wb: () => c,
        xH: () => m,
        xV: () => s,
        yR: () => te,
        yu: () => M
    });
    //var a = n(473456), i = n(812763), o = n(459730);
    var a = { Bd: {} }, i = { $X: {}, dc: {} }, o = { r: {} };
    const r = -1
        , l = "/media/images/flows"
        , s = "$"
        , c = 2
        , d = "_FAKE_"
        , u = "Welcome Series"
        , p = {
            EVENT: 0,
            ADDED_TO_LIST: 1,
            UNCONFIGURED: 2,
            DATE_BASED: 3,
            PRICE_DROP: 4
        }
        , m = {
            CLEAR_TRIGGER: "CLEAR_TRIGGER",
            UPDATE_SELECTED_TRIGGER: "UPDATE_SELECTED_TRIGGER",
            UPDATE_TRIGGER_TYPE: "UPDATE_TRIGGER_TYPE",
            SAVE_TRIGGER_PENDING: "SAVE_TRIGGER_PENDING",
            SAVE_TRIGGER_ERROR: "SAVE_TRIGGER_ERROR",
            SAVE_TRIGGER_SUCCESS: "SAVE_TRIGGER_SUCCESS",
            SAVE_DATE_TRIGGER_ERROR: "SAVE_DATE_TRIGGER_ERROR",
            UPDATE_FLOW_HOLDOUT_OVERRIDE_SUCCESS: "UPDATE_FLOW_HOLDOUT_OVERRIDE_SUCCESS"
        }
        , h = {
            FETCH_INITAL_DATA_SUCCESS: "FETCH_DATA_SUCCESS",
            FETCH_FLOW_STATISTICS_DATA_SUCCESS: "FETCH_FLOW_STATISTICS_DATA_SUCCESS",
            UPDATE_FLOW_STATISTICS_LOADING: "UPDATE_FLOW_STATISTICS_LOADING",
            UPDATE_FLOW_SUCCESS: "UPDATE_FLOW_SUCCESS",
            UPDATE_FLOW_PENDING: "UPDATE_FLOW_PENDING",
            UPDATE_FLOW_ERROR: "UPDATE_FLOW_ERROR",
            FLOW_API_SUCCESS: "FLOW_API_SUCCESS",
            FLOW_API_ERROR: "FLOW_API_ERROR",
            UPDATE_FLOW_DETAILS_SUCCESS: "UPDATE_FLOW_DETAILS_SUCCESS",
            CREATE_FLOW_FOLDER_PENDING: "CREATE_FLOW_FOLDER_PENDING",
            CREATE_FLOW_FOLDER_SUCCESS: "CREATE_FLOW_FOLDER_SUCCESS",
            CREATE_FLOW_FOLDER_ERROR: "CREATE_FLOW_FOLDER_ERROR",
            BACKPOPULATE_FLOW_SUCCESS: "BACKPOPULATE_FLOW_SUCCESS",
            CLEAR_HEADER_STATE: "CLEAR_HEADER_STATE",
            BULK_UPDATE_ACTIONS_STATUS_PENDING: "BULK_UPDATE_ACTIONS_STATUS_PENDING",
            BULK_UPDATE_ACTIONS_STATUS_SUCCESS: "BULK_UPDATE_ACTIONS_STATUS_SUCCESS",
            BULK_UPDATE_ACTIONS_STATUS_ERROR: "BULK_UPDATE_ACTIONS_STATUS_ERROR",
            WEBHOOK_SETUP_SUCCESS: "WEBHOOK_SETUP_SUCCESS",
            SHOW_TOASTS: "SHOW_TOASTS",
            CLEAR_TOASTS: "CLEAR_TOASTS"
        }
        , g = {
            TRIGGER_AND_FILTERS_INITIAL: "TRIGGER_AND_FILTERS_INITIAL",
            TRIGGER_LIST_PANEL: "TRIGGER_LIST_PANEL",
            TRIGGER_SEGMENT_PANEL: "TRIGGER_SEGMENT_PANEL",
            TRIGGER_ACTION_PANEL: "TRIGGER_ACTION_PANEL",
            TRIGGER_DATE_PANEL: "TRIGGER_DATE_PANEL",
            TRIGGER_PRICE_DROP_PANEL: "TRIGGER_PRICE_DROP_PANEL",
            TRIGGER_SETUP_PANEL: "TRIGGER_SETUP_PANEL",
            FILTER_BUILDER: "FILTER_BUILDER",
            REQUEST_TRIGGER_OPTIONS: "REQUEST_TRIGGER_OPTIONS",
            RECEIVE_TRIGGER_OPTIONS: "RECEIVE_TRIGGER_OPTIONS",
            UPDATE_CONFIGURATION_PANEL: "UPDATE_CONFIGURATION_PANEL",
            PREVIOUS_CONFIGURATION_PANEL: "PREVIOUS_CONFIGURATION_PANEL",
            HIDE_CONFIGURATION_PANEL: "HIDE_CONFIGURATION_PANEL",
            SHOW_CONFIGURATION_PANEL: "SHOW_CONFIGURATION_PANEL",
            SEND_EMAIL_PANEL: "SEND_EMAIL_PANEL",
            SEND_PUSH_PANEL: "SEND_PUSH_PANEL",
            SEND_SMS_PANEL: "SEND_SMS_PANEL",
            BRANCH_PANEL: "BRANCH_PANEL",
            CONDITIONAL_SPLIT_PANEL: "CONDITIONAL_SPLIT_PANEL",
            TRIGGER_SPLIT_PANEL: "TRIGGER_SPLIT_PANEL",
            SCHEDULE_PANEL: "SCHEDULE_PANEL",
            COUNTDOWN_DELAY_PANEL: "COUNTDOWN_DELAY_PANEL",
            DATE_TRIGGER_PANEL: "DATE_TRIGGER_PANEL",
            BACK_IN_STOCK_PANEL: "BACK_IN_STOCK_PANEL",
            SUPPRESS_CUSTOMER_PANEL: "SUPPRESS_CUSTOMER_PANEL",
            UPDATE_CUSTOMER_PANEL: "UPDATE_CUSTOMER_PANEL",
            NOTIFICATION_PANEL: "NOTIFICATION_PANEL",
            PRICE_DROP_TRIGGER_PANEL: "PRICE_DROP_TRIGGER_PANEL",
            WEBHOOK_PANEL: "WEBHOOK_PANEL",
            INTERNAL_SERVICE_PANEL: "INTERNAL_SERVICE_PANEL",
            AB_TEST_PANEL: "AB_TEST_PANEL"
        }
        , E = [g.TRIGGER_AND_FILTERS_INITIAL, g.TRIGGER_LIST_PANEL, g.TRIGGER_SEGMENT_PANEL, g.TRIGGER_ACTION_PANEL, g.TRIGGER_PRICE_DROP_PANEL, g.TRIGGER_DATE_PANEL]
        , f = {
            CLEAR_ALL_PENDING: "CONFIG_PANEL_CLEAR_ALL_PENDING",
            SAVE_CHANGES_COMPLETED: "CONFIG_PANEL_SAVE_CHANGES_COMPLETED",
            SAVE_CHANGES_PENDING: "CONFIG_PANEL_SAVE_CHANGES_PENDING",
            SAVE_CHANGES_ERROR: "CONFIG_PANEL_SAVE_CHANGES_ERROR",
            UPDATE_CHANGES: "CONFIG_PANEL_UPDATE_CHANGES"
        }
        , S = {
            MESSAGE_NAME: "messageName",
            MESSAGE_SETTINGS: "messageSettings",
            MESSAGE_FILTERS: "messageFilters",
            ACTION_STATUS: "actionStatus",
            ACTION_TIME_DELTA: "actionTimeDelta",
            DATE_TRIGGER_TIME_DELTA: "dateTriggerTimeDelta",
            PRICE_DROP_TRIGGER: "priceDropTrigger",
            NOTIFICATION_MESSAGE: "notificationMessage",
            WEBHOOK_SETTINGS: "webhookSettings",
            WEBHOOK_NAME: "webhookName",
            UTM_PARAMS: "utmParams"
        }
        , y = {
            BULK_CREATE_CANVAS_GRAPH: "BULK_CREATE_CANVAS_GRAPH",
            SELECT_COMPONENT: "SELECT_COMPONENT",
            CLEAR_SELECTED: "CLEAR_SELECTED",
            CLEAR_ALL_SELECTED: "CLEAR_ALL_SELECTED",
            CREATE_COMPONENT_PENDING: "CREATE_COMPONENT_PENDING",
            CREATE_COMPONENT_ERROR: "CREATE_COMPONENT_ERROR",
            CREATE_COMPONENT_SUCCESS: "CREATE_COMPONENT_SUCCESS",
            DISCONNECT_REJOIN_PENDING: "DISCONNECT_REJOIN_PENDING",
            DISCONNECT_REJOIN_SUCCESS: "DISCONNECT_REJOIN_SUCCESS",
            DISCONNECT_REJOIN_ERROR: "DISCONNECT_REJOIN_ERROR",
            DELETE_BRANCH_PENDING: "DELETE_BRANCH_PENDING",
            DELETE_BRANCH_ERROR: "DELETE_BRANCH_ERROR",
            DELETE_BRANCH_SUCCESS: "DELETE_BRANCH_SUCCESS",
            UPDATE_COMPONENT_TIMING_PENDING: "UPDATE_COMPONENT_TIMING_PENDING",
            UPDATE_COMPONENT_ERROR: "UPDATE_COMPONENT_ERROR",
            UPDATE_COMPONENT_TIMING_ERROR: "UPDATE_COMPONENT_TIMING_ERROR",
            UPDATE_COMPONENT_SUCCESS: "UPDATE_COMPONENT_SUCCESS",
            MOVE_COMPONENT_PENDING: "MOVE_COMPONENT_PENDING",
            MOVE_COMPONENT_SUCCESS: "MOVE_COMPONENT_SUCCESS",
            MOVE_COMPONENT_ERROR: "MOVE_COMPONENT_ERROR",
            PURGE_ALL_PLACED_COMPONENT_DATA: "PURGE_ALL_PLACED_COMPONENT_DATA",
            HIDE_TRIGGER_SUMMARY: "HIDE_TRIGGER_SUMMARY",
            SHOW_TRIGGER_SUMMARY: "SHOW_TRIGGER_SUMMARY",
            TOGGLE_ANALYTICS: "TOGGLE_ANALYTICS"
        }
        , v = {
            TRIGGER_AND_FILTERS_INITIAL: {
                title: "Trigger Setup",
                displayFooter: !1
            },
            TRIGGER_LIST_PANEL: {
                title: "Trigger Setup",
                displayFooter: !0
            },
            TRIGGER_SEGMENT_PANEL: {
                title: "Trigger Setup",
                displayFooter: !0
            },
            TRIGGER_ACTION_PANEL: {
                title: "Trigger Setup",
                displayFooter: !0
            },
            TRIGGER_DATE_PANEL: {
                title: "Trigger Setup",
                displayFooter: !0
            },
            TRIGGER_SETUP_PANEL: {
                title: "Trigger Setup",
                displayFooter: !0
            },
            TRIGGER_PRICE_DROP_PANEL: {
                title: "Trigger Setup",
                displayFooter: !1
            },
            FILTER_BUILDER: {
                title: "Flow Filters",
                displayFooter: !1
            },
            SEND_EMAIL_PANEL: {
                title: "Message Name",
                displayFooter: !1
            },
            SEND_PUSH_PANEL: {
                title: "Notification Name",
                displayFooter: !1
            },
            SEND_SMS_PANEL: {
                title: "Message Name",
                displayFooter: !1
            },
            CONDITIONAL_SPLIT_PANEL: {
                title: "Conditional Split",
                displayFooter: !1
            },
            TRIGGER_SPLIT_PANEL: {
                title: "Trigger Split",
                displayFooter: !1
            },
            SCHEDULE_PANEL: {
                title: "Time Delay",
                displayFooter: !1
            },
            BACK_IN_STOCK_PANEL: {
                title: "Back In Stock Delay",
                displayFooter: !0
            },
            SUPPRESS_CUSTOMER_PANEL: {
                title: "Suppress Customer",
                displayFooter: !0
            },
            UPDATE_CUSTOMER_PANEL: {
                title: "Profile Property Update",
                displayFooter: !0
            },
            COUNTDOWN_DELAY_PANEL: {
                title: "Countdown Delay",
                displayFooter: !1
            },
            DATE_TRIGGER_PANEL: {
                title: "Target Date",
                displayFooter: !1
            },
            NOTIFICATION_PANEL: {
                title: "Notification",
                displayFooter: !1
            },
            WEBHOOK_PANEL: {
                title: "Webhook",
                displayFooter: !0
            },
            INTERNAL_SERVICE_PANEL: {
                title: "Internal Service",
                displayFooter: !0
            },
            AB_TEST_PANEL: {
                title: "Message Name",
                displayFooter: !0
            },
            REQUEST_TRIGGER_OPTIONS: {
                title: "Trigger Setup",
                displayFooter: !1
            },
            RECEIVE_TRIGGER_OPTIONS: {
                title: "Trigger Setup",
                displayFooter: !1
            },
            UPDATE_CONFIGURATION_PANEL: {
                title: "",
                displayFooter: !1
            },
            PREVIOUS_CONFIGURATION_PANEL: {
                title: "",
                displayFooter: !1
            },
            HIDE_CONFIGURATION_PANEL: {
                title: "",
                displayFooter: !1
            },
            SHOW_CONFIGURATION_PANEL: {
                title: "",
                displayFooter: !1
            },
            BRANCH_PANEL: {
                title: "",
                displayFooter: !1
            },
            PRICE_DROP_TRIGGER_PANEL: {
                title: "",
                displayFooter: !1
            }
        }
        , I = [o.r.FLOWS_ACTION_STATUS_WRITE, o.r.FLOWS_BACKPOPULATE, o.r.FLOWS_COMPONENTS_CLONE_DELETE, o.r.FLOWS_COMPONENTS_CREATE, o.r.FLOWS_COMPONENTS_MOVE, o.r.FLOWS_CONTENT_WRITE, o.r.FLOWS_CREATE, o.r.FLOWS_EMAIL_SETTINGS_WRITE, o.r.FLOWS_TRIGGERS_FILTERS_WRITE, o.r.FLOWS_WRITE]
        , T = {
            EMAIL: "send_message",
            SEND_PUSH_NOTIFICATION: "send_push_notification",
            SEND_SMS_MESSAGE: "send_sms",
            BRANCH: "branch_boolean",
            TIME_DELTA: "time_delay",
            BACK_IN_STOCK_DELAY: "back_in_stock_delay",
            SUPPRESS_CUSTOMER: "suppress_customer",
            UPDATE_CUSTOMER: "update_customer",
            COUNTDOWN_DELAY: "countdown_delay",
            DATE_TRIGGER: "date_trigger",
            NOTIFICATION: "send_notification_message",
            WEBHOOK: "webhook",
            INTERNAL_SERVICE: "internal_service",
            AB_TEST: "ab_test",
            TRIGGER_SPLIT: "trigger_split",
            CONDITIONAL_SPLIT: "conditional_split",
            SPLIT: "branch_boolean",
            TRIGGER: "trigger",
            EXIT_NODE: "exit_node",
            REJOIN: "rejoin_node"
        }
        , C = {
            [T.TRIGGER]: g.TRIGGER_SETUP_PANEL,
            [T.SEND_PUSH_NOTIFICATION]: g.SEND_PUSH_PANEL,
            [T.EMAIL]: g.SEND_EMAIL_PANEL,
            [T.SEND_SMS_MESSAGE]: g.SEND_SMS_PANEL,
            [T.TIME_DELTA]: g.SCHEDULE_PANEL,
            [T.BACK_IN_STOCK_DELAY]: g.BACK_IN_STOCK_PANEL,
            [T.SUPPRESS_CUSTOMER]: g.SUPPRESS_CUSTOMER_PANEL,
            [T.UPDATE_CUSTOMER]: g.UPDATE_CUSTOMER_PANEL,
            [T.BRANCH]: g.CONDITIONAL_SPLIT_PANEL,
            [T.CONDITIONAL_SPLIT]: g.CONDITIONAL_SPLIT_PANEL,
            [T.TRIGGER_SPLIT]: g.TRIGGER_SPLIT_PANEL,
            [T.COUNTDOWN_DELAY]: g.COUNTDOWN_DELAY_PANEL,
            [T.DATE_TRIGGER]: g.DATE_TRIGGER_PANEL,
            [T.NOTIFICATION]: g.NOTIFICATION_PANEL,
            [T.WEBHOOK]: g.WEBHOOK_PANEL,
            [T.INTERNAL_SERVICE]: g.INTERNAL_SERVICE_PANEL,
            [T.AB_TEST]: g.AB_TEST_PANEL
        }
        , A = {
            [T.SEND_PUSH_NOTIFICATION]: "push notification",
            [T.EMAIL]: "email",
            [T.SEND_SMS_MESSAGE]: "SMS message",
            [T.TIME_DELTA]: "time delay",
            [T.BACK_IN_STOCK_DELAY]: "back in stock delay",
            [T.COUNTDOWN_DELAY]: "countdown delay",
            [T.DATE_TRIGGER]: "countdown delay",
            [T.SUPPRESS_CUSTOMER]: "suppress customer",
            [T.UPDATE_CUSTOMER]: "update customer",
            [T.BRANCH]: "split",
            [T.TRIGGER_SPLIT]: "trigger split",
            [T.CONDITIONAL_SPLIT]: "conditional split",
            [T.NOTIFICATION]: "notification",
            [T.WEBHOOK]: "webhook",
            [T.INTERNAL_SERVICE]: "internal_service",
            [T.AB_TEST]: "email"
        }
        , P = {
            ACTION: "action",
            TIMING: {
                get COLLAPSED() {
                    return `${this.base} collapsed`
                },
                get EXPANDED() {
                    return `${this.base} expanded`
                },
                base: "timing"
            },
            LOGIC: "logic"
        }
        , _ = {
            [T.SEND_PUSH_NOTIFICATION]: `push - notification ${P.ACTION}`,
            [T.EMAIL]: `send - email ${P.ACTION}`,
            [T.SEND_SMS_MESSAGE]: `send - sms ${P.ACTION}`,
            [T.TIME_DELTA]: `time - delta ${P.TIMING.COLLAPSED}`,
            [T.BACK_IN_STOCK_DELAY]: `back -in -stock ${P.TIMING.EXPANDED}`,
            [T.COUNTDOWN_DELAY]: `countdown - delay ${P.TIMING.COLLAPSED}`,
            [T.DATE_TRIGGER]: `countdown - delay ${P.TIMING.COLLAPSED}`,
            [T.SUPPRESS_CUSTOMER]: `suppress - customer ${P.ACTION}`,
            [T.BRANCH]: `branch ${P.LOGIC}`,
            [T.TRIGGER_SPLIT]: `branch ${P.LOGIC}`,
            [T.CONDITIONAL_SPLIT]: `branch ${P.LOGIC}`,
            [T.UPDATE_CUSTOMER]: `update - customer ${P.ACTION}`,
            [T.REJOIN]: "rejoin-node exit-node",
            [T.NOTIFICATION]: `send - notification ${P.ACTION}`,
            [T.WEBHOOK]: `webhook ${P.ACTION}`,
            [T.INTERNAL_SERVICE]: `internal - service ${P.ACTION}`,
            [T.AB_TEST]: `ab - test ${P.ACTION}`
        }
        , w = {
            PLACED_COMPONENT: "PLACED_COMPONENT",
            OPERATION_BUILDER: "OPERATION_BUILDER",
            [T.EMAIL]: "SEND_EMAIL",
            [T.SEND_PUSH_NOTIFICATION]: "SEND_PUSH_NOTIFICATION",
            [T.SEND_SMS_MESSAGE]: "SEND_SMS_MESSAGE",
            [T.TIME_DELTA]: "TIME_DELTA",
            [T.COUNTDOWN_DELAY]: "COUNTDOWN_DELAY",
            [T.BACK_IN_STOCK_DELAY]: "BACK_IN_STOCK",
            [T.SUPPRESS_CUSTOMER]: "SUPPRESS_CUSTOMER",
            [T.UPDATE_CUSTOMER]: "UPDATE_CUSTOMER",
            [T.REJOIN]: "REJOIN_NODE",
            [T.NOTIFICATION]: "SEND_NOTIFICATION",
            [T.WEBHOOK]: "WEBHOOK",
            [T.INTERNAL_SERVICE]: "INTERNAL_SERVICE",
            [T.AB_TEST]: "AB_TEST"
        }
        , b = {
            [w.PLACED_COMPONENT]: w.PLACED_COMPONENT,
            [w.OPERATION_BUILDER]: w.OPERATION_BUILDER
        }
        , N = {
            [T.SEND_PUSH_NOTIFICATION]: "draggable-push-notification-component",
            [T.EMAIL]: "draggable-email-placed-component",
            [T.SEND_SMS_MESSAGE]: "draggable-sms-placed-component",
            [T.TIME_DELTA]: "draggable-time-delta-component",
            [T.COUNTDOWN_DELAY]: "draggable-countdown-delay-component",
            [T.BACK_IN_STOCK_DELAY]: "draggable-back-in-stock-component",
            [T.SUPPRESS_CUSTOMER]: "draggable-suppress-customer-component",
            [T.UPDATE_CUSTOMER]: "draggable-update-customer-component",
            [T.REJOIN]: "",
            [T.NOTIFICATION]: "draggable-notification-placed-component",
            [T.WEBHOOK]: "draggable-webhook-placed-component",
            [T.INTERNAL_SERVICE]: "draggable-internal-service-placed-component",
            [T.AB_TEST]: "draggable-ab-test-placed-component"
        }
        , D = {
            CONDITIONAL_MODE: 0,
            TRIGGER_MODE: 1
        }
        , O = {
            [D.CONDITIONAL_MODE]: T.CONDITIONAL_SPLIT,
            [D.TRIGGER_MODE]: T.TRIGGER_SPLIT
        }
        , M = {
            [D.CONDITIONAL_MODE]: "Conditional Split",
            [D.TRIGGER_MODE]: "Trigger Split"
        }
        , F = [T.BRANCH, ...Object.values(O)]
        , R = {
            BRANCH: 1,
            EMAIL: 4,
            UPDATE_CUSTOMER: 5,
            SEND_PUSH_NOTIFICATION: 6,
            TIME_DELTA: 7,
            BACK_IN_STOCK_DELAY: 8,
            SUPPRESS_CUSTOMER: 9,
            DATE_TRIGGER: 10,
            COUNTDOWN_DELAY: 11,
            SEND_SMS_MESSAGE: 12,
            NOTIFICATION: 13,
            WEBHOOK: 14,
            INTERNAL_SERVICE: 15,
            AB_TEST: 16
        }
        , k = {
            CREATE_MESSAGE: "CREATE_MESSAGE",
            CREATE_MESSAGE_LEGACY_PENDING: "CREATE_MESSAGE_LEGACY_PENDING",
            CLONE_ACTION_PENDING: "CLONE_ACTION_PENDING",
            CLONE_ACTION_SUCCESS: "CLONE_ACTION_SUCCESS",
            CLONE_ACTION_ERROR: "CLONE_ACTION_ERROR",
            UPDATE_ACTION_STATUS_PENDING: "UPDATE_ACTION_STATUS_PENDING",
            UPDATE_ACTION_STATUS_SUCCESS: "UPDATE_ACTION_STATUS_SUCCESS",
            UPDATE_ACTION_STATUS_ERROR: "UPDATE_ACTION_STATUS_ERROR",
            DELETE_ACTION_PENDING: "DELETE_ACTION_PENDING",
            UPDATE_ACTION_SETTING_PENDING: "UPDATE_ACTION_SETTING_PENDING",
            UPDATE_ACTION_SETTING_SUCCESS: "UPDATE_ACTION_SETTING_SUCCESS",
            UPDATE_ACTION_SETTING_ERROR: "UPDATE_ACTION_SETTING_ERROR",
            UPDATE_NOTIFICATION_ACTION: "UPDATE_NOTIFICATION_ACTION",
            FLIP_BRANCH_PENDING: "FLIP_BRANCH_PENDING",
            FLIP_BRANCH_SUCCESS: "FLIP_BRANCH_SUCCESS",
            FLIP_BRANCH_ERROR: "FLIP_BRANCH_ERROR",
            UPDATE_MESSAGE_SETTING_PENDING: "UPDATE_MESSAGE_SETTING_PENDING",
            UPDATE_MESSAGE_SETTING_SUCCESS: "UPDATE_MESSAGE_SETTING_SUCCESS",
            UPDATE_MESSAGE_SETTING_ERROR: "UPDATE_MESSAGE_SETTING_ERROR",
            UPDATE_MESSAGE_NAME_PENDING: "UPDATE_MESSAGE_NAME_PENDING",
            UPDATE_MESSAGE_NAME_SUCCESS: "UPDATE_MESSAGE_NAME_SUCCESS",
            UPDATE_MESSAGE_NAME_ERROR: "UPDATE_MESSAGE_NAME_ERROR",
            UPDATE_MESSAGE_SUBJECT_PENDING: "UPDATE_MESSAGE_SUBJECT_PENDING",
            UPDATE_MESSAGE_SUBJECT_SUCCESS: "UPDATE_MESSAGE_SUBJECT_SUCCESS",
            UPDATE_MESSAGE_SUBJECT_ERROR: "UPDATE_MESSAGE_SUBJECT_ERROR",
            UPDATE_MESSAGE_CONTENT_PENDING: "UPDATE_MESSAGE_CONTENT_PENDING",
            UPDATE_MESSAGE_CONTENT_SUCCESS: "UPDATE_MESSAGE_CONTENT_SUCCESS",
            UPDATE_MESSAGE_CONTENT_ERROR: "UPDATE_MESSAGE_CONTENT_ERROR",
            UPDATE_MESSAGE_UTM_PENDING: "UPDATE_MESSAGE_UTM_PENDING",
            UPDATE_MESSAGE_UTM_SUCCESS: "UPDATE_MESSAGE_UTM_SUCCESS",
            UPDATE_MESSAGE_UTM_ERROR: "UPDATE_MESSAGE_UTM_ERROR",
            UPDATE_MESSAGE_VARIATION_SUBJECT_PENDING: "UPDATE_MESSAGE_VARIATION_SUBJECT_PENDING",
            UPDATE_MESSAGE_VARIATION_SUBJECT_SUCCESS: "UPDATE_MESSAGE_VARIATION_SUBJECT_SUCCESS",
            UPDATE_MESSAGE_VARIATION_SUBJECT_ERROR: "UPDATE_MESSAGE_VARIATION_SUBJECT_ERROR",
            UPDATE_MESSAGE_VARIATION_WEIGHTS_PENDING: "UPDATE_MESSAGE_VARIATION_WEIGHTS_PENDING",
            UPDATE_MESSAGE_VARIATION_WEIGHTS_SUCCESS: "UPDATE_MESSAGE_VARIATION_WEIGHTS_SUCCESS",
            UPDATE_MESSAGE_VARIATION_WEIGHTS_ERROR: "UPDATE_MESSAGE_VARIATION_WEIGHTS_ERROR",
            UPDATE_WEBHOOK_MESSAGE_NAME_PENDING: "UPDATE_WEBHOOK_MESSAGE_NAME_PENDING",
            UPDATE_WEBHOOK_MESSAGE_NAME_SUCCESS: "UPDATE_WEBHOOK_MESSAGE_NAME_SUCCESS",
            UPDATE_WEBHOOK_MESSAGE_NAME_ERROR: "UPDATE_WEBHOOK_MESSAGE_NAME_ERROR",
            UNDELETE_FLOW_MESSAGE_SUCCESS: "UNDELETE_FLOW_MESSAGE_SUCCESS",
            UNDELETE_FLOW_MESSAGE_FAILURE: "UNDELETE_FLOW_MESSAGE_FAILURE"
        }
        , x = {
            DRAFT: 0,
            MANUAL_MODE: 1,
            LIVE: 2,
            DISABLED_MANUAL_MODE: 3
        }
        , L = {
            [x.DRAFT]: "Draft",
            [x.MANUAL_MODE]: "Manual",
            [x.LIVE]: "Live",
            [x.DISABLED_MANUAL_MODE]: "Disabled"
        }
        , Z = {
            DRAFT: 0,
            LIVE: 1,
            COMPLETED: 2
        }
        , U = {
            [Z.DRAFT]: "Draft",
            [Z.LIVE]: "Live",
            [Z.COMPLETED]: "Completed"
        }
        , B = {
            [x.DRAFT]: "draft",
            [x.MANUAL_MODE]: "manual",
            [x.LIVE]: "live",
            [x.DISABLED_MANUAL_MODE]: "disabled"
        }
        , G = "UPDATE_GO_LIVE_MODAL_STATUS"
        , H = {
            HIDE_READY_TO_SEND: 0,
            SHOW_READY_TO_SEND: 1
        }
        , V = "UPDATE_READY_TO_SEND_MODAL_STATUS"
        , z = "GET_SMS_SETUP_STATUS"
        , j = {
            DAYS: 0,
            HOURS: 1,
            SECONDS: 2,
            MINUTES: 3
        }
        , W = "HH:mm:ss"
        , $ = "HH:mm"
        , K = "h:mm A"
        , J = "Invalid Date"
        , Q = {
            TRIGGER_FILTER_KEY: "trigger_filter",
            CUSTOMER_FILTER_KEY: "customer_filter",
            JOINED_PATH_KEY: "joined_path",
            TRUE_PATH_KEY: "true_path",
            FALSE_PATH_KEY: "false_path",
            PROFILE_OPERATIONS: "profile_operations"
        }
        , Y = "$subscribed_to_back_in_stock"
        , q = {
            ADDITIONAL_FILTERS: "filter",
            UTM_TRACKING: "utm",
            SOUND: "sound",
            SMART_SENDING: "mail-checkmark",
            TRANSACTIONAL: "sort-horizontal",
            QUIET_HOURS: "sleep"
        }
        , X = {
            [a.Bd.TriggerFilter]: "triggerFilter",
            [a.Bd.CustomerFilter]: "customerFilter",
            [a.Bd.TruePath]: "truePath",
            [a.Bd.FalsePath]: "falsePath",
            [a.Bd.JoinedPath]: "joinedPath",
            [a.Bd.ProfileOperations]: "profileOperations"
        }
        , ee = "daysOfWeek"
        , te = "Daily"
        , ne = {
            0: "M",
            1: "T",
            2: "W",
            3: "Th",
            4: "F",
            5: "Sa",
            6: "S"
        }
        , ae = [0, 1, 2, 3, 4, 5, 6]
        , ie = {
            [ae[0]]: "Mon",
            [ae[1]]: "Tue",
            [ae[2]]: "Wed",
            [ae[3]]: "Thu",
            [ae[4]]: "Fri",
            [ae[5]]: "Sat",
            [ae[6]]: "Sun"
        }
        , oe = 0
        , re = 1
        , le = 2
        , se = 0
        , ce = 1
        , de = 2
        , ue = {
            NETWORK_ERROR: "NETWORK_ERROR"
        };
    const pe = {
        [i.$X.PERCENT]: "PERCENT",
        [i.$X.CURRENCY]: "CURRENCY"
    }
        , me = 100
        , he = {
            DAYS_7: "7 days",
            DAYS_14: "14 days",
            DAYS_30: "30 days",
            DAYS_60: "60 days",
            DAYS_90: "90 days",
            DAYS_CUSTOM: "Custom (up to 90 days)"
        }
        , ge = {
            DAYS_7: 7,
            DAYS_14: 14,
            DAYS_30: 30,
            DAYS_60: 60,
            DAYS_90: 90,
            DAYS_CUSTOM: -1
        }
        , Ee = (i.dc.VIEWED_ITEM,
            i.dc.STARTED_CHECKOUT,
            i.dc.VIEWED_OR_CHECKOUT,
        {
            [i.dc.VIEWED_ITEM]: "viewed the item",
            [i.dc.STARTED_CHECKOUT]: "started checkout with the item",
            [i.dc.VIEWED_OR_CHECKOUT]: "viewed the item or started checkout with the item"
        })
        , fe = {
            OPEN_CHANGELOG_SIDEBAR: "OPEN_CHANGELOG_SIDEBAR",
            CLOSE_CHANGELOG_SIDEBAR: "CLOSE_CHANGELOG_SIDEBAR"
        }
        , Se = {
            SCHEDULE_REPORT: 0,
            TRACK_EVENT: 1
        }
        , ye = {
            SHOW_PREVIEW_TRIGGER_MODAL: "SHOW_PREVIEW_TRIGGER_MODAL",
            HIDE_PREVIEW_TRIGGER_MODAL: "HIDE_PREVIEW_TRIGGER_MODAL"
        }
        , ve = "<p><br></p>"
}