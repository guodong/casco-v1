/**
 * This class is the controller for the main view for the application. It is
 * specified as the "controller" of the Main view class.
 * 
 * TODO - Replace this content of this view to suite the needs of your
 * application.
 */
Ext.define('casco.view.main.MainController', {
	extend : 'Ext.app.ViewController',

	alias : 'controller.main',

	switchProject : function(combo, record) {
		this.redirectTo('project/' + record.get('id'), true);
		location.reload();
	},

	manage : function() {
		this.redirectTo('manage', true);
		location.reload();
	},
	testing : function() {
		this.redirectTo('testing/' + this.getView().project.get('id'));
		location.reload();
		return;
		var tabs = Ext.getCmp('workpanel');
		var tab = tabs.child('#tab-testing');
		if(!tab){
			tab = tabs.add({
				id: 'tab-testing',
				xtype: 'test',
				title: 'Testing',
				closable: true,
				project: this.getView().project
			});
		}
		tabs.setActiveTab(tab);
	}

});
