
jQuery(function ($) {
    $(document).on('click', '#tab-menu .page-tabs-content a', function () {
        var id = $(this).data('pageid');
        $this = $(this);
        $('.sidebar-menu li').removeClass('activeLink');
        $('.sidebar-menu .treeview').removeClass('active');
        $('.treeview-menu').removeClass('menu-open').css("display", "none");
        $('.sidebar-menu li').each(function () {
            if ($(this).data('menuid') === id) {
                $(this).addClass('activeLink');
                $(this).parents('.treeview').addClass('active');
                $(this).parents('.treeview-menu').addClass('menu-open').css("display", "block");
            } else if ($this.data('pageid') === 10008) {
                $('.sidebar-menu > li:first').addClass('activeLink');
            }
        });
    });
    /*****************************************************************/
    $(document).on('click', '#tab-menu .page-tabs-content i', function () {
        alert('check');
        var closeid = $this.data('pageid');
        alert(closeid);
        $('#tab-menu .page-tabs-content .page_tab_close').each(function () {
            if ($(this).hasClass('active')) {
                var cur_pageid = $(this).data('pageid');
                alert(cur_pageid);
            }
        });
        //$('.sidebar-menu li').removeClass('activeLink');
        //$('.sidebar-menu .treeview').removeClass('active');
        //$('.treeview-menu').removeClass('menu-open').css("display", "none");
        //$('.sidebar-menu li').each(function () {
        //    if ($(this).data('menuid') === closeid) {
        //        $(this).addClass('activeLink');
        //        $(this).parents('.treeview').addClass('active');
        //        $(this).parents('.treeview-menu').addClass('menu-open').css("display", "block");
        //    } 
        //});
    });
});
