Ext.define('casco.view.matrix.Verification', {
    extend: 'Ext.grid.Panel',
    xtype: 'matrix.verification',
    
    requires:['casco.store.Verification','casco.model.Verification','casco.view.matrix.VerificationCreate',
		'casco.view.matrix.ParentMatrix','casco.view.matrix.ChildMatrix'],

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
	forceFit:true,
    initComponent: function(){
    	var me = this;
    	me.store = new casco.store.Verification();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id')
    		}
    	});
		var states = Ext.create('Ext.data.Store', {
		fields: ['abbr', 'name'],
		data : [
			{"abbr":"AL", "name":"ParentMatrix"},
			{"abbr":"AK", "name":"ChildMatrix"},
			{"abbr":"AZ", "name":"Revison"}
		]
		});
		me.columns = [{
			text : 'name',
			dataIndex : 'name'
		}, {
			text : 'child:version',
			dataIndex : 'child_version',
			renderer : function(v) {
				return v?v.document.name+":"+v.name:'';
			}
		},{
			text: 'parent:versions',
			dataIndex: 'parent_versions',
			renderer: function(value){
						var arr = [];
						Ext.Array.each(value, function(v) {
							arr.push(v.document.name+':'+v.name);
						});
						return arr.join(',	');
			}
		}, {
			text: 'status',
			dataIndex: 'status',
			renderer: function(v){
				return v==0?'<span style="color:red">testing</span>':'<span style="color: green">submited</span>';
			},
		 
		}, {
			text: 'created at',
			dataIndex: 'created_at',
			 
		}, {
			
			text:'view',
			dataIndex:'id',
			renderer:function(val_id){
			 var id = Ext.id();	 
             Ext.defer(function() {
               	Ext.create('Ext.form.ComboBox', {
				store: states,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'abbr',
                glyph: 0xf0ce,
				val_id:val_id,//依赖注入,组件扩展性很好哇
			    emptyText: 'Switch View',
				listeners: {
            	select: 'switchView'
				},
				renderTo:id
				});   
            }, 50);
            return Ext.String.format('<div style="color:0xf0ce" id="{0}" ></div>', id);
			

			}//renderer
		}];
		me.tbar = [{
			text: 'Create Verification',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var job = Ext.create('casco.model.Verification');
				var win = Ext.create('widget.matrix.create', {
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