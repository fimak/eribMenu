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
    $('#service-tree-list').html(html);
}

//On Document Ready
$(document).ready(function() {
    $.ajax({
        url: 'src/response/init.json',
        success: function(response) {
            console.log('init success', response);
            renderServiceTree(response.tree)
            renderServiceNavigation(response.navigation)
        },
        error: function() {
            console.log('init fail')
        }
    })










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