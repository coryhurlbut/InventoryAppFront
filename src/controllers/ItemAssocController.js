import AuthController from './AuthController';

/*
*   Controls functions calling APIs for ItemAssoc data operations
*/
class ItemAssocController extends AuthController{

    //Gets all item associations
    async getAllItemAssocs() {
        return await this.requestWithAuth('itemAssoc', {method: 'GET'});
    };

    //Gets item associations by the parent item's Id
    async getItemAssocByParentId(parentId) {
        return await this.requestWithAuth('itemAssoc/parent/' + parentId, {method: 'GET'});
    };

    //Gets item associations by child item's Id 
    async getItemAssocByChildId(childId) {
        return await this.requestWithAuth('itemAssoc/child/' + childId, {method: 'GET'});
    };

    //Creates item association. Must have a parent item Id and a child item Id
    async createItemAssoc(parentItemId, childItemId) {
        let body = {
            parentId: parentItemId,
            childId: childItemId
        };

        return await this.requestWithAuth('itemAssoc', {method: 'POST', body: JSON.stringify(body)});
    };

    //Deletes an item association by composite key of parent and child Ids
    async deleteItemAssoc(parentId, childId) {
        return await this.requestWithAuth(`itemAssoc/${parentId}/${childId}`, {method: 'DELETE'});
    };
};

//Exports an instance of the class instead of the class
const itemAssocController = new ItemAssocController();
export default itemAssocController;