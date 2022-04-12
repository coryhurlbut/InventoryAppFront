//Settings for which data is displaying in the table

const availableItemsColumns = [
    {
        Header: 'Item Number',
        accessor: 'itemNumber'
    },
    {
        Header: 'Item Name',
        accessor: 'name'
    },
    {
        Header: 'Description',
        accessor: 'description'
    },
    {
        Header: 'Location',
        accessor: 'homeLocation'
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
        Header: 'Item Number',
        accessor: 'itemNumber'
    },
    {
        Header: 'Item Name',
        accessor: 'name'
    },
    {
        Header: 'Description',
        accessor: 'description'
    },
    {
        Header: 'Location',
        accessor: 'homeLocation'
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
        accessor: 'firstName'
    },
    {
        Header: 'Last Name',
        accessor: 'lastName'
    },
    {
        Header: 'Username',
        accessor: 'userName'
    },
    {
        Header: 'User Role',
        accessor: 'userRole'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber'
    },
    {
        Header: 'Status',
        accessor: 'status'
    }
];

export const availableItemsContent = {
    contentType:  "Available Items",
    editControls: "ItemEditControls",
    inOrOut:      "Sign Item Out",
    columns:      availableItemsColumns
};
export const unavailableItemsContent = {
    contentType:  "Unavailable Items",
    editControls: "ItemEditControls",
    inOrOut:      "Sign Item In",
    columns:      unavailableItemsColumns
};
export const usersContent = {
    contentType:  "Users",
    editControls: "UserEditControls",
    inOrOut:      "",
    columns:      usersColumns
};

//Settings for what is to be displayed in ContentBuilder based on the user's role
export const displayPresets = {
    main: {
        userContentIsVisible:   false,
        signItemInOutIsVisible: false,
        editControlIsVisible:   false,
        allowEditNotes:         false,
        isLoggedIn:             false,
        itemLogIsVisible:       false,
        adminLogIsVisible:      false
    },
    custodian: {
        userContentIsVisible:   true,
        signItemInOutIsVisible: true,
        editControlIsVisible:   false,
        allowEditNotes:         false,
        isLoggedIn:             true,
        itemLogIsVisible:       true,
        adminLogIsVisible:      false
    },
    admin: {
        userContentIsVisible:   true,
        signItemInOutIsVisible: true,
        editControlIsVisible:   true,
        allowEditNotes:         true,
        isLoggedIn:             true,
        itemLogIsVisible:       true,
        adminLogIsVisible:      true
    }
};
