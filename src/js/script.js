/**
 * Render service tree list (left sidebar)
 * @param tree
 */
function renderServiceTree (tree) {
    var html = '<li class="st__item st__item--open" data-id="' + tree.treeId + '">' +
        '<a href="#">' + tree.title + '</a><ul class="st__list">';

    /**
     * Service tree build function which create the list of services in left sidebar
     * @param tree
     */
    function serviceTreeBuild (tree) {
        tree.children.forEach(function(item) {
            if (item.children.length > 0) {
                html += '<li class="st__item st__item--open" data-id="' + item.treeId + '">'
                    + '<a href="#">' + item.title + '</a>'
                    + '<ul class="st__list">';
                serviceTreeBuild(item);
                html += '</ul>';
            } else {
                html += '<li class="st__item st__item--closed" data-id="' + item.treeId + '">'
                    + '<a href="#">' + item.title + '</a>';
            }
            html += '</li>';
        })
    }

    serviceTreeBuild(tree)

    html += '</ul></li>'

    $('#service-tree-list').html(html);
}

/**
 * Build service navigation function which build the list of services
 * @param navigation
 * @returns {string}
 */
function buildServiceNavigation (navigation) {
    var html = ''
debugger
    if (navigation) {
        navigation.forEach(function(item) {
            html += '<li class="sn__list__item sn__list__item--minimized" data-id="' + item.serviceId + '">' +
                '<div class="sn__btn-remove"></div><div class="sn__drag-handle"></div>' +
                '<div class="sn__header"><div class="sn__header__item"><div class="sn__checkbox-wrapper">' +
                '<div class="sn__checkbox-image"><input type="checkbox" class="sn__tr-hide" id="sn__tr-hide-' + item.serviceId + '"';
            html += item.hidden ? 'checked' : '';
            html += '><label for="sn__tr-hide-' + item.serviceId + '"></label></div></div>' +
                '<div class="sn__checkbox-wrapper"><div class="sn__checkbox-image sn__checkbox-image--padding">' +
                '<input type="checkbox" class="sn__tr-new" id="sn__tr-new-' + item.serviceId + '"';
            html += item.novelty ? 'checked' : '';
            html += '><label for="sn__tr-new-' + item.serviceId + '"></label>' +
                '</div></div><span class="sn__header__title" title="Развернуть">' + item.title + '</span></div></div>' +
                '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">' +
                '<input type="checkbox" class="sn__tr-erib" id="sn__tr-erib-' + item.serviceId + '" ';
            html += item.eribEnabled ? 'checked' : '';
            html += '><label for="sn__tr-erib-' + item.serviceId + '"></label></div> ЕРИБ:</div></div><div class="sn__field">' +
                '<input class="sn__link-field" type="text" value="' + item.eribUrl + '"></div></div>' +
                '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">' +
                '<input type="checkbox" class="sn__tr-pl" id="sn__tr-pl-' + item.serviceId + '" ';
            html += item.plEnabled ? 'checked' : '';
            html += '><label for="sn__tr-pl-' + item.serviceId + '"></label></div> PL:</div></div><div class="sn__field">' +
                '<input class="sn__link-field" type="text" value="' + item.plUrl + '"></div></div>' +
                '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside">Код сервиса:</div></div>' +
                '<div class="sn__field"><input class="sn__service-code-field" type="text" value="' + item.serviceCode + '">' +
                '</div></div><div class="sn__row"><div class="sn__label"><div class="sn__label__inside">Тэги:</div>' +
                '</div><div class="sn__field"><textarea class="sn__tags-field" type="text">' +
                item.tags + '</textarea></div></div><div class="sn__row"><div class="sn__label"></div>' +
                '<a class="sn__btn-save" data-id="' + item.serviceId + '" href="#save">Сохранить</a></div></li>';
        })
    } else {
        html += '<p>Нет вложенных сервисов.</p>'
    }

    return html
}

/**
 * Render os service navigation (right block)
 * @param navigation
 */
function renderServiceNavigation (navigation) {
    $('#service-navigation-list').html(buildServiceNavigation(navigation));
}

/**
 * Insert element request function
 * @param parentId
 * @param service
 * @returns {*}
 */
function insertElementRequest (parentId, service) {
    return $.ajax({
        type: 'POST',
        url: 'src/response/insertElement.json',
        data: {
            parentServiceTreeId: parentId,
            descriptionTreeElement: service
        },
        success: function() {
            console.log('InsertElement success')
        }
    })
}

/**
 * Delete service request function
 * @param id
 * @param element
 */
function deleteServiceRequest (id, element) {
    $.ajax({
        type: 'POST',
        url: 'src/response/deleteElement.json',
        data: {id: id},
        success: function() {
            console.log('delete success')
            element.remove()
        },
        error: function() {
            console.warn('remove fail')
        }
    })
}

/**
 * Set the current category which you chose in left sidebar
 * @param id
 * @param title
 */
function setCurrentCategory(id, title) {
    var tree = findService(id, window.tree)

    if (tree) {
        renderServiceNavigation(tree.children)
    } else {
        renderServiceNavigation(null)
    }

    window.currentCategory = {
        id: id,
        name: title
    }
}

/**
 * Initialization request function
 */
function treeInitRequest () {
    $.ajax({
        url: 'src/response/init.json',
        success: function(response) {
            console.log('init success', response);
            window.tree = response.tree
            renderServiceTree(response.tree)
            setCurrentCategory(response.tree.treeId, response.tree.title)
        },
        error: function() {
            console.warn('init fail')
        }
    })
}

/**
 * Select service list request function
 * @returns {*}
 */
function selectServiceListRequest () {
    return $.ajax({
        url: 'src/response/selectServiceList.json',
        success: function(response) {
            console.log('select service list success', response)
        },
        error: function() {
            console.warn('select service list fail')
        }
    })
}

/**
 * Update the service request function
 * @param parentId
 * @param service
 * @returns {*}
 */
function updateServiceRequest (parentId, service) {
    return $.ajax({
        type: 'POST',
        url: 'src/response/updateElement.json',
        data: {
            parentServicesTreeId: parentId,
            descriptionTreeElement: service
        },
        success: function(response) {
            console.log('edit service success', response)
        },
        error: function() {
            console.watn('edit service fail')
        }
    })
}

/**
 * Find the service by treeId
 * @param treeId
 * @param tree
 */
function findService (treeId, tree) {
    var newTree
    if (Array.isArray(tree)) {
        tree.every(function(el) {
            if (el.treeId === treeId) {
                newTree = el
                return false
            } else {
                return findService(treeId, el)
            }
        })
        return newTree
    } else {
        if (tree.treeId === treeId) {
            return tree
        }
        return findService(treeId, tree.children)
    }
}



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
     * Choosing the service category (set current category)
     */
    st.on('click', '.st__item', function(event) {
        event.stopPropagation()
        var id = $(this).data('id')
        var title = $(this).children('a')[0].innerText
        console.log('service tree item with id=' + id + ' has been chosen')
        setCurrentCategory(id, title)
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
    sn.on('sortupdate', function(event, ui) {
        console.log('sorting');
        var next = ui.item.next().data('id')
    });



    /**
     * Toggles list item
     */
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

    /**
     * Expand list items
     */
    $('#sn__tr-expand').click(function() {
        console.log('expand');
        sn.find('.sn__list__item').removeClass('sn__list__item--minimized');
        sn.find('.sn__header__title').attr('title', 'Свернуть');

    });

    /**
     * Shrink list items
     */
    $('#sn__tr-shrink').click(function() {
        console.log('shrink');
        sn.find('.sn__list__item').addClass('sn__list__item--minimized');
        sn.find('.sn__header__title').attr('title', 'Развернуть');
    });


    /**
     * Delete element from tree
     */
    sn.on('click', '.sn__btn-remove', function() {
        console.log('remove')
        var element = $(this).closest('.sn__list__item')
        var id = element.data('id')

        $.colorbox({
            width:"50%",
            opacity: 0.4,
            html: '<div class="popup">' +
            '<h1 class="popup__title">Вы уверены что хотите удалить сервис?</h1>' +
            '<div class="popup__confirmation">' +
            '<button class="confirm-yes">Да</button>' +
            '<button class="confirm-no">Нет</button></div>' +
            '</div>'
        });

        $('.confirm-yes').on('click', function() {
            deleteServiceRequest(id, element)
            $.colorbox.close()
        })

        $('.confirm-no').on('click', function() {
            $.colorbox.close()
        })
    });


    /**
     * Hide / Show / Set visibility
     */
    snm.on('click', '.sn__tr-hide', function() {
        console.log('hiding')
        var element = $(this).closest('.sn__list__item')
        var id = element.data('id')
        element.data('view', !element.data('view'))
        console.log(element.data('view'))
    });


    /**
     * Add service
     */
    $('.sn__btn-add').on('click', function(event) {
        event.preventDefault()
        selectServiceListRequest()
            .done(function(data) {
                var html = '<div id="service-add" class="popup"><div class="sa__title">' +
                    'Добавить сервис в ' + window.currentCategory.name + '</div>' +
                    '<div class="sa__search"><input type="text" class="sa__search__form" placeholder="Поиск">' +
                    '<a href="#" class="sa__search__button">' +
                    '<img src="img/loupe.svg" alt="loupe" class="sa__search__button__image">' +
                    '</a></div><table class="sa__services">' +
                    '<tr><th>Наименование сервиса</th><th>Код сервиса</th></tr>';

                data.serviceList.map(function(el) {
                    html += '<tr data-id="' + el.serviceId + '"><td>' + el.serviceName + '</td><td>' + el.serviceKey + '</td></tr>'
                })

                html += '</table></div>';

                $.colorbox({
                    width:"50%",
                    opacity: 0.4,
                    html: html
                })
        })
    });


    /**
     * Insert item to tree
     */
    $('body').on('dblclick', '.sa__services td', function() {
        var tr = $(this).parent()
        var serviceId = tr.data('id')
        var serviceName = $(tr.children()[0]).text()
        var serviceCode = $(tr.children()[1]).text()

        var service = {
            "id": serviceId,
            "serviceId": serviceId,
            "title": serviceName,
            "hidden": true,
            "novelty": true,
            "parent": window.currentCategory.id,
            "master": true,
            "eribEnabled": false,
            "eribUrl": "",
            "plEnabled": false,
            "plUrl": "",
            "serviceCode": serviceCode,
            "tags": [""]
        }

        insertElementRequest(window.currentCategory.id, service)
            .done(function() {
                // findTreeItem()
                // moveTreeItem()
                sn.append(buildServiceNavigation([service]))
                $.colorbox.close()
            })
    });


    /**
     * Edit tree element
     */
    sn.on('click', '.sn__btn-save', function(event) {
        event.preventDefault()
        var id = $(this).data('id')
        var service = {
            listId: '2',
            serviceId: '2',
            treeId: '2',
            title: 'Перевод на карту в другом банке',
            eribEnabled: true,
            eribUrl: 'https://sbtatlas.sigma.sbrf.ru/wiki/pages/viewpage.action?pageId=107845880',
            plEnabled: false,
            plUrl: 'https://sbtatlas.sigma.sbrf.ru/wiki/pages/viewpage.action?pageId=107845880',
            novelty: true,
            master: '',
            hidden: true,
            tags: 'Перевод; Банк;',
            serviceCode: 'transfer_client_sberbank'
        }
        updateServiceRequest(window.currentCategory, service)
    });
});