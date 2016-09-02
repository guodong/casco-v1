Ext.define('casco.view.rs.MultiVats', {
	extend: 'Ext.window.Window',
	xtype: 'multivats',
	modal: true,
	title: '批量编辑VAT',
	height: 380,
	width: 400,
	initComponent: function() {
		var me = this;
		var parentDocs = Ext.create('Ext.data.Store');
		var vat = Ext.create('casco.store.Vats');
		vat.load({
			params: {
				project_id: me.project.get('id')
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
			},{
				fieldLabel: 'Vat Version',
				name: 'vat_build_id',
				store: vat,
				id: 'vat_build_id',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					select: function(f, r, i){
						//console.log(r.get('tc_version_id'));
						Ext.getCmp('vat_tc').setValue(r.get('tc_version').document.name+':'+r.get('tc_version').name);
						Ext.getCmp('tmp_id').setValue(r.get('tc_version_id'));
						Ext.getCmp('vat-rs').getStore().setData(r.get('rs_versions'));
					}
				}
			},{	
				fieldLabel: 'Tc Version',
				name: 'tc_version_name',
				msgTarget: 'under',
				id:'vat_tc',
				xtype: 'textfield',
				editable: false
			},{ 
				hidden:true,
				name: 'tmps',
				id:'tmp_id',
				xtype: 'textfield',
				editable: false
			}]
		},  {
			xtype: 'grid',
			id: 'vat-rs',
			region: 'center',
			store: vats,
			selModel: new Ext.selection.CheckboxModel({checkOnly:true}),
		    columns: [{
				text: 'Rs doc',
				dataIndex: 'document',
				flex: 1,
				renderer: function(v) {
				return v.name;
				}
			},{
				text: 'Version',
				dataIndex: 'name',
				renderer: function(v, md, record){
				return v;
				}
			}]
		}];
		
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: 'Save',
				glyph: 0xf1c3,
				handler: function(){
					var self = this;var obj=null;
					var form = me.down('form').getForm().getValues();
					var tmp_id=form.tmps;
					var view = me.father.getView();//gridpanel里面的内容好吧
					var selection=view.getSelectionModel().getSelection();var arrays=[];
					Ext.Array.forEach(selection,function(str,index,array){ //单纯的遍历数组   
						arrays.push(str.get('id'));
					}); 
					if(arrays.length==0){
						Ext.Msg.alert('请先选择Rs');
						return;
					}
					var versions=[];//console.log(tmp_id);
					versions.push(tmp_id);
					var vat_rs=Ext.getCmp('vat-rs').getView().getSelectionModel().getSelection();
					Ext.Array.forEach(vat_rs,function(str,index,array){ //单纯的遍历数组    
						versions.push(str.get('id'));
					}); 
					Ext.Ajax.request({
					url: API + 'rs/multivats',
					method: 'post',
					jsonData: {rs:arrays,versions:versions},
					callback: function(){
						me.destroy();
						me.father.store.reload();
						Ext.Msg.alert('Success', 'Saved successfully.');
					}
					});//ajax

				}
			}, {
				text: 'Cancel',
				glyph: 0xf112,
				scope: me,
				handler: function(){
					me.destroy();
				}
			}]
		}];

		me.callParent();
	}
});