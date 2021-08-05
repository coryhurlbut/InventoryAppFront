import React from 'react';
import * as Controller from '../controllers';


export default class TestComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: []
        };

        this.getAvailableItems = this.getAvailableItems.bind(this);
        this.getUnavailableItems = this.getUnavailableItems.bind(this);
        this.getItemById = this.getItemById.bind(this);
        this.createItem = this.createItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.getAllItemLogs = this.getAllItemLogs.bind(this);
        this.getItemLogsByItemId = this.getItemLogsByItemId.bind(this);
        this.getItemLogsByUserId = this.getItemLogsByUserId.bind(this);
        this.createItemLog = this.createItemLog.bind(this);
        this.deleteItemLog = this.deleteItemLog.bind(this);
        this.getAllAdminLogs = this.getAllAdminLogs.bind(this);
        this.getAdminLogsByItemId = this.getAdminLogsByItemId.bind(this);
        this.getAdminLogsByUserId = this.getAdminLogsByUserId.bind(this);
        this.createAdminLog = this.createAdminLog.bind(this);
        this.deleteAdminLog = this.deleteAdminLog.bind(this);
        this.getAllItemAssocs = this.getAllItemAssocs.bind(this);
        this.getItemAssocByChildId = this.getItemAssocByChildId.bind(this);
        this.getItemAssocByParentId = this.getItemAssocByParentId.bind(this);
        this.createItemAssoc = this.createItemAssoc.bind(this);
        this.deleteItemAssoc = this.deleteItemAssoc.bind(this);


    };

    /*
    *   Item Functions
    *      
    */

    async getAvailableItems() {
        let content = await Controller.ItemController.getAvailableItems();
        console.log(content)    
    };

    async getUnavailableItems() {
        let content = await Controller.ItemController.getUnavailableItems();
        console.log(content)
    };

    async getItemById() {
        let itemId = '60d0bed9f29050d2dc316a68'
        let content = await Controller.ItemController.getItemById(itemId);
        console.log(content)
    };

    async createItem() {
        let body = {
            "name":"item7",
            "description": "item 7 also parent item",
            "serialNumber": "fdsafsa",
            "notes": "notesnotesnotes",
            "homeLocation": "S112",
            "specificLocation": "C4",
            "available": true,
            "servicable": true,
            "isChild": false
        };
        let content = await Controller.ItemController.createItem(body);
        console.log(content)
    };

    async deleteItem() {
        let itemId = '60dc800603394835d8ee3639';
        let content = await Controller.ItemController.deleteItem(itemId);
        console.log('deletedItem')
    };

    async updateItem() {
        let itemId = "60d349da9973d477887792a4"
        let body = {
            "name":"item7",
            "description": "item 7 also child item",
            "serialNumber": "fdsafsa",
            "notes": "notesnotesnotes",
            "homeLocation": "S112",
            "specificLocation": "C4",
            "available": true,
            "servicable": true,
            "isChild": true
        };
        let content = await Controller.ItemController.updateItem(itemId, body);
        console.log(content)
    };

    /*
    *   User Functions
    *      
    */

    async getAllUsers() {
        let content = await Controller.UserController.getAllUsers();
        console.log(content)
    };

    async getUserById() {
        let userId = '60abfa44e7e61d5b300e1fe0'
        let content = await Controller.UserController.getUserById(userId);
        console.log(content)
    };

    async createUser() {
        let body = {
            "firstName":"michael",
            "lastName":"james",
            "userName":"qwerty",
            "password":"qwerty",
            "userRole":"admin",
            "phoneNumber":"5307883532"
        };
        let content = await Controller.UserController.createUser(body);
        console.log(content)
    };

    async deleteUser() {
        let userId = '60abfa44e7e61d5b300e1fe0';
        let content = await Controller.UserController.deleteUser(userId);
        console.log(content)
    };

    async updateUser() {
        let userId = '60abfa44e7e61d5b300e1fe0';
        let body = {
            "firstName":"Peter",
            "lastName":"Griffin",
            "userName":"JohnnyBravo",
            "password":"JohnnyBravo",
            "userRole":"admin",
            "phoneNumber":"5307883532"
        };
        let content = await Controller.UserController.updateUser(userId, body);
        console.log(content)
    };

/*
    *   User Functions
    *      
    */

    async getAllUsers() {
        let content = await Controller.UserController.getAllUsers();
        console.log(content)
    };

    async getUserById() {
        let userId = '60abfa44e7e61d5b300e1fe0'
        let content = await Controller.UserController.getUserById(userId);
        console.log(content)
    };

    async createUser() {
        let body = {
            "firstName":"test",
            "lastName":"test",
            "userName":"testtest",
            "password":"testtest",
            "userRole":"admin",
            "phoneNumber":"5307883532"
        };
        let content = await Controller.UserController.createUser(body);
        console.log(content)
    };

    async deleteUser() {
        let userId = '60abfa44e7e61d5b300e1fe0';
        let content = await Controller.UserController.deleteUser(userId);
        console.log(content)  
    };

    async updateUser() {
        let userId = '60abfa44e7e61d5b300e1fe0';
        let body = {
            "firstName":"test1",
            "lastName":"test1",
            "userName":"testtest1",
            "password":"testtest1",
            "userRole":"admin",
            "phoneNumber":"5307883532"
        };
        let content = await Controller.UserController.updateUser(userId, body);
        console.log(content)  
    };

    /*
    *   ItemLog Functions
    *      
    */

    async getAllItemLogs() {
        let content = await Controller.ItemLogController.getAllItemLogs();
        console.log(content)
    };

    async getItemLogsByItemId() {
        let itemId = '60d0beedf29050d2dc316a69'
        let content = await Controller.ItemLogController.getItemLogsByItemId(itemId);
        console.log(content)
    };

    async getItemLogsByUserId() {
        let userId = '60abfa44e7e61d5b300e1fe0'
        let content = await Controller.ItemLogController.getItemLogsByItemId(userId);
        console.log(content)
    };

    async createItemLog() {
        let body = {
            "itemId": "60d0beedf29050d2dc316a69",
            "userId": "60abfa44e7e61d5b300e1fe0",
            "custodianId": "60abf9f9e7e61d5b300e1fdf",
            "action": "signed out",
            "notes": "notesnotesnotes"
        };
        let content = await Controller.ItemLogController.createItemLog(body);
        console.log(content)
    };

    async deleteItemLog() {
        let itemLogId = '60abfa44e7e61d5b300e1fe0';
        let content = await Controller.ItemLogController.deleteItemLog(itemLogId);
        console.log(content)    
    };

    /*
    *   AdminLog Functions
    *      
    */

    async getAllAdminLogs() {
        let content = await Controller.AdminLogController.getAllAdminLogs();
        console.log(content)
    };

    async getAdminLogsByItemId() {
        let itemId = '60d0beedf29050d2dc316a69'
        let content = await Controller.AdminLogController.getAdminLogsByItemId(itemId);
        console.log(content)
    };

    async getAdminLogsByUserId() {
        let userId = '60abfa44e7e61d5b300e1fe0'
        let content = await Controller.AdminLogController.getAdminLogsByUserId(userId);
        console.log(content)
    };

    async createAdminLog() {
        let body = {
            "itemId": "60d0beedf29050d2dc316a69",
            "userId": "60abfa44e7e61d5b300e1fe0",
            "adminId": "60abf9f9e7e61d5b300e1fdf",
            "action": "signed out",
            "content": "",
            "notes": "notesnotesnotes"
        };
        let content = await Controller.AdminLogController.createAdminLog(body);
        console.log(content)
    };

    async deleteAdminLog() {
        let adminLogId = '60abfa44e7e61d5b300e1fe0';
        let content = await Controller.AdminLogController.deleteAdminLog(adminLogId);
        console.log(content)    
    };

    /*
    *   ItemAssoc Functions
    *      
    */

    async getAllItemAssocs() {
        let content = await Controller.ItemAssocController.getAllItemAssocs();
        console.log(content)
    };

    async getItemAssocByChildId() {
        let childId = '60d0bef5f29050d2dc316a6a'
        let content = await Controller.ItemAssocController.getItemAssocByChildId(childId);
        console.log(content)
    };

    async getItemAssocByParentId() {
        let parentId = '60d0bed9f29050d2dc316a68'
        let content = await Controller.ItemAssocController.getItemAssocByParentId(parentId);
        console.log(content)
    };

    async createItemAssoc() {
        let parentItemId = '60d0bed9f29050d2dc316a68';
        let childItemId = '60d0bef5f29050d2dc316a6a';
        let content = await Controller.ItemAssocController.createItemAssoc(parentItemId, childItemId);
        console.log(content)
    };

    async deleteItemAssoc() {
        let parentItemId = '60d0bed9f29050d2dc316a68';
        let childItemId = '60d0bef5f29050d2dc316a6a';
        let content = await Controller.ItemAssocController.deleteItemAssoc(parentItemId, childItemId);
        console.log(content)    
    };

    render() {
        return(
            <div>
                <div>
                    Items
                    <button onClick={this.getAvailableItems}>
                        getAvailableItems
                    </button>
                    <button onClick={this.getUnavailableItems}>
                        getUnavailableItems
                    </button>
                    <button onClick={this.getItemById}>
                        getItemById
                    </button>
                    <button onClick={this.createItem}>
                        createItem
                    </button>
                    <button onClick={this.deleteItem}>
                        deleteItem
                    </button>
                    <button onClick={this.updateItem}>
                        updateItem
                    </button>
                </div>
                <div>
                    Users
                    <button onClick={this.getAllUsers}>
                        getAllUsers
                    </button>
                    <button onClick={this.getUserById}>
                        getUserById
                    </button>
                    <button onClick={this.createUser}>
                        createUser
                    </button>
                    <button onClick={this.deleteUser}>
                        deleteUser
                    </button>
                    <button onClick={this.updateUser}>
                        updateUser
                    </button>
                </div>
                <div>
                    ItemLogs
                    <button onClick={this.getAllItemLogs}>
                        getAllItemLogs
                    </button>
                    <button onClick={this.getItemLogsByItemId}>
                        getItemLogsByItemId
                    </button>
                    <button onClick={this.getItemLogsByUserId}>
                        getItemLogsByUserId
                    </button>
                    <button onClick={this.createItemLog}>
                        createItemLog
                    </button>
                    <button onClick={this.deleteItemLog}>
                        deleteItemLog
                    </button>
                </div>
                <div>
                    AdminLogs
                    <button onClick={this.getAllAdminLogs}>
                       getAllAdminLogs
                    </button>
                    <button onClick={this.getAdminLogsByItemId}>
                        getAdminLogsByItemId
                    </button>
                    <button onClick={this.getAdminLogsByUserId}>
                        getAdminLogsByUserId
                    </button>
                    <button onClick={this.createAdminLog}>
                        createAdminLog
                    </button>
                    <button onClick={this.deleteAdminLog}>
                        deleteAdminLog
                    </button>
                </div>
                <div>
                    ItemAssoc
                    <button onClick={this.getAllItemAssocs}>
                        getAllItemAssocs
                    </button>
                    <button onClick={this.getItemAssocByChildId}>
                        getItemAssocByChildId
                    </button>
                    <button onClick={this.getItemAssocByParentId}>
                        getItemAssocByParentId
                    </button>
                    <button onClick={this.createItemAssoc}>
                        createItemAssoc
                    </button>
                    <button onClick={this.deleteItemAssoc}>
                        deleteItemAssoc
                    </button>
                </div>
            </div>
        )
    }
};