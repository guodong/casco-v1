Ext.define('casco.view.report.Report', {
    extend: 'Ext.container.Viewport',
	xtype: 'report',
    requires: [
        'Ext.plugin.Viewport',
        'casco.view.report.ReportController',
        'casco.view.report.ReportModel',
		'casco.view.report.Tree',
		'casco.view.main.Top'
    ],
    controller: 'report',
    viewModel: 'report',
    reference:'report',
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
            xtype: 'top',
            reference:'top',
            project: me.project
        },{
            xtype: 'report_tree',
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
			id:'reportpanel',
			reference: 'rightpanel',
            items:[{
                title: 'Overview',
                html: '<iframe id="draw" src="/draw/noedit.html?'+me.project.get('id')+'" style="width:100%;height:100%;border:0"></iframe>'
            }]
        }];
    	this.callParent();
	 
    }
});
