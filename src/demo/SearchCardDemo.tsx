import { rst } from 'rt-state';
import * as React from 'react';
import { Grid, Paper, Typography, Hidden } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { clsx } from '../commons';
import { countries, skills } from './data';
import {
    xFormSetLanguage,
    xFormGetLanguage,
    xFormInitLanguage,
    string,
    object,
    createXForm,
    XKeyboardDateTimePicker,
    XTextField,
    XAutocomplete,
    XSelect,
    XKeyboardTimePicker,
} from '../';

const initialValues = {
    username: '',
    gender: 'Female',
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

const resources = {
    zh: {
        translation: {
            'Username is required{{x}}': '必填用户名{{x}}',
            'Country is required': '国家是必填的',
            Username: '用户名',
            Gender: '性别',
        },
    },
};

xFormInitLanguage({ resources, lng: 'zh' }).then();

export const FormSearchCard = rst.create<{}>((ctx) => {
    const form = createXForm({
        initialValues,
        validate: {
            username: string().required('Username is required{{x}}', { x: 'good' }),
            gender: string().required('Gender selection is required'),
            country: object()
                .required('Country is required')
                .check((value) => {
                    if (value?.value === 'AX') {
                        return "Can't be AX";
                    }
                }),
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
                            const lng = xFormGetLanguage();
                            if (lng === 'en') {
                                xFormSetLanguage('zh');
                                console.log('current lan:', 'zh');
                            } else {
                                xFormSetLanguage('en');
                                console.log('current lan:', 'en');
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
