//import { ColumnFilter } from './ColumnFilter'

export const COLUMNS = [
    {
        Header: 'Id',
        Footer: 'Id',
        accessor: '_id',
        //disableFilters:true           <------ how to not have a column with filter capes
        
    },
    {
        Header: 'Item Name',
        Footer: 'Item Name',
        accessor: 'name',
    },
    {
        Header: 'Description',
        Footer: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Location',
        Footer: 'Location',
        accessor: 'homeLocation',
    },
    {
        Header: 'Serial #',
        Footer: 'Serial #',
        accessor: 'serialNumber',
    },
    {
        Header: 'Notes',
        Footer: 'Notes',
        accessor: 'notes',
    }
]

export const GROUPED_COLUMNS = [
    {
        Header: 'Id',
        Footer: 'Id',
        accessor: 'id'
    },
    {
        Header: 'About',
        Footer: 'About',
        columns: [
            {
                Header: 'Item Name',
                Footer: 'Item Name',
                accessor: 'item_name'
            },
            {
                Header: 'Description',
                Footer: 'Description',
                accessor: 'description'
            },
        ]
    },
    {
        Header: 'Info',
        Footer: 'Info',
        columns : [
            {
                Header: 'Location',
                Footer: 'Location',
                accessor: 'location'
            },
            {
                Header: 'Serial #',
                Footer: 'Serial #',
                accessor: 'serial'
            },
            {
                Header: 'Notes',
                Footer: 'Notes',
                accessor: 'notes'
            },
            {
                Header: 'Available',
                Footer: 'Available',
                accessor: 'available'
            },
            {
                Header: 'Serviceable',
                Footer: 'Serviceable',
                accessor: 'serviceable'
            },
            {
                Header: 'Is Child',
                Footer: 'Is Child',
                accessor: 'is_child'
            }
        ]
    }

]