Ext.define('casco.view.testing.Job', {
    extend: 'Ext.grid.Panel',
    xtype: 'testing.job',
    
    requires:['casco.store.Testjobs'],

    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	Ext.getCmp('result-main').job = record;
        	Ext.getCmp('result-main').store.load({
        		params: {
        			job_id: record.get('id')
        		},
//        		callback: function(){
//        			var it = Ext.ComponentQuery.query(".testit");console.log(it)
//        			it.setDisabled();
//        		}
        	});
    	}
    },
    bodyPadding: 0,
    initComponent: function(){
    	var me = this;
		me.addListener("datachanged",function(){
		console.log('gagaga!');
		Ext.getCmp('result-main').getStore().reload(); 
		Ext.getCmp('testing-step-panel').getStore().reload();
		});
    	me.store = new casco.store.Testjobs();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id')
    		}
    	});
		me.columns = [{
			text : 'name',
			dataIndex : 'name'
		}, {
			text : 'build',
			dataIndex : 'build',
			renderer : function(v) {
				return v?v.name:'';
			}
		}, {
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
			renderer: function(v){
				var arr = [];
				for(var i in v){
					var str = v[i].document.name + ":" + v[i].name;
					arr.push(str);
				}
				return arr.join('; ');//处理过后渲染出来
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
		}];
		me.tbar = [{
			text: 'Create Testjob',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var job = Ext.create('casco.model.Testjob');
				var win = Ext.create('widget.testing.jobcreate', {
					project: me.project,
					job: job
				});
				win.down('form').loadRecord(job);
				win.show();
			}
		},{
			text: 'Delete Testjob',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){   //confirm
					if(choice == 'yes'){
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (selection) {
							me.store.remove(selection);
							selection.erase({
								success: function(record, operation) {
								//view.getStore().reload();//级联变动
								location.reload();
								//me.fireEvent('datachanged');
//								Ext.getCmp().getStore().reload();//最好写在listener中
//								Ext.getCmp().getStore().reload();
								// do something if the erase succeeded
								}
							});
						}
					}}, this);
			}
		},{
			xtype : 'filefield',
			name : 'file',
			fieldLabel : 'Template',
			labelWidth : 60,
			msgTarget : 'side',
			allowBlank : false,
			anchor : 0,
			width : 200,
			buttonText : 'Select File'
		}/*{
			text: 'Import Template',
			glyph: 0xf093,
			scope: this,
			handler: function() {
				var win = Ext.create('widget.testing.templateimport', {
					listeners: {
						scope: this
					},
					//version_id: me.down('combobox').getValue(),
//					document_id: me.document.id,
					vstore:me.versions,
//					type: 'rs'
				});
				
				win.show();
			}
				
		}*/];
    	this.callParent();
    }
})