function renderServiceTree (tree) {
    var html = '<li class="st__item st__item--open"><a href="#">Web канал</a><ul class="st__list">'

    function serviceTreeBuild (tree) {
        tree.forEach(function(item) {
            if (item.children.length > 0) {
                html += '<li class="st__item st__item--open">'
                    + '<a href="#">' + item.title + '</a>'
                    + '<ul class="st__list">';
                serviceTreeBuild(item.children);
                html += '</ul>';
            } else {
                html += '<li class="st__item st__item--closed">'
                    + '<a href="#">' + item.title + '</a>';
            }
            html += '</li>';
        })
    }

    serviceTreeBuild(tree)

    html += '</ul></li>'

    $('#service-tree-list').html(html);
}

function buildServiceNavigation (navigation) {
    var html = ''

    navigation.forEach(function(item, index) {
        html += '<li class="sn__list__item sn__list__item--minimized" data-id="' + item.serviceId + '">'
        + '<div class="sn__btn-remove"></div><div class="sn__drag-handle"></div>'
        + '<div class="sn__header"><div class="sn__header__item"><div class="sn__checkbox-wrapper">'
        + '<div class="sn__checkbox-image"><input type="checkbox" class="sn__tr-hide" id="sn__tr-hide-' + index + '"';
        html += item.hidden ? 'checked' : '';
        html += '><label for="sn__tr-hide-' + index + '"></label></div></div>'
        + '<div class="sn__checkbox-wrapper"><div class="sn__checkbox-image sn__checkbox-image--padding">'
        + '<input type="checkbox" class="sn__tr-new" id="sn__tr-new-' + index + '"';
        html += item.novelty ? 'checked' : '';
        html += '><label for="sn__tr-new-' + index + '"></label>'
        + '</div></div><span class="sn__header__title" title="Развернуть">' + item.title + '</span></div></div>'
        + '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">'
        + '<input type="checkbox" class="sn__tr-erib" id="sn__tr-erib-' + index + '" ';
        html += item.eribEnabled ? 'checked' : '';
        html += '><label for="sn__tr-erib-' + index + '"></label></div> ЕРИБ:</div></div><div class="sn__field">'
        + '<input class="sn__link-field" type="text" value="' + item.eribUrl + '"></div></div>'
        + '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">'
        + '<input type="checkbox" class="sn__tr-pl" id="sn__tr-pl-' + index + '" ';
        html += item.plEnabled ? 'checked' : '';
        html += '><label for="sn__tr-pl-' + index + '"></label></div> PL:</div></div><div class="sn__field">'
        + '<input class="sn__link-field" type="text" value="' + item.plUrl + '"></div></div>'
        + '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside">Код сервиса:</div></div>'
        + '<div class="sn__field"><input class="sn__service-code-field" type="text" value="' + item.serviceCode + '">'
        + '</div></div><div class="sn__row"><div class="sn__label"><div class="sn__label__inside">Тэги:</div>'
        + '</div><div class="sn__field"><textarea class="sn__tags-field" type="text">'
        + item.tags + '</textarea></div></div></li>';
    })

    return html
}

function renderServiceNavigation (navigation) {
    $('#service-navigation-list').html(buildServiceNavigation(navigation));
}

function addNewServiceRequest () {

}

function removeServiceRequest (id, element) {
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
}


//--- On Document Ready ---//
$(document).ready(function() {
    // get the object of navigation list
    var sn = $('#service-navigation-list');
    // get the object of expanded navigation list item
    var snm = $('.sn__list__item:not(.sn__list__item--minimized)');
    // get the object of service add table
    var sa = $('.sa__services');


    // colorbox configuration
    $(".sn__btn-add").colorbox({inline:true, width:"50%", opacity: 0.4});


    //initial request to get the tree
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


    // Toggle list item
    sn.on('click', '.sn__header', function() {
        console.log('toggling');
        var listItem = $(this).parents('.sn__list__item');
        var headerTitle = $(this).find('.sn__header__title');
        if (listItem.hasClass('sn__list__item--minimized')) {
            listItem.removeClass('sn__list__item--minimized');
            headerTitle.attr('title', 'Свернуть');
        } else {
            listItem.addClass('sn__list__item--minimized');
            headerTitle.attr('title', 'Развернуть');
        }
    });


    // Expand list items
    $('#sn__tr-expand').click(function() {
        console.log('expand');
        sn.find('.sn__list__item').removeClass('sn__list__item--minimized');
        sn.find('.sn__header__title').attr('title', 'Свернуть');

    });
    // Shrink list items
    $('#sn__tr-shrink').click(function() {
        console.log('shrink');
        sn.find('.sn__list__item').addClass('sn__list__item--minimized');
        sn.find('.sn__header__title').attr('title', 'Развернуть');
    });


    // Remove element from tree
    sn.on('click', '.sn__btn-remove', function() {
        console.log('remove')
        var element = $(this).closest('.sn__list__item')
        var id = element.data('id')



        $.colorbox({
            width:"50%",
            opacity: 0.4,
            html: '<div class="popup">' +
            '<h1 class="popup__title">Вы уверены что хотите удалить сервис?</h1>' +
            '<div>' +
            '<button class="confirm-yes">Да</button>' +
            '<button class="confirm-no">Нет</button></div>' +
            '</div>'
        });

        $('.confirm-yes').on('click', function() {
            removeServiceRequest(id, element)
            $.colorbox.close()
        })

        $('.confirm-no').on('click', function() {
            $.colorbox.close()
        })
    });


    // sortable configuration
    sn.sortable({
        axis: 'y',
        cursor: 'move',
        handle: '.sn__drag-handle'
    });
    sn.disableSelection();
    // callback on sortupdate
    sn.on('sortupdate', function(event, ui) {
        console.log('sorting');
        var next = ui.item.next().data('id')
    });


    // Hide / Set invision to true
    snm.on('click', '.sn__tr-hide', function() {
        console.log('hiding')
        var element = $(this).closest('.sn__list__item')
        var id = element.data('id')
        element.data('view', !element.data('view'))
        console.log(element.data('view'))
    });


    // Insert item to tree
    sa.on('dblclick', 'td', function() {
        var tr = $(this).parent()
        var serviceName = $(tr.children()[0]).text()
        var serviceCode = $(tr.children()[1]).text()
        tr.remove()
        sn.append(buildServiceNavigation([{
            "id": +(new Date()),
            "title": serviceName,
            "hidden": false,
            "novelty": false,
            "parent": 1,
            "master": true,
            "eribEnabled": true,
            "eribUrl": "https://sbtatlas.sigma.sbrf.ru/wiki/pages/viewpage.action?pageId=107845880",
            "plEnabled": true,
            "plUrl": "https://sbtatlas.sigma.sbrf.ru/wiki/pages/viewpage.action?pageId=107845880",
            "serviceCode": serviceCode,
            "tags": [""]
        }]))
    });
});