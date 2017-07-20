function renderServiceTree (tree) {
    var html = ''

    function serviceTreeBuild (tree) {
        tree.forEach(function(item) {
            if (item.children.length > 0) {
                html += '<li class="st__item st__item--open">'
                    + '<a href="#">' + item.name + '</a>'
                    + '<ul class="st__list">';
                serviceTreeBuild(item.children);
                html += '</ul>';
            } else {
                html += '<li class="st__item st__item--closed">'
                    + '<a href="#">' + item.name + '</a>';
            }
            html += '</li>';
        })
    }

    serviceTreeBuild(tree)

    $('#service-tree-list').html(html);
}

function renderServiceNavigation(navigation) {
    var html = ''

    function serviceNavigation(navigation) {
        navigation.forEach(function(item) {

        })
    }

    serviceNavigation(navigation)
    $('#service-navigation-list').html(html);
}

//On Document Ready
$(document).ready(function() {
    $.ajax({
        url: 'src/response/init.json',
        success: function(response) {
            console.log('init success', response);
            renderServiceTree(response.tree)
            // renderServiceNavigation(response.navigation)
        },
        error: function() {
            console.log('init fail')
        }
    })

    var sn = $('#service-navigation-list');

    sn.on('click', '.sn__header', function() {
        console.log('expanding');
        var listItem = $(this).parents('.sn__list__item');
        var headerTitle = $(this).find('.sn__header__title');
        if (listItem.hasClass('sn__list__item--expanded')) {
            listItem.removeClass('sn__list__item--expanded');
            headerTitle.attr('title', 'Свернуть');
        } else {
            listItem.addClass('sn__list__item--expanded');
            headerTitle.attr('title', 'Развернуть');
        }
    });

    $('#sn__tr-expand').click(function() {
        sn.find('.sn__list__item').removeClass('sn__list__item--expanded');
        sn.find('.sn__header__title').attr('title', 'Свернуть');
    });
    $('#sn__tr-shrink').click(function() {
        sn.find('.sn__list__item').addClass('sn__list__item--expanded');
        sn.find('.sn__header__title').attr('title', 'Развернуть');
    });








    // var table = $('.service-navigation__table')
    //
    // table.on('click', '.trigger-view', function() {
    //     console.log('view')
    //     var element = $(this).closest('.service-navigation__item')
    //     var id = element.data('id')
    //     element.data('view', !element.data('view'))
    //     console.log(element.data('view'))
    // });
    //
    // table.on('click', '.trigger-remove', function() {
    //     console.log('remove')
    //     var element = $(this).closest('.service-navigation__item')
    //     var id = element.data('id')
    //
    //     $.ajax({
    //         url: 'src/response/remove.json',
    //         data: {id: id},
    //         success: function() {
    //             console.log('remove success')
    //             element.remove()
    //         },
    //         error: function() {
    //             console.log('remove fail')
    //         }
    //     })
    // });

});