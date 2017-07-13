$(document).ready(function() {
    var table = $('.service-navigation__table')

    table.on('click', '.trigger-view', function() {
        console.log('view')
        var element = $(this).closest('.service-navigation__item')
        var id = element.data('id')
        element.data('view', !element.data('view'))
        console.log(element.data('view'))
    });

    table.on('click', '.trigger-remove', function() {
        console.log('remove')
        var element = $(this).closest('.service-navigation__item')
        var id = element.data('id')

        $.ajax({
            url: 'src/response/remove.json',
            data: {id: id},
            success: function() {
                console.log('remove success')
                element.remove()
            },
            error: function() {
                console.log('remove fail')
            }
        })
    });

    table.on('click', '.trigger-up', function() {
        console.log('up')
        var element = $(this).closest('.service-navigation__item')
        var id = element.data('id')

        $.ajax({
            url: 'src/response/up.json',
            data: {id: id},
            success: function() {
                console.log('up success')
                var prevElement = element.prev()
                if (prevElement !== 0) {
                    element.remove()
                    prevElement.before(element)
                }
            },
            error: function() {
                console.log('up fail')
            }
        })
    });

    table.on('click', '.trigger-down', function() {
        console.log('down')
        var element = $(this).closest('.service-navigation__item')
        var id = element.data('id')

        $.ajax({
            url: 'src/response/down.json',
            data: {id: id},
            success: function() {
                console.log('down success')
                var nextElement = element.next()
                if (nextElement.length !== 0) {
                    element.remove()
                    nextElement.after(element)
                }
            },
            error: function() {
                console.log('down fail')
            }
        })
    });
});