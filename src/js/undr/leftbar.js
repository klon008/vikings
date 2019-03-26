;(($)=>{
    let leftBarShowing = true;
    const leftBar = $('#sidebar')
    const topbar = $('#topbar')
    const body = $('#content-body')
    $('#leftBarToggler').click((e)=>{
        leftBarShowing = !leftBarShowing
        if (!leftBarShowing)
            for (let i of [leftBar, topbar, body]){
                i.addClass('collapsed-left')
            }
        else if (leftBarShowing)
        for (let i of [leftBar, topbar, body]){
            i.removeClass('collapsed-left')
        }
        
    })
})(window.jQuery)