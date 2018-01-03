Ext.define('casco.view.manage.Buildlist', {
	extend: 'Ext.grid.Panel',

	alias: 'widget.buildlist',
	requires: ['casco.view.testing.BuildCreate', 'casco.store.Builds'],

	id: 'build_list',
	modal: true,
	maximizable: true,

	initComponent: function () {
		var me = this;

		var store = Ext.create('casco.store.Builds', {
			proxy: {
				extraParams: {
					project_id: me.project.get('id'),

				}
			}
		});
		store.load();
		me.store = store;
		me.tbar = [{
			//	hidden: localStorage.role == 'staff',  //用户权限
			text: '添加Build',
			glyph: 0xf067,
			handler: function () {
				var win = Ext.create('casco.view.testing.BuildCreate', { project: me.project });
				win.show();
			}
		}, {
			//	hidden: localStorage.role == 'staff',  //用户权限
			text: '删除Build',
			glyph: 0xf068,
			handler: function () {
				Ext.MessageBox.buttonText.yes = '是';
				Ext.MessageBox.buttonText.no = '否';
				var view = me.getView();
				var selection = view.getSelectionModel().getSelection()[0];
				if (selection) {
					Ext.Msg.confirm('确认', '确认删除?', function (choice) {
						if (choice == 'yes') {
							selection.erase();
							me.store.remove(selection);
							me.getView().refresh();
						}
					}, this);
				} else {
					Ext.Msg.alert('注意', '请先选中需要删除的记录！');
				}




			}
		}];
		me.callParent();
	},
	columns: [
		{
			text: "编号",
			dataIndex: "id",
			hidden: true

		}, {
			text: "名称",
			width: 200,
			anchor: '50%',
			dataIndex: "name",

		}, {
			text: "创建时间",
			dataIndex: "created_at",
			width: 200,
			anchor: '50%',
		}],
	listeners: {
		itemdblclick: function (dv, record, item, index, e) {
			if (localStorage.role == 'staff') return;  //用户权限
			var win = Ext.create('casco.view.testing.BuildCreate', { user: record });//这里初始化的什么玩意
			win.down('form').loadRecord(record);
			win.show();
		}
	}
})