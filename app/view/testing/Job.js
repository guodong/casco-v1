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
				return arr.join('; ');
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
		}];
    	this.callParent();
    }
})