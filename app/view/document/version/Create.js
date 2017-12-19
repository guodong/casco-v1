Ext.define('casco.view.document.version.Create', {
	extend: 'Ext.window.Window',

	alias: 'widget.version.create',
	uses: ['casco.view.document.DocumentController'],
	controller: 'document',

	modal: true,
	title: '创建文档版本',
	width: 300,

	initComponent: function() {
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
						click: 'createVersion',
					}
				}, {
					text: '取消',
					glyph: 0xf112,
					scope: me,
					handler: this.destroy
				}]
			}],
			items: [{
				xtype: 'form',
				reference: 'version_create_form',
				document: me.document,
				bodyPadding: '10',
				items: [{
					fieldLabel: 'Version Name',
					msgTarget: 'under',
					name: 'name',
					xtype: 'textfield'
				}, {
					xtype: 'hiddenfield',
					name: 'document_id',
					value: me.document.id
				}]
			}]
		});
		me.callParent(arguments);
	}
});