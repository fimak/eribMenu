/**
 * On Document Ready
 */
$(document).ready(function() {
    // Initial request to get the tree / keep data in the window.tree
    treeInitRequest()


    // get the object of service tree
    var st = $('#service-tree-list');
    // get the object of navigation list
    var sn = $('#service-navigation-list');
    // get the object of expanded navigation list item
    var snm = $('.sn__list__item:not(.sn__list__item--minimized)');


    /**
     * Select the service category (set current category)
     */
    st.on('click', '.st__item', function (event) {
        selectServiceCategory.call(this, event)
    });


    /**
     * Sortable configuration
     */
    sn.sortable({
        axis: 'y',
        cursor: 'move',
        handle: '.sn__drag-handle'
    });
    sn.disableSelection();

    /**
     * Callback of sortUpdate
     */
    sn.on('sortupdate', function (event, ui) {
        console.log('sorting');
        var next = ui.item.next().data('tree-id')
    });


    /**
     * Toggles list item
     */
    sn.on('click', '.sn__header', function () {
        toggleItem.call(this)
    });

    /**
     * Expand list items
     */
    $('#sn__tr-expand').click(function () {
        expandAll.call(this, sn)
    });

    /**
     * Collapse list items
     */
    $('#sn__tr-collapse').click(function () {
        collapseAll.call(this, sn)
    });


    /**
     * Delete element from tree
     */
    sn.on('click', '.sn__btn-remove', function () {
        deleteElement.call(this)
    });


    /**
     * Hide / Show / Set visibility
     */
    snm.on('click', '.sn__tr-hide', function () {
        visibilityToggle.call(this)
    });


    /**
     * Add service
     */
    $('.sn__btn-add').on('click', function (event) {
        addService.call(this, event)
    });


    /**
     * Insert item to tree
     */
    $('body').on('dblclick', '.sa__services td', function () {
        insertItem.call(this, sn)
    });


    /**
     * Update tree element
     */
    sn.on('click', '.sn__btn-save', function (event) {
        updateElement.call(this, event)
    });

    sn.on('change', '.sn__list__item', function () {
        debugger
       $(this).closest('.sn__list__item').addClass('sn__list__item--new')
    });
});
