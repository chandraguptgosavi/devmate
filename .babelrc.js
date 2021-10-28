const plugins = [
    [
        'babel-plugin-import',
        {
            libraryName: '@mui/material',
            libraryDirectory: '',
            camel2DashComponentName: false,
        },
        'core',
    ],
    [
        'babel-plugin-import',
        {
            libraryName: '@material-ui/core',
            libraryDirectory: '',
            camel2DashComponentName: false,
        },
        'core',
    ],
    [
        'babel-plugin-import',
        {
            libraryName: '@mui/icons-material',
            libraryDirectory: '',
            camel2DashComponentName: false,
        },
        'icons',
    ],
    [
        'babel-plugin-import',
        {
            libraryName: '@material-ui/lab',
            libraryDirectory: '',
            camel2DashComponentName: false,
        },
        'lab',
    ],
];

module.exports = { plugins };