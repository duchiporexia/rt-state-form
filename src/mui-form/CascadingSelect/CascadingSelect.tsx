import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { rst } from 'rt-state';
import * as React from 'react';
import { CascadingSelectOptionsType, ParentPopupState } from './common';
import { bindHover, bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Submenu } from './SubMenu';
import { ClickAwayListener } from '@material-ui/core';

export interface CascadingSelectProps {
    label?: React.ReactNode;
    options: CascadingSelectOptionsType[];
    error?: boolean;
    helperText?: React.ReactNode;
    fullWidth?: boolean;
    variant?: 'standard' | 'filled' | 'outlined';
    margin?: 'none' | 'dense' | 'normal';
    size?: 'small' | 'medium';
    onSelected?: (value: any) => void;
    renderValue?: (option: CascadingSelectOptionsType) => React.ReactNode;
    renderValueWithPaths?: (options: CascadingSelectOptionsType[]) => React.ReactNode;
    renderOption?: (option: CascadingSelectOptionsType) => React.ReactNode;
}

const findOption = (options: CascadingSelectOptionsType[], value: any) => {
    if (value == null) {
        return null;
    }
    for (const option of options) {
        if (option.children) {
            const opt = findOption(option.children, value);
            if (opt != null) {
                return opt;
            }
        } else if (option.value === value) {
            return option;
        }
    }
    return null;
};

export const CascadingSelect = rst.create<CascadingSelectProps & TextFieldProps>(
    (ctx) => {
        const hooksRef = rst.hooks(() => {
            return usePopupState({ popupId: 'CascadingSelect', variant: 'popover' });
        });

        const state = rst.state<{
            option: CascadingSelectOptionsType;
            open: boolean;
            isInMenu: boolean;
        }>({
            option: null,
            open: false,
            isInMenu: false,
        });

        const handleMenuItemClick = (option: CascadingSelectOptionsType) => {
            ctx.props.onSelected?.(option.value);
            hooksRef.current.close();
            state.option = option;
        };

        let optionsMap = {};
        const buildMap = (options: CascadingSelectOptionsType[], parentOption: CascadingSelectOptionsType) => {
            options.forEach((opt) => {
                if (opt.children) {
                    buildMap(opt.children, opt);
                }
                optionsMap[opt.value] = parentOption;
            });
        };

        const getPaths = (option: CascadingSelectOptionsType) => {
            const paths = [];
            paths.push(option);
            let parent = optionsMap[option.value];
            while (parent) {
                paths.push(parent);
                parent = optionsMap[parent.value];
            }
            return paths.reverse();
        };

        rst.watch(
            () => {
                if (state.option?.value !== ctx.props.value) {
                    const option = findOption(ctx.props.options, ctx.props.value);
                    if (option != null && option.value !== state.option?.value) {
                        state.option = option;
                    }
                }
                // console.log(state.option, ctx.props.value, ctx.props.options);
            },
            () => [ctx.w().options, ctx.w().value],
        );

        rst.watch(
            () => {
                if (ctx.props.renderValueWithPaths) {
                    optionsMap = {};
                    buildMap(ctx.props.options, null);
                }
            },
            () => [ctx.w().options],
        );

        const getMenus = (options: CascadingSelectOptionsType[]) => {
            return options.map((option) => {
                if (!option.children) {
                    return (
                        <MenuItem
                            key={option.value}
                            onClick={(e) => {
                                setTimeout(() => {
                                    state.isInMenu = false;
                                }, 100);
                                handleMenuItemClick(option);
                            }}
                            value={option.value}>
                            {ctx.props.renderOption ? ctx.props.renderOption(option) : option.label}
                        </MenuItem>
                    );
                }
                return (
                    <Submenu key={option.value} popupId={option.value} title={option.label}>
                        {getMenus(option.children)}
                    </Submenu>
                );
            });
        };

        return (props) => {
            const { renderValue, renderValueWithPaths } = props;
            const hasData = state.option != null;

            const triggerProps = ((t) => {
                return {
                    ...t,
                    onClick: (e) => {
                        state.open = true;
                        state.isInMenu = true;
                        t.onClick(e);
                    },
                };
            })(bindTrigger(hooksRef.current));

            const menuProps = ((p) => {
                return {
                    ...p,
                    onClose: () => {
                        p.onClose();
                        state.isInMenu = false;
                    },
                };
            })(bindMenu(hooksRef.current));

            return (
                <>
                    <ClickAwayListener
                        onClickAway={(e) => {
                            if (!state.isInMenu && state.open) {
                                state.open = false;
                            }
                        }}>
                        <TextField
                            focused={state.open}
                            select
                            value={'1'}
                            error={props.error}
                            helperText={props.helperText}
                            {...triggerProps}
                            SelectProps={{
                                // IconComponent: () => <div />,
                                renderValue: () => {
                                    const value = state.option;
                                    if (!hasData) {
                                        return '';
                                    }
                                    if (renderValueWithPaths) {
                                        return renderValueWithPaths(getPaths(value));
                                    }
                                    if (renderValue) {
                                        return renderValue(value);
                                    }
                                    return value.label;
                                },
                                MenuProps: {
                                    hidden: true,
                                },
                                open: state.isInMenu,
                            }}
                            InputLabelProps={{
                                shrink: hasData,
                            }}
                            fullWidth={props.fullWidth}
                            variant={props.variant}
                            margin={props.margin}
                            label={props.label}>
                            <MenuItem value={'1'}>1</MenuItem>
                        </TextField>
                    </ClickAwayListener>
                    <ParentPopupState.Provider value={hooksRef.current}>
                        <Menu {...menuProps} getContentAnchorEl={null}>
                            {getMenus(ctx.props.options ?? [])}
                        </Menu>
                    </ParentPopupState.Provider>
                </>
            );
        };
    },
    {
        defaultProps: {
            fullWidth: true,
            variant: 'outlined',
            margin: 'normal',
            size: 'small',
        },
    },
);
