function serviceTreeBuild (tree) {
    tree.forEach(function(item, i) {
        console.log('<li>');
        console.log('<a>' + item.name + '</a>')
        if (item.children.length > 0) {
            console.log('<ul>')
            serviceTreeBuild(item.children)
            console.log('</ul>')
        }
        console.log('</li>');
    })
}

$(document).ready(function() {
    $.ajax({
        url: 'src/response/init.json',
        success: function(response) {
            console.log('init success', response)
            serviceTreeBuild(response.tree)
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