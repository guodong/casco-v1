Ext.define('casco.view.manage.VatlistWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'casco.view.main.MainController',
        'casco.view.main.MainModel',
        'casco.view.main.Top',
        'casco.view.project.Project',
        'casco.view.main.Tree',
    ],
	modal: true,
    controller: 'manage',
    title: '查看Vat',
	width: '80%',
	height: '80%',
	maximizable: true,
	
    initComponent : function() {
		var me = this;
		me.items = [{
	        xtype: 'vatlist',
	        project:me.project,
	        anchor: '100%', //resize
	    }];
		 
		this.callParent();
	},

    
});
