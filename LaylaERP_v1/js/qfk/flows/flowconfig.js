"use strict";
var m = {};
export const flowConfig = (e) => {
    let a = m[e]; if (void 0 !== a) return a.exports;
    let c = m[e] = { id: e, loaded: !1, exports: {} };
    return enums.call(c.exports, c, c.exports), c.loaded = !0, c.exports
},
    checkArray = (e, a) => Object.prototype.hasOwnProperty.call(e, a),
    getArray = (e, a) => {
        for (var c in a) checkArray(a, c) && !checkArray(e, c) && Object.defineProperty(e, c, { enumerable: !0, get: a[c] })
    },
    loader = () => {
        let x = document.getElementById("loader");
        x.style.display = (x.style.display === "none" ? "block" : "none");
    };
export const enums = function (e, t, n) {
    getArray(t, {
        flow: () => x,
        controls: () => _controls,
        events: () => _events,
        events_action: () => _action,
        panel: () => _panel,
        triggers: () => _triggers,
        flowAction: () => _flowAction,
        draggable: () => _draggable,
        urls: () => _urls
    });
    const _controls = { ROOT: 'root-branch', PLACED_COMPONENT: 'placed-component' },
        _events = {
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
        },
        P = {
            ACTION: "action",
            TIMING: {
                get COLLAPSED() { return `${this.base} collapsed` },
                get EXPANDED() { return `${this.base} expanded` },
                base: "timing"
            },
            LOGIC: "logic"
        },
        _action = {
            [_events.TRIGGER]: `trigger ${P.LOGIC}`,
            [_events.SEND_PUSH_NOTIFICATION]: `push-notification ${P.ACTION}`,
            [_events.EMAIL]: `send-email ${P.ACTION}`,
            [_events.SEND_SMS_MESSAGE]: `send-sms ${P.ACTION}`,
            [_events.TIME_DELTA]: `time-delta ${P.TIMING.COLLAPSED}`,
            [_events.BACK_IN_STOCK_DELAY]: `back-in-stock ${P.TIMING.EXPANDED}`,
            [_events.COUNTDOWN_DELAY]: `countdown-delay ${P.TIMING.COLLAPSED}`,
            [_events.DATE_TRIGGER]: `countdown-delay ${P.TIMING.COLLAPSED}`,
            [_events.SUPPRESS_CUSTOMER]: `suppress-customer ${P.ACTION}`,
            [_events.BRANCH]: `branch ${P.LOGIC}`,
            [_events.TRIGGER_SPLIT]: `branch ${P.LOGIC}`,
            [_events.CONDITIONAL_SPLIT]: `branch ${P.LOGIC}`,
            [_events.UPDATE_CUSTOMER]: `update-customer ${P.ACTION}`,
            [_events.REJOIN]: "rejoin-node exit-node",
            [_events.NOTIFICATION]: `send-notification ${P.ACTION}`,
            [_events.WEBHOOK]: `webhook ${P.ACTION}`,
            [_events.INTERNAL_SERVICE]: `internal-service ${P.ACTION}`,
            [_events.AB_TEST]: `ab-test ${P.ACTION}`
        },
        _panel = {
            FLOWS_COMPONENTS_PANEL: "FLOWS_COMPONENTS_PANEL",
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
        },
        _triggerType = { EVENT: 0, ADDED_TO_LIST: 1, UNCONFIGURED: 2, DATE_BASED: 3, PRICE_DROP: 4 },
        _triggerName = { Actions: 'action', Date: 'date', Lists: 'list', PriceDrop: 'priceDrop', Segments: 'segment' },
        _triggers = [{
            triggerName: _triggerName.Lists,
            triggerType: _triggerType.ADDED_TO_LIST,
            icon: "fas fa-list",
            text: "List",
            description: "People will enter when they are added to a specific list.",
            state: _panel.TRIGGER_LIST_PANEL,
        }, {
            triggerName: _triggerName.Segments,
            triggerType: _triggerType.ADDED_TO_LIST,
            icon: "fas fa-list",
            text: "Segment",
            description: "People will enter when they join a specific dynamic segment.",
            state: _panel.TRIGGER_SEGMENT_PANEL,
        }, {
            triggerName: _triggerName.Actions,
            triggerType: _triggerType.EVENT,
            icon: "fas fa-list",
            text: "Metric",
            description: "People will enter when they take a specific action (e.g. Placed Order).",
            state: _panel.TRIGGER_ACTION_PANEL,
        },
        //{
        //triggerName: _triggerName.PriceDrop,
        //triggerType: _triggerType.PRICE_DROP,
        //icon: "fas fa-list",
        //text: "Price Drop",
        //description: "People will enter when the price drops on any item they engaged with.",
        //state: _panel.TRIGGER_PRICE_DROP_PANEL,
        //},
        {
            triggerName: _triggerName.Date,
            triggerType: _triggerType.DATE_BASED,
            icon: "fas fa-list",
            isNewIcon: !0,
            text: "Date Property",
            description: "People will enter if they have a specific date property set (e.g. Birthday).",
            state: _panel.TRIGGER_DATE_PANEL,
        }],
        _flowAction = [{
            type: P.ACTION, text: 'Actions',
            group: [
                { type: _events.EMAIL, text: "Email", icon: "fas fa-list" },
                { type: _events.SEND_SMS_MESSAGE, text: "SMS", icon: "fas fa-list" },
                { type: _events.UPDATE_CUSTOMER, text: "Update Profile Property", icon: "fas fa-list" },
                { type: _events.NOTIFICATION, text: "Notification", icon: "fas fa-list" },
                { type: _events.WEBHOOK, text: "Webhook", icon: "fas fa-list" }
            ]
        }, {
            type: P.TIMING.base, text: 'Timing',
            group: [{ type: _events.TIME_DELTA, text: "Time Delay", icon: "fas fa-list" },]
        }, {
            type: P.LOGIC, text: 'Logic',
            group: [
                { type: _events.CONDITIONAL_SPLIT, text: "Conditional Split", icon: "fas fa-list" },
                { type: _events.TRIGGER_SPLIT, text: "Trigger Split", icon: "fas fa-list" },
            ]
        }],
        _draggable = {
            [_events.SEND_PUSH_NOTIFICATION]: "draggable-push-notification-component",
            [_events.EMAIL]: "draggable-email-placed-component",
            [_events.SEND_SMS_MESSAGE]: "draggable-sms-placed-component",
            [_events.TIME_DELTA]: "draggable-time-delta-component",
            [_events.COUNTDOWN_DELAY]: "draggable-countdown-delay-component",
            [_events.BACK_IN_STOCK_DELAY]: "draggable-back-in-stock-component",
            [_events.SUPPRESS_CUSTOMER]: "draggable-suppress-customer-component",
            [_events.UPDATE_CUSTOMER]: "draggable-update-customer-component",
            [_events.REJOIN]: "",
            [_events.NOTIFICATION]: "draggable-notification-placed-component",
            [_events.WEBHOOK]: "draggable-webhook-placed-component",
            [_events.INTERNAL_SERVICE]: "draggable-internal-service-placed-component",
            [_events.AB_TEST]: "draggable-ab-test-placed-component"
        },
        _urls = {
            getFlow: e => `/api/flows/${e}`,
            configureFlowTrigger: e => `/api/flow/${e}/configure`,
            triggerOptions: {
                [_triggerName.Lists]: "/api/lists/static-group?type=1",
                [_triggerName.Segments]: "/api/lists/static-group?type=2",
                [_triggerName.Actions]: "/api/lists/metrics",
                [_triggerName.Date]: "/api/lists/people/property"
            },
            addAction: e => `/api/flow/path/${e}/action/add`,
            deleteAction: e => `/api/flow/action/${e}/delete`,
            moveAction: e => `/api/flow/action/${e}/move`,
        };
    function x() {
        return window.location.pathname.split("/")[2] || "-1"
    }
}

export default flowConfig;