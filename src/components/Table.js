import React from "react";
import { useTable, useRowSelect } from "react-table";
import '../styles/table.css'

function Table({ columns, data, ...props }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
        state: { selectedRowIds }
    } = useTable({
            columns,
            data,
        },
        useRowSelect
    );

    return (
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
                    if (props.userRole === 'custodian' && props.contentType !== 'Users' || props.userRole === 'admin') {
                        return (
                            <tr 
                                {...row.getRowProps()} 
                                {...row.getToggleRowSelectedProps()} 
                                onClick={                            
                                    () => {
                                    row.toggleRowSelected()
                                    props.setIdArray(row.original._id);
                                }} 
                                style={{'backgroundColor': (row.isSelected ? '#013e44' : '')}}
                            >
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    } else {
                        return (
                            <tr {...row.getRowProps()} >
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