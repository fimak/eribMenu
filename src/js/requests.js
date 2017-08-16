/**
 * Initialization request function
 */
function treeInitRequest () {
    return $.ajax({
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
            console.log('update service success', response)
        },
        error: function() {
            console.watn('update service fail')
        }
    })
}



/**
 * Delete element (service) request function
 * @param treeId
 */
function deleteElementRequest (treeId) {
    return $.ajax({
        type: 'POST',
        url: 'src/response/deleteElement.json',
        data: {removingServicesTreeId: treeId},
        success: function() {
            console.log('delete success')
        },
        error: function() {
            console.warn('remove fail')
        }
    })
}
