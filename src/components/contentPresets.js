//Settings for which data is displaying in the table

export const availableItemsColumns = [
    {
        Header  : 'Item Number',
        accessor: 'itemNumber'
    },
    {
        Header  : 'Item Name',
        accessor: 'name'
    },
    {
        Header  : 'Description',
        accessor: 'description'
    },
    {
        Header  : 'Location',
        accessor: 'homeLocation'
    },
    {
        Header  : 'Specific Location',
        accessor: 'specificLocation'
    },
    {
        Header  : 'Serial Number',
        accessor: 'serialNumber'
    },
];

const unavailableItemsColumns = [
    {
        Header  : 'Item Number',
        accessor: 'itemNumber'
    },
    {
        Header  : 'Item Name',
        accessor: 'name'
    },
    {
        Header  : 'Description',
        accessor: 'description'
    },
    {
        Header  : 'Location',
        accessor: 'homeLocation'
    },
    {
        Header  : 'Specific Location',
        accessor: 'specificLocation'
    },
    {
        Header  : 'Serial Number',
        accessor: 'serialNumber'
    },
    {
        Header  : 'Signed Out To',
        accessor: 'possessedBy'
    }
];

const usersColumns = [
    {
        Header  : 'First Name',
        accessor: 'firstName'
    },
    {
        Header  : 'Last Name',
        accessor: 'lastName'
    },
    {
        Header  : 'Username',
        accessor: 'userName'
    },
    {
        Header  : 'User Role',
        accessor: 'userRole'
    },
    {
        Header  : 'Phone Number',
        accessor: 'phoneNumber'
    },
    {
        Header  : 'Status',
        accessor: 'status'
    }
];

export const adminLogColumns = [
    {
        Header: 'Item ID',
        accessor: 'itemId',
    },
    {
        Header: 'User ID',
        accessor: 'userId',
    },
    {
        Header: 'Admin ID',
        accessor: 'adminId'
    },
    {
        Header: 'Action taken',
        accessor: 'action',
    },
    {
        Header: 'Content',
        accessor: 'content'
    },
    {
        Header: 'Date',
        accessor: 'date'
    }
];

export const itemLogColumns = [
    {
        Header: 'Item ID',
        accessor: 'itemId',
    },
    {
        Header: 'Custodian ID',
        accessor: 'custodianId',
    },
    {
        Header: 'Action taken',
        accessor: 'action',
    },
    {
        Header: 'Notes',
        accessor: 'notes'
    },
    {
        Header: 'Date',
        accessor: 'date'
    }   
];

export const viewNoteColumns = [
    {
        Header: "Notes",
        accessor: "notes"
    },
    {
        Header: "Date",
        accessor: 'date'
    }
]

export const approveUserColumns = [
    {
        Header: 'First Name',
        accessor: 'firstName',
    },{
        Header: 'Last Name',
        accessor: 'lastName',
    },{
        Header: 'Username',
        accessor: 'userName'
    },{
        Header: 'Phone Number',
        accessor: 'phoneNumber',
    }

];

export const availableItemsContent = {
    contentType : "Available Items",
    editControls: "ItemEditControls",
    inOrOut     : "Sign Item Out",
    columns     : availableItemsColumns
};
export const unavailableItemsContent = {
    contentType : "Unavailable Items",
    editControls: "ItemEditControls",
    inOrOut     : "Sign Item In",
    columns     : unavailableItemsColumns
};
export const usersContent = {
    contentType : "Users",
    editControls: "UserEditControls",
    inOrOut     : "",
    columns     : usersColumns
};

//Settings for what is to be displayed in ContentBuilder based on the user's role
export const displayPresets = {
    main: {
        isUserContentVisible    : false,
        isSignItemInOutVisible  : false,
        isEditControlVisible    : false,
        isLoggedIn              : false,
        isItemLogVisible        : false,
        isAdminLogVisible       : false
    },
    custodian: {
        isUserContentVisible    : true,
        isSignItemInOutVisible  : true,
        isEditControlVisible    : true,
        isLoggedIn              : true,
        isItemLogVisible        : true,
        isAdminLogVisible       : false
    },
    admin: {
        isUserContentVisible    : true,
        isSignItemInOutVisible  : true,
        isEditControlVisible    : true,
        isLoggedIn              : true,
        isItemLogVisible        : true,
        isAdminLogVisible       : true
    }
};

