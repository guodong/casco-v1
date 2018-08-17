//151105 
Ext.define('casco.view.manage.ManageController', {
	extend: 'Ext.app.ViewController',
	requires: [
		'casco.view.manage.Userlist'
	],
	alias: 'controller.manage',
	onLogout: function () {
		Ext.Msg.confirm('确认', '确认退出系统?', function (choice) {
			if (choice === 'yes') {
				localStorage.removeItem('uid');
				this.getView().destroy();
				Ext.widget('login');
			}
		}, this);
	},

	//Vat Build Create
	createVat: function () {
		var form = this.lookupReference('vat_view_create_form');
		var meta = form.getValues(); //vatbuild_info
		var rsvsd = Ext.getCmp('vat-view-rs').getStore(); //RS info
		var tcvsd = Ext.getCmp('vat-view-tc').getStore();
		var docvs = [];
		rsvsd.each(function (v) {
			var obj = {
				doc_document_id: v.get('id'),
				doc_version_id: v.get('version_id'),
				doc_type: 'rs',
			}
			docvs.push(obj);//放入的是一个对象啊
		});
		tcvsd.each(function (v) {
			var obj = {
				doc_document_id: v.get('id'),
				doc_version_id: v.get('version_id'),
				doc_type: 'tc',
			}
			docvs.push(obj);//放入的是一个对象啊
		});
		meta.doc_versions = docvs;
		var vat = Ext.create('casco.model.Vat', meta);
		vat.save({
			callback: function (record, operation) {
				if (record.data) {
					var vatlist = Ext.getCmp('vat_list');
					vatlist.store.reload();
					Ext.Msg.alert('提示', '创建成功。');
					//Ext.getCmp('joblist').store.insert(0, job);//添加入数据的方式
				} else {
					Ext.Msg.alert('创建失败!', JSON.stringify(record.data.data));
				}
				Ext.getCmp('vat-view-create-window').destroy();
			}//callback
		});
	},
	saveVat: function () {
		var view = this.getView();
		var form = this.lookupReference('vat_view_create_form');
		var meta = form.getValues(); //vatbuild_info
		var rsvsd = Ext.getCmp('vat-view-rs').getStore(); //RS info
		var tcvsd = Ext.getCmp('vat-view-tc').getStore();
		var docvs = [];
		rsvsd.each(function (v) {
			var obj = {
				doc_document_id: v.get('id'),
				doc_version_id: v.get('version_id'),
				doc_type: 'rs',
			}
			docvs.push(obj);//放入的是一个对象啊
		});
		tcvsd.each(function (v) {
			var obj = {
				doc_document_id: v.get('id'),
				doc_version_id: v.get('version_id'),
				doc_type: 'tc',
			}
			docvs.push(obj);//放入的是一个对象啊
		});
		meta.doc_versions = docvs;
		var vat = view.vat;
		vat.set(form.getValues());
		vat.save({
			callback: function (record, operation) {
				if (record.data) {
					var vatlist = Ext.getCmp('vat_list');
					vatlist.store.reload();
					Ext.Msg.alert('提示', '保存成功。');
					//Ext.getCmp('joblist').store.insert(0, job);//添加入数据的方式
				} else {
					Ext.Msg.alert('保存失败!', JSON.stringify(record.data.data));
				}
				Ext.getCmp('vat-view-create-window').destroy();
			}//callback
		});
	},
	//用户管理
	createuser: function () {
		var view = this.getView();
		var self = this;
		var form = this.lookupReference('useraddform');	 //获取对应的form表单
		var isCreate = !(view && view.user && view.user.id);
		var user = view.user ? view.user : Ext.create('casco.model.User');
		user.set(form.getValues());
		Ext.MessageBox.buttonText.ok = '确认';
		var message = isCreate ? '用户创建成功。' : '用户更新成功。';
		user.save({
			callback: function () {
				Ext.Msg.alert('提示', message, function () {
					//更新
					var t = Ext.ComponentQuery.query("#tab-userlist")[0];	//Array[0]
					//if(!view.user)t.store.add(user);//edit 就不对了的
					if (t) t.store.reload();
					Ext.ComponentQuery.query("#switcher")[0] && Ext.ComponentQuery.query("#switcher")[0].store.reload();
					form.up("window").destroy();
				});
			}
		});
	},

	createFolder: function () {//build
		var view = this.getView();
		var self = this;
		var operation = view.build  ? '更新' : '创建';
		var form = this.lookupReference('build_create_form');//获取对应的form表单
		var build = view.build ? view.build : Ext.create('casco.model.Build');
		build.set(form.getValues());
		build.save({
			callback: function () {
				Ext.Msg.alert('提示',operation + '成功。', function () {
					var t = Ext.ComponentQuery.query("#build_list")[0];
					if (!view.user) t.store.add(build);
					form.up("window").destroy();
				});
			}
		});
	},

	createmethod: function () {
		var view = this.getView();
		var self = this;
		var form = this.lookupReference('methodaddform');
		var method = view.method ? view.method : Ext.create('casco.model.Testmethod');
		method.set(form.getValues());
		Ext.MessageBox.buttonText.ok = '确认';
		method.save({
			callback: function () {
				Ext.Msg.alert('提示', '测试方法已更新。', function () {
					var t = Ext.ComponentQuery.query("#tab-testmethod")[0];//基于属性ID进行检索
					if (!view.method) t.store.add(method);
					form.up("window").destroy();//销毁整个窗口
				});
			}
		});
	},

	createProject: function () {
		var view = this.getView();
		var project = view.project ? view.project : Ext.create('casco.model.Project');
		var form = view.down('form');
		var data = form.getValues(); //提交的数据,没有name的需要手动添加进入表单么？
		console.log(view);

		data.document_id = view.document_id;
		data.vatstrs = [];
		view.vatstrs.each(function (s) {
			data.vatstrs.push({
				id: s.data.id,
				name: s.data.name
			});
		});
		data.participants = [];
		view.participants.each(function (s) {
			data.participants.push(s.getData());
		});
		project.set(data);
		project.save({
			callback: function () {
				form.up("window").destroy();
				var t = Ext.ComponentQuery.query("#tab-projectlist")[0];
				t.store.reload();
				//最好再刷新一下user,不然userlist那边store仍然没改变
				var u = Ext.ComponentQuery.query("#tab-userlist")[0];
				if (u) { u.store.reload(); }
			}
		});
	},
	createDocument: function () {
		var view = this.getView();
		var self = this;
		var form = this.lookupReference('documentaddform');//获取对应的form表单
		var doc = view.doc ? view.doc : Ext.create('casco.model.Document');
		doc.set(form.getValues());
		doc.save({
			callback: function () {
				Ext.Msg.alert('提示', '文档保存成功。', function () {
					form.up("window").destroy();
					//重新刷新左边的树的结构
					var t = Ext.ComponentQuery.query("#mtree")[0];
					t.store.reload();

				});
			}
		});
	},
	buildCtxMenu: function () {
		return Ext.create('Ext.menu.Menu', {
			items: [{
				itemId: 'add',
				handler: 'onAdd',
			},
			{
				itemId: 'edit',
				handler: 'onEdit'
			},
			{
				itemId: 'delete',
				handler: 'onDelete'
			}
			]
		});
	},
	onConfirmDelete: function (answer, value, cfg, button) {
		if (answer != 'yes') return;
		var menu = button.up(), node = menu.treeNode;
		if (!node.id || node.id.indexOf('extModel') == 0) {
			node.remove(true);
			return;
		}
		node.getOwnerTree().setLoading(true, node);
		var model = new casco.model.Document({ id: node.id });
		model.erase({
			waitMsg: '正在删除...',
			success: function (record, operation) {
				//Ext.Msg.alert('提示', '删除成功!');
				node.getOwnerTree().setLoading(false, node);
				node.remove(true);
			},
		});



	},

	onDelete: function (button) {

		Ext.MessageBox.buttonText.yes = '是';
		Ext.MessageBox.buttonText.no = '否';
		var callback = Ext.bind(this.onConfirmDelete, undefined, [button], true);
		Ext.Msg.confirm(
			'确认',
			'确认删除此节点?', callback);
	},
	onAdd: function (button) {
		console.log(button.itemId);
		//console.log(Ext.getCmp('mtree').project.get('id'));
		var mark = button.itemId;
		var global = this;
		var type; var text;
		var menu = button.up().up(), node = menu ? menu.treeNode : '', view = menu ? menu.treeView : '', delay = view.expandDuration + 50, newNode, doCreate;
		switch (mark) {
			case 'edit_verisons'://Edit versions
				console.log(button.up().treeNode.id);
				var win = Ext.create('casco.view.manage.Versions', { 'document_id': button.up().treeNode.id }); win.show();
				return;
			case 'add_rs':
				type = 'rs'; text = 'New RS Document'; break;
			case 'add_tc':
				type = 'tc'; text = 'New TC Document'; break;
			case 'add_folder':
				type = 'folder'; text = 'New folder'; break;
			default://type='rs';text='New RS Document';
		}
		//console.log(button.up().up().treeView);
		var menu = button.up().up();
		if (!menu || !menu.treeNode || !menu.treeView) {
			return;
		}
		var node = menu.treeNode;
		var view = menu.treeView;
		var delay = view.expandDuration + 50;
		var newNode = null;

		var doCreate = function () {
			//console.log(location.hash.substring(location.hash.lastIndexOf('/')+1));
			newNode = node.appendChild({
				name: text,
				type: type,
				fid: node.id,
				project_id: Ext.getCmp('mtree').project.get('id'),
				leaf: (type != 'folder')
			});
		}
		if (!node.isExpanded()) {
			Ext.Msg.alert('提示', '请先展开目录。');
			//node.expand(false, Ext.callback(this.doCreate, this, [], delay));
			// node.expand(false, function () {
			// 	Ext.Msg.alert('提示', '目录已展开，请重新添加。');
			// });

		} else {
			doCreate();
		}
	},
	onCtxMenu: function (view, record, element, index, evtObj) {
		view.select(record);
		evtObj.stopEvent();
		if (!this.ctxMenu) {
			this.ctxMenu = this.buildCtxMenu();
		}

		this.ctxMenu.treeNode = record;
		this.ctxMenu.treeEle = element;
		this.ctxMenu.treeView = view;
		var ctxMenu = this.ctxMenu;
		var addItem = ctxMenu.getComponent('add');
		var editItem = ctxMenu.getComponent('edit');
		var deleteItem = ctxMenu.getComponent('delete');
		if (record.isRoot() || record.parentNode.isRoot()) {
			editItem.setVisible(false);
			deleteItem.setVisible(false);
		} else {
			editItem.setVisible(true);
			deleteItem.setVisible(true);
		}
		if (!record.isLeaf()) {
			addItem.setText('添加');
			addItem.itemId = null;
			addItem.treeNode = record;
			addItem.treeView = view;
			addItem.treeEle = element;
			addItem.setMenu({
				items: [{
					text: '添加需求文档',
					itemId: 'add_rs',
					handler: 'onAdd'
				},
				{
					text: '添加测试文档',
					itemId: 'add_tc',
					handler: 'onAdd'
				},
				{
					text: '添加目录',
					itemId: 'add_folder',
					handler: 'onAdd'
				}]
			});
			deleteItem.setText('删除目录');
			editItem.setText('编辑目录');
			addItem.enable();
			deleteItem.enable();
			editItem.enable();
		} else {
			addItem.setText('编辑版本');
			addItem.itemId = 'edit_verisons';
			addItem.setMenu(null, true);//此处为引用
			deleteItem.setText('删除文档');
			editItem.setText('编辑文档');
			addItem.enable();
			deleteItem.enable();
			editItem.enable();
		}
		ctxMenu.showAt(evtObj.getXY());
	},
	onEdit: function (button, node) {
		var me = this;
		var menu = button.up(),
			node = menu.treeNode || node,
			view = menu.treeView,
			tree = view.ownerCt,
			selMdl = view.getSelectionModel(),
			colHdr = tree.headerCt.getHeaderAtIndex(0);
		if (selMdl.getCurrentPositon) {
			pos = selMdl.getCurrentPosition();
			colHdr = tree.headerCt.getHeaderAtIndex(pos.column);
		}
		//console.log(node,colHdr);
		var editor = new Ext.Editor({
			updateEl: true,
			alignment: 'l-l',
			autoSize: {
				width: '20'
			},
			field: {
				xtype: 'textfield'
			}
		});
		console.log(Ext.get(menu.treeEle).query('span'));
		node.getOwnerTree().setLoading(true, node);

		editor.startEdit(Ext.get(menu.treeEle).query('span')[0]);
		editor.on('complete', function (this_g, value, startValue, eOpts) {
			console.log(node);
			node.set('name', value);
			var id;
			re = /^(([a-z]|[0-9])*-*){3,}([a-z]|[0-9])*$/g;
			if (re.test(node.id)) {
				id = node.id ? node.id : '';
			}
			var model = id ? new casco.model.Document({ id: id }) : new casco.model.Document();
			model.set(node.getData());
			model.set('name', value);
			model.save({
				callback: function (record, operation, success) {
					node.setId(record.get('id'));
					node.getOwnerTree().setLoading(false, node);
					//Ext.Msg.alert('提示', '保存成功。');
					//console.log( Ext.getCmp('draw'));
					// Ext.getCmp('draw').items;
					//Ext.getCmp('mtree').getStore().reload();
					// Ext.getCmp('mtree').reconfigure();
				}
			});
		});
	},
	seldoc: function (view, record, item, index, e, eOpts) {//only leaf can  be listened
		var json = record.data;
		if (!record.data.leaf) return;
		var tabs = this.lookupReference('main');
		//		console.log(json.id);
		if (json.id == 'userlist'
			&& JSON.parse(localStorage.user).role_id != 1) {
			Ext.Msg.alert('提示', '您没有权限查看此信息,请联系管理员!'); return;
		}

		var tab = tabs.child('#tab-' + json.id);
		if (!tab) {
			tab = tabs.add({
				itemId: 'tab-' + json.id,
				id: 'tab-' + json.id,
				xtype: json.id,//这个是存在的
				title: json.text,
				closable: true
			});
		}

		tabs.setActiveTab(tab);
	},
	save_userdocs: function () {


		function child_checked(node) {//判断是否有选中的子节点

			var flag = false;
			node.eachChild(function (rec) {
				if (rec.checked == 'checked') {
					flag = true;
				}
				rec.eachChild(function (last) {
					if (last.checked == 'checked') {
						flag = true;
					}

				});

			});
			// console.log(node.data.text+':'+flag);
			return flag;
		};


		var form = this.lookupReference('prosuserform');

		var json = {};
		var a = Ext.getCmp('doc_tree').getRootNode();
		var all_check = Ext.getCmp('doc_tree').getChecked();
		//	 console.log(all_check);

		//先进行无值的project处理
		for (var i = 0; i < a.childNodes.length; i++) {//第一层必定是工程节点,顶多三层

			if (!child_checked(a.childNodes[i])) {

				json[a.childNodes[i].data.id] = null;

			}
			continue;
		}
		//有值的project处理
		all_check.forEach(function (node) {
			if ((node.data.type == 'folder' || node.data.type == 'doc') && node.parentNode.data.type == 'project') {
				json[node.parentNode.data.id] = json[node.parentNode.data.id] ? json[node.parentNode.data.id] += (',' + node.data.doc_id) : node.data.doc_id;
				// console.log(json[node.parentNode.data.id]);
			} else if (node.data.type == 'doc' && node.parentNode.data.type == 'folder') {
				json[node.parentNode.parentNode.data.id] = json[node.parentNode.parentNode.data.id] ? json[node.parentNode.parentNode.data.id] += (',' + node.data.doc_id) : node.data.doc_id;
				// console.log(json[node.parentNode.parentNode.data.id]);
			}

		});
		//	 console.log(json);
		Ext.Ajax.request({
			url: API + 'tree/poweredit',
			method: 'post',
			jsonData: {
				data: json,
				user_id: Ext.getCmp('userdocs').user.get('id')
			},
			success: function () {
				Ext.Msg.alert('提示', '保存成功。');
				form.up("window").destroy();
			}
		});
	}//save


});