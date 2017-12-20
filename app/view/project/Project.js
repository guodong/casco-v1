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
	            fieldLabel: '选择工程',
	            queryMode: 'local',
	            displayField: 'name',
	            valueField: 'id',
	            allowBlank: false,
	            store: store
	        }],
	        buttons: [{
	            text: "新建工程",
	            listeners: {
	            	click: 'create'
	            }
	        },{
	            text: '确定',
	            formBind: true,
	            listeners: {
	                click: 'onChooseProject'
	            }
	        }]
	    }
		this.callParent();
	}
});