/**
 Core script to handle the entire theme and core functions
 **/
var App = function () {
    // IE mode
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;
    var resizeHandlers = [];

    // runs callback functions set by App.addResponsiveHandler().
    var _runResizeHandlers = function () {
        // reinitialize other subscribed elements
        for (var i = 0; i < resizeHandlers.length; i++) {
            var each = resizeHandlers[i];
            each.call();
        }
    };

    //Initialize the iframe content page height
    var handleIframeContent = function () {
        var ht = $(window).height();//Get the overall height of the browser window；

        var $footer = $(".main-footer");
        var $header = $(".main-header");
        var $tabs = $(".content-tabs");

        var height = App.getViewPort().height - $footer.outerHeight() - $header.outerHeight();
        if ($tabs.is(":visible")) {
            height = height - $tabs.outerHeight();
        }

        $(".tab_iframe").css({
            height: height,
            width: "100%"
        });

        //var width = App.getViewPort().width- $(".page-sidebar-menu").width();
        /*$(".tab_iframe").css({
         });*/
    };
    //Initialize the content page layout component height
    var handleIframeLayoutHeight = function () {

        var height = App.getViewPort().height - $('.page-footer').outerHeight() - $('.page-header').outerHeight() - $(".content-tabs").height();
        // $("#layout").css({ "height": height });
        return height;
    };

    var handleSiderBarmenu = function () {
        jQuery('.page-sidebar-menu').on('click', ' li > a.iframeOpen', function (e) {
            e.preventDefault();
            App.scrollTop();
            $("#iframe-main").attr("src", $(this).attr('href'));
        });
    };

    // handle the layout reinitialization on window resize
    var handleOnResize = function () {
        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize(function () {
                if (currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    _runResizeHandlers();
                    handleIframeContent();
                }, 50); // wait 50ms until window resize finishes.                
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
            $(window).resize(function () {
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    _runResizeHandlers();
                    handleIframeContent();
                }, 50); // wait 50ms until window resize finishes.
            });
        }
    };

    // Handles Bootstrap Tabs.
    var handleTabs = function () {
        //activate tab if tab id provided in the URL
        if (location.hash) {
            var tabid = encodeURI(location.hash.substr(1));
            $('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function () {
                var tabid = $(this).attr("id");
                $('a[href="#' + tabid + '"]').click();
            });
            $('a[href="#' + tabid + '"]').click();
        }

        if ($().tabdrop) {
            $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
            });
        }
    };

    return {

        //main function to initiate the theme
        init: function () {
            //IMPORTANT!!!: Do not modify the core handlers call order.

            //Core handlers
            handleInit(); // initialize core variables
            handleOnResize(); // set and handle responsive    

            //UI Component handlers     
            handleMaterialDesign(); // handle material design       
            handleUniform(); // hanfle custom radio & checkboxes
            handleiCheck(); // handles custom icheck radio and checkboxes
            handleBootstrapSwitch(); // handle bootstrap switch plugin
            handleScrollers(); // handles slim scrolling contents 
            handleFancybox(); // handle fancy box
            handleSelect2(); // handle custom Select2 dropdowns
            handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            handleAlerts(); //handle closabled alerts
            handleDropdowns(); // handle dropdowns
            handleTabs(); // handle tabs
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); //handles accordions 
            handleModals(); // handle modals
            handleBootstrapConfirmation(); // handle bootstrap confirmations
            handleTextareaAutosize(); // handle autosize textareas
            handleCounterup(); // handle counterup instances

            handleSiderBarmenu();
            //Handle group element heights
            this.addResizeHandler(handleHeight); // handle auto calculating height on window resize

            // Hacks
            handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
        },
        fixIframeCotent: function () {
            setTimeout(function () {
                //_runResizeHandlers();
                handleIframeContent();
            }, 50);
        },
        //public function to remember last opened popover that needs to be closed on click
        setLastPopedPopover: function (el) {
            lastPopedPopover = el;
        },

        //public function to add callback a function which will be called on window resize
        addResizeHandler: function (func) {
            resizeHandlers.push(func);
        },

        //public functon to call _runresizeHandlers
        runResizeHandlers: function () {
            _runResizeHandlers();
        },

        // wrApper function to  block element(indicate loading)
        blockUI: function (options) {
            options = $.extend(true, {}, options);
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="data:image/gif;base64,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" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="data:image/gif;base64,R0lGODlhHgAeAIQAAAQCBISChMTCxOTi5GxqbCQmJPTy9NTS1BQSFKyqrMzKzOzq7Pz6/DQ2NNza3BwaHLy+vAwKDJyanMTGxOTm5Hx+fCwqLPT29BQWFLSytMzOzOzu7Pz+/Nze3P///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQAeACwAAAAAHgAeAAAF/qAnjiOzOJrCHUhDZAYpzx7TCRAkCIwG/ABMZUOTcSgTnVLA8QF/mASn6OE4lFie8/mrUD0LXG7Z5EIPVWPnAsaJBRprIfLEoBcd2QIyie0hCgtsIkcSBUF3OgslSQJ9YAMMRRcViTgTkh4dSwKDXyJ/SgM1YmOjnyKbpZgbWSqohAo5OxAGV1iLsCIDWBAOsm48uiIXbxAHSWMKw4QTpQoM0dLMItLW0heZzAzZ3AylgNQcssoaSxDasMVYGrdKFMy8sxAdG246E1OwDM5LG99jdOSBdevNlBtjBMSAFSbgKYA7/HTQN8MGmz04oI3AeDHjgAv6OFwY4ExhGwi5REYM8ANOgAoG5MZMuHhqxp97OhgYmHXvUREOCBPq4LCzJYSaRRYA46lzng4BRFAxIElmp7JIzDicOADtgoIDDgykkxECACH5BAkJACgALAAAAAAeAB4AhQQCBISChMTCxERCROTi5BweHKyqrPTy9NTS1BQSFGxqbDQ2NLy6vJSSlMzKzOzq7CQmJPz6/HR2dAwKDLSytNza3BwaHHx+fAQGBISGhMTGxOTm5CQiJKyurPT29BQWFLy+vJyanMzOzOzu7CwqLPz+/Hx6fNze3P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+QJRwOIw8KiJHCZFYKCgHonSKipwEIJBAEBEBvoDPZUSVljYarVpQ8oK/H0OpjCpV1FqGtv1+X+goD1hZa3x9YQh1ZicegVgCegIidhAYbx+JBhJSDyAaUZ0gDg+NQiUPDRCIKAaWHUVpAp+BBBFlHheZlgAWZCgnebJRgEOtbxlVg4QExEMSfQUeI2uic80oHhx9DHd5IA/XQw19Eg7BXOFCJ30DaYQO6aaqYAUR9vfxQiP7/PYe+PlK3LPnLgu8eCUKejL3CIStdB4agkBwZ5CADfEIZBlUYRoeJeEiaLAI4kAJi3qYXesGSZStK5EElGoWKo9KkVpkBjphbYpbFVCDHDwMpKVRJ1kEPFgr4YHASJ2CQPgaQgAUoUdKIpgj5AmUyilHSXI5sBESFg0zp5QAtlHPHrIt13wt82Dro7Eb84y6FsFpsBJk39VCOALJpAMORBAYMXRKEAAh+QQJCQAqACwAAAAAHgAeAIUEAgSEgoTEwsREQkTk4uQcHhysqqz08vTU0tQUEhS0trSUkpRsamw0NjTMyszs6uwkJiT8+vx0dnQMCgyMjoy0srTc2twcGhy8vrx8fnwEBgSEhoTExsTk5uQkIiSsrqz09vQUFhS8urycmpzMzszs7uwsKiz8/vx8enzc3tz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCVcDiMPCwkxwmRaDAqB6J0qoqkBBiMQBAhAb6AUKZElZ46HK1acPKCvyHDqaw6WdRakbb9fmfoKg9YWWt8fWEIdWYpIIFYAnoCJHYQGm8hiQYSUg8YHFGdGA4PjUInDwsQiCoGlh9FaQKfgQQRZSAZmZYAF2QqKXmyUYBDrW8bVYOEBMRDEn0FICVronPNKiAefSJ3eRgP10MLfRIOwVzhQil9A2mEDummqmAFEfb38UIl+/z2IPj5DvAT6C4LvHgntNEz9wiDrXTr3gy4M0hAh3gUyE3DoyTcgQt9MJyoqIfZNQbQbF2JJKBUMwN9KAiJEKtloBTWpliJYgyAXodhgbQ06iSLAAhrJ0AQ4LClkTEFUgiAIvRISQRzhDzx/EOFaEUtEQ5k2SICC4dGOYmcADZWzx6xkMZqMUnnAdZHXMSuETHqWoSlwU7oNVgLYQkkkw44IEGgxEMqQQAAIfkECQkALAAsAAAAAB4AHgCFBAIEhIKExMLEREJE5OLkrKqsHB4c9PL01NLUFBIUlJKUbGpstLa0NDY0jIqMzMrM7OrsJCYk/Pr8dHZ0DAoMtLK03NrcHBocvL68fH58BAYEhIaExMbEREZE5ObkrK6sJCIk9Pb0FBYUnJqcvLq8jI6MzM7M7O7sLCos/P78fHp83N7c////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv5AlnA4lEAspkcKkWgsKgeidMqSrAQYjEAgMQG+AFHmRJWmPBytWpDygr+iQqrMSlnUWpK2/X5n6CwQWFlrfH1hCHVmKyGBWAJ6AiZ2ERpvIokFE1IQGBxRnRgPEI1CKRAKEYgsBZYfRWkCn4EEEmUhGZmWABdkLCt5slGAQ61vG1WDhATEQxN9BiEna6JzzSwhIH0kd3kYENdDCn0TD8Fc4UIrfQNphA/ppqpgBhL29/FCJ/v89iH4+Q7wE+guC7x4KbTRM/cIg610694MuDNIgId4JchNw6Mk3IELfTCkqKiH2bUF0GxdiSSgVLMCfUoIkRCrZaAV1qYcmKDrC1iIYYG0NOoki0AIa3YcgMTEyhIDKQRAEXqkxIJCMEwL/KFCtKKWLodW5SSSAlgWSGcNHXJADIK5NVzcvDHwtJkEArFIsJELwEAJl9dSnEAyCYGBDioc0gkCACH5BAkJAC0ALAAAAAAeAB4AhQQCBISChMTCxERCROTi5BweHKyqrPTy9NTS1BQSFJSSlGxqbDQyNLS2tIyKjMzKzOzq7CQmJPz6/HR2dAwKDLSytNza3BwaHLy+vHx+fAQGBISGhMTGxERGROTm5CQiJKyurPT29BQWFJyanDQ2NLy6vIyOjMzOzOzu7CwqLPz+/Hx6fNze3P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+wJZwOJRALKeHCpEgLSoHonTakrAEGIxAIDkBvgBRBkWVqjwcrVqg8oK/IoOq3FJZ1NqStv1+Z+gtEFhZa3x9YQh1ZiwhgVgCegIndhEabyKJBhNSEBgcUZ0YDxCNQioQChGILQaWIEVpAp+BBBJlIRmZlgAXZC0sebJRgEOtbxtVg4QExEMTfQUhKGuic80tIR99JXd5GBDXQwp9Ew/BXOFCLH0DaYQP6aaqYAUS9vfxQij7/PYh+PkO8BPoLgu8eCq00TP3CIOtdOveDLgzSICHeCbITcOjJNyBC30wqKioh9m1BdBsXYkkoFQzA31MCJEQqyWrCS6lHJig68tah2GBtDSCCaCAAhbW7DgAiYmVpQZSCEQx9oZBCAsKwTQ18IcK1TcJDrjp09SamWeHEoQY28cBMRAg31BYe6gA1GYoNhQAo5ZtARM5m4UoMWGAVQQFOqxwSCcIACH5BAkJADAALAAAAAAeAB4AhQQCBISChMTCxERCROTi5KSmpBweHPTy9JSSlNTS1LS2tCwuLBQSFGxqbIyKjMzKzOzq7KyurCQmJPz6/HR2dAwKDJyanNza3Ly+vDQ2NBwaHHx+fAQGBISGhMTGxERGROTm5KyqrCQiJPT29Ly6vDQyNBQWFIyOjMzOzOzu7LSytCwqLPz+/Hx6fJyenNze3P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+QJhwOJxALqgHK8HINFQHonQKm7wEGIxAMEEBvgDTJkWVskAerVrA8oK/phCrDGNd1FqStv1+b+gwEFhZa3x9YQl1Zi8jgVgCegIodhIcbyaJIRRSEBgeUZ0YDxCNQiwQCBKIMAUcHBFFaQKfgQQTZSMbmZYAGmQwL3mzUYBDIbxfHVWDhATFQxR9BiMpa6JzzzAjIn0kd3kYENlDCH0UD8Jc40IvfQNphA/rpqpgBhP4+fNCKf3+/ymIzTvgjyCDNwuwjZvAzV6GNxXErXuBDMCABn0szDthTkUfCaWeHTDQB8MIE33+ZMP45h6MDZcSZWv15gQ/lKs0hZRygEJbIpoARAgssIqmAQQvsNlxoCGnJQVEWOiCcazPggkJ6oHBxCpAmap9GIxw04erwqjRDlUYkeDQFwfFIjR9I5asPajPUnQg+aVuyxM7n40gQWHAArYGPrTAcKtMEAAh+QQJCQAyACwAAAAAHgAeAIUEAgSEgoTEwsREQkSkoqTk4uQcHhy0srT08vSUkpTU0tRkZmQsLiwUEhR0dnSMiozMysysqqzs6uwkJiS8urz8+vwMCgycmpzc2tw0NjQcGhx8fnwEBgSEhoTExsRERkSkpqTk5uQkIiS0trT09vRsamw0MjQUFhR8enyMjozMzsysrqzs7uwsKiy8vrz8/vycnpzc3tz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCZcDisSDAqyEvRyJQOCKJ0KqvEBC6XQFBRAb6A04ZFlb5CHq1a8PKCv6fIqyx7YdRairb9fm/oMhJYWWt8fWEKdWYOiYJ5Wip2ExxvJ4kRDlIEiIFZEBIkQy8SCROcIBwcK0MhJ3CNBRVlJBuXlAAaZDIOlYmAQxG3Xx0yCA19Kb9DvG8GJCt9DLLKMiQGfRQLfTDUQwl9DiZvHLrdBX0DFm8M3aIizSzx8VHtQvLyCPMS9PX58yzqwDCY0+7FOzAGMryxIKFeDHQl+lyolwLcgT4TQlFDcO2NCxKu/HSL2EzWhl7dUL1JJoNFSEsyMGmcgoCRDJUARPADcYqSUYEEMQjaeaCBUzAAI4i8qBVT2BdpCkyhBBGgzNE+DUi46QOT4KJDACyQUAAWwINfK4q+yboVYVJlLDp0BMC2WYqZ1EhQcDCAwVgDH1C4mEYlCAAh+QQJCQAwACwAAAAAHgAeAIUEAgSEgoTEwsREQkQkIiSkoqTk4uT08vQUEhSUkpRkZmQ0MjS0srTU0tR0dnSMiowsKiysqqzs6uz8+vwcGhwMCgycmpw8Ojy8urzc2tx8fnwEBgSEhoTMzsxERkQkJiSkpqTk5uT09vQUFhRsamw0NjS0trR8enyMjowsLiysrqzs7uz8/vwcHhycnpzc3tz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCYcDg8qEgLgqiBKJEYB6J0CpM4RoAsQtTJZkeaFVXKKiC82QoX/Y2wxjAWia1d0wEaOAy0oW+7dCMNcWQOgxF9XhsXIhkfiV+HDlIFAIIwiAAQLhJvcRIJH5aDfBsqQyFYo3saE2MiGqQVWRRiMA5ol3pDKpAAHDAHZ2gou0O4aC0iKmwprsYwIgRsGApsLtBDCWwOC2gbttkGbAOzXinZQyzTXi0r7+9R6ULw8AfxEvLz9/Er5lkpPGVbl6wEmgoS5r0gNweNhXkouDFg80FEtgMtqIlQ5SUPtIbtXGnINQgaH2L0VF2K4MAilQOG9iQioA/EqpMtErzwxCLDSAMKqzKZIMIiFiZfAJw1EEVyT4Axmdj8uXNJIFFkbNQ0uAPgwS4VQNFMZdNiqLEVHDLWAZSlBQqX2URgcDAgxZIWHk4IgDslCAAh+QQJCQAyACwAAAAAHgAeAIUEAgSEgoTEwsREQkTk4uQkIiSkoqT08vS0srQUEhTU0tRkZmQ0MjSUkpR0dnSMiozMyszs6uwsKiysqqz8+vy8urwcGhwMCgzc2tw8Ojx8fnwEBgSEhoTExsRERkTk5uQkJiSkpqT09vS0trQUFhRsamw0NjScnpx8enyMjozMzszs7uwsLiysrqz8/vy8vrwcHhzc3tz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCZcDg8tEqMgkgkUGFWFKJ0Kos4SIBsQnR4CV6vTixKJboMiaz6wgV/v51IWegqqe9bprvifcXmMiEbd1ptXnxwBzIuUi4OCjITg2obGUsQAnxgHYoTDlIGACSQkgASJxGMQiIfEF6dgy1DH1iikCEaZFMUMSKRkxYrQg53o4BEE4QcMgdpdynHQ8R3MCIthCy6xyIwhBULhCfRRA2EDgx3G8LjQgSEAxd3LOxDLgXUK/n5ivRC+voH9kXg1y/gvhXx1LBQxc4eNRN3LsihF+OdnTvi6KUwh4AQCF/jDlgg9EJELTUa2F1UAyOKhmKQxgl65q+WMU8gpxx4FGhSWgGCIWz1BACjQQxVLjA8GHlz0AgzGkhNUkhBAQhCxkIEKFOK0BYVhLIYY2hmGiE2CsJmeXCsxUg8IsASgvE02goO3QrJzQIjRc5xIio4GMBChAIYHlC80CYlCAAh+QQJCQAxACwAAAAAHgAeAIUEAgSEgoTEwsREQkTk4uSkoqQkIiT08vS0srQUEhTU0tRkZmSUkpQ0MjR0dnSMiozMyszs6uysqqz8+vy8urwcGhwMCgwsKizc2tw8Ojx8fnwEBgSEhoTExsRERkTk5uSkpqT09vS0trQUFhRsamycnpw0NjR8enyMjozMzszs7uysrqz8/vy8vrwcHhwsLizc3tz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/sCYcDg8rEgNQygkSGFUE6J0Gos4RoBsInRoCVqtDixKJbIKiazawgV/v51IWcgiqe9bppvibcHmMSAbd1ptXnxwBzEsUiwOCjESg2obGUsQAnxgHYoRf0QFACOQkgAXJRGMQiEfEF6dX3JCH1iikCAaZFMTMCFVXy0QZA53o4BEEW5gBDEHaXcox0MwwJkdEyuEL7rHEx2ZfSoLhCXSRB9gfTANdxsq5kMTb14pFncv8EMsEJoUECoAASrKJ2SCwYMHBEYYSDBgQHtqXqiCx8LAHRcm7liQBQ/GpCwD7Nwplw8FIQcICCmBd6ACoRYhaqnRAE+kGhdRNBSDZE4QaDQhKmoZk+DAF5UDjwJNMsAQhC2lAFwwgKGKBYYHLocOEmFGA6mPWbYpMADWGIgAZUoR2pKCUBZjE80Qc8tGgdssD46tcIknRFtCLrhKU8HBhRq2F1EYhReCgoMBL0IocOHhRAtuUoIAACH5BAkJADAALAAAAAAeAB4AhQQCBISChMTCxERGROTi5KSipCQiJPTy9LSytBQSFNTS1JSSlGRmZDQyNHR2dIyKjMzKzOzq7KyqrPz6/Ly6vBwaHAwKDCwqLNza3Dw6PHx+fAQGBISGhMTGxOTm5KSmpPT29LS2tBQWFJyenGxqbDQ2NHx6fIyOjMzOzOzu7KyurPz+/Ly+vBweHCwuLNze3P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+QJhwODyoSA0DCCRAYVITonQKizhEgGwCdGAJWKzOK0olrgqJrNrCBX+/nUhZuCKp71umm+JlveYwHxt3Wm1efHAHMCtSKw4KMBKDAJQbGUsQAnxgHYoRf0QFACKQkgAXIxGMQiAeEF6eX3JCHlijkB8aZFMTLyBVXywQZA6UlKSARBFuYAQwB2nGACfJQy/Bmh0TKtIALrvJEx2afSkM3SPVRB5gfS8N0hsp6kMTb14oFtIu9EMrEJsoQEhBkKCifkImKFx4wGCEgwgngFAIYoU+Yy5W0fvXTlgJaRZm0dMTDIUdaen6EWj35QWCbkroievz5QAIW8Y00HtxCMxuMBgapCFTt2yPMxgpbCGT4OAXlQOPgPnc9eFWoEEtFrxYtQLDgwpWI3yZ509DqUkYJygwgDYsqCmmum1B0e0YpDKO6gJgo0AvgAfJVICVNrduixDqUnBoYaywsRYnnI6k4GCACxAKWgwwwQKclCAAIfkECQkALgAsAAAAAB4AHgCFBAIEhIKExMLEREZE5OLkJCIkpKKk9PL0FBIU1NLUtLK0ZGZkNDI0lJKUdHZ0zMrM7OrsrKqs/Pr8HBocDAoMjI6MLCos3NrcvLq8PDo8fH58BAYEhIaExMbE5ObkpKak9Pb0FBYUbGpsNDY0nJ6cfHp8zM7M7O7srK6s/P78HB4cLC4s3N7cvL68////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv5Al3A4PKBEjAIIJDBdThKidOqCOEKALAJ0aAlarQ4rSiWmDIismsIFf78dSFmYEqnvW6Yb422x5i4fG3dabV58cAcuKVIpDgkuEYMAlBsZSw8CfGAdihB/RAYAIZCSABYkEIxCIB4PXp5fckIeWKOQHxpkUxIsIFVfLQ9kDpSUpIBEEG5gBC4HacYAFclDLMGaHRIo0gAru8kSHZp9JwvdJNVEHmB9LAzSGyfqQxJvXiYU0iv0QykPmzA8OEGQoKJ+QiQoXHjAIISDCCWAUAgihT5jK1bR+9dO2AhpFGbR0xPMhB1p6foRaPeFhYJuSuiJ6/PlAAhbxjTQY3EIzHIwFxqkIVO3bI8zFydsIYvg4BeVXr8gBPsp5MOtQINUNGCxKgUIAuMERP0yz5+GUpMwSnwVLIyno1NMdUNwoAszOE6pOOpGaUuXYBjewC2DYkI3NiDuChMJ6AQHFcb8suxAAFw1EBgcDFiBKcGFA5aJBAEAIfkECQkAKQAsAAAAAB4AHgCFBAIEhIKExMLEZGZk5OLkJCIkpKKk9PL01NLUFBIUNDI0tLK0dHZ0zMrM7OrsrKqs/Pr8DAoMnJ6cLCos3NrcHBocPDo8fH58BAYEjI6MxMbEbGps5ObkpKak9Pb0FBYUNDY0vL68fHp8zM7M7O7srK6s/P78LC4s3N7c////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv7AlHA4PJQ2ioLHIxhRSBCidJpyMD6AbMJzCAlCIQ0qSiWaDImsOsIFf78aR1lo2qjvW6Z7j5qnOhh3Wm1eYF4CHikmUiYMCCkPgWoYFksNX4YCB1V9RAYAH4+RABMSDotCHhwNXpsOX3JCHFigjx0XZFMQBK6FGmQMd6F+RA6FXwQpB2l3GcRDKIZgvyWCJ7nEEKxvIQcDghLPRByZIRQKdxgk4kMQhV4jEXcn7EMmrIYNJPv7m/VCEAIKPNDPgb9/AgXKU3MCFTsTGqRpAHEnQix2ejAhsHMnXD0C5SgsEKSEHQQN3Lp5oKXmArto0hpEuSDskbhX75KlIEFrmGcDFA6lQECRyNgXmUM61KriRQMBD6hMeCCAUhNTARcVXXhkbI+ABia0SQtTtNMUo5jeQOhyyNfBKSZgvvNiogumPTrnkMD3RsDaPYfWPdsV8U3dmASwPTPhgMKIERA8NBhBwIFiIkEAACH5BAkJACUALAAAAAAeAB4AhQQCBISChMTCxGRmZOTi5CQiJPTy9KSipNTS1BQSFDQyNMzKzHR2dOzq7Pz6/Ly+vAwKDJyenKyqrNza3BwaHDw6PAQGBIyOjMTGxGxqbOTm5CwuLPT29BQWFDQ2NMzOzHx6fOzu7Pz+/KyurNze3P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+wJJwODSMMooChyP4TEIOonRaajA6gGyCY3gIHg8MKUolig6JrBrCBX+/mEZZKMqo71ume0+alyQWd1ptXmBeAhwlIlIiDAh/gWoWFUsLX4YCBlV9RAcAHY+AABsRDYtCHBoLXpoNX3JCGlifoSCJVA4ErYUYZAx3oH5EDYVfBCUGaXcXwkMkhmC9I4IbZM0Oq28PBgOCEc1EGpgPEwp3FiHgQw6FXh8QdxvqQyKrhgsh+fma80IO/wAD/uvnTyAGaAsIijhoCMOHdgKsgdNzCcGEYg809CMw7smeBwtOXcOgbZsDhoU4NbvYbkEUEpe83Grmas+xEg7eZNokUopbAxK73ogkhqjKlwUEOJwSwYEAyaJEYQ3RZRSagJDYoIVppVIKMYxeHHQ5xGvmFBEwrXoR0SVmoZtzGjx1E3HsJQEC0l0jcVDoWDBIJTYT0WACApccFlg0IJhIEAAh+QQJCQAhACwAAAAAHgAeAIUEAgSEgoTEwsTk4uRkZmQkIiT08vTU0tSkoqQUEhTMyszs6uw0NjT8+vy8vrwMCgx8enzc2tysqqwEBgScnpzExsTk5uRsamwsLiz09vQUFhTMzszs7uw8Ojz8/vzc3tysrqz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/sCQcDg0gC6MQiYj2EQ4DaJ0GlpAEoBswmBwCByOyidKJXoQ2Kw20/W6K4uy0HNR2x9LsNv9kYckE3ZrXV9fXgIZIR5SHh8Gf4FqEx1LCoZgAo8LfUQLYYkSWRgUC4tCGRYKXppfcUINFV4VjxIQiVQNA5pvZB97s36dbl8DIQ2XxMFDvnphDRx7Dgqmyg2qhQ4GEZhgrspCA3pfEdeHZN8hTHsHsXoK6EMequ4N9fbwQ/b6+/iv+5fS+nloB6bChj0Czn1TZ+jAtj3evoXj9sTQFwUK/cBCCAUbmGLfHg5bxAzTLWWeLoGEVSjKpoz5HFVxg3FIyl3SBmQw5SHDSYAKAoAtaCVFVxWAAqZZa/apCsgpnoZhatBGADZgZRp5LOSBkDgvT8ssiGUxYVWaEeXkIuulazMBA2D68bAgwgGMGRQ4NEBtShAAIfkECQkAEAAsAAAAAB4AHgCEvL685OLk1NLU9PL0zMrM7Ors/Pr8xMbE3NrcxMLE5Obk9Pb0zM7M7O7s/P783N7c////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABf4gJI6jUSAM4QwHgTQGKc+Q8SQAkCTGoOeHR4xGcigOP1xilVMCDgWiyIH4WZe+pvYhhRRwuSTTqVxAHDLHw/y9MhwLArjJ5pIKz4E3RyiYSwoEOnptUSIGSAkHhAFDMzaEYARDD0kJf10ieFYBNXM5nZkiN1oHBg1XKqKHB2A4DVVWhqsQAWE6CIJKPLQiC04AAkhhBL1TgsQGysvGh8vPyguOvQbSy5/Fxg7IQAxJANOiv0kMsT8KxrZaL2QHaKuIwAMGnwl2orGuaKRNeqttYULR05GA0IN3j9bswTFpBJ5LXhgGWPAOToBWBSMCmCUiQKRbCVQY4AaETagZmyuA8ciy48ciKWrq6RgDEsBJIgV0NVmphWADeBfFZOHTSNsJAZPiCEAwT0oIADs=" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }

            if (options.target) { // element blocking
                var el = $(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },

        // wrApper function to  un-block element(finish loading)
        unblockUI: function (target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function () {
                        $(target).css('position', '');
                        $(target).css('zoom', '');

                    }
                });
            } else {
                $.unblockUI();
            }
        },

        startPageLoading: function (options) {
            if (options && options.animate) {
                $('.page-spinner-bar').remove();
                $('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            } else {
                $('.page-loading').remove();
                $('body').append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading/loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>');
            }
        },

        stopPageLoading: function () {
            $('.page-loading, .page-spinner-bar').remove();
        },

        alert: function (options) {

            options = $.extend(true, {
                container: "", // alerts parent container(by default placed after the page breadcrumbs)
                place: "append", // "append" or "prepend" in container 
                type: 'success', // alert's type
                message: "", // alert's message
                close: true, // make alert closable
                reset: true, // close all previouse alerts first
                focus: true, // auto scroll to the alert after shown
                closeInSeconds: 0, // auto close after defined seconds
                icon: "" // put icon before the message
            }, options);

            var id = App.getUniqueID("App_alert");

            var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

            if (options.reset) {
                $('.custom-alerts').remove();
            }

            if (!options.container) {
                if ($('.page-fixed-main-content').size() === 1) {
                    $('.page-fixed-main-content').prepend(html);
                } else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').size() === 0) {
                    $('.page-title').after(html);
                } else {
                    if ($('.page-bar').size() > 0) {
                        $('.page-bar').after(html);
                    } else {
                        $('.page-breadcrumb, .breadcrumbs').after(html);
                    }
                }
            } else {
                if (options.place == "append") {
                    $(options.container).append(html);
                } else {
                    $(options.container).prepend(html);
                }
            }

            if (options.focus) {
                App.scrollTo($('#' + id));
            }

            if (options.closeInSeconds > 0) {
                setTimeout(function () {
                    $('#' + id).remove();
                }, options.closeInSeconds * 1000);
            }

            return id;
        },

        //public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
        getActualVal: function (el) {
            el = $(el);
            if (el.val() === el.attr("placeholder")) {
                return "";
            }
            return el.val();
        },

        //public function to get a paremeter by name from URL
        getURLParameter: function (paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },

        // check for device touch support
        isTouchDevice: function () {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },

        // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        getViewPort: function () {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        getUniqueID: function (prefix) {
            return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
        },

        // check IE8 mode
        isIE8: function () {
            return isIE8;
        },

        // check IE9 mode
        isIE9: function () {
            return isIE9;
        },

        //check RTL mode
        isRTL: function () {
            return isRTL;
        },

        // check IE8 mode
        isAngularJsApp: function () {
            return (typeof angular == 'undefined') ? false : true;
        },

        getResponsiveBreakpoint: function (size) {
            // bootstrap responsive breakpoints
            var sizes = {
                'xs': 480,     // extra small
                'sm': 768,     // small
                'md': 992,     // medium
                'lg': 1200     // large
            };

            return sizes[size] ? sizes[size] : 0;
        }
    };
}();

/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.8
 *
 */
(function ($) {

    $.fn.extend({
        slimScroll: function (options) {

            var defaults = {

                // width in pixels of the visible scroll area
                width: 'auto',

                // height in pixels of the visible scroll area
                height: '250px',

                // width in pixels of the scrollbar and rail
                size: '7px',

                // scrollbar color, accepts any hex/color value
                color: '#000',

                // scrollbar position - left/right
                position: 'right',

                // distance in pixels between the side edge and the scrollbar
                distance: '1px',

                // default scroll position on load - top / bottom / $('selector')
                start: 'top',

                // sets scrollbar opacity
                opacity: .4,

                // enables always-on mode for the scrollbar
                alwaysVisible: false,

                // check if we should hide the scrollbar when user is hovering over
                disableFadeOut: false,

                // sets visibility of the rail
                railVisible: false,

                // sets rail color
                railColor: '#333',

                // sets rail opacity
                railOpacity: .2,

                // whether  we should use jQuery UI Draggable to enable bar dragging
                railDraggable: true,

                // defautlt CSS class of the slimscroll rail
                railClass: 'slimScrollRail',

                // defautlt CSS class of the slimscroll bar
                barClass: 'slimScrollBar',

                // defautlt CSS class of the slimscroll wrapper
                wrapperClass: 'slimScrollDiv',

                // check if mousewheel should scroll the window if we reach top/bottom
                allowPageScroll: false,

                // scroll amount applied to each mouse wheel step
                wheelStep: 20,

                // scroll amount applied when user is using gestures
                touchScrollStep: 200,

                // sets border radius
                borderRadius: '7px',

                // sets border radius of the rail
                railBorderRadius: '7px'
            };

            var o = $.extend(defaults, options);

            // do it for every element that matches selector
            this.each(function () {

                var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
                    barHeight, percentScroll, lastScroll,
                    divS = '<div></div>',
                    minBarHeight = 30,
                    releaseScroll = false;

                // used in event handlers and for better minification
                var me = $(this);

                // ensure we are not binding it again
                if (me.parent().hasClass(o.wrapperClass)) {
                    // start from last bar position
                    var offset = me.scrollTop();

                    // find bar and rail
                    bar = me.siblings('.' + o.barClass);
                    rail = me.siblings('.' + o.railClass);

                    getBarHeight();

                    // check if we should scroll existing instance
                    if ($.isPlainObject(options)) {
                        // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
                        if ('height' in options && options.height == 'auto') {
                            me.parent().css('height', 'auto');
                            me.css('height', 'auto');
                            var height = me.parent().parent().height();
                            me.parent().css('height', height);
                            me.css('height', height);
                        } else if ('height' in options) {
                            var h = options.height;
                            me.parent().css('height', h);
                            me.css('height', h);
                        }

                        if ('scrollTo' in options) {
                            // jump to a static point
                            offset = parseInt(o.scrollTo);
                        }
                        else if ('scrollBy' in options) {
                            // jump by value pixels
                            offset += parseInt(o.scrollBy);
                        }
                        else if ('destroy' in options) {
                            // remove slimscroll elements
                            bar.remove();
                            rail.remove();
                            me.unwrap();
                            return;
                        }

                        // scroll content by the given offset
                        scrollContent(offset, false, true);
                    }

                    return;
                }
                else if ($.isPlainObject(options)) {
                    if ('destroy' in options) {
                        return;
                    }
                }

                // optionally set height to the parent's height
                o.height = (o.height == 'auto') ? me.parent().height() : o.height;

                // wrap content
                var wrapper = $(divS)
                    .addClass(o.wrapperClass)
                    .css({
                        position: 'relative',
                        overflow: 'hidden',
                        width: o.width,
                        height: o.height
                    });

                // update style for the div
                me.css({
                    overflow: 'hidden',
                    width: o.width,
                    height: o.height
                });

                // create scrollbar rail
                var rail = $(divS)
                    .addClass(o.railClass)
                    .css({
                        width: o.size,
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
                        'border-radius': o.railBorderRadius,
                        background: o.railColor,
                        opacity: o.railOpacity,
                        zIndex: 90
                    });

                // create scrollbar
                var bar = $(divS)
                    .addClass(o.barClass)
                    .css({
                        background: o.color,
                        width: o.size,
                        position: 'absolute',
                        top: 0,
                        opacity: o.opacity,
                        display: o.alwaysVisible ? 'block' : 'none',
                        'border-radius': o.borderRadius,
                        BorderRadius: o.borderRadius,
                        MozBorderRadius: o.borderRadius,
                        WebkitBorderRadius: o.borderRadius,
                        zIndex: 99
                    });

                // set position
                var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
                rail.css(posCss);
                bar.css(posCss);

                // wrap it
                me.wrap(wrapper);

                // append to parent div
                me.parent().append(bar);
                me.parent().append(rail);

                // make it draggable and no longer dependent on the jqueryUI
                if (o.railDraggable) {
                    bar.bind("mousedown", function (e) {
                        var $doc = $(document);
                        isDragg = true;
                        t = parseFloat(bar.css('top'));
                        pageY = e.pageY;

                        $doc.bind("mousemove.slimscroll", function (e) {
                            currTop = t + e.pageY - pageY;
                            bar.css('top', currTop);
                            scrollContent(0, bar.position().top, false);// scroll content
                        });

                        $doc.bind("mouseup.slimscroll", function (e) {
                            isDragg = false; hideBar();
                            $doc.unbind('.slimscroll');
                        });
                        return false;
                    }).bind("selectstart.slimscroll", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    });
                }

                // on rail over
                rail.hover(function () {
                    showBar();
                }, function () {
                    hideBar();
                });

                // on bar over
                bar.hover(function () {
                    isOverBar = true;
                }, function () {
                    isOverBar = false;
                });

                // show on parent mouseover
                me.hover(function () {
                    isOverPanel = true;
                    showBar();
                    hideBar();
                }, function () {
                    isOverPanel = false;
                    hideBar();
                });

                // support for mobile
                me.bind('touchstart', function (e, b) {
                    if (e.originalEvent.touches.length) {
                        // record where touch started
                        touchDif = e.originalEvent.touches[0].pageY;
                    }
                });

                me.bind('touchmove', function (e) {
                    // prevent scrolling the page if necessary
                    if (!releaseScroll) {
                        e.originalEvent.preventDefault();
                    }
                    if (e.originalEvent.touches.length) {
                        // see how far user swiped
                        var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
                        // scroll content
                        scrollContent(diff, true);
                        touchDif = e.originalEvent.touches[0].pageY;
                    }
                });

                // set up initial height
                getBarHeight();

                // check start position
                if (o.start === 'bottom') {
                    // scroll content to bottom
                    bar.css({ top: me.outerHeight() - bar.outerHeight() });
                    scrollContent(0, true);
                }
                else if (o.start !== 'top') {
                    // assume jQuery selector
                    scrollContent($(o.start).position().top, null, true);

                    // make sure bar stays hidden
                    if (!o.alwaysVisible) { bar.hide(); }
                }

                // attach scroll events
                attachWheel(this);

                function _onWheel(e) {
                    // use mouse wheel only when mouse is over
                    if (!isOverPanel) { return; }

                    var e = e || window.event;

                    var delta = 0;
                    if (e.wheelDelta) { delta = -e.wheelDelta / 120; }
                    if (e.detail) { delta = e.detail / 3; }

                    var target = e.target || e.srcTarget || e.srcElement;
                    if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
                        // scroll content
                        scrollContent(delta, true);
                    }

                    // stop window scroll
                    if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
                    if (!releaseScroll) { e.returnValue = false; }
                }

                function scrollContent(y, isWheel, isJump) {
                    releaseScroll = false;
                    var delta = y;
                    var maxTop = me.outerHeight() - bar.outerHeight();

                    if (isWheel) {
                        // move bar with mouse wheel
                        delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

                        // move bar, make sure it doesn't go out
                        delta = Math.min(Math.max(delta, 0), maxTop);

                        // if scrolling down, make sure a fractional change to the
                        // scroll position isn't rounded away when the scrollbar's CSS is set
                        // this flooring of delta would happened automatically when
                        // bar.css is set below, but we floor here for clarity
                        delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

                        // scroll the scrollbar
                        bar.css({ top: delta + 'px' });
                    }

                    // calculate actual scroll amount
                    percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
                    delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

                    if (isJump) {
                        delta = y;
                        var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
                        offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
                        bar.css({ top: offsetTop + 'px' });
                    }

                    // scroll content
                    me.scrollTop(delta);

                    // fire scrolling event
                    me.trigger('slimscrolling', ~~delta);

                    // ensure bar is visible
                    showBar();

                    // trigger hide when scroll is stopped
                    hideBar();
                }

                function attachWheel(target) {
                    if (window.addEventListener) {
                        target.addEventListener('DOMMouseScroll', _onWheel, false);
                        target.addEventListener('mousewheel', _onWheel, false);
                    }
                    else {
                        document.attachEvent("onmousewheel", _onWheel)
                    }
                }

                function getBarHeight() {
                    // calculate scrollbar height and make sure it is not too small
                    barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
                    bar.css({ height: barHeight + 'px' });

                    // hide scrollbar if content is not long enough
                    var display = barHeight == me.outerHeight() ? 'none' : 'block';
                    bar.css({ display: display });
                }

                function showBar() {
                    // recalculate bar height
                    getBarHeight();
                    clearTimeout(queueHide);

                    // when bar reached top or bottom
                    if (percentScroll == ~~percentScroll) {
                        //release wheel
                        releaseScroll = o.allowPageScroll;

                        // publish approporiate event
                        if (lastScroll != percentScroll) {
                            var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                            me.trigger('slimscroll', msg);
                        }
                    }
                    else {
                        releaseScroll = false;
                    }
                    lastScroll = percentScroll;

                    // show only when required
                    if (barHeight >= me.outerHeight()) {
                        //allow window scroll
                        releaseScroll = true;
                        return;
                    }
                    bar.stop(true, true).fadeIn('fast');
                    if (o.railVisible) { rail.stop(true, true).fadeIn('fast'); }
                }

                function hideBar() {
                    // only hide when options allow it
                    if (!o.alwaysVisible) {
                        queueHide = setTimeout(function () {
                            if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg) {
                                bar.fadeOut('slow');
                                rail.fadeOut('slow');
                            }
                        }, 1000);
                    }
                }

            });

            // maintain chainability
            return this;
        }
    });

    $.fn.extend({
        slimscroll: $.fn.slimScroll
    });

})(jQuery);


/*! Slider Menu Bind
 *
 */
(function ($) {
    $.fn.sidebarMenu = function (options) {
        options = $.extend({}, $.fn.sidebarMenu.defaults, options || {});
        var $menu_ul = $(this);
        var level = 0;
        //  target.addClass('nav');
        // target.addClass('nav-list');
        if (options.data) {
            init($menu_ul, options.data, level);
        }
        else {
            if (!options.url) return;
            $.getJSON(options.url, options.param, function (data) {
                init($menu_ul, data, level);
            });
        }

        function init($menu_ul, data, level) {
            $.each(data, function (i, item) {
                //isHeader
                var $header = $('<li class="header"></li>');
                if (item.isHeader !== null && item.isHeader === true) {
                    $header.append(item.text);
                    $menu_ul.append($header);
                    return;
                }

                //header
                var li = $('<li class="treeview" data-level="' + level + '"></li>');

                var $a;
                if (level > 0) {
                    $a = $('<a style="padding-left:' + (level * 20) + 'px"></a>');
                    //$a = $('<a style="padding-left:' + (level * 10) + 'px"></a>');
                } else {
                    $a = $('<a></a>');
                }

                var $icon = $('<i></i>');
                $icon.addClass(item.icon);

                var $title = $('<span class="title"></span>');
                $title.addClass('menu-text').text(item.text);

                $a.append($icon);
                $a.append($title);
                $a.addClass("nav-link");

                var isOpen = item.isOpen;

                if (isOpen === true) {
                    li.addClass("active");
                }
                if (item.children && item.children.length > 0) {
                    var pullSpan = $('<span class="pull-right-container"></span>');
                    var pullIcon = $('<i class="fa fa-angle-left pull-right"></i>');
                    pullSpan.append(pullIcon);
                    $a.append(pullSpan);
                    li.append($a);

                    var menus = $('<ul></ul>');
                    menus.addClass('treeview-menu');
                    if (isOpen === true) {
                        menus.css("display", "block");
                        menus.addClass("menu-open");
                    } else {
                        menus.css("display", "none");
                    }
                    init(menus, item.children, level + 1);
                    li.append(menus);
                }
                else {
                    li.removeClass("treeview");
                    if (item.targetType != null && item.targetType === "blank") //Representative opens a new page
                    {
                        $a.attr("href", item.url);
                        $a.attr("target", "_blank");
                    }
                    else if (item.targetType != null && item.targetType === "ajax") { //Open page on behalf of ajax
                        $a.attr("href", item.url);
                        $a.addClass("ajaxify");
                    }
                    else if (item.targetType != null && item.targetType === "iframe-tab") {
                        item.urlType = item.urlType ? item.urlType : 'relative';
                        var href = 'addTabs({id:\'' + item.id + '\',title: \'' + item.text + '\',close: true,url: \'' + item.url + '\',urlType: \'' + item.urlType + '\'});';
                        href += "App.fixIframeCotent();";
                        $a.attr('onclick', href);
                    }
                    else if (item.targetType != null && item.targetType === "iframe") { //Represents a single iframe page
                        //$a.attr("href", item.url);
                        //$a.addClass("iframeOpen");
                        //$("#iframe-main").addClass("tab_iframe");
                        item.urlType = item.urlType ? item.urlType : 'relative';
                        var href = 'addTabs({id:\'' + item.id + '\',title: \'' + item.text + '\',close: true,url: \'' + item.url + '\',urlType: \'' + item.urlType + '\'});';
                        href += "App.fixIframeCotent();";
                        $a.attr('onclick', href);
                    } else {
                        $a.attr("href", item.url);
                        $a.addClass("iframeOpen");
                        $("#iframe-main").addClass("tab_iframe");
                    }
                    $a.addClass("nav-link");
                    var badge = $("<span></span>");
                    // <span class="badge badge-success">1</span>
                    if (item.tip != null && item.tip > 0) {
                        badge.addClass("label").addClass("label-success").text(item.tip);
                    }
                    $a.append(badge);
                    li.append($a);
                }
                $menu_ul.append(li);
            });
        }
    };

    $.fn.sidebarMenu.defaults = {
        url: null,
        param: null,
        data: null,
        isHeader: false
    };
})(jQuery);

//Add tab
var addTabs = function (options) {
    var defaultTabOptions = {
        id: Math.random() * 200,
        urlType: "relative",
        title: "New Page"
    };

    options = $.extend(true, defaultTabOptions, options);

    //if (options.urlType === "relative") {
    //    // var url = window.location.protocol + '//' + window.location.host + "/";
    //    var basePath = window.location.pathname + "/../";
    //    options.url = basePath + options.url;
    //}

    var $iframe = $("<iframe></iframe>").attr("src", options.url).css("width", "100%").attr("frameborder", "no").attr("id", "iframe_").addClass("tab_iframe");

    //iframe Load completion event
    //$iframe.load(function () {
    //    //App.unblockUI('#tab-content');//Unlock interface
    //    App.fixIframeCotent();//Corrected height
    //});
    App.fixIframeCotent();//Corrected height
    $('#tab-content').empty().append($iframe);
    var obj = { ModuleURL: options.url, ModuleName: options.title };
    setTimeout(function () { addActivityLog(obj); }, 50);
};

//Add Activity Log
var addActivityLog = function (options) {
    var defaultOptions = {
        ModuleURL: '/Home/Dashboard',
        ModuleName: "Dashboard",
    };
    options = $.extend(true, defaultOptions, options);
    jQuery.ajax({
        url: '/AccountAPI/menuWriteDbLog', dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(options),
        success: function (data) { },
        error: function (jqXHR, textStatus, errorThrown) { alert(errorThrown); }
    });
};