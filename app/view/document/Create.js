Ext.define('Type', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'number'
	}, {
		name: 'type',
		type: 'string'
	},]
});
Ext.define('casco.view.document.Create', {
	extend: 'Ext.window.Window',

	alias: 'widget.document.create',
	uses: ['casco.view.document.DocumentController'],
	controller: 'document',
	modal: true,
	title: '创建文档',
	width: 300,
	initComponent: function () {
		var me = this;
		Ext.apply(me, {
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				style: {
					background: '#eee'
				},
				items: ['->', {
					text: '保存',
					glyph: 0xf0c7,
					listeners: {
						click: 'createDocument'
					}
				}, {
						text: '取消',
						glyph: 0xf112,
						scope: me,
						handler: this.doHide
					}]
			}],
			items: [{
				xtype: 'form',
				reference: 'document_create_form',
				bodyPadding: '10',
				items: [{
					fieldLabel: '名称',
					msgTarget: 'under',
					name: 'name',
					xtype: 'textfield'
				}, {
					xtype: 'combobox',
					name: 'type',
					editable: false,
					fieldLabel: '类型',
					queryMode: 'local',
					displayField: 'text',
					valueField: 'type',
					allowBlank: false,
					store: Ext.create('Ext.data.Store', {
						model: 'Type',
						data: [{
							id: 1,
							type: 'rs',
							text: '需求类'
						}, {
							id: 2,
							type: 'tc',
							text: '测试类'
						}, {
							id: 3,
							type: 'tr',
							text: '报告类'
						},]
					}),
					listeners: {
						//						select: function(f, r, i) {
						//							if(r.get('type') == 'rs'){
						//								me.down('#rsreg').show();
						//								me.down('#tcreg').hide();
						//							}else if(r.get('type') == 'tc'){
						//								me.down('#rsreg').hide();
						//								me.down('#tcreg').show();
						//							}else{
						//								me.down('#rsreg').hide();
						//								me.down('#tcreg').hide();
						//							}
						//						}
					}
				}, {
					xtype: 'hiddenfield',
					name: 'project_id',
					value: me.project.id
				}, {
					xtype: 'fieldset',
					title: 'Rs Regex',
					collapsible: false,
					id: 'rsreg',
					defaultType: 'textfield',
					hidden: true,
					defaults: {
						anchor: '100%'
					},
					items: [{
						fieldLabel: '标签',
						name: 'rstag'
					}, {
						fieldLabel: '描述',
						name: 'rsdescription'
					}, {
						fieldLabel: '实现',
						name: 'rsimplement'
					}, {
						fieldLabel: '优先级',
						name: 'rspriority'
					}, {
						fieldLabel: '贡献',
						name: 'rscontribution'
					}, {
						fieldLabel: '类别',
						name: 'rscategory'
					}, {
						fieldLabel: '分配',
						name: 'rsallocation'
					}]
				}, {
					xtype: 'fieldset',
					title: 'Tc Regex',
					collapsible: false,
					id: 'tcreg',
					defaultType: 'textfield',
					hidden: true,
					defaults: {
						anchor: '100%'
					},
					items: [{
						fieldLabel: '标签',
						name: 'tag'
					}, {
						fieldLabel: '描述',
						name: 'description'
					}, {
						fieldLabel: '前提',
						name: 'pre_condition'
					}]
				}]
			}]
		});
		me.callParent(arguments);
	},
	doHide: function () {
		this.destroy();
	}
});