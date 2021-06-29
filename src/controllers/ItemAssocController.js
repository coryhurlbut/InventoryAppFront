import GenericController from './GenericController';

/*
*   Controls functions calling APIs for ItemAssoc data operations
*/
class ItemAssocController extends GenericController{

    //Gets all item associations
    async getAllItemAssocs() {
        let itemAssocs;
        await this.request('itemAssoc', {method: 'GET'})
            .then((res) => res.json())
            .then((itemAssoc) => itemAssocs = itemAssoc);
        return itemAssocs;
    };

    //Gets item associations by the parent item's Id
    async getItemAssocByParentId(parentId) {
        let itemAssocs;
        await this.request('itemAssoc/parent/' + parentId, {method: 'GET'})
            .then((res) => res.json())
            .then((itemAssoc) => itemAssocs = itemAssoc);
        return itemAssocs;
    };

    //Gets item associations by child item's Id 
    async getItemAssocByChildId(childId) {
        let itemAssocs;
        await this.request('itemAssoc/child/' + childId, {method: 'GET'})
            .then((res) => res.json())
            .then((itemAssoc) => itemAssocs = itemAssoc);
        return itemAssocs;
    };

    //Creates item association. Must have a parent item Id and a child item Id
    async createItemAssoc(parentItemId, childItemId) {
        let body = {
            parentId: parentItemId,
            childId: childItemId
        };

        return await this.request('itemAssoc', {method: 'POST', body: body});
    };

    //Deletes an item association by composite key of parent and child Ids
    async deleteItemAssoc(parentId, childId) {
        return await this.request(`itemAssoc/${parentId}/${childId}`, {method: 'DELETE'});
    };
};

//Exports an instance of the class instead of the class
const itemAssocController = new ItemAssocController();
export default itemAssocController;