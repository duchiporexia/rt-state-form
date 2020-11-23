import TableHead, { TableHeadProps } from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import React from 'react';
import { rst } from 'rt-state';
import { makeStyles } from '@material-ui/core/styles';
import { OrderType, XTableColumn } from './commons';

const useStyles = makeStyles((theme) => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    headCell: {
        backgroundColor: 'white',
        borderBottom: '2px solid rgba(224, 224, 224, 1)',
    },
}));

export const XTableHead = rst.createS<XTableHeadProps & TableHeadProps>((props) => {
    const { onRequestSort, orderBy, order, columns, ...others } = props;
    const classes = useStyles(props);

    return (
        <TableHead {...others}>
            <TableRow>
                {props.columns.map((column, idx) => (
                    <TableCell
                        key={idx}
                        align={'center'}
                        className={classes.headCell}
                        padding={'default'}
                        sortDirection={orderBy === column.name ? order : false}>
                        <TableSortLabel
                            active={orderBy === column.name}
                            direction={orderBy === column.name ? order : 'asc'}
                            onClick={() => onRequestSort(column.name)}>
                            {column.label ?? column.name}
                            {orderBy === column.name ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
});

export interface XTableHeadProps {
    onRequestSort: (field: string) => void;
    order?: OrderType;
    orderBy: string;
    columns: XTableColumn[];
}
