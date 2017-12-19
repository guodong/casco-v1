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
		var test_job = Ext.create('casco.store.Testjobs');
		test_job.load({
			params: {
				project_id: me.project.get('id'),
				child_id:me.child_doc.data.id?me.child_doc.data.id:''
			}
		});
		var rsdocs = Ext.create('casco.store.Documents');
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
			},
			{
				fieldLabel: 'Testing name',
				name: 'test_id',
				store: test_job,
				id: 'child-version',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					select: function(f, r, i) {
						Ext.getCmp('testing_item').store.load({'id':r.get('id')}
						);
					}
				}
			},
			{
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
			forceFit:'true',
			store: Ext.create('casco.store.Testjobs'),
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
			text : 'name',
			dataIndex : 'name'
		}, {
			text : 'build',
			dataIndex : 'build',
			renderer : function(v) {
				return v?v.name:'';
			}
		},{
			text: 'vat_version',
			dataIndex: 'vatbuild',
			flex: 1,
			renderer: function(v){
				/*var arr = [];
				for(var i in v){
					var str = v[i].document.name + ":" + v[i].name;
					arr.push(str);
				}
				return arr.join('; ');//处理过后渲染出来
				*/
				return v?v.name:'';
			}
		}, {
			text: 'status',
			dataIndex: 'status',
			renderer: function(v){
				return v==0?'<span style="color:red">testing</span>':'<span style="color: green">submited</span>';
			},
			width: 200
		}, {
			text: 'created at',
			dataIndex: 'created_at',
			width: 200
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
				text: '取消',
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