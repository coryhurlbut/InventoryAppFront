import {genericController} from './GenericController';
import {AuthController} from './AuthController';

/*
*   Controls functions calling APIs for Item data operations
*/
class ItemController extends AuthController {

    //gets all items
    async getAllItems(){
        return await genericController.request('items', {method: 'GET'});
    }

    //Gets all available items
    async getAvailableItems() {
        return await genericController.request('items/available', {method: 'GET'});
    };

    //Gets all unavailable items
    async getUnavailableItems() {
        return await genericController.request('items/unavailable', {method: 'GET'});
    };

    //Gets one item by Id
    async getItemByItemNumber(itemNumber) {
        return await this.requestWithAuth(`items/item/${itemNumber}`, {method: 'GET'});
    };

    //Creates one item. Must have required data fields
    async createItem(item) {
        return await this.requestWithAuth('items', {method: 'POST', body: JSON.stringify(item)}); 
    };

    //Deletes items by Id
    async deleteItems(items) {
        return await this.requestWithAuth('items/delete', {method: 'DELETE', body: JSON.stringify(items)});
    };

    //Updates one item. Must pass item Id and the data to update
    async updateItem(item) {
        return await this.requestWithAuth(`items/${item.itemNumber}`, {method: 'PATCH', body: JSON.stringify(item)});
    };

    //Signs out items. Must pass item Ids
    async signItemOut(items, user) {
        let body = {
            'items': items,
            'user': user
        };
        return await this.requestWithAuth('items/signout', {method: 'PATCH', body: JSON.stringify(body)});
    };

    //Signs in items. Must pass item Ids
    async signItemIn(items) {
        return await this.requestWithAuth('items/signin', {method: 'PATCH', body: JSON.stringify(items)});
    };
};

//Exports an instance of the class instead of the class
const itemController = new ItemController();
export default itemController;