jQuery.fn.extend( {
    selectbox : function(options) {
        return this.each(function() {
            new jQuery.SelectBox(this, options);
        });
    },
    disableSelectbox : function(isDisable) {
        $(this).attr("disabled", isDisable);
        if ($("#" + $(this).attr("id") + "_input").length > 0) {
            $("#" + $(this).attr("id") + "_input").attr("disabled", isDisable);
        }
    },
    hideSelectbox : function() {
        if ($("#" + $(this).attr("id") + "_input").length > 0) {
            $("#" + $(this).attr("id") + "_input").css("display", "none");
            $("#" + $(this).attr("id") + "_a").css("display", "none");
        } else {
            $(this).css("display", "none");
        }
    },
    showSelectbox : function() {
        if ($("#" + $(this).attr("id") + "_input").length > 0) {
            $("#" + $(this).attr("id") + "_input").css("display", "");
            $("#" + $(this).attr("id") + "_a").css("display", "");
        } else {
            $(this).css("display", "");
        }
    },
    setSelectboxValue : function(v) {
        $(this).val(v);
        var inputId = $(this).attr("id") + "_input";
        $(this).children('option').each(function() {
            if ($(this).is(':selected')) {
                $("#" + inputId).val($(this).html());
            }
        });
    }
});

/* pawel maziarz: work around for ie logging */
if (!window.console) {
    var console = {
        log : function(msg) {
        }
    }
}
/* */

jQuery.SelectBox = function(selectobj, options) {

    var opt = options || {};
    opt.inputClass = opt.inputClass || "selectbox";
    opt.imgClass = opt.imgClass || "selectImg";
    opt.containerClass = opt.containerClass || "selectbox-wrapper";
    opt.hoverClass = opt.hoverClass || "current";
    opt.currentClass = opt.selectedClass || "selected";
    opt.debug = opt.debug || false;

    var elm_id = selectobj.id;
    var active = 0;
    var inFocus = false;
    var hasfocus = 0;
    // jquery object for select element
    var $select = $(selectobj);
    // jquery input object
    var $input = setupInput(opt);
    // jquery img object
    var $a = setupA(opt);
    // jquery container object
    var $container = setupContainer(opt);
    // hide select and append newly created elements
    $select.hide().before($input).before($a).after($container);

    init();

    $input.click(function() {
        if (!inFocus) {
            $container.toggle();
        }
    }).focus(function() {
        if ($container.not(':visible')) {
            inFocus = true;
            $container.show();
        }
    }).keydown(function(event) {
        switch (event.keyCode) {
            case 38: // up
                event.preventDefault();
                moveSelect(-1);
                break;
            case 40: // down
                event.preventDefault();
                moveSelect(1);
                break;
            // case 9: // tab
            case 13: // return
                event.preventDefault(); // seems not working in mac !
                $('li.' + opt.hoverClass).trigger('click');
                break;
            case 27: // escape
                hideMe();
                break;
        }
    }).blur(function() {
        if ($container.is(':visible') && hasfocus > 0) {
            if (opt.debug) {
                console.log('container visible and has focus');
            }
        } else {
            // Workaround for ie scroll - thanks to Bernd Matzner
            if ($.browser.msie || $.browser.safari) { // check for safari too
                // - workaround for
                // webkit
                if (document.activeElement.getAttribute('id').indexOf('_container') == -1) {
                    hideMe();
                } else {
                    $input.focus();
                }
            } else {
                hideMe();
            }
        }
    });

    $a.click(function() {
        if (!$input.is(':disabled')) {
            $input.focus();
        }
    });

    function hideMe() {
        hasfocus = 0;
        $container.hide();
    }

    function init() {
        $container.append(getSelectOptions($input.attr('id'))).hide();
    }

    function setupContainer(options) {
        var container = document.createElement("div");
        $container = $(container);
        $container.attr('id', elm_id + '_container');
        $container.addClass(options.containerClass);
        $container.attr("style", $select.attr("style"));
        if ($select.attr("offsetWidth") > 0) {
            $container.css("width", $select.attr("offsetWidth"));
        }
        return $container;
    }

    function setupInput(options) {
        var input = document.createElement("input");
        var $input = $(input);
        $input.attr("id", elm_id + "_input");
        $input.attr("type", "text");
        $input.addClass(options.inputClass);
        $input.attr("style", $select.attr("style"));
        if ($select.attr("offsetWidth") > 0) {
            $input.css("width", $select.attr("offsetWidth"));
        }
        $input.attr("autocomplete", "off");
        $input.attr("readonly", "readonly");
        $input.attr("disabled", $select.attr("disabled"));
        $input.attr("tabIndex", $select.attr("tabindex")); // "I" capital is
        // important for ie

        return $input;
    }

    function setupA(options) {
        var a = document.createElement("a");
        var $a = $(a);
        $a.attr("id", elm_id + "_a");
        $a.addClass(options.imgClass);
        $a.attr("tabIndex", $select.attr("tabindex")); // "I" capital is
        // important for ie

        return $a;
    }

    function moveSelect(step) {
        var lis = $("li", $container);
        if (!lis || lis.length == 0)
            return false;
        active += step;
        // loop through list
        if (active < 0) {
            active = lis.size() - 1;
        } else if (active >= lis.size()) {
            active = 0;
        }
        scroll(lis, active);
        lis.removeClass(opt.hoverClass);

        $(lis[active]).addClass(opt.hoverClass);
    }

    function scroll(list, active) {
        var el = $(list[active]).get(0);
        var list = $container.get(0);

        if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) {
            list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
        } else if (el.offsetTop < list.scrollTop) {
            list.scrollTop = el.offsetTop;
        }
    }

    function setCurrent() {
        var li = $("li." + opt.currentClass, $container).get(0);
        var ar = ('' + li.id).split('_');
        var el = ar[ar.length - 1];
        $select.val(el);
        $input.val($(li).html());
        return true;
    }

    // select value
    function getCurrentSelected() {
        return $select.val();
    }

    // input value
    function getCurrentValue() {
        return $input.val();
    }

    function getSelectOptions(parentid) {
        var select_options = [];
        var ul = document.createElement('ul');
        $select.children('option').each(function() {
            var li = document.createElement('li');
            li.setAttribute('id', parentid + '_' + $(this).val());
            li.innerHTML = $(this).html();
            if ($(this).is(':selected')) {
                $input.val($(this).html());
                $(li).addClass(opt.currentClass);
            }
            ul.appendChild(li);
            $(li).mouseover(function(event) {
                hasfocus = 1;
                if (opt.debug)
                    console.log('over on : ' + this.id);
                jQuery(event.target, $container).addClass(opt.hoverClass);
            }).mouseout(function(event) {
                hasfocus = -1;
                if (opt.debug)
                    console.log('out on : ' + this.id);
                jQuery(event.target, $container).removeClass(opt.hoverClass);
            }).click(function(event) {
                var fl = $('li.' + opt.hoverClass, $container).get(0);
                if (opt.debug)
                    console.log('click on :' + this.id);
                $('#' + elm_id + '_container' + ' li.' + opt.currentClass).removeClass(opt.currentClass);
                $(this).addClass(opt.currentClass);
                setCurrent();
                $select.get(0).blur();
                hideMe();
                $select.change();
            });
        });
        return ul;
    }

};
