"use strict";
$(".navbar-right > .dropdown").click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('open')) {
        $(".navbar-right > .dropdown").removeClass('open');
        $(this).addClass('open');
    } else {
        $(".navbar-right > .dropdown").removeClass('open');
    }


});
var Sidemenu = function () {
    this.$body = $("body"),
        this.$openLeftBtn = $(".open-left"),
        this.$menuItem = $("#sidebar-menu a")
};
Sidemenu.prototype.openLeftBar = function () {
    $("#wrapper").toggleClass("enlarged");
    $("#wrapper").addClass("forced");

    if ($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
        $("body").removeClass("fixed-left").addClass("fixed-left-void");
    } else if (!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
        $("body").removeClass("fixed-left-void").addClass("fixed-left");
    }

    if ($("#wrapper").hasClass("enlarged")) {
        $(".left ul").removeAttr("style");
    } else {
        $(".subdrop").siblings("ul:first").show();
    }

    toggle_slimscroll(".slimscrollleft");
    //$("body").trigger("resize");
},
    //menu item click
    Sidemenu.prototype.menuItemClick = function (e) {
        if (!$("#wrapper").hasClass("enlarged")) {
            if ($(this).parent().hasClass("has_sub")) {

            }
            if (!$(this).hasClass("subdrop")) {
                // hide any open menus and remove all other classes
                $("ul", $(this).parents("ul:first")).slideUp(350);
                $("a", $(this).parents("ul:first")).removeClass("subdrop");
                $("#sidebar-menu .pull-right i").removeClass("md-remove").addClass("md-add");

                // open our new menu and add the open class
                $(this).next("ul").slideDown(350);
                $(this).addClass("subdrop");
                $(".pull-right i", $(this).parents(".has_sub:last")).removeClass("md-add").addClass("md-remove");
                $(".pull-right i", $(this).siblings("ul")).removeClass("md-remove").addClass("md-add");
            } else if ($(this).hasClass("subdrop")) {
                $(this).removeClass("subdrop");
                $(this).next("ul").slideUp(350);
                $(".pull-right i", $(this).parent()).removeClass("md-remove").addClass("md-add");
            }
        }
    },

    //init sidemenu
    Sidemenu.prototype.init = function () {
        var $this = this;

        var ua = navigator.userAgent,
            event = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) ? "touchstart" : "click";

        //bind on click
        this.$openLeftBtn.unbind("touchstart click");
        this.$openLeftBtn.on(event, function (e) {
            e.stopPropagation();
            $this.openLeftBar();
        });

        // LEFT SIDE MAIN NAVIGATION
        $this.$menuItem.on(event, $this.menuItemClick);

        // NAVIGATION HIGHLIGHT & OPEN PARENT
        $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
    },

    //init Sidemenu
    $.Sidemenu = new Sidemenu, $.Sidemenu.Constructor = Sidemenu;
$.Sidemenu.init();

$('.slimscrollleft').slimScroll({
    height: 'auto',
    position: 'right',
    size: "5px",
    color: '#98a6ad',
    wheelStep: 10
});

function toggle_slimscroll(item) {
    if ($("#wrapper").hasClass("enlarged")) {
        //$(item).css("overflow","inherit").parent().css("overflow","inherit");
        //$(item). siblings(".slimScrollBar").css("visibility","hidden");
    } else {
        //$(item).css("overflow","hidden").parent().css("overflow","hidden");
        //$(item). siblings(".slimScrollBar").css("visibility","visible");
    }
}



    /**
     Portlet Widget
     */
    var Portlet = function () {
        this.$body = $("body"),
            this.$portletIdentifier = ".portlet",
            this.$portletCloser = '.portlet a[data-toggle="remove"]',
            this.$portletRefresher = '.portlet a[data-toggle="reload"]'
    };

    //on init
    Portlet.prototype.init = function () {
        // Panel closest
        var $this = this;
        $(document).on("click", this.$portletCloser, function (ev) {
            ev.preventDefault();
            var $portlet = $(this).closest($this.$portletIdentifier);
            var $portlet_parent = $portlet.parent();
            $portlet.remove();
            if ($portlet_parent.children().length == 0) {
                $portlet_parent.remove();
            }
        });

        // Panel Reload
        $(document).on("click", this.$portletRefresher, function (ev) {
            ev.preventDefault();
            var $portlet = $(this).closest($this.$portletIdentifier);
            // This is just a simulation, nothing is going to be reloaded
            $portlet.append('<div class="panel-disabled"><div class="loader-1"></div></div>');
            var $pd = $portlet.find('.panel-disabled');
            setTimeout(function () {
                $pd.fadeOut('fast', function () {
                    $pd.remove();
                });
            }, 500 + 300 * (Math.random() * 5));
        });
    },
        //
        $.Portlet = new Portlet, $.Portlet.Constructor = Portlet


    var w, h, dw, dh;
    var changeptype = function () {
        w = $(window).width();
        h = $(window).height();
        dw = $(document).width();
        dh = $(document).height();

        if (jQuery.browser.mobile === true) {
            $("body").addClass("mobile").removeClass("fixed-left");
        }

        if (w > 990) {
            $("body").removeClass("smallscreen").addClass("widescreen");
            $("#wrapper").removeClass("enlarged");
        } else {
            $("body").removeClass("widescreen").addClass("smallscreen");
            $("#wrapper").addClass("enlarged");
            $(".left ul").removeAttr("style");
        }
        if ($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
            $("body").removeClass("fixed-left").addClass("fixed-left-void");
        } else if (!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
            $("body").removeClass("fixed-left-void").addClass("fixed-left");
        }
        $.Sidemenu.init();


    };
    $(window).resize(changeptype);
    $(document).ready(changeptype);