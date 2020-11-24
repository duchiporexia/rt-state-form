import { rst } from 'rt-state';
import * as React from 'react';
import { Grid, Paper, Typography, Hidden } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { clsx, number } from '../commons';
import { countries, skills } from './data';
import {
    string,
    object,
    createXForm,
    XKeyboardDateTimePicker,
    XTextField,
    XAutocomplete,
    XSelect,
    XKeyboardTimePicker,
} from '../';
import i18n from 'i18next';

const initialValues = {
    username: '',
    gender: 'Female',
    age: '',
    country: null,
    skills: [
        {
            label: 'ASP.NET',
            value: 'ASP.NET',
        },
    ],
    birthdate: null,
    interviewTime: null,
};

const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const FormSearchCard = rst.create<{}>((ctx) => {
    const form = createXForm({
        initialValues,
        validate: {
            username: string().min(3).max(5).required('Username is required{{x}}', { x: 'good' }),
            gender: string().required('Gender selection is required'),
            age: number().required().min(18, 'Not an adult'),
            country: object()
                .required('Country is required')
                .check((value) => {
                    if (value?.value === 'AX') {
                        return "Can't be AX";
                    }
                }),
            skills: string(true).required(),
            birthdate: object().required(),
        },
        onSubmit,
        fieldProps: {
            username: { label: 'Username' },
            gender: {
                label: 'Gender',
                options: [
                    { value: '', label: '-- No selection --' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                ],
            },
            country: {
                options: countries,
            },
            skills: {
                options: skills,
            },
            birthdate: {
                format: 'dd/MM/yyyy hh:mm',
            },
        },
    });

    function onSubmit(values) {
        console.log(form);
        // eslint-disable-next-line no-alert
        window.alert(`
          Username: ${values.username}
          Gender: ${values.gender}
          Age: ${values.age}
          Country: ${values.country?.label}
          Skills: ${values.skills.map((v) => v.label).join(', ')}
          Birth date: ${values.birthdate}
          Interview Time: ${values.interviewTime}
        `);
    }

    return (props) => {
        const node = (
            <Paper className={clsx('px-1', 'py-1')}>
                <div>
                    <Button
                        onClick={() => {
                            if (!i18n.isInitialized) {
                                return;
                            }
                            if (i18n.language === 'en') {
                                i18n.changeLanguage('zh').then();
                            } else {
                                i18n.changeLanguage('en').then();
                            }
                        }}>
                        change Language
                    </Button>
                    <Grid direction={'column'} container>
                        <Grid item container>
                            <Typography component={'div'} variant={'h6'}>
                                <span>Search</span>
                            </Typography>
                            <Grid item xs />
                            <Button variant={'contained'} onClick={form.handleReset}>
                                Reset
                            </Button>
                            <Box pl={2} />
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                type="submit"
                                disabled={!form.dirty}
                                onClick={form.handleSubmit}>
                                Confirm
                            </Button>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <XTextField form={form} name="username" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <XSelect name="gender" form={form} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <XTextField name="age" form={form} type={'number'} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <XAutocomplete form={form} name="country" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <XAutocomplete form={form} name="skills" multiple={true} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <XKeyboardDateTimePicker form={form} name="birthdate" label={'Birth Date'} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <XKeyboardTimePicker form={form} name="interviewTime" mask={'__:__'} ampm={false} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        );

        return (
            <Hidden xsDown implementation={'css'}>
                {node}
            </Hidden>
        );
    };
});
