Ext.define('casco.view.testing.Job', {
    extend: 'Ext.grid.Panel',
    xtype: 'testing.job',
    requires:['casco.store.Testjobs',
              'Ext.grid.filters.Filters'],
    
    forceFit: true,
    plugins: 'gridfilters',
    
    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	Ext.getCmp('result-main').job = record;
        	Ext.getCmp('result-main').store.load({
        		params: {
        			job_id: record.get('id')
        		}
        	});
    	}
    },
    bodyPadding: 0,
    initComponent: function(){
    	var me = this;
		me.addListener("datachanged",function(){
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
			},
			filter:{
				type: 'string',
			}
		},{
			text: 'vat_version',
			dataIndex: 'vatbuild',
			renderer: function(value,metadata,record){ //value-rs_versions(current cell); metadata-cell metadata; record-Ext.data.Model
				return getPreview(value,metadata,record);
			},
			filter:{
				type: 'string',
			}
		},{
			text: 'status',
			dataIndex: 'status',
			renderer: function(v){
				return v==0?'<span style="color:red">testing</span>':'<span style="color: green">submited</span>';
			},
//			width: 200
		}, {
			text: 'last_modified',
			dataIndex: 'user',
			renderer: function(v){
				return v?v.realname:'';
			}
		},{
			text: 'created at',
			dataIndex: 'created_at',
		}];
		me.tbar = [{
			text: 'Create Testjob',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var job = Ext.create('casco.model.Testjob');
				console.log(job);
				var win = Ext.create('widget.testing.jobcreate', {
					project: me.project,
					job: job
				});
				win.down('form').loadRecord(job);
				win.show();
			}
		},{
			text: 'Delete Testjob',
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
						}
					}}, this);
			}
		},{
			text: 'Edit Templates',
			glyph: 0xf093,
			scope: me,
			handler: function() {
				var win = Ext.create('widget.testing.templateedit', {
					project: me.project,
				});
				win.show();
			}
		}];
		
		function getPreview(value,metadata,record){ //record-rsversions
			var tmp = [];
			var tcvs = record.data.vatbuild.tc_version;
			var rsvs = record.data.vatbuild.rs_versions;
			var str = "TC文档信息：" + tcvs.document.name + "-" + tcvs.name + "<br/>" + "RS文档信息：";
			tmp.push(str);
			for(var i in rsvs){
				str = "[" + rsvs[i].document.name + "-" + rsvs[i].name + "]";
				tmp.push(str);
			}
			var value = tmp.join(' ');
		    metadata.tdAttr = 'data-qtip="' + value + '\n"'  ; //提示信息
		    return record.data.vatbuild.name;
		};
		
    	this.callParent();
    }
})