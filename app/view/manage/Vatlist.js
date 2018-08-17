Ext.define('casco.view.manage.Vatlist',{
	extend: 'Ext.grid.Panel',
	requires: ['casco.store.Vats'], //Needed
	xtype: 'vatlist',
	id: 'vat_list',
	modal: true,
	maximizable: true,
	resizable: true,
	forceFit:true,
	columnLines: true,
	
    initComponent: function(){
    	var me = this;
    	me.store = new casco.store.Vats();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id'),
    		}
    	});
		
		me.columns = [{
			text : '名称',
			dataIndex: 'name',
			width: 150
		},{
			text: '描述',
			dataIndex: 'description',
			width: 250
		}, {
			text: '文档版本',
			dataIndex: 'doc_versions',
			flex: 1,
			renderer: function(value,metadata,record){ //value-rs_versions(current cell); metadata-cell metadata; record-Ext.data.Model
				return getPreview(value,metadata,record);
			}
		}, {
			text: '创建时间',
			dataIndex: 'created_at',
			width: 150
		}];
		
		me.tbar = [{
			text: '创建定版',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var vv = Ext.create('casco.model.Vat',{
					id: null
				});
				var win = Ext.create('widget.vat.vatcreate', {
					project: me.project,
					vat: vv
				});
				win.down('form').loadRecord(vv);
				win.show();
			}
		},'-',{
			text: '删除定版',
			glyph: 0xf068,
			scope: this,
			handler: function() {
				Ext.MessageBox.buttonText.yes = '是';
				Ext.MessageBox.buttonText.no = '否';
				var view=me.getView();
				var selection =view.getSelectionModel().getSelection()[0];
				if(selection){
					Ext.Msg.confirm('确认', '确认删除?', function(choice){   //confirm
						if(choice == 'yes'){
								me.store.remove(selection);
								selection.erase();
								//view.refresh();
						}}, this);
				}else{
					Ext.Msg.alert('注意','请先选中需要删除的定版！');
				}
			
			}
		}];
		
		function getPreview(value,metadata,record){ //record-rsversions
			var tmp = [];
			var docvs = record.data.doc_versions;
			for(var i in docvs){
				var str = "["+docvs[i].document.name + "-" + docvs[i].name+"]";
				tmp.push(str);
			}
			var value = tmp.join('  ');
			if(value){
				metadata.tdAttr = 'data-qtip="' + "文档版本信息:  <br/>"+value + '"' ; //提示信息
			}
		    return value;
		};
		
    	this.callParent();
	},
	listeners: {
		itemdblclick: function (dv, record, item, index, e) {
			
			if (localStorage.role == 'staff') return;  //用户权限
			var win = Ext.create('casco.view.manage.VatCreate', { user: record,
				status: 1,
				vat: record,
				pointer: this,
				project: this.project,
				columns: this.columns
			 });//这里初始化的什么玩意
			win.down('form').loadRecord(record);
			win.show();
		}
	}
})