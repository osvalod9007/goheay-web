const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { 
      '@primary-color': '#0275d8',
      '@success-color': '#1aae88', // success state color
      '@warning-color': '#faad14', // warning state color
      '@error-color': '#e33244' // error state color
    },
}),
);