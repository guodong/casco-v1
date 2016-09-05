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
        me.store = Ext.create('casco.store.Vats');
        me.store.load({
        	params: {
        		project_id: me.project.get('id'),
        	}
        });
        console.log(me.store);
    	me.items = [{
            region: 'north',
            xtype: 'vat_top',
            reference:'top',
            project: me.project
        },{
            region: 'center',
            xtype: 'tabpanel',
            title: '',
			id:'vatpanel',
			reference: 'rightpanel',
//			plugin: Ext.create('Ext.ux.TabCloseMenu', {  
//                closeTabText : '关闭当前页',  
//                closeOthersTabsText : '关闭其他页',  
//                closeAllTabsText : '关闭所有页'  
//            }), 
            items:[{
            	'xtype': 'vat.view',
				'title': 'Vat Build Lists',
				'id': 'vatlist'+me.project.get('id'),
				'project': me.project,
//				'closable': false
            }]
        }];
    	this.callParent();
	 
    }
});
