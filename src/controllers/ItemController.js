import {genericController} from './GenericController';
import AuthController from './AuthController';

/*
*   Controls functions calling APIs for Item data operations
*/
class ItemController extends AuthController{

    //Gets all available items
    async getAvailableItems() {
        let itemsList;
        try {
            await genericController.request('items/available', {method: 'GET'})
                .then((res) => res.json())
                .then((items) => itemsList = items)
            return itemsList;
        } catch (error) {
            return error.message
        };
    };

    //Gets all unavailable items
    async getUnavailableItems() {
        let itemsList;
        await genericController.request('items/unavailable', {method: 'GET'})
            .then((res) => res.json())
            .then((items) => itemsList = items);
        return itemsList;
    };

    //Gets one item by Id
    async getItemById(itemId) {
        let item = await this.requestWithAuth(`items/${itemId}`, {method: 'GET'})
            .then((res) => res.json());
        return item;
    };

    //Creates one item. Must have required data fields
    async createItem(item) {
        return await this.requestWithAuth('items', {method: 'POST', body: JSON.stringify(item)});
    };

    //Deletes one item by Id
    async deleteItem(itemId) {
        return await this.requestWithAuth(`items/${itemId}`, {method: 'DELETE'});
    };

    //Updates one item. Must pass item Id and the data to update
    async updateItem(itemId, item) {
        return await this.requestWithAuth(`items/${itemId}`, {method: 'PATCH', body: JSON.stringify(item)});
    };
};

//Exports an instance of the class instead of the class
const itemController = new ItemController();
export default itemController;