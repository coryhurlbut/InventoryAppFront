import {genericController} from './GenericController';
import AuthController from './AuthController';

/*
*   Controls functions calling APIs for Item data operations
*/
class ItemController extends AuthController{

    //Gets all available items
    async getAvailableItems() {
        return await genericController.request('items/available', {method: 'GET'});
    };

    async getParentItems() {
        let itemsList;
        try{
            await genericController.request('items/parents', {method: 'GET'})
                .then((res) => res.json())
                .then((items) => itemsList = items)
                return itemsList;
        }
        catch (error){
            return error.message
        };
    };

    //Gets all unavailable items
    async getUnavailableItems() {
        return await genericController.request('items/unavailable', {method: 'GET'});
    };

    //Gets one item by Id
    async getItemById(itemId) {
        return await this.requestWithAuth(`items/${itemId}`, {method: 'GET'});
    };

    //Creates one item. Must have required data fields
    async createItem(item) {
        return await this.requestWithAuth('items', {method: 'POST', body: JSON.stringify(item)});
    };

    //Deletes one item by Id
    // async deleteItem(itemId) {
    //     return await this.requestWithAuth(`items/${itemId}`, {method: 'DELETE'});
    // };

    //Deletes items by Id
    async deleteItems(itemIds) {
        console.log(JSON.stringify(itemIds));
        return await this.requestWithAuth('items/delete', {method: 'DELETE', body: JSON.stringify(itemIds)});
    };

    //Updates one item. Must pass item Id and the data to update
    async updateItem(itemId, item) {
        return await this.requestWithAuth(`items/${itemId}`, {method: 'PATCH', body: JSON.stringify(item)});
    };

    //Signs out items. Must pass item Ids
    async signItemOut(itemIds) {
        return await this.requestWithAuth('items/signout', {method: 'PATCH', body: JSON.stringify(itemIds)});
    };

    //Signs in items. Must pass item Ids
    async signItemIn(itemIds) {
        return await this.requestWithAuth('items/signin', {method: 'PATCH', body: JSON.stringify(itemIds)});
    };
};

//Exports an instance of the class instead of the class
const itemController = new ItemController();
export default itemController;