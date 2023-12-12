var doc = doc || document, lt = { id: 1000, loaded: !1, exports: {} };
doc.addEventListener("DOMContentLoaded", function () {
    fnENUM(lt);
    console.log('ENUM => ', lt)



    addEventListenerMulti("dragover", (event) => { dropAction(event) }, true, ".droppable-target");
    //addEventListenerMulti("drop", (event) => { dropAction(event) }, true, ".droppable-target");
    function dropAction(evt) {
        console.log(evt, this)
        let e = { canDrop: true, pending: false, actionType: 'send_message' };
        evt.target.parentElement.parentElement.parentElement.insertBefore(draw(e), evt.target.parentElement.parentElement);
    }

    //addEventListenerMulti("dragstart", onDragStart, false, ".draggable-flow-action-component");
    //addEventListenerMulti("dragend", onDragStart, false, ".draggable-flow-action-component");
    //addEventListenerMulti("mousedown", () => { dropActive(true); }, false, ".draggable-flow-action-component");
    //addEventListenerMulti("mouseup", () => { dropActive(false); }, false, ".draggable-flow-action-component");
    //addEventListenerMulti("drop", () => { dropActive(false); }, false, ".draggable-flow-action-component");
});

export const addEventListenerMulti = function (type, listener, capture, selector) {
    let nodes = doc.querySelectorAll(selector); console.log(type, nodes)
    for (let i = 0; i < nodes.length; i++) { nodes[i].addEventListener(type, listener, capture); }
},
    onDragStart = (ev) => {
        const rect = ev.target.getBoundingClientRect();
        console.log(rect)
        dropActive(true);
        //offsetX = ev.clientX - rect.x;
        //offsetY = ev.clientY - rect.y;
    },
    onDragEnd = (ev) => {
        const rect = ev.target.getBoundingClientRect();
        console.log(rect)
        //dropActive(false);
    },
    dropTarget = () => {
        return doc.createElement('div', { class: "droppable-target droppable-node" },
            doc.createElement('div', { class: "component-node-container" },
                doc.createElement('div', { class: "add-component-node" }, doc.createElement('i', { class: "fas fa-plus" }))
            )
        );
    },
    dropActive = (v) => {
        let nodes = doc.querySelectorAll('.flow-canvas .droppable-target'),
            panel = doc.createElement('div', { class: 'placed-component-container placeholder' }, doc.createElement('div', { class: 'placed-component send-email action' }));

        nodes.forEach((e, i) => {
            e.addEventListener("dragover", event => {
                // prevent default to allow drop
                event.preventDefault();
                //if (!event.target.querySelector('.placed-component-container')) {
                //event.target.appendChild(doc.createElement('div', { class: 'placed-component-container placeholder' }, doc.createElement('div', { class: 'placed-component send-email action' })));
                //event.target.appendChild(doc.createElement('div', { class: 'component-node-container  ' }));
                //}
            });
            e.addEventListener("drop", event => {
                // prevent default action (open as link for some elements)
                event.preventDefault();
                // move dragged element to the selected drop target
                //if (event.target.className == "dropzone") {
                //    dragged.parentNode.removeChild(dragged);
                //    event.target.appendChild(dragged);
                //}
                console.log("drop", event);

            });

            let addNode = e.querySelector('.add-component-node');
            addNode && addNode.replaceChildren();


            if (v && addNode) {
                e.classList.add('droppable-node'), addNode.replaceChildren(doc.createElement('i', { class: "fas fa-plus" }));
                //addNode.addEventListener("mouseover", (evt) => {
                //    evt.target.replaceChildren();
                //    e.appendChild(doc.createElement('div', { class: 'placed-component-container placeholder' }, doc.createElement('div', { class: 'placed-component send-email action' })));
                //    e.appendChild(doc.createElement('div', { class: 'component-node-container  ' }));
                //});
            }
            else {
                e.classList.remove('droppable-node');
            }
            //if (v) { e.classList.add('droppable-node'), addNode && addNode.replaceChildren(doc.createElement('i', { class: "fas fa-plus" })); }
            //else e.classList.remove('droppable-node'), addNode && addNode.replaceChildren();
        });
    },
    icon = () => {
        return doc.createElement('div', { class: "placed-component-icon-container" },
            doc.createElement('div', { class: "placed-component-icon-background" },
                doc.createElement('i', { class: "kl-icon kl-icon-send-email" })
            ),
        );
    };
function draw(e) {
    let { actionType: t, pending: n, canDrop: i } = e;
    const o = t === lt.Jn.REJOIN, r = o ? "path-exit" : "placed-component-container", l = lt.pc[t];
    let container = doc.createElement('div', { class: `${r} ${t}` });
    container.appendChild(dropTarget());

    let b = doc.createElement('div', { role: 'button', tabindex: '-1', class: `placed-component ${l}`.trim() },
        doc.createElement('div', { class: 'placed-component-body' }, icon(),
            doc.createElement('div', { class: 'placed-component-content' },
                doc.createElement('div', { class: 'placed-component-header' },
                    doc.createElement('div', { class: 'placed-component-title' }, '-'),
                    doc.createElement('div', { class: 'placed-component-dropdown-container' }, '-')
                ),
                doc.createElement('div', { class: 'placed-component-main' })
            ),
            doc.createElement('div', { class: 'placed-component-footer' })
        )
    )
    if (i === true) container.appendChild(doc.createElement('div', { role: 'button', tabindex: '-1' }, doc.createElement('div', { class: lt.i_[t], draggable: "true" }, b)))
    else container.appendChild(doc.createElement('div', { role: 'button', tabindex: '-1' }, b));
    //console.log(container);
    return container;
    //let b = r.createElement("div", {
    //    role: "button",
    //    tabIndex: "-1",
    //    className: `${ T? "": y }`.trim(),
    //    onClick: w,
    //    onKeyPress: function (e) {
    //        "Enter" === e.key && w(e)
    //    }
    //}, r.createElement("div", {
    //    className: "placed-component-body"
    //}, n, r.createElement("div", {
    //    className: "placed-component-content"
    //}, r.createElement("div", {
    //    className: "placed-component-header"
    //}, a, r.createElement("div", {
    //    className: "placed-component-dropdown-container"
    //}, S || !h.includes(v.r.FLOWS_COMPONENTS_CLONE_DELETE) || P ? "" : l)), null !== i ? r.createElement("div", {
    //    className: "placed-component-main",
    //    "data-actionid": g
    //}, i) : null, null !== o ? o : null)), P ? null : s);



    //return i || n ? [a.createElement(mi, {
    //    key: (0,
    //        La.Z)(),
    //    doShowDropTarget: !1
    //}), a.createElement("div", {
    //    key: (0,
    //        La.Z)(),
    //    className: `${r} placeholder`
    //}, a.createElement("div", {
    //    className: `${o ? "" : "placed-component"} ${l}`.trim()
    //}, n ? a.createElement("div", {
    //    className: "loader"
    //}) : "")), a.createElement(mi, {
    //    key: (0,
    //        La.Z)(),
    //    doShowDropTarget: !1
    //})] : a.createElement(mi, {
    //    key: (0,
    //        La.Z)()
    //})
}


export const checkArray = (e, a) => Object.prototype.hasOwnProperty.call(e, a),
    getArray = (e, a) => {
        for (var c in a)
            checkArray(a, c) && !checkArray(e, c) && Object.defineProperty(e, c, {
                enumerable: !0,
                get: a[c]
            })
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