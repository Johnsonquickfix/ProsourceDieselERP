
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
    
});
