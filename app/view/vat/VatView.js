
Ext.define('casco.view.vat.VatView',{
	extend: 'Ext.grid.Panel',
	xtype: 'vat.view',
	viewModel: 'vat',
	requires: ['casco.store.Vats',
	           'casco.view.vat.VatRelations',
	           'Ext.grid.filters.Filters'], //Needed
	
//    bodyPadding: 0,
	forceFit:true,
	columnLines: true,
	
    initComponent: function(){
    	var me = this;
    	var p_id=me.id;
    	me.store = new casco.store.Vats();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id'),
				document_id:me.document.data.id
    		}
    	});
		
		var chioces = Ext.create('Ext.data.Store', {
		fields: ['abbr', 'name'],
		data : [
		    {"abbr":"all", "name":"ALL"},
			{"abbr":"forward","name":"TC-RS"},
			{"abbr":"backward", "name":"RS-TC"}
		]
		});
		
		me.columns = [{
			text : 'name',
			dataIndex: 'name'
		},{
			text: 'description',
			dataIndex: 'description'
		},{
			text : 'tc',
			dataIndex : 'tc_version',
			renderer : function(v) {
				return v?v.document.name:'';
			}
		}, {
			text : 'tc version',
			dataIndex : 'tc_version',
			renderer : function(v) {
				return v?v.name:'';
			}
		}, {
			text: 'rs:version',
			dataIndex: 'rs_versions',
			flex: 1,
			renderer: function(value,metadata,record){ //value-rs_versions(current cell); metadata-cell metadata; record-Ext.data.Model
				return getPreview(value,metadata,record);
			}
		}, {
			text: 'created at',
			dataIndex: 'created_at',
			width: 150
		},{
			text:'view',
			dataIndex:'id',
			width:130,
			renderer:function(val_id,metaData,rec){ //data value from current cell,column_cell,vat_build_data
			 var id = Ext.id();
             Ext.defer(function(e) {	//延迟调用 miliseconds
               	Ext.create('Ext.button.Button', {
				text: 'Show Relation',
				renderTo: id,
				handler: function(){
					var tabs = Ext.getCmp('vatpanel');
					console.log(tabs);
					var tab = tabs.child('#vatrelations'+val_id); 
					console.log(rec);
					if(!tab) tab = tabs.add({
						xtype: 'vatrelations',
						title: rec.get('tc_version').document.name + '-' +rec.data.name,
						id: 'vatrelations'+val_id,
					    relation: rec,
					    closable: true
					});
					console.log(tab);
					tabs.setActiveTab('vatrelations'+val_id);
				},
				});   
            }, 50);
            return Ext.String.format('<div style="color:0xf0ce" id="{0}" ></div>', id);
			}//renderer
		}];
		
		me.tbar = [{
			text: 'Create Vat',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var vv = Ext.create('casco.model.Vat',{
					id: null
				});
				var win = Ext.create('widget.vat.vatcreate', {
					project: me.project,
					document: me.document,
					p_id:p_id?p_id:'',
					vat: vv
				});
				win.down('form').loadRecord(vv);
				win.show();
			}
		},{
			text: 'Delete Vat',
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
//			tmp.push("RS文档版本信息：");
			var rsvs = record.data.rs_versions;
			for(var i in rsvs){
				var str = "["+rsvs[i].document.name + "-" + rsvs[i].name+"]";
				tmp.push(str);
			}
			var value = tmp.join('  ');
		    metadata.tdAttr = 'data-qtip="' + "RS文档信息:  <br/>"+value + '"' ; //提示信息
		    return value;
		};
		
    	this.callParent();
    }
})