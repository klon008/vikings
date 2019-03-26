;(($)=>{
    let rightbarShowing = true;
    const btn = $('#right_chat_btn');
    const rightBar = $('#right-side-chat');
    const body = $('#content-body')
    btn.click((e)=>{
        rightbarShowing=!rightbarShowing;
        if (!rightbarShowing){
            for (let i of [rightBar, body]){
                i.addClass('collapsed-right')
            }
        }
        else if(rightbarShowing){
            for (let i of [rightBar, body]){
                i.removeClass('collapsed-right')
            }
        }
            
    })
})(window.jQuery);