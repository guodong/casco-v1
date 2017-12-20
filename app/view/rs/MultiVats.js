Ext.define('casco.view.rs.MultiVats', {
	extend: 'Ext.window.Window',
	xtype: 'multivats',
	modal: true,
	title: '批量编辑Vat',
	width: 400,
	initComponent: function () {
		var me = this;
		var parentDocs = Ext.create('Ext.data.Store');
		var vat = Ext.create('casco.store.Vats');
		var version_id = me.version.get && me.version.get('id') || me.version;
		vat.load({
			params: {
				project_id: me.project.get('id'),
				version_id: version_id
			}
		});
		var vats = Ext.create('casco.store.Vats');
		me.items = [{
			xtype: 'form',
			reference: 'multivats',
			bodyPadding: 20,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			}, {
				fieldLabel: 'Vat版本',
				name: 'vat_build_id',
				store: vat,
				region: 'north',
				id: 'vat_build_id',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					select: function (f, r, i) {
						//Ext.getCmp('tmp_id').setValue(r.get('tc_version_id'));
						Ext.getCmp('vat-rs').getStore().setData(r.get('doc_versions'));
					}
				}
			}, {
				hidden: true,
				name: 'tmps',
				id: 'tmp_id',
				xtype: 'textfield',
				editable: false
			}]
		},/*{
			xtype: 'grid',
			id: 'vat-rs',
			region: 'east',
			store: vats,
			selModel: new Ext.selection.CheckboxModel({checkOnly:true}),
			width: 300, //important to avoid layout run failed
			split: true,
		    columns: [{
				text: 'Tc Docs',
				dataIndex: 'name',
				width: 150
			}, {
				text: 'Version',
				dataIndex: 'version_id',
				width: 150,
				renderer: function(v, md, record){
					var versions = record.get('versions');
					if(versions.length == 0) return;
					if(!v){
						record.set('version_id', versions[0].id);
						return versions[0].name;
					}
					for(var i in versions){
						if(v == versions[i].id){
							return versions[i].name;
						}
					}
				},
				editor: {
			        xtype: 'combobox',
			        queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					editable: false
			    }
			}]
		
		},{
			xtype: 'grid',
			id: 'vat-view-rs',
			region: 'center',
			store: vats,
			width: 300,
			selModel: new Ext.selection.CheckboxModel({checkOnly:true}),
			plugins: {
		        ptype: 'cellediting',
		        clicksToEdit: 1,
		        listeners: {
		            beforeedit: function(editor, e) {
		            	console.log(e);
		            	var combo = e.grid.columns[e.colIdx].getEditor(e.record);
		            	var st = Ext.create('casco.store.Versions', {data: e.record.get('versions')});
		            	console.log(st);
		            	combo.setStore(st);
		            }
		        }
		    },
		    columns: [{
				text: 'Rs Docs',
				dataIndex: 'name',
				width: 150
			}, {
				text: 'Version',
				dataIndex: 'version_id',
				flex: 1,
				renderer: function(v, md, record){
					var versions = record.get('versions');
					if(versions.length == 0) return;
					if(!v){
						record.set('version_id', versions[0].id);
						return versions[0].name;
					}
					for(var i in versions){
						if(v == versions[i].id){
							return versions[i].name;
						}
					}
				}
			}]
		}, */ {
			xtype: 'grid',
			id: 'vat-rs',
			region: 'center',
			store: vats,
			height: 400,
			multiSelect: true,
			scrollable: true,
			selModel: new Ext.selection.CheckboxModel({ checkOnly: true }),
			columns: [{
				text: '文档',
				dataIndex: 'document',
				flex: 1,
				renderer: function (v) {
					return v.name;
				}
			}, {
				text: '版本',
				dataIndex: 'name',
				renderer: function (v, md, record) {
					return v;
				}
			}]
		}
		];

		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: '保存',
				glyph: 0xf1c3,
				handler: function () {
					var self = this; var obj = null;
					var form = me.down('form').getForm().getValues();
					var tmp_id = form.tmps;
					var view = me.father.getView();//gridpanel里面的内容好吧
					var selection = view.getSelectionModel().getSelection(); var arrays = [];
					Ext.Array.forEach(selection, function (str, index, array) { //单纯的遍历数组   
						arrays.push(str.get('id'));
					});
					if (arrays.length == 0) {
						Ext.Msg.alert('请先选择Rs');
						return;
					}
					var versions = [];
					versions.push(tmp_id);
					var vat_rs = Ext.getCmp('vat-rs').getView().getSelectionModel().getSelection();
					Ext.Array.forEach(vat_rs, function (str, index, array) { //单纯的遍历数组    
						versions.push(str.get('id'));
					});
					Ext.Ajax.request({
						url: API + 'rs/multivats',
						method: 'post',
						jsonData: { rs: arrays, versions: versions },
						callback: function () {
							me.destroy();
							me.father.store.reload();
							Ext.Msg.alert('成功', '保存成功。');
						}
					});//ajax

				}
			}, {
					text: '取消',
					glyph: 0xf112,
					scope: me,
					handler: function () {
						me.destroy();
					}
				}]
		}];

		me.callParent();
	}
});