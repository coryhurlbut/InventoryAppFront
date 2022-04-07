import {AuthController} from "./AuthController";
/*
*   Controls functions calling APIs for AdminLog data operations
*/
class AdminLogController extends AuthController {
    
    //Gets all admin logs
    async getAllAdminLogs() {
        return await this.requestWithAuth('logs/adminLogs', {method: 'GET'});
    };

    //Gets admin logs by item Id
    async getAdminLogsByItemId(itemId) {
        return await this.requestWithAuth(`logs/adminLogs/item/${itemId}`, {method: 'GET'});
    };

    //Gets admin logs by user Id
    async getAdminLogsByUserId(userId) {
        return await this.requestWithAuth(`logs/adminLogs/user/${userId}`, {method: 'GET'});
    };

    //Creates an admin log. Must have required adminLog data
    async createAdminLog(adminLog) {
        let user = this.getUserInfo();
        adminLog.adminId = user.user.user._id;
        return await this.requestWithAuth('logs/adminLogs', {method: 'POST', body: JSON.stringify(adminLog)});
    };

    //Delete an admin log
    async deleteAdminLog(logId) {
        return await this.requestWithAuth(`logs/adminLogs/${logId}`, {method: 'DELETE'});
    };
};

//Exports an instance of the class instead of the class
const adminLogController = new AdminLogController();
export default adminLogController;