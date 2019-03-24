;(($)=>{
    let leftBarHided = false;
    const leftBar = $('#sidebar')
    const topbar = $('#topbar')
    const body = $('#content-body')
    $('#leftBarToggler').click((e)=>{
        if (!leftBarHided)
            for (let i of [leftBar, topbar, body]){
                i.addClass('collapsed-left')
            }
        else if (leftBarHided)
        for (let i of [leftBar, topbar, body]){
            i.removeClass('collapsed-left')
        }
        leftBarHided = !leftBarHided
    })
})(window.jQuery)