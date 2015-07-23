Ext.define('casco.view.main.Top', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.top',
    
    style: {background: '#167abc',padding: '10px',color: '#fff'},
    initComponent: function(){
    	var store = Ext.create('casco.store.Projects');
    	store.load({
    		params:{
    			user_id: 'a7b12e32-b0f5-11e4-abb7-c17404b78885'//localStorage.uid
    		}
    	});
    	this.items = [{
            xtype: 'label',
            html: 'CASCO TEST CENTER',
            style: 'font-size: 27px;'
        },'->',{
            text: 'Manage',
            xtype: 'button',
            handler: function(){
            	localStorage.view = 'manage';
            	location.reload();
            },
            hidden: localStorage.view == 'manage'?true:false
        }
        ,{
            text: 'Testing',
            xtype: 'button',
            handler: 'testing',
            hidden: localStorage.view == 'manage'?true:false
        },{
            text: 'Project Stat',
            xtype: 'button',
            handler: function(){
            	window.open("/prostat/projectstat-tmp.htm");
            },
            hidden: localStorage.view == 'manage'?false:true
        },{
            text: 'Relation view',
            xtype: 'button',
            handler: function(){
            	window.open('/draw/graph2.html');
            }
        },{
            xtype: 'combobox',
            editable: false,
            displayField: 'name',
            valueField: 'id',
            store: store,
            queryMode: 'local',
            emptyText: 'Switch Project',
            //value: localStorage.project_id,
            listeners: {
            	select: function(combo, record){
            		localStorage.project = JSON.stringify(record.getData());
            		localStorage.project_id = record.get('id');
            		localStorage.project_name = record.get('name');
            		localStorage.view = 'test';
            		location.reload();
            		return;
            		var tree = Ext.getCmp('mtree');
            		tree.setTitle(record.get('name'));
//            		tree.store = Ext.create('casco.store.TreeDocuments', {
//                		proxy: {
//                			extraParams: {
//                				project_id: record.get('id')
//                			}
//                		}
//                	});
            		tree.store.reload({params: {project_id: record.get('id')}});
            		localStorage.view = 'test';
            		//location.reload();
            	}
            }
        }];
    	this.callParent();
    }
})