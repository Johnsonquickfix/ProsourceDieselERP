var doc = doc || document, c = { id: 1000, loaded: !1, exports: {} };
doc.addEventListener("DOMContentLoaded", function () {
    let rightcard = false, tempblock, tempblock2;
    getEnum(c);
    //doc.getElementById("blocklist").innerHTML = '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/eye.svg"></div><div class="blocktext">                        <p class="blocktitle">New visitor</p><p class="blockdesc">Triggers when somebody visits a specified page</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="2"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Action is performed</p><p class="blockdesc">Triggers when somebody performs a specified action</p></div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="3"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/time.svg"></div><div class="blocktext">                        <p class="blocktitle">Time has passed</p><p class="blockdesc">Triggers after a specified amount of time</p>          </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="4"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/error.svg"></div><div class="blocktext">                        <p class="blocktitle">Error prompt</p><p class="blockdesc">Triggers when a specified error happens</p>              </div></div></div>';
    flowy(document.getElementById("canvas"), drag, release, snapping);
    flowy.import(createPanel(c.fa.TRIGGER));
    function addEventListenerMulti(type, listener, capture, selector) {
        var nodes = doc.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener(type, listener, capture);
        }
    }
    function snapping(drag, first) {
        let s = drag.querySelector(".blockelemtype").value, grab = drag.querySelector(".grabme"), blockin = drag.querySelector(".blockin");
        grab.parentNode.removeChild(grab);
        blockin.parentNode.removeChild(blockin);
        drag.innerHTML += createPanel(s);
        //if (s === c.fa.EMAIL) {
        //    drag.innerHTML += `<div class='blockyleft'><div class='blockico'><i class='fas fa-envelope'></i></div><p class='blockyname'>Email #1</p></div><div class='blockyright'></div><div class='blockydiv'></div><div class='blockyinfo'>Email #1 Subject</div>`;
        //}
        ////else if (s === c.fa.UPDATE_CUSTOMER) {
        ////    drag.innerHTML += "<div class='blockyleft'><div class='blockico'><i class='fas fa-envelope'></i></div><p class='blockyname'>Email #1</p></div><div class='blockyright'></div><div class='blockydiv'></div><div class='blockyinfo'>Email #1 Subject</div>";
        ////}
        //else if (s === c.fa.TIME_DELAY) {
        //    drag.innerHTML += `<div class='blockyleft'><div class='blockico'><i class='fas fa-clock'></i></div><p class='blockyname'>Configure Time Delay...</p></div><div class='blockyright'></div>`;
        //}
        return true;
    }
    function drag(block) {
        block.classList.add("blockdisabled");
        tempblock2 = block;
    }
    function release() {
        if (tempblock2) {
            tempblock2.classList.remove("blockdisabled");
        }
    }
    //var disabledClick = function(){
    //    document.querySelector(".navactive").classList.add("navdisabled");
    //    document.querySelector(".navactive").classList.remove("navactive");
    //    this.classList.add("navactive");
    //    this.classList.remove("navdisabled");
    //    if (this.getAttribute("id") == "triggers") {
    //        document.getElementById("blocklist").innerHTML = '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/eye.svg"></div><div class="blocktext">                        <p class="blocktitle">New visitor</p><p class="blockdesc">Triggers when somebody visits a specified page</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="2"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Action is performed</p><p class="blockdesc">Triggers when somebody performs a specified action</p></div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="3"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/time.svg"></div><div class="blocktext">                        <p class="blocktitle">Time has passed</p><p class="blockdesc">Triggers after a specified amount of time</p>          </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="4"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/error.svg"></div><div class="blocktext">                        <p class="blocktitle">Error prompt</p><p class="blockdesc">Triggers when a specified error happens</p>              </div></div></div>';
    //    } else if (this.getAttribute("id") == "actions") {
    //        document.getElementById("blocklist").innerHTML = '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="5"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/database.svg"></div><div class="blocktext">                        <p class="blocktitle">New database entry</p><p class="blockdesc">Adds a new entry to a specified database</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="6"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/database.svg"></div><div class="blocktext">                        <p class="blocktitle">Update database</p><p class="blockdesc">Edits and deletes database entries and properties</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="7"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Perform an action</p><p class="blockdesc">Performs or edits a specified action</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="8"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/twitter.svg"></div><div class="blocktext">                        <p class="blocktitle">Make a tweet</p><p class="blockdesc">Makes a tweet with a specified query</p>        </div></div></div>';
    //    } else if (this.getAttribute("id") == "loggers") {
    //        document.getElementById("blocklist").innerHTML = '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="9"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/log.svg"></div><div class="blocktext">                        <p class="blocktitle">Add new log entry</p><p class="blockdesc">Adds a new log entry to this project</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="10"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/log.svg"></div><div class="blocktext">                        <p class="blocktitle">Update logs</p><p class="blockdesc">Edits and deletes log entries in this project</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="11"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/error.svg"></div><div class="blocktext">                        <p class="blocktitle">Prompt an error</p><p class="blockdesc">Triggers a specified error</p>        </div></div></div>';
    //    }
    //}
    //addEventListenerMulti("click", disabledClick, false, ".side");
    document.getElementById("close")?.addEventListener("click", function () {
        if (rightcard) {
            rightcard = false;
            document.getElementById("properties").classList.remove("expanded");
            setTimeout(function () {
                document.getElementById("propwrap").classList.remove("itson");
            }, 300);
            tempblock.classList.remove("selectedblock");
        }
    });

    document.getElementById("removeblock").addEventListener("click", function () {
        flowy.deleteBlocks();
    });
    var aclick = false;
    var noinfo = false;
    var beginTouch = function (event) {
        aclick = true;
        noinfo = false;
        if (event.target.closest(".create-flowy")) {
            noinfo = true;
        }
    }
    var checkTouch = function (event) {
        aclick = false;
    }
    var doneTouch = function (event) {
        if (event.type === "mouseup" && aclick && !noinfo) {
            if (!rightcard && event.target.closest(".block") && !event.target.closest(".block").classList.contains("dragging")) {
                tempblock = event.target.closest(".block");
                rightcard = true;
                document.getElementById("properties").classList.add("expanded");
                document.getElementById("propwrap").classList.add("itson");
                tempblock.classList.add("selectedblock");
            }
        }
    }
    addEventListener("mousedown", beginTouch, false);
    addEventListener("mousemove", checkTouch, false);
    addEventListener("mouseup", doneTouch, false);
    addEventListenerMulti("touchstart", beginTouch, false, ".block");
});
function createPanel(_type) {
    let _ctr = '';

    if (c.fa.TRIGGER === _type) {
        return {
            html: `<div class="indicator invisible"></div><div class="blockelem noselect block" style="left: 329px; top: 16px;"><input type="hidden" name="blockelemtype" class="blockelemtype" value="${_type}"><input type="hidden" name="blockid" class="blockid" value="0"><div class="blockyleft"><div class="blockico"><i class="fas fa-bolt"></i></div><p class="blockyname">Trigger</p></div><div class="blockyright"></div><div class="blockydiv"></div><div class="blockyinfo">Select a flow trigger on the left to get started.</div></div>`,
            blockarr: [{ parent: -1, childwidth: 0, id: 0, x: 488, y: 72.5, width: 318, height: 113 }],
            blocks: [
                {
                    id: 0, parent: -1, data: [{ name: "blockelemtype", value: "send_message" }, { name: "blockid", value: 0 }],
                    attr: [{ class: "blockelem noselect block" }, { style: "left: 329px; top: 16px;" }]
                }
            ]
        }

        _ctr += `<div class='blockyleft'><div class='blockico'><i class='fas fa-envelope'></i></div><p class='blockyname'>Trigger</p></div><div class='blockyright'></div><div class='blockydiv'></div><div class='blockyinfo'>Select a flow trigger on the left to get started.</div>`;
    }
    else if (c.fa.EMAIL === _type) {
        _ctr += `<div class='blockyleft'><div class='blockico'><i class='fas fa-envelope'></i></div><p class='blockyname'>Email #1</p></div><div class='blockyright'></div><div class='blockydiv'></div><div class='blockyinfo'>Email #1 Subject</div>`;
    }
    //else if (s === c.fa.UPDATE_CUSTOMER) {
    //    drag.innerHTML += "<div class='blockyleft'><div class='blockico'><i class='fas fa-envelope'></i></div><p class='blockyname'>Email #1</p></div><div class='blockyright'></div><div class='blockydiv'></div><div class='blockyinfo'>Email #1 Subject</div>";
    //}
    else if (c.fa.TIME_DELAY === _type) {
        _ctr += `<div class='blockyleft'><div class='blockico'><i class='fas fa-clock'></i></div><p class='blockyname'>Configure Time Delay...</p></div><div class='blockyright'></div>`;
    }
    else if (c.fa.EXITNODE === _type) {
        _ctr += `<div class='blockyleft'><div class='blockico'><i class='fas fa-envelope'></i></div><p class='blockyname'>Email #1</p></div><div class='blockyright'></div><div class='blockydiv'></div><div class='blockyinfo'>Email #1 Subject</div>`;
    }
    return _ctr;
}

export const checkArray = (e, a) => Object.prototype.hasOwnProperty.call(e, a),
    getArray = (e, a) => {
        for (var c in a)
            checkArray(a, c) && !checkArray(e, c) && Object.defineProperty(e, c, {
                enumerable: !0,
                get: a[c]
            })
    },
    getEnum = function (t) {
        getArray(t, {
            fa: () => flow_action
        });
        const flow_action = {
            TRIGGER: "trigger",
            EMAIL: "send_message",
            SEND_SMS_MESSAGE: "send_sms",
            UPDATE_CUSTOMER: "update_customer",
            SEND_PUSH_NOTIFICATION: "send_push_notification",
            WEBHOOK: "webhook",
            TIME_DELAY: "time_delay",
            TRIGGER_SPLIT: "trigger_split",
            CONDITIONAL_SPLIT: "conditional_split",
            EXITNODE: "exit_node",
        }
    };