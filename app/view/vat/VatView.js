
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
	plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1,
        listeners: {
            beforeedit: function(editor, e) {
            	var combo = e.grid.columns[e.colIdx].getEditor();
            	console.log(e);
            	var tcdocs = [];
            	var doc_vers = e.record.get('doc_versions');
				doc_vers.forEach(function(value,index,arr){
					if(value.document.type == 'tc'){
//						value.vat_build_id = e.record.id;
						tcdocs.push(value);
					}
				});
            	var st = Ext.create('casco.store.Versions', {data: tcdocs,});
            	console.log(st);
            	combo.setStore(st);
            }
        }
    },
	
    initComponent: function(){
    	var me = this;
    	me.store = new casco.store.Vats();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id'),
    		}
    	});
//    	console.log(me.store.getData().items);
    	var tcdocs_store = Ext.create('Ext.data.Store',{
    		loading: true,
			fields: ['tc_version_id','tc_doc'],
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
			text : 'Name',
			dataIndex: 'name'
		},{
			text: 'Description',
			dataIndex: 'description'
		}, {
			text: 'Doc Version',
			dataIndex: 'doc_versions',
			flex: 1,
			renderer: function(value,metadata,record){ //value-rs_versions(current cell); metadata-cell metadata; record-Ext.data.Model
				return getPreview(value,metadata,record);
			}
		}, {
			text: 'Created At',
			dataIndex: 'created_at',
			width: 150
		},{
			text:'Choose TC',
//			dataIndex:'id',
			width:150,
			editor: {
		        xtype: 'combobox',
		        queryMode: 'local',
				displayField: 'document.name',
				valueField: 'id',
//				vat_build_id: 'vat_build_id',
				editable: false,
				emptyText: 'Choose TC',
				listeners: {
					select: function(combo,rec){
						console.log(rec.get('pivot'));

//						console.log(rec);
						var tab_json=[];
						var vatres = Ext.create('casco.store.VatRelations');
						vatres.load({
							params: {
								vat_build_id: rec.get('pivot').vat_build_id,
								tc_version_id: rec.get('pivot').doc_version_id,
							}
						});
						vatres.on('load',function(){ //Store加载
							var vatres_data = vatres.getData().items[0];
							var val_id = vatres_data.get('vat_build_id');
							var tcdoc_name = vatres_data.get('tc_doc_name');
							var tcdoc_version = vatres_data.get('tc_version_id');
							console.log(tcdoc_version);
							console.log(vatres_data.get('vat_build_id'));
							if(vatres_data.get('parent_vat')!=[]){
								var tmps=[];
								Ext.Array.each(vatres_data.get('parent_vat'),function(v){
//									console.log(v);
									var tmp={
										'xtype': 'tc_vat_relations',
//										'title': v[0].rs_doc_name+'_'+vatres_data.data.vat_build_name,
										'title': v[0].rs_doc_name,
										'id': 'vatrelations-p'+val_id+v[0].rs_version_id,
										'relations': v,
										'vatbuild_id': val_id,
										'tc_version_id': tcdoc_version,
										'rs_version_id': v[0].rs_version_id,
										'closable': true,
									};
									tmps.push(tmp);
								});
								tab_json.push({title:tcdoc_name+'_本阶段分配给其他阶段的', xtype: 'tabpanel',items:tmps,'closable':true});
							}
							if(vatres_data.get('vat_tc')!=[]){
								var tmps=[];
								Ext.Array.each(vatres_data.get('vat_tc'),function(v){
//									console.log(v[0].rs_doc_name);
									var tmp={
										'xtype': 'vat_tc_relations',
//										'title': v[0].rs_doc_name+'_'+vatres_data.data.vat_build_name,
										'title': v[0].rs_doc_name,
										'id': 'vatrelations'+val_id+v[0].rs_version_id,
										'relations': v,
										'vatbuild_id': val_id,
										'tc_version_id': tcdoc_version,
										'rs_version_id': v[0].rs_version_id,
										'closable': true
									};
									tmps.push(tmp);
								});
								tab_json.push({title:tcdoc_name+'_其他阶段分配给本阶段的', xtype: 'tabpanel',items:tmps,'closable':true});
							}
							
							var create_tab=function(record){ //写个递归方便多了啊
								if(!record) return;
								  if(Array.isArray(record)){
									   Ext.Array.each(record,function(name,index){create_tab(name)});
								   }else{
									   var tabs= Ext.getCmp('vatpanel');
									   var tab=tabs.child('#'+record.id);
//									   console.log(record.id);
									   if(!tab)tab=tabs.add(record);
									   tabs.setActiveTab(tab);
							   		}
							  }
						       create_tab(tab_json);
						});
					
						
						
					}
				}
		    }
		
		},{
			text: 'Export Vats',
			
		}];
		
//		me.tbar = [{
//			text: 'Export Relations',
//			glyph: 0xf1c3,
//			scope: this,
//			hidden: true,
//			handler: function(){
//				var win=Ext.create('widget.vat.twowayrelation',{
//					project: me.project,
//				});
//				win.show();
//			}
//		},'-',{
//			xtype: 'combobox',
//			displayField: 'value',
//			valueField: 'id',
//			emptyText: 'Export Vats',
//			queryModel: 'local',
//			editable: false,
//			store: Ext.create('Ext.data.Store',{
//				fields: ['id', 'value'],
//				data: [{'id':'Assign', 'value':'本阶段分配给其他阶段的'},
//				       {'id':'Assigned', 'value':'其他阶段分配给本阶段的'}]
//			}),
//			listeners:{
//				select: function(combo,rd){
//					switch(rd.id){
//					case 'Assign':
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
//					case 'Assigned':
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
////					case 'All':
////						var view=me.getView();
////						var selection =view.getSelectionModel().getSelection()[0];
////						if (!selection) {
////						 Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择VAT版本 !</b></div>');
////						 combo.clearValue();
////				         return;
////						}
////			            window.open(API+'vat/export_all?vat_build_id='+selection.get('id')+'&type='+rd.id);
////						combo.setValue(combo.emptyText);
////						break;
//					default:
//						break;
//					}
//				}
//			}
//		}];
		
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