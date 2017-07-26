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

    navigation.forEach(function(item, index) {
        html += '<li class="sn__list__item sn__list__item--expanded" data-id="' + item.id + '">'
        + '<div class="sn__btn-remove"></div><div class="sn__drag-handle"></div>'
        + '<div class="sn__header"><div class="sn__header__item"><div class="sn__checkbox-wrapper">'
        + '<div class="sn__checkbox-image"><input type="checkbox" class="sn__tr-hide" id="sn__tr-hide-' + index + '" ';
        html += item.isHidden ? 'checked' : '';
        html += '><label for="sn__tr-hide-' + index + '"></label></div></div>'
        + '<div class="sn__checkbox-wrapper"><div class="sn__checkbox-image sn__checkbox-image--padding">'
        + '<input type="checkbox" class="sn__tr-new" id="sn__tr-new-' + index + '" ';
        html += item.isNew ? 'checked' : '';
        html += '><label for="sn__tr-new-' + index + '"></label>'
        + '</div></div><span class="sn__header__title" title="Развернуть">' + item.name + '</span></div></div>'
        + '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">'
        + '<input type="checkbox" class="sn__tr-erib" id="sn__tr-erib-' + index + '" ';
        html += item.isErib ? 'checked' : '';
        html += '><label for="sn__tr-erib-' + index + '"></label></div> ЕРИБ:</div></div><div class="sn__field">'
        + '<input class="sn__link-field" type="text" value="' + item.eribUrl + '"></div></div>'
        + '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">'
        + '<input type="checkbox" class="sn__tr-pl" id="sn__tr-pl-' + index + '" ';
        html += item.isPL ? 'checked' : '';
        html += '><label for="sn__tr-pl-' + index + '"></label></div> PL:</div></div><div class="sn__field">'
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
    $(".sn__btn-add").colorbox({inline:true, width:"50%", opacity: 0.4});

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
        console.log('expand');
        sn.find('.sn__list__item').removeClass('sn__list__item--expanded');
        sn.find('.sn__header__title').attr('title', 'Свернуть');
    });
    $('#sn__tr-shrink').click(function() {
        console.log('shrink');
        sn.find('.sn__list__item').addClass('sn__list__item--expanded');
        sn.find('.sn__header__title').attr('title', 'Развернуть');
    });

    sn.on('click', '.sn__btn-remove', function() {
        console.log('remove')
        var element = $(this).closest('.sn__list__item')
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

    sn.sortable();
    sn.disableSelection();

    sn.on('sortupdate', function(event, ui) {
        console.log('sorting');
        var next = ui.item.next().data('id')
    });

    sn.on('click', '.sn__tr-hide', function() {
        console.log('hiding')
        var element = $(this).closest('.sn__list__item')
        var id = element.data('id')
        element.data('view', !element.data('view'))
        console.log(element.data('view'))
    });
});