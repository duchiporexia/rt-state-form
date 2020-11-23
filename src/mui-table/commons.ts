import React from 'react';

export type OrderType = 'asc' | 'desc' | null;

export interface XTableColumn {
    name: string;
    label: React.ReactNode;
    align?: 'left' | 'center' | 'right' | 'justify';
    render?: (row: any) => React.ReactNode;
}

export type XTableRow = { [key: string]: any } & { id: string | number };

function descendingComparator(a: any, b: any, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: OrderType, orderBy: string) {
    if (order == null) {
        return null;
    }
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function defaultSort(rows: XTableRow[], order: OrderType, orderBy: string) {
    const comparator = getComparator(order, orderBy);
    if (!comparator) {
        return rows;
    }
    const stabilizedThis = rows.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        const idxA = a[1] as number;
        const idxB = b[1] as number;
        return idxA - idxB;
    });
    return stabilizedThis.map((el) => el[0]) as XTableRow[];
}
