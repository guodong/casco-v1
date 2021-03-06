Ext.define('casco.view.manage.Documentadd', {
	extend: 'Ext.window.Window',

	xtype: 'widget.documentadd',
	requires: [],
	controller: 'manage',
	resizable: true,
	maximizable: true,
	modal: true,
	title: '添加文档',
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
				}, {
					anchor: '100%',
					fieldLabel: '项目编号',
					name: 'project_id',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					value:project_id,
					allowBlank: false,
					editable:false,
					hidden: true//me.user?true:false
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
				}],
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