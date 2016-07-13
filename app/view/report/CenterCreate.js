Ext.define('casco.view.report.CenterCreate', {
	extend: 'Ext.window.Window',
	xtype: 'report.create',

	modal: true,
	title: 'Create Center Report Job',
	id: 'ver-create-window',
	controller: 'report',
	layout: {
		type: 'border'
	},
	height: 400,
	 width: 900,
	 
	initComponent: function() {
		var me = this;
		var p_id=me.p_id?me.p_id:'';
		var rsdocs = Ext.create('casco.store.Documents');
		var result_store=Ext.create('Ext.data.Store', {
			 model: 'Ext.data.Model',
			 proxy: {
				 type: 'rest',
				 url: API+'center/results',
				 reader: {
					 type: 'json',	
				 }
			 }
			});
		//console.log(me.project.get('id'),me.child_doc.data.id);
		result_store.reload({
			params:{
			  tc_id:me.child_doc.data.id?me.child_doc.data.id:'',
			  project_id:me.project.get('id')
			}
			});
		me.items = [{
			xtype: 'form',
			region: 'west',
			split: true,
			reference: 'ver_create_form',
			bodyPadding: '10',
			width: 300,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			}, {
				fieldLabel: 'Version',
				msgTarget: 'under',
				name: 'version',
				xtype: 'textfield'
			},{
				fieldLabel: 'description',
				labelAlign:'top',
				name: 'description',
				xtype: 'textarea',
				flex:1,
				anchor :'100%'
		}]
		},{
			xtype: 'grid',
			id: 'testing_item',
			region: 'center',
			forceFit: 'true',
			store: result_store,
			selModel: {
				selType: 'checkboxmodel',
				checkOnly: true
			},
			plugins: {
		        ptype: 'cellediting',
		        clicksToEdit: 1,
		        listeners: {
		            beforeedit: function(editor, e) {
		            	var combo = e.grid.columns[e.colIdx].getEditor(e.record);
		            	var st = Ext.create('casco.store.Versions', {data: e.record.get('versions')});
		            	combo.setStore(st);
		            }
		        }
		    },
		    columns:  [{
			text : 'Test Case Id',
			dataIndex : 'id',
			hidden:true
		},{
			text : 'Result	Id',
			dataIndex : 'result_id',
			hidden:true
		},{
			text : 'Test Case Id',
			dataIndex : 'tag',
			width:300
		}, {
			text : 'Test Case Description',
			dataIndex : 'description',
			renderer : function(v) {
				return v;
			}
		}, {
			text: 'Status',
			dataIndex: 'status',
			renderer: function(v){
				return v==0?'<span style="color:red">testing</span>':'<span style="color: green">submited</span>';
			}
		}, {
			text : 'Version Tested',
			dataIndex : 'build',
			renderer : function(v) {
				return v;
			},
			width: 200
		}, {
			text: 'created at',
			dataIndex: 'created_at'
		}, {
			text: 'updated at',
			dataIndex: 'updated_at'
		}]//columns
		}//me.items[1]
		];
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: 'Create Report',
				glyph: 0xf0c7,
				listeners: {
					click: 'createReport'
				}
			}, {
				text: 'Cancel',
				glyph: 0xf112,
				scope: me,
				handler: function(){
					
					me.destroy();
				}
			}]
		}],
        me.listeners={
		destroy:function(g, eOpts){
		//console.log(p_id);
		p_id&&Ext.getCmp(p_id).store.reload();
	
		}	
		},
		me.callParent();
	}
});