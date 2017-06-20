Ext.define('casco.view.manage.Methodadd', {
	extend: 'Ext.window.Window',

	xtype: 'widget.methodadd',
	requires: [],
	controller: 'manage',
	resizable: true,
	maximizable: true,
	modal: true,
	title: '测试方法',
	width: 300,
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			items: [{
				xtype: 'form',
				reference: 'methodaddform',
				bodyPadding: '10',
				items: [{
					anchor: '100%',
					fieldLabel: '方法名称',
					name: 'name',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				}],
				buttons: ['->', {
					text: '保存',
					formBind: true,
					glyph: 0xf0c7,
					listeners: {
						click: 'createmethod'
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