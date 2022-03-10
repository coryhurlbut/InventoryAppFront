//Settings for which data is displaying in the table

const availableItemsColumns = [
    {
        Header: 'Item Name',
        accessor: 'name',
    },
    {
        Header: 'Description',
        accessor: 'description'
    },
    {
        Header: 'Location',
        accessor: 'homeLocation',
    },
    {
        Header: 'Specific Location',
        accessor: 'specificLocation'
    },
    {
        Header: 'Serial Number',
        accessor: 'serialNumber'
    },
    {
        Header: 'Notes',
        accessor: 'notes'
    }
];

const unavailableItemsColumns = [
    {
        Header: 'Item Name',
        accessor: 'name',
    },
    {
        Header: 'Description',
        accessor: 'description'
    },
    {
        Header: 'Location',
        accessor: 'homeLocation',
    },
    {
        Header: 'Specific Location',
        accessor: 'specificLocation'
    },
    {
        Header: 'Serial Number',
        accessor: 'serialNumber'
    },
    {
        Header: 'Notes',
        accessor: 'notes'
    },
    {
        Header: 'Signed Out To',
        accessor: 'possessedBy'
    }
];

const usersColumns = [
    {
        Header: 'First Name',
        accessor: 'firstName',
    },
    {
        Header: 'Last Name',
        accessor: 'lastName'
    },
    {
        Header: 'Username',
        accessor: 'userName',
    },
    {
        Header: 'User Role',
        accessor: 'userRole'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber'
    }
];

export const availableItemsContent = {
    contentType:        "Available Items",
    editControls:       "ItemEditControls",
    inOrOut:            "Sign Item Out",
    columns:            availableItemsColumns
};
export const unavailableItemsContent = {
    contentType:        "Unavailable Items",
    editControls:       "ItemEditControls",
    inOrOut:            "Sign Item In",
    columns:            unavailableItemsColumns
};
export const usersContent = {
    contentType:        "Users",
    editControls:       "UserEditControls",
    inOrOut:            "",
    columns:            usersColumns
};

