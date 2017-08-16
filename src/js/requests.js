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
function selectServicesListRequest () {
    return $.ajax({
        url: 'src/response/selectServicesList.json',
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
