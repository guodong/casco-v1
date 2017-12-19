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
			text: 'Doc Version',
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
			text: '创建 Vat',
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
			text: '删除 Vat',
			glyph: 0xf068,
			scope: this,
			handler: function() {
				Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){   //confirm
					if(choice == 'yes'){
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (selection) {
							me.store.remove(selection);
							selection.erase();
							//view.refresh();
						}
					}}, this);
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
    }
})