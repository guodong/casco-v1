Ext.define('casco.view.manage.Manage', {
	extend: 'Ext.container.Viewport',
	requires: ['casco.view.main.Top', 'casco.view.manage.ManageController',
			'casco.view.manage.Projectlist', 'casco.store.Users',
			'casco.view.manage.Testmethod', 'casco.view.manage.Methodadd',
			'casco.view.manage.Projectadd', 'casco.view.manage.Useradd','casco.view.manage.Document'],

	xtype: 'manage',

	layout: {
		type: 'border'
	},
	itemId: 'manage',
	controller: 'manage',
	
	initComponent: function() {
		Ext.setGlyphFontFamily('FontAwesome'); // 设置图标字体文件，只有设置了以后才能用glyph属性
		var me = this;
		this.items = [{
			region: 'north',
			xtype: 'top'
		}, {
			xtype: 'treepanel',
			title: "Management",
			region: 'west',
			width: 200,
			split: true,
			collapsible: true,
			rootVisible: false,
			listeners: {
				itemclick: 'seldoc'
			},
			store: Ext.create('Ext.data.TreeStore', {
				root: {
					expanded: true,
					children: [{
						text: "User Management",
						children: [{
							text: "User List",
							leaf: true,
							id: 'userlist'
						}]
					}, {
						text: "Project Management",
						children: [{
							text: "Project List",
							leaf: true,
							id: 'projectlist'
						}]
					}, {
						text: "System Management",
						children: [{
							text: "Test Method",
							leaf: true,
							id: 'testmethod'
						}]
					}]
				}
			})
		}, {
			region: 'center',
			reference: 'main',
			xtype: 'tabpanel'
		}]
		this.callParent();
	},

});
