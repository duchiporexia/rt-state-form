import { makeStyles, Menu } from '@material-ui/core';
import * as React from 'react';
import { bindHover, bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import MenuItem from '@material-ui/core/MenuItem';
import ChevronRight from '@material-ui/icons/ChevronRight';
import HoverMenu from 'material-ui-popup-state/HoverMenu';
import { ParentPopupState } from './common';

const useStyles = makeStyles((theme) => ({
    menu: {
        marginTop: theme.spacing(-1),
    },
    title: {
        flexGrow: 1,
    },
    moreArrow: {
        marginRight: theme.spacing(-1),
    },
}));

export const Submenu = React.forwardRef(({ title, popupId, children, ...props }: any, ref) => {
    const classes = useStyles();
    const parentPopupState = React.useContext(ParentPopupState);
    const popupState = usePopupState({
        popupId,
        variant: 'popover',
        parentPopupState,
    });
    return (
        <ParentPopupState.Provider value={popupState}>
            <MenuItem {...bindHover(popupState)} selected={popupState.isOpen} ref={ref as any}>
                <span className={classes.title}>{title}</span>
                <ChevronRight className={classes.moreArrow} />
            </MenuItem>
            <HoverMenu
                {...bindMenu(popupState)}
                classes={{ paper: classes.menu }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                getContentAnchorEl={null}
                {...props}>
                {children}
            </HoverMenu>
        </ParentPopupState.Provider>
    );
});
