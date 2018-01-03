// 20151021  R
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
	//forceFit: true,
	initComponent: function() {
		Ext.setGlyphFontFamily('FontAwesome'); // 设置图标字体文件，只有设置了以后才能用glyph属性
		var me = this;
		var user=me.user;

		this.items = [{		
			region: 'north',
			xtype: 'manage_top'
		}, {
			xtype: 'treepanel',
			title: "信息管理",
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
						text: "用户信息管理",
						children: [{
							text: "用户列表",
							leaf: true,
							id: 'userlist'
						}]
					}, {
						text: "项目工程管理",
						children: [{
							text: "工程列表",
							leaf: true,
							id: 'projectlist'
						}]
					}
				/*, {
						text: "系统信息管理",
						children: [{
							text: "测试方法",
							leaf: true,
							id: 'testmethod'
						}]
					} */
				]
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
