
/**
* This class is the controller for the main view for the application. It is
* specified as the "controller" of the Main view class.
*
* TODO - Replace this content of this view to suite the needs of your
* application.
*/
Ext.define('casco.view.vat.VatController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.vat',

	switchProject: function (combo, record) {
		this.redirectTo('project/' + record.get('id'), true);
		location.reload();
	},

	//Vat
	vat: function () {
		this.redirectTo('vat/' + this.getView().project.get('id'), true);
		location.reload();
	},


	manage: function () {
		this.redirectTo('manage', true);
		location.reload();
	},


	editUser: function (combo, record) {
		if (record.get('name') == '1') {
			combo.setValue(combo.emptyText);
			var model = Ext.create('casco.model.User');
			model.setId(JSON.parse(localStorage.user).id);
			casco.model.User.load(JSON.parse(localStorage.user).id, {
				callback: function (record, operation, ops) {
					var win = Ext.create('casco.view.manage.Useredit', { user: record });
					win.down('form').loadRecord(record);//动态填充表单
					win.show();
				}
			});
		} else if (record.get('name') == '2') {

			Ext.Msg.confirm('确认', '确认退出系统?', function (choice) {
				if (choice == 'yes') {
					var me = this;
					var view = this.getView();
					Ext.Ajax.request({
						url: API + 'logout',
						withCredentials: true,
						success: function (response) {
							var d = Ext.decode(response.responseText);
							if (d.code != 0) {
								Ext.Msg.alert('Error', 'Logout failure.');
							} else {
								localStorage.clear();
								var main = location.hash;
								loc = main.match(/^\#([a-z]*).*?$/);//蛋疼，表示project窗口不能销毁
								var parent = (loc[1] == "project") ? "app-main" : loc[1];
								me.getView().up(parent).destroy();
								me.redirectTo('selectProject', true);
								location.reload();
							}
						}//success
					});//request
				}
			}, this);//confirm
		}//else
	},

	testing: function () {
		this.redirectTo('testing/' + this.getView().project.get('id'));
		location.reload();
		return;
		var tabs  = Ext.getCmp('workingpanel')||Ext.getCmp('workpanel');
		var tab = tabs.child('#tab-testing');
		if (!tab) {
			tab = tabs.add({
				id: 'tab-testing',
				xtype: 'test',
				title: '测试',
				closable: true,
				project: this.getView().project
			});
		}
		tabs.setActiveTab(tab);
	},

	matrix: function () {
		this.redirectTo('matrix/' + this.getView().project.get('id'), true);
		location.reload();
	},

	reporting: function () {
		this.redirectTo('report/' + this.getView().project.get('id'), true);
		location.reload();
	},

	project: function () {
		this.redirectTo('project/' + this.getView().project.get('id'), true);
		location.reload();
	}
});
