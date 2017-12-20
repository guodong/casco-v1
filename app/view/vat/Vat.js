//151105
/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('casco.view.vat.Vat', {
    extend: 'Ext.container.Viewport',
	xtype: 'vat',
    requires: ['casco.view.vat.VatController',
               'casco.store.TreeDocuments',
               'casco.view.main.Top',
               'casco.store.Projects',
               'casco.view.vat.Tree',
               'casco.view.vat.VatModel',
               'casco.store.VatRelations'],
    
    controller: 'vat',
    viewModel: 'vat',
    reference:'vat',
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
    
    initComponent: function(){
    	var me = this;
        me.store = Ext.create('casco.store.TreeDocuments', {
    		proxy: {
    			extraParams: {
    				project_id: me.project?me.project.get('id'):''
    			}
    		}
    	});
    	me.items = [{
            region: 'north',
            xtype: 'vat_top',
            reference:'top',
            project: me.project
        },{
            xtype: 'vat_tree',
            store: me.store,
            title: me.project.get('name'),
            project: me.project,
            region: 'west',
            width: 150,
            split: true,
            collapsible: true,
            editable: false,
            bodyPadding: 0
        },{
            region: 'center',
            xtype: 'tabpanel',
            title: '',
			id:'vatpanel',
			reference: 'rightpanel',
            items:[{
                title: '概览',
                html: '<iframe id="draw" src="/draw/noedit.html?'+me.project.get('id')+'" style="width:100%;height:100%;border:0"></iframe>'
            }]
        }];
    	this.callParent();
	 
    }
});