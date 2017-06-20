Ext.define('casco.view.manage.Useradd', {
	extend: 'Ext.window.Window',

	xtype: 'widget.useradd',
	requires: [],
	controller: 'manage',
	resizable: true,
	maximizable: true,
	modal: true,
	title:'添加用户',
	width: 300,
	initComponent: function() {
		var me = this;
		me.projects = Ext.create('casco.store.Projects');  
		if(me.user!=null){
			me.projects.setData(me.user.get('projects'));
		}
		var pros_store=Ext.create('casco.store.Projects');
		pros_store.load();

		var store = Ext.create('Ext.data.Store', {
         fields: ['name', 'value'],
         data : [
         {"name":"普通用户", "value":"0"},
		 {"name":"管理员", "value":"1"}
           ]});
		
		Ext.apply(me, {
			
			items: [{
				xtype: 'form',
				reference: 'useraddform',
				bodyPadding: '10',
				items: [{
					anchor: '100%',
					fieldLabel: '用户名',
					name: 'account',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					
					allowBlank: false
				}, {
					anchor: '100%',
					fieldLabel: '姓名',
					name: 'realname',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				}, {
					anchor: '100%',
					fieldLabel: '工号',
					name: 'jobnumber',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield'
				},{
					anchor: '100%',
					fieldLabel: '密码(默认:casco123)',
					name: 'password',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					inputType: 'password',
					value:'casco123',
					allowBlank: false,
					//hidden: me.user?true:false
				}, {
					anchor: '100%',
					fieldLabel: '用户权限(默认:普通用户)',
					name: 'Role',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'combobox',
                    editable: false,
                    displayField: 'name',
                    valueField: 'value',
                    store: store,
                    queryMode: 'local',
                    emptyText: '请分配用户权限',
                    listeners:{
                    	afterRender: function(cb){
                    		cb.setValue('0');
                    	}
                    }
                   
				},{
					anchor: '100%',
					fieldLabel: '参与项目',
					name: 'project',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'combobox',
                    editable: false,
					multiSelect:true,
                    displayField: 'name',
                    valueField: 'id',
                    store: pros_store,
                    queryMode: 'local',
                    emptyText: '请为其分配参与的项目',
                   
				},{
				   xtype:'checkboxfield',
				   fieldLabel:'停用',
				   checked:false,
				   name:'islock',
                   inputValue:'1',
				   uncheckedValue:'0',
				   boxLabel:'停用账户'
				}],
				buttons: ['->', {
					text: '保存',
					formBind: true,
					glyph: 0xf0c7,
					listeners: {
						click: 'createuser'
					}
				}, {
					text: '取消',
					glyph: 0xf112,
					scope: me,
					handler: this.destroy
				}]

			}]
		});
		me.callParent(arguments);
	}
});