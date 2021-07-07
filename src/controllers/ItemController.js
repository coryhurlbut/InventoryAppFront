import GenericController from './GenericController';

/*
*   Controls functions calling APIs for Item data operations
*/
class ItemController extends GenericController{

    //Gets all items
    async getAllItems() {
        let items;
        await this.request('items', {method: 'GET'})
            .then((res) => res.json())
            .then((item) => items = item);
        return items;
    };

    //Gets all available items
    async getAvailableItems() {
        let itemsList;
        await this.request('items/available', {method: 'GET'})
            .then((res) => res.json())
            .then((items) => itemsList = items);
        return itemsList;
    };

    //Gets all unavailable items
    async getUnavailableItems() {
        let itemsList;
        await this.request('items/unavailable', {method: 'GET'})
            .then((res) => res.json())
            .then((items) => itemsList = items);
        return itemsList;
    };

    //Gets one item by Id
    async getItemById(itemId) {
        let item = await this.request(`items/${itemId}`, {method: 'GET'})
            .then((res) => res.json());
        return item;
    };

    //Creates one item. Must have required data fields
    async createItem(item) {
        return await this.request('items', {method: 'POST', body: JSON.stringify(item)});
    };

    //Deletes one item by Id
    async deleteItem(itemId) {
        return await this.request(`items/${itemId}`, {method: 'DELETE'});
    };

    //Updates one item. Must pass item Id and the data to update
    async updateItem(itemId, item) {
        return await this.request(`items/${itemId}`, {method: 'PATCH', body: JSON.stringify(item)});
    };
};

//Exports an instance of the class instead of the class
const itemController = new ItemController();
export default itemController;