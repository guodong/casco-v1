
Ext.define('casco.view.vat.VatView',{
	extend: 'Ext.grid.Panel',
	xtype: 'vat.view',
	viewModel: 'vat',
	requires: ['casco.store.Vats'
//	           'Ext.grid.filters.Filters'
	           ], //Needed
	
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
//					console.log(rec);
					var tab_json=[];
					var vatres = Ext.create('casco.store.VatRelations');
					vatres.load({
						params: {
							vat_build_id: val_id
						}
					});
					vatres.on('load',function(){ //Store加载
						var vatres_data = vatres.getData().items[0];
//						console.log(vatres_data.get('vat_tc'));
						if(vatres_data.get('parent_vat')!=[]){
							var tmps=[];
							Ext.Array.each(vatres_data.get('parent_vat'),function(v){
//								console.log(v);
								var tmp={
									'xtype': 'tc_vat_relations',
//									'title': v[0].rs_doc_name+'_'+vatres_data.data.vat_build_name,
									'title': v[0].rs_doc_name,
									'id': 'vatrelations-p'+val_id+v[0].rs_version_id,
									'relations': v,
									'vatbuild_id': val_id,
									'rs_version_id': v[0].rs_version_id,
									'closable': true,
								};
								tmps.push(tmp);
							});
							tab_json.push({title:'本阶段分配给其他阶段的', xtype: 'tabpanel',items:tmps,'closable':true});
						}
						if(vatres_data.get('vat_tc')!=[]){
							var tmps=[];
							Ext.Array.each(vatres_data.get('vat_tc'),function(v){
//								console.log(v[0].rs_doc_name);
								var tmp={
									'xtype': 'vat_tc_relations',
//									'title': v[0].rs_doc_name+'_'+vatres_data.data.vat_build_name,
									'title': v[0].rs_doc_name,
									'id': 'vatrelations'+val_id+v[0].rs_version_id,
									'relations': v,
									'vatbuild_id': val_id,
									'rs_version_id': v[0].rs_version_id,
									'closable': true
								};
								tmps.push(tmp);
							});
							tab_json.push({title:'其他阶段分配给本阶段的', xtype: 'tabpanel',items:tmps,'closable':true});
						}
						
						var create_tab=function(record){ //写个递归方便多了啊
							if(!record) return;
							  if(Array.isArray(record)){
								   Ext.Array.each(record,function(name,index){create_tab(name)});
							   }else{
								   var tabs= Ext.getCmp('vatpanel');
								   var tab=tabs.child('#'+record.id);
//								   console.log(record.id);
								   if(!tab)tab=tabs.add(record);
								   tabs.setActiveTab(tab);
						   		}
						  }
					       create_tab(tab_json);
					});
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
		},'-',{
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
		},'-',{
			text: 'Export Relations',
			glyph: 0xf1c3,
			scope: this,
			handler: function(){
				var win=Ext.create('widget.vat.twowayrelation',{
					project: me.project,
				});
				win.show();
			}
		},'-',{
			xtype: 'combobox',
			displayField: 'value',
			valueField: 'id',
			emptyText: 'Export Vats',
			queryModel: 'local',
			editable: false,
			store: Ext.create('Ext.data.Store',{
				fields: ['id', 'value'],
				data: [{'id':'Assign', 'value':'本阶段分配给其他阶段的'},
				       {'id':'Assigned', 'value':'其他阶段分配给本阶段的'}]
			}),
			listeners:{
				select: function(combo,rd){
					switch(rd.id){
					case 'Assign':
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (!selection) {
						 Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择VAT版本 !</b></div>');
						 combo.clearValue();
				         return;
						}
			            window.open(API+'vat/export_all?vat_build_id='+selection.get('id')+'&type='+rd.id);
						combo.setValue(combo.emptyText);
						break;
					case 'Assigned':
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (!selection) {
						 Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择VAT版本 !</b></div>');
						 combo.clearValue();
				         return;
						}
			            window.open(API+'vat/export_all?vat_build_id='+selection.get('id')+'&type='+rd.id);
						combo.setValue(combo.emptyText);
						break;
//					case 'All':
//						var view=me.getView();
//						var selection =view.getSelectionModel().getSelection()[0];
//						if (!selection) {
//						 Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择VAT版本 !</b></div>');
//						 combo.clearValue();
//				         return;
//						}
//			            window.open(API+'vat/export_all?vat_build_id='+selection.get('id')+'&type='+rd.id);
//						combo.setValue(combo.emptyText);
//						break;
					default:
						break;
					}
				}
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