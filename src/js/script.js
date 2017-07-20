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

    navigation.forEach(function(item) {
        html += '<li class="sn__list__item sn__list__item--expanded">'
        + '<div class="sn__btn-close"></div><div class="sn__btn-close"></div>'
        + '<div class="sn__header"><div class="sn__header__item"><div class="sn__checkbox-wrapper">'
        + '<div class="sn__checkbox-image"><input type="checkbox" id="sn__tr-hide"><label for="sn__tr-hide"></label>'
        + '</div></div><div class="sn__checkbox-wrapper"><div class="sn__checkbox-image sn__checkbox-image--padding">'
        + '<input type="checkbox" id="sn__tr-new"><label for="sn__tr-new"></label></div></div>'
        + '<span class="sn__header__title" title="Развернуть">' + item.name + '</span></div></div>'
        + '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">'
        + '<input type="checkbox" id="sn__tr-erib" ';
        html += item.isErib ? 'checked' : '';
        html += '><label for="sn__tr-erib"></label></div> ЕРИБ:</div></div><div class="sn__field">'
        + '<input class="sn__link-field" type="text" value="' + item.eribUrl + '"></div></div>'
        + '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">'
        + '<input type="checkbox" id="sn__tr-pl" ';
        html += item.isPL ? 'checked' : '';
        html += '><label for="sn__tr-pl"></label></div> PL:</div></div><div class="sn__field">'
        + '<input class="sn__link-field" type="text" value="' + item.plUrl + '"></div></div>'
        + '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside">Код сервиса:</div></div>'
        + '<div class="sn__field"><input class="sn__service-code-field" type="text" value="' + item.serviceCode + '">'
        + '</div></div><div class="sn__row"><div class="sn__label"><div class="sn__label__inside">Тэги:</div>'
        + '</div><div class="sn__field"><textarea class="sn__tags-field" type="text">';

        item.tags.forEach(function(item) {
            html += item + ' ';
        });

        html += '</textarea></div></div></li>';
    })

    $('#service-navigation-list').html(html);
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