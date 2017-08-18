/**
 * Toggle all items in the list of navigation
 */
function toggleItem() {
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
}

/**
 * Expand item in the list of navigation
 * @param sn
 */
function expandAll(sn) {
    console.log('expand');
    sn.find('.sn__list__item').removeClass('sn__list__item--minimized');
    sn.find('.sn__header__title').attr('title', 'Свернуть');
}



/**
 * Collapse item in the list of navigation
 * @param sn
 */
function collapseAll(sn) {
    console.log('collapse');
    sn.find('.sn__list__item').addClass('sn__list__item--minimized');
    sn.find('.sn__header__title').attr('title', 'Развернуть');
}



/**
 * Set the visibility of the item in the list of navigation
 */
function visibilityToggle () {
    console.log('hiding')
    var element = $(this).closest('.sn__list__item')
    var id = element.data('tree-id')
    element.data('view', !element.data('view'))
    console.log(element.data('view'))
}



/**
 * Select the service category from left sidebar (set current category)
 * @param event
 */
function selectServiceCategory (event) {
    event.stopPropagation()
    var id = $(this).data('tree-id')
    var title = $(this).children('a')[0].innerText
    console.log('service tree item with id=' + id + ' has been chosen')
    setCurrentCategory(id, title)
}



/**
 * Add service function
 * when you click to button add service
 * colorbox will be fired
 * @param event
 */
function addService (event) {
    event.preventDefault()
    selectServicesListRequest()
        .done(function(data) {
            var html = '<div id="service-add" class="popup"><div class="sa__title">' +
                'Добавить сервис в ' + window.currentCategory.name + '</div>' +
                '<div class="sa__search"><input type="text" class="sa__search__form" placeholder="Поиск">' +
                '<a href="#" class="sa__search__button">' +
                '<img src="img/loupe.svg" alt="loupe" class="sa__search__button__image">' +
                '</a></div><div class="sa__table-wrapper"><table class="sa__services">' +
                '<tr><th>Наименование сервиса</th><th>Код сервиса</th></tr>';

            data.serviceList.map(function(el) {
                html += '<tr data-service-id="' + el.serviceId + '"><td>' + el.serviceName + '</td><td>' + el.serviceKey + '</td></tr>'
            })

            html += '</table></div></div>';

            $.colorbox({
                width:"50%",
                opacity: 0.4,
                html: html
            })
        })
}



/**
 * Insert item to tree
 * when you dblclick by service in popup window
 */
function insertItem (sn) {
    var tr = $(this).parent()
    var serviceId = tr.data('service-id')
    var serviceTitle = $(tr.children()[0]).text()
    var serviceCode = $(tr.children()[1]).text()

    var service = findService(serviceId, window.tree)
    var newService = {}

    if (!service) {
        newService = {
            "listId": null,
            "serviceId": serviceId,
            "treeId": null,
            "title": serviceTitle,
            "eribEnabled": false,
            "eribUrl": "",
            "plEnabled": false,
            "plUrl": "",
            "novelty": true,
            "master": true,
            "hidden": true,
            "tags": [""],
            "serviceCode": serviceCode,
            "descriptionTreeElement": []
        }
    } else {
        Object.assign(newService, service)
        newService.treeId = null
        newService.master = false
        newService.descriptionTreeElement = []
    }

    var targetService = findService(window.currentCategory.id, window.tree)
    // nasty hack of insert service to window.tree by the link of targetService
    targetService.descriptionTreeElement.push(newService)

    sn.append(buildServiceNavigation([newService]))
    renderServiceTree(window.tree)
    $.colorbox.close()
}



/**
 * Delete element from the list of navigation
 */
function deleteElement() {
    console.log('delete')
    var element = $(this).closest('.sn__list__item')
    var treeId = element.data('tree-id')

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
        deleteElementRequest(treeId)
            .done(function(data) {
                if (data.status.code === 0) {
                    //todo: remove service from window.tree
                    $('#service-tree-list').find('.st__item[data-tree-id="' + treeId +'"]')[0].remove()
                    element.remove()
                } else {
                    console.warn('Can\'t to delete element. Status code = ' + data.status.code)
                }
            })
        $.colorbox.close()
    })

    $('.confirm-no').on('click', function() {
        $.colorbox.close()
    })
}



/**
 * Edit element of service tree
 * @param event
 */
function editElement(event) {
    event.preventDefault()
    var id = $(this).data('tree-id')
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
}