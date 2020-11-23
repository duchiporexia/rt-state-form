import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { XTableHead } from './TableHead';
import { rst } from 'rt-state';
import { OrderType, defaultSort, XTableColumn, XTableRow } from './commons';
import { clsx } from '../commons';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
    },
    dummy: {},
}));

export const XTable = rst.create<{
    rows: XTableRow[];
    columns: XTableColumn[];
    disableDefaultSorting?: boolean;
    disableDefaultPaging?: boolean;
    noDataComponent?: React.ReactNode;
    initValues?: {
        page?: number;
        rowsPerPage?: number;
        order?: OrderType;
        orderBy?: string;
    };
    onRowClick?: (row: any, event: React.MouseEvent<any>) => void;
    onSortChange?: (orderBy: string, order: OrderType) => void;
    onPaginationChange?: (page: number, rowsPerPage: number) => void;
}>((ctx) => {
    const { initValues } = ctx.props;
    const state = rst.stateS<{
        order: OrderType;
        orderBy: string;
        page: number;
        rowsPerPage: number;
    }>({
        order: initValues?.order,
        orderBy: initValues?.orderBy,
        page: initValues?.page ?? 0,
        rowsPerPage: initValues?.rowsPerPage ?? 10,
    });

    const _handleSortChange = (field: string) => {
        const { onSortChange } = ctx.props;
        const { value: data } = state;
        if (data.orderBy !== field) {
            data.order = 'asc';
            data.orderBy = field;
        } else {
            switch (data.order) {
                case 'asc':
                    data.order = 'desc';
                    break;
                case 'desc':
                    data.order = null;
                    data.orderBy = null;
                    break;
                default:
                    data.order = 'asc';
                    data.orderBy = field;
            }
        }
        state.forceUpdate();
        onSortChange?.(data.orderBy, data.order); //eslint-disable-line
    };

    const handleRowClick = (row: any, event: React.MouseEvent<any>) => {
        ctx.props.onRowClick?.(row, event); //eslint-disable-line
    };

    const handleChangePage = (event, newPage) => {
        const { value } = state;
        value.page = newPage;
        state.forceUpdate();
        ctx.props.onPaginationChange?.(value.page, value.rowsPerPage); //eslint-disable-line
    };

    const handleChangeRowsPerPage = (event) => {
        const { value } = state;
        value.rowsPerPage = parseInt(event.target.value, 10);
        value.page = 0;
        state.forceUpdate();
        ctx.props.onPaginationChange?.(value.page, value.rowsPerPage); //eslint-disable-line
    };

    return (props) => {
        const classes = useStyles(props);
        const { rows, columns, disableDefaultSorting, disableDefaultPaging, noDataComponent } = props;

        const { orderBy, order, page, rowsPerPage } = state.value;

        // sorting
        let processedRows = disableDefaultSorting ? rows : defaultSort(rows, order, orderBy);
        // paging
        processedRows = disableDefaultPaging
            ? processedRows
            : processedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return (
            <div style={props.style} className={clsx(props.className, classes.root)}>
                <Table stickyHeader size={'medium'}>
                    <XTableHead orderBy={orderBy} order={order} onRequestSort={_handleSortChange} columns={columns} />
                    <TableBody>
                        {processedRows.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleRowClick(row, event);
                                    }}
                                    tabIndex={-1}
                                    key={row.id ?? index}>
                                    {columns.map((col, colIdx) => {
                                        return (
                                            <TableCell
                                                key={colIdx}
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                align={col.align}
                                                padding="default">
                                                {col.render?.(row) ?? row[col.name]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                        {(!rows || rows.length == 0) && (
                            <TableRow style={{ height: 53 }}>
                                <TableCell colSpan={6}>{noDataComponent ? noDataComponent : '没有数据'}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        );
    };
});
