Ext.define('casco.view.manage.Buildlist', {
	extend: 'Ext.grid.Panel',
	 
	alias: 'widget.buildlist',
	requires: ['casco.view.testing.BuildCreate','casco.store.Builds'],
   
	id:'build_list',
	modal: true,
	maximizable: true,
    
	initComponent: function() {
		var me = this;
		 
		var store = Ext.create('casco.store.Builds', {
    		proxy: {
    			extraParams: {
    				project_id: me.project.get('id'),
    			 
    			}
    		}
    	});
		store.load();
		me.store = store;
		me.tbar = [{
		//	hidden: localStorage.role == 'staff' ? true: false,  //用户权限
			text: 'Add Build',
			glyph: 0xf067,
			handler: function() {
				var win = Ext.create('casco.view.testing.BuildCreate', {project: me.project});
				win.show();
			}
		}, {
		//	hidden: localStorage.role == 'staff' ? true: false,  //用户权限
			text: 'Delete Build',
			glyph: 0xf068,
			handler: function() {
				Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){if(choice == 'yes'){
		 
	            var view=me.getView();
                var selection =view.getSelectionModel().getSelection()[0];
	            if (selection) {
				selection.erase();
			
	            me.store.remove(selection);

	            me.getView().refresh();
	            }
		       
    	}}, this);
        
				

			}
		}];
		me.callParent();   
	},
	columns: [
	{  
		text:"id",
		dataIndex:"id",
		 
	    hidden:true
	
	},{
		text: "Name",
		width:200,
		anchor: '50%',
		dataIndex: "name",
		 
	}, {
		text: "created time",
		dataIndex: "created_at",
	    width:200,
		anchor: '50%', 
	}	],
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	if(localStorage.role == 'staff') return;  //用户权限
        	var win = Ext.create('casco.view.testing.BuildCreate', {user: record});//这里初始化的什么玩意
            win.down('form').loadRecord(record);
            win.show();
        }
    }
})