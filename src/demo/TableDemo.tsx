import React from 'react';
import { rst } from 'rt-state';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Container } from '@material-ui/core';
import { XTable, XTableColumn } from '../';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            // width: '100%',
            // display: 'flex',
            // justifyContent: 'center',
            // marginBottom: theme.spacing(1),
        },
        table: {
            // width: '40%',
        },
    };
});

let idx = 0;
function createData(name, price) {
    return { id: idx++, name, price };
}

const rows = [
    createData('Point Piper', '$23,966,600'),
    createData('Elizabeth Bay', '$6,966,600'),
    createData('Watsons Bay', '$53,966,600'),
    createData('Test Corp', '$7,966,600'),
    createData('Point Piper', '$23,966,600'),
    createData('Elizabeth Bay', '$6,966,600'),
    createData('Watsons Bay', '$53,966,600'),
    createData('Test Corp', '$7,966,600'),
    createData('Point Piper', '$23,966,600'),
    createData('Elizabeth Bay', '$6,966,600'),
    createData('Watsons Bay', '$53,966,600'),
    createData('Test Corp', '$7,966,600'),
    createData('Point Piper', '$23,966,600'),
    createData('Elizabeth Bay', '$6,966,600'),
    createData('Watsons Bay', '$53,966,600'),
    createData('Test Corp', '$7,966,600'),
];

const columns = [
    {
        name: 'id',
        align: 'left',
        label: 'ID',
        render: (row) => {
            // console.log(row);
            return <span>id:{row.id}</span>;
        },
    },
    { name: 'name', align: 'left', label: 'Region' },
    { name: 'price', align: 'right', label: 'Price' },
] as XTableColumn[];

export const XTableDemo = rst.create<{}>((ctx) => {
    return (props) => {
        const classes = useStyles(props);
        return (
            <Container>
                <XTable rows={rows} columns={columns} className={classes.table} />
            </Container>
        );
    };
});
