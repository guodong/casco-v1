Ext.define('casco.view.manage.UserProjectsadd', {
	extend: 'Ext.window.Window',

	xtype: 'widget.UserProjectsadd',
	requires: [],
	controller: 'manage',
	resizable: true,
	maximizable: true,
	modal: true,
	title: '为用户添加工程',
	width: 300,
	initComponent: function() {
		var me = this;
		var type= Ext.create('Ext.data.Store', {
        fields: ['text', 'value'],
        data:[
        ['rs','rs'],
		['tc','tc'],
		['ad','ad'],
	    ['tr','tr']
         ]
         });
		var project_id=me.project.get('id');
	 
		me.projects = Ext.create('casco.store.Projects');
		if(me.user){
			me.projects.setData(me.user.get('projects'));
		}
		Ext.apply(me, {
			
			items: [{
				xtype: 'form',
				reference: 'documentaddform',
				bodyPadding: '10',
				items: [{
					anchor: '100%',
					fieldLabel: '名称',
					name: 'name',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				}, {
					anchor: '100%',
					fieldLabel: '类型',
					name: 'type',
					labelAlign: 'top',
					msgTarget: 'under',
				    xtype : 'combobox',
				//defaultType:'checkbox',
				    queryMode: 'local',
                    editable : true,
					valueField : 'value',
				    store:type,
	                allowBlank: false
				    
         /*  renderer: function(val,meta,rec) {
              var id = Ext.id(); //rs','tc','ad','tr','folder
               Ext.defer(function() {
				var data=[
					['rs','rs'],
					['tc','tc'],
					['ad','ad'],
					['tr','tr']
					];
				var store =new Ext.data.ArrayStore({
					fields:['value','text'],
					data:data
				});
					store.load();
					var combo=new Ext.form.checkBox({
						store:store,
						emptyTExt:'Please Search',
						model:'local',
						valueField:'value',
						displayField:'text',
						triggerAction:'query',
						value:'value1',
						renderTo:id
					});
             
			
			 
			 
			 
			 
			 
			 
			 }, 50);
             return Ext.String.format('<div id="{0}"></div>', id);
         }
                   


 */





				},/*{                                        //用户角色
					anchor: '100%',
					fieldLabel: 'role',
					name: 'role',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield'
				}, */ {
					anchor: '100%',
					fieldLabel: '工程编号',
					name: 'project_id',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					value:project_id,
					allowBlank: false,
					editable:false,
					hidden: true//me.user?true:false
				}, {
					anchor: '100%',
					fieldLabel: 'build_version',
					name: 'build_version',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				},{
					anchor: '100%',
					fieldLabel: 'test_version',
					name: 'test_version',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				},{
					anchor: '100%',
					fieldLabel: 'fid',
					name: 'fid',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
				    value:me.fid.get('id'),
				    hidden:true,
					allowBlank: false
				},{
					anchor: '100%',
					fieldLabel: 'regex',
					name: 'regex',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				},{
					anchor: '100%',
					fieldLabel: '文件名',
					name:'filename',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				}/*,{
					anchor: '100%',
					fieldLabel: '创建时间',
					name: 'created_at',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				},{
					anchor: '100%',
					fieldLabel: '更新时间',
					name: 'updated_at',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				}
//    	    	 */  
    			     
    			],
				buttons: ['->', {
					text: '保存',
					formBind: true,
					glyph: 0xf0c7,
					listeners: {
						click: 'createDocument'
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