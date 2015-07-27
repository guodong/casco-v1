Ext.define('casco.view.testing.Job', {
    extend: 'Ext.grid.Panel',
    xtype: 'testing.job',

    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
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
			flex: 1,
			renderer : function(v) {
				return v.name;
			}
		}, {
			text : 'tc',
			dataIndex : 'tc_version',
			renderer : function(v) {
				return v.document.name;
			}
		}, {
			text : 'tc version',
			dataIndex : 'tc_version',
			renderer : function(v) {
				return v.name;
			}
		}, {
			text : 'rs',
			dataIndex : 'rs_version',
			renderer : function(v) {
				return v.document.name;
			}
		}, {
			text : 'rs version',
			dataIndex : 'rs_version',
			renderer : function(v) {
				return v.name;
			}
		},{
			text: 'created at',
			dataIndex: 'created_at',
			width: 200
		}];
		me.tbar = [{
			text: 'Create Testjob',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var win = Ext.create('widget.testing.jobcreate', {
					project: me.project,
				});
				win.show();
			}
		}];
    	this.callParent();
    }
})