Ext.define('casco.view.manage.userprojects', {
	extend: 'Ext.window.Window',

	alias: 'widget.userprojects',
	requires: ['casco.view.manage.Methodadd', 'casco.store.Users'],
	resizable: true,
	maximizable: true,
	modal: true,
	title: '用户工程',
	width: 400,
	height: 250,
	initComponent: function () {
		var me = this;
		user = me.user;
		var store = Ext.create('casco.store.Users',
			{
				proxy: {

					extraParams: {
						user_id: me.user.get('id')
					}
				}
			});
		store.proxy.url = API + 'userpros',
			store.load();
		me.store = store;
		me.project_store = Ext.create('casco.store.Projects');
		me.project_store.load();
		me.tbar = [{
			/*anchor: '100%',
		   // fieldLabel: 'Add Projects',
			name: 'Add Projects',
			msgTarget: 'under',
		    xtype : 'combobox',
		 //defaultType:'checkbox',
			queryMode: 'local',
			editable : true,
			value:'Add Projects',
			store:me.project_store,
			allowBlank: false,
			glyph: 0xffff,
			handler: function() {
			 Ext.Msg.alert('test');

			}
			*/
			hidden: localStorage.role == 'staff' ? true : false,  //用户权限
			text: '编辑工程',
			glyph: 0xf067,
			handler: function () {


			}
		}, {
			hidden: localStorage.role == 'staff' ? true : false,  //用户权限
			text: '删除工程',
			glyph: 0xf067,
			handler: function () {
				Ext.MessageBox.buttonText.yes = '是';
				Ext.MessageBox.buttonText.no = '否';
				var view = me.getView();
				var selection = Ext.ComponentQuery.query('grid')[1].getView();
				if (selection) {
					Ext.Msg.confirm('确认', '确认删除?', function (choice) {
						if (choice == 'yes') {
							console.log(selection);
							//	selection.erase();//erase()会向后台请求rest,ajax删除对应的项目?
							var store_del = Ext.create('casco.store.Users', {
								proxy: {
									extraParams: {
										user_id: me.user.get('id')
									}
								}
							});
							store_del.proxy.url = API + 'userprosdel';
							store_del.load({
								params: {
									project_id: selection.get('id')
								}
							});
							me.store.remove(selection);
							Ext.Msg.alert('删除成功!');
							view.refresh();

						}
					}, this);
				} else {
					Ext.Msg.alert('注意', '请先选中需要删除的工程！');
				}

			}
		}];

		me.items = [{
			xtype: 'grid',
			anchor: '100%',
			store: me.store,
			columns: [{
				text: '工程名称',
				dataIndex: 'name',
				flex: 1
			}, {
				text: '描述',
				dataIndex: 'description',
				flex: 1
			}],
			listeners: {


			}
		}];
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: '确定',
				glyph: 0xf112,
				scope: me,
				handler: this.destroy
			}]
		}];
		me.callParent(arguments);
	},
	doHide: function () {
		this.hide();
	}
});

