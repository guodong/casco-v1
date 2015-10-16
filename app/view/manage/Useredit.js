Ext.define('casco.view.manage.Useredit', {
	extend: 'Ext.window.Window',

	xtype: 'widget.useredit',
	requires: [],
	controller: 'manage',
	resizable: true,
	maximizable: true,
	modal: true,
	title:'Edit User',
	width: 300,
	initComponent: function() {
		var me = this;
	 	
		me.projects = Ext.create('casco.store.Projects');  //作用？？？？？
		if(me.user!=null){//自身默认的方法啦
			me.projects.setData(me.user.get('projects'));
		}
		var pros_store=Ext.create('casco.store.Projects');
		pros_store.load();
      
		var store = Ext.create('Ext.data.Store', {
         fields: ['name', 'value'],
         data : [
          
         {"name":"Staff", "value":"0"},
		 {"name":"Manager", "value":"1"}
		
        
           ]});
		Ext.apply(me, {
			
			items: [{
				xtype: 'form',
				reference: 'useraddform',
				bodyPadding: '10',
				items: [{
					anchor: '100%',
					fieldLabel: 'Account',
					name: 'account',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					
					allowBlank: false
				}, {
					anchor: '100%',
					fieldLabel: 'Realname',
					name: 'realname',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				}, {
					anchor: '100%',
					fieldLabel: 'Jobnumber',
					name: 'jobnumber',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield'
				},/*{                                        //用户角色
					anchor: '100%',
					fieldLabel: 'role',
					name: 'role',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield'
				}, */ {
					anchor: '100%',
					fieldLabel: 'Password',
					name: 'password',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					inputType: 'password',
					allowBlank: false,
					//hidden: me.user?true:false
				},{
					anchor: '100%',
					fieldLabel: 'Role',
					name: 'role_id',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'combobox',
				    id:'switcher',
                    editable: false,
                    displayField: 'name',
                    valueField: 'value',
                    store: store,
                    queryMode: 'local',
                    emptyText: me.user.get('role_id')=='0'?'Staff':'Manager',
                   
				},/*{
					anchor: '100%',
					fieldLabel: 'Role',
					anchor: '100%',
					fieldLabel: 'role_id',
					name: 'role_id',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false,
                   
				},*/{
    				anchor: '100%',
					fieldLabel: 'Project',
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
                    emptyText: 'Select the Projects',
					listeners : {

						  afterRender : function(combo) {
						 
						  me.projects.each(function(record){
						  combo.addValue(record.data.id);//同时下拉框会将与name为firstValue值对应的 text显示
						 
						  });
						  } , //还要重写select方法
						 
						  select : function(combo, record) {
                           //难道是程序自动加载的id
						   console.log('all '+combo.getValue());
						
						   console.log(combo.getSelection().data);
						   //遍历来判断是否有值
						   var flag=Ext.Array.contains(combo.getValue(),combo.getSelection().data.id);
                           if(!flag){
                            combo.addValue(combo.getSelection().data.id);
						   }
					       }//select
                    

					}//listeners
    			},{
				   xtype:'checkboxfield',//
				   fieldLabel:'Lock',
				   checked:me.user.get('islock')=='0'?false:true,
				   name:'islock',
                   inputValue:'1',
				   boxLabel:'停用账户',
				   uncheckedValue:'0',
				}],
				buttons: ['->', {
					text: 'Save',
					formBind: true,
					glyph: 0xf0c7,
					listeners: {
						click: 'createuser'
					}
				}, {
					text: 'Cancel',
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