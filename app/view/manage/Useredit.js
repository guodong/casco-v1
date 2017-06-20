Ext.define('casco.view.manage.Useredit', {
	extend: 'Ext.window.Window',
	alias:'widget.useredit',
	requires: [],
	controller: 'manage',	
	resizable: true,
	maximizable: true,
	modal: true,
	title:'个人信息修改',
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
		 {"name":"管理员", "value":"1"},
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
					allowBlank: false,
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
				}, {
					anchor: '100%',
					fieldLabel: '密码',
					name: 'password',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					inputType: 'password',
					allowBlank: false,
					//hidden: me.user?true:false
				},{
					anchor: '100%',
					fieldLabel: '用户权限',
					name: 'role_id',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'combobox',
                    editable: false,
                    displayField: 'name',
                    valueField: 'value',
                    store: store,
                    queryMode: 'local',
                    emptyText: me.user.get('role_id')=='0'?'普通用户':'管理员',
                    hidden: me.isTop?true:false		
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
//                    store: me.projects,	//???如何
                    store: pros_store,
                    queryMode: 'local',
                    emptyText: '请为其分配参与的项目',
                    hidden: me.isTop?true:false,
					listeners : {

						  afterRender : function(combo) {
						  me.projects.each(function(record){
						  combo.addValue(record.data.id);//同时下拉框会将与name为firstValue值对应的 text显示
						 
						  });
						  } , //还要重写select方法
						 
						  select : function(combo, record) {
                           //难道是程序自动加载的id
//						   console.log('all '+combo.getValue());
						
						   console.log(combo.getSelection());
						   //遍历来判断是否有值
						   if(!combo.getSelection()) combo.setValue = '';
						   else{
							   var flag=Ext.Array.contains(combo.getValue(),combo.getSelection().getData().id);
	                           if(!flag){
	                            combo.addValue(combo.getSelection().data.id);
							   }
						   }
						   
					       }//select
					}//listeners
    			},{
				   xtype:'checkboxfield',//
				   fieldLabel:'停用',
				   checked:me.user.get('islock')=='0'?false:true,
				   name:'islock',
                   inputValue:'1',
				   boxLabel:'选中停用账户',
				   uncheckedValue:'0',
				   hidden: me.isTop?true:false
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
	},
	doHide: function() {
		this.hide();
	}
});