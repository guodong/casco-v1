Ext.define('casco.model.Folder', {
    extend: 'Ext.data.Model',
    requires:[
        'Ext.data.proxy.LocalStorage',
        'Ext.data.proxy.Ajax'
    ],
    proxy: {
        type: 'rest',
        url: API+'folder',
    }

});