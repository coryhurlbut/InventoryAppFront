import React from 'react';

import { useTable, useRowSelect } from 'react-table';

import '../../styles/Table.css'


function Table({ columns, data, ...props }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        toggleAllRowsSelected
    } = useTable({
            columns,
            data,
        },
        useRowSelect
    );

    return(
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    if(
                        (props.userRole === 'admin' && 
                        props.contentType !== undefined) || 
                        (props.userRole === 'custodian' && 
                        props.contentType !== 'Users' && 
                        props.contentType !== undefined)
                    ) {
                        return(
                            <tr 
                                {...row.getRowProps()} 
                                {...row.getToggleRowSelectedProps()}
                                indeterminate="false"
                                onDoubleClick={() => {
                                    toggleAllRowsSelected();
                                    console.log(rows)
                                    props._parseRowsArray(rows, rows[0].isSelected);
                                }}
                                onClick={() => {
                                    row.toggleRowSelected();
                                    props.setParentState(row.original);
                                }} 
                                className="dataRow" 
                                title=""
                                style={row.isSelected ?  //unable to style in other file due to needing the conditional changes
                                    {'backgroundColor': (row.index % 2 === 1 ? '#76c5ceb6' : '#a8f5feb6')} : 
                                    null
                                }
                            >
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    } else {
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    }
                })
            } 
            </tbody>
        </table>
    )
}

export default Table