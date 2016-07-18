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
			title: "Management",
			region: 'west',
			width: 200,
			split: true,
			collapsible: true,
			rootVisible: false,
			listeners: {
				itemclick: 'seldoc'
			},
//			render:function(){
//				if(JSON.parse(localStorage.user).role_id != '2')
//					this.hide();
//			},
//			hide:function(){
//				this.node.hide = true;
//				if(this.wrap) this.wrap.style.display = "none";
//			},
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
//			initEvents:function(){
//				if(this.node){
//					this.hide();
//				}
//			}
		}, {
			region: 'center',
			reference: 'main',
			xtype: 'tabpanel'
		}]
		this.callParent();
	},

});
