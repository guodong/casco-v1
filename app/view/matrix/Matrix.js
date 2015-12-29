//151105
/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('casco.view.matrix.Matrix', {
    extend: 'Ext.container.Viewport',
	xtype: 'matrix',
    requires: [
        'Ext.plugin.Viewport',
        'casco.view.matrix.MatrixController',
        'casco.view.matrix.MatrixModel',
		'casco.view.matrix.Tree',
		'casco.view.matrix.ItemTree',
		'casco.view.matrix.Top'
    ],
    
    controller: 'matrix',
    viewModel: 'matrix',
    reference:'matrix',
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
            xtype: 'matrix_top',
            reference:'top',
            project: me.project
        },{
            xtype: 'matrix_tree',
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
			id:'matrixpanel',
			reference: 'rightpanel',
            items:[{
                title: 'Overview',
                html: '<iframe id="draw" src="/draw/noedit.html?'+Ext.Object.getKey(me.project,'id')+'" style="width:100%;height:100%;border:0"></iframe>'
            }]
        }];
    	this.callParent();
	 
    }
});
