/**
 * Helper function of treeId checking
 * @param treeId
 * @returns {boolean}
 */
function isNew(treeId) {
    return treeId.toString().substr(0, 4) === 'new_'
}



/**
 * Render service tree list (left sidebar)
 * @param tree
 */
function renderServiceTree (tree) {
    var html = '<li class="st__item st__item--open" data-tree-id="' + tree.treeId + '">' +
        '<a href="#">' + tree.title + '</a><ul class="st__list">';

    /**
     * Service tree build function which create the list of services in left sidebar
     * @param tree
     */
    function serviceTreeBuild (tree) {
        tree.descriptionTreeElement.forEach(function(item) {
            if (item.descriptionTreeElement.length > 0) {
                html += '<li class="st__item st__item--open" data-tree-id="' + item.treeId + '">'
                    + '<a href="#">' + item.title + '</a>'
                    + '<ul class="st__list">';
                serviceTreeBuild(item);
                html += '</ul>';
            } else {
                html += '<li class="st__item st__item--closed" data-tree-id="' + item.treeId + '">'
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
 * @param {array} navigation
 * @returns {string}
 */
function buildServiceNavigation (navigation) {
    var html = ''

    if (navigation && navigation.length > 0) {
        navigation.forEach(function(item) {
            html += '<li class="sn__list__item sn__list__item--minimized ';
            html += isNew(item.treeId) ? 'sn__list__item--new' : '';
            html += '" data-tree-id="' + item.treeId + '" ' +
                'data-list-id="' + item.listId + '" ' +
                'data-service-id="' + item.serviceId + '" ' +
                'data-master="' + item.master + '">' +
                '<div class="sn__btn-remove"></div><div class="sn__drag-handle"></div>' +
                '<div class="sn__header"><div class="sn__header__item"><div class="sn__checkbox-wrapper">' +
                '<div class="sn__checkbox-image"><input type="checkbox" class="sn__tr-hide" id="sn__tr-hide-' + item.treeId + '"';
            html += item.hidden ? 'checked' : '';
            html += '><label for="sn__tr-hide-' + item.treeId + '"></label></div></div>' +
                '<div class="sn__checkbox-wrapper"><div class="sn__checkbox-image sn__checkbox-image--padding">' +
                '<input type="checkbox" class="sn__tr-new" id="sn__tr-new-' + item.treeId + '"';
            html += item.novelty ? 'checked' : '';
            html += '><label for="sn__tr-new-' + item.treeId + '"></label>' +
                '</div></div><span class="sn__header__title" title="Развернуть">' + item.title + '</span></div></div>' +
                '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">' +
                '<input type="checkbox" class="sn__tr-erib" id="sn__tr-erib-' + item.treeId + '" ';
            html += item.eribEnabled ? 'checked' : '';
            html += '><label for="sn__tr-erib-' + item.treeId + '"></label></div> ЕРИБ:</div></div><div class="sn__field">' +
                '<input class="sn__link-field" type="text" id="sn__erib-url-' + item.treeId + '" value="' + item.eribUrl + '"></div></div>' +
                '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside"><div class="sn__checkbox">' +
                '<input type="checkbox" class="sn__tr-pl" id="sn__tr-pl-' + item.treeId + '" ';
            html += item.plEnabled ? 'checked' : '';
            html += '><label for="sn__tr-pl-' + item.treeId + '"></label></div> PL:</div></div><div class="sn__field">' +
                '<input class="sn__link-field" type="text" id="sn__pl-url-' + item.treeId + '" value="' + item.plUrl + '"></div></div>' +
                '<div class="sn__row"><div class="sn__label"><div class="sn__label__inside">Код сервиса:</div></div>' +
                '<div class="sn__field"><input class="sn__service-code-field" type="text" id="sn__service-code-' + item.treeId + '" value="' + item.serviceCode + '">' +
                '</div></div><div class="sn__row"><div class="sn__label"><div class="sn__label__inside">Тэги:</div>' +
                '</div><div class="sn__field"><textarea class="sn__tags-field" type="text" id="sn__tags-' + item.treeId + '">' +
                item.tags + '</textarea></div></div><div class="sn__row"><div class="sn__label"></div>' +
                '<a class="sn__btn-save" data-tree-id="' + item.treeId + '" href="#save">Сохранить</a></div></li>';
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
 * Set the current category which you chose in left sidebar
 * @param id
 * @param title
 */
function setCurrentCategory(id, title) {
    var tree = findService(id, window.tree)

    if (tree) {
        renderServiceNavigation(tree.descriptionTreeElement)
    } else {
        renderServiceNavigation(null)
    }

    window.currentCategory = {
        id: id,
        name: title
    }

    $('.sn__title').text(title);
}



/**
 * Find the service by treeId
 * @param treeId
 * @param {object} tree
 * @returns {object}
 */
function findService (treeId, tree) {
    var newTree
    //todo: refactor search, e.g. exit from forEach when tree was found, may be you must replace forEach for it
    (function recursiveSearch (tree) {
        if (tree.treeId === treeId) { newTree = tree }
        tree.descriptionTreeElement.forEach(function(el) { recursiveSearch(el) })
    })(tree)
    return newTree
}

/**
 * Find the parent service by treeId
 * @param {integer} treeId
 * @param {object} tree
 * @returns {object}
 */
function findParentService (treeId, tree) {
    var newTree
    (function recursiveSearch(tree) {
        if (tree.descriptionTreeElement.some(function(el) { return el.treeId === treeId })) {
            newTree = tree
        }
        tree.descriptionTreeElement.forEach(function(el) {
            return recursiveSearch(el)
        })
    })(tree)
    return newTree
}