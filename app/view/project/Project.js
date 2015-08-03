Ext.define("casco.view.project.Project", {
	extend : 'Ext.window.Window',
	xtype : 'project',

	requires : [ 'casco.view.project.ProjectController'],

	controller : 'project',
	title : 'Projects',
    closable: false,
    title: 'Choose Project',
	autoShow : true,
	initComponent: function(){
		var store = Ext.getStore("Projects");
		store.reload();
		this.items = {
	        xtype: 'form',
	        bodyPadding: 10,
	        items: [{
	            xtype: 'combobox',
	            name: 'project_id',
	            editable: false,
	            fieldLabel: 'Choose Project',
	            queryMode: 'local',
	            displayField: 'name',
	            valueField: 'id',
	            allowBlank: false,
	            store: store
	        }],
	        buttons: [{
	            text: 'Create Project',
	            listeners: {
	            	click: 'create'
	            }
	        },{
	            text: 'OK',
	            formBind: true,
	            listeners: {
	                click: 'onChooseProject'
	            }
	        }]
	    }
		this.callParent();
	}
});