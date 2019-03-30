;(($) => {
    $.fn.autoResize = function(options) {

        // Just some abstracted details,
        // to make plugin users happy:
        var settings = $.extend({
            onResize : function(){},
            animate : true,
            animateDuration : 150,
            animateCallback : function(){},
            extraSpace : 0,
            limit: 1000
        }, options);

        // Only textarea's auto-resize:
        this.filter('textarea').each(function(){

            // Get rid of scrollbars and disable WebKit resizing:
            var textarea = $(this).css({resize:'none','overflow-y':'hidden'}),

                // Cache original height, for use later:
                origHeight = textarea.height(),

                // Need clone of textarea, hidden off screen:
                clone = (function(){

                    // Properties which may effect space taken up by chracters:
                    var props = ['height','width','lineHeight','textDecoration','letterSpacing'],
                        propOb = {};

                    // Create object of styles to apply:
                    $.each(props, function(i, prop){
                        propOb[prop] = textarea.css(prop);
                    });

                    // Clone the actual textarea removing unique properties
                    // and insert before original textarea:
                    return textarea.clone().removeAttr('id').removeAttr('name').css({
                        position: 'absolute',
                        top: 0,
                        left: -9999
                    }).css(propOb).attr('tabIndex','-1').insertBefore(textarea);

                })(),
                lastScrollTop = null,
                updateSize = function() {

                    // Prepare the clone:
                    clone.height(0).val($(this).val()).scrollTop(10000);

                    // Find the height of text:
                    var scrollTop = Math.max(clone.scrollTop(), origHeight) + settings.extraSpace,
                        toChange = $(this).add(clone);

                    // Don't do anything if scrollTip hasen't changed:
                    if (lastScrollTop === scrollTop) { return; }
                    lastScrollTop = scrollTop;

                    // Check for limit:
                    if ( scrollTop >= settings.limit ) {
                        $(this).css('overflow-y','');
                        return;
                    }
                    // Fire off callback:
                    settings.onResize.call(this);

                    // Either animate or directly apply height:
                    settings.animate && textarea.css('display') === 'block' ?
                        toChange.stop().animate({height:scrollTop}, settings.animateDuration, settings.animateCallback)
                        : toChange.height(scrollTop);
                };

            // Bind namespaced handlers to appropriate events:
            textarea
                .unbind('.dynSiz')
                .bind('keyup.dynSiz', updateSize)
                .bind('keydown.dynSiz', updateSize)
                .bind('change.dynSiz', updateSize);

        });

        // Chain:
        return this;

    };

    let rightbarShowing = false;
    const btn = $('#right_chat_btn');
    const rightBar = $('#right-side-chat');
    const body = $('#content-body');
    const chatUITitle = $('.rs_chat__title');
    const chatUITitleOrigin = $('.rs_chat-__title').text();
    const usersElemts = $('.right-side-chat__user');
    const topIcon = $('.rs_users__top .selected_user').first();
    const closeBtn = $('#right_chat_btn_close');
    const mobileBtn = $('#mobile-right_chat_btn');
    function showRightBar(){
        for (let i of [rightBar, body]) {
            i.addClass('collapsed-right');
        }
    }
    function hideRightBar(){
        for (let i of [rightBar, body]) {
            i.removeClass('collapsed-right');
            chatUITitle.text(chatUITitleOrigin);
            topIcon.addClass('d-none');
        }
        $("#chat__content").addClass('d-none');
        $("#chat__empty").removeClass('d-none');
    }
    function btnClick(e){
            if (!rightbarShowing) {
                showRightBar();
                $('#chat__story').addClass('d-none');
            } else if (rightbarShowing) {
                hideRightBar();
            }
            rightbarShowing = !rightbarShowing;
        
    }
    btn.click(btnClick);
    mobileBtn.click(btnClick);

    closeBtn.click(e => {
        rightbarShowing = false;
        hideRightBar();
    });


    usersElemts.each(e => {
        let user = $(usersElemts[e]);
        user.click(e => {
            if (!rightbarShowing){
                showRightBar();
            }
            let userpic = user.find('.right-side-chat__userpic').attr('src');
            let userName = user.data('original-title');
            $(topIcon).attr( 'src' , userpic);
            $(topIcon).removeClass('d-none');
            chatUITitle.text(userName);

            $('#chat__story').removeClass('d-none');
            let data = user.data('user-id');
            if (data){
                $("#chat__content").removeClass('d-none');
                $("#chat__empty").addClass('d-none');
                $("#chat__content img").attr('src', userpic);
            } else {
                $("#chat__content").addClass('d-none');
                $("#chat__empty").removeClass('d-none');
            }
        })
    })
    $('.rs_chat__reply-textarea').autoResize();
})(window.jQuery);