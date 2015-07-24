/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('casco.view.main.Main', {
    extend: 'Ext.container.Viewport',
	xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',

        'casco.view.main.MainController',
        'casco.view.main.MainModel'
    ],

    controller: 'main',
    viewModel: 'main',

    ui: 'navigation',

    tabBarHeaderPosition: 1,

    tabBar: {
        flex: 1,
    },
    layout: {
        type: 'border'
    },
    defaults: {
        bodyPadding: 10,
    },
    items: [{
        region: 'north',
        xtype: 'top'
    },{
        xtype: 'tree',
        id: 'mtree',
        itemId: 'mtree',
        title: JSON.parse(localStorage.project).name,
        region: 'west',
        width: 200,
        split: true,
        collapsible: true,
        editable: false,
    },{
        region: 'center',
        xtype: 'tabpanel',
        title: '',
        id: 'workpanel',
        items:[{
            title: 'Tab 1',
            html: '<h2>Content appropriate for the current navigation.</h2>'
        }]
    }]
});
