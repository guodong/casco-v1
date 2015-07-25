Ext.define('casco.view.manage.Userlist', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.userlist',
	requires: ['casco.view.manage.Useradd'],
	id: 'userlist',
	itemId: 'userlist',
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Users');
		store.load();
		me.store = store;
		me.tbar = [{
			hidden: localStorage.role == 'staff' ? true: false,  //用户权限
			text: 'Add User',
			glyph: 0xf067,
			handler: function() {
				var win = Ext.create('casco.view.manage.Useradd', {store: store});
				win.show();
			}
		}, {
			hidden: localStorage.role == 'staff' ? true: false,  //用户权限
			text: 'Delete User',
			glyph: 0xf068,
			handler: function() {
				Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){if(choice == 'yes'){
		 
	            var view=me.getView();
                var selection =view.getSelectionModel().getSelection()[0];
	            if (selection) {
				selection.erase();
			    //var user = view.user?view.user:Ext.create('casco.model.User');
				//Ext.Msg.alert(selection.account);
	            me.store.remove(selection);

	            me.getView().refresh();
	            }
		       
    	}}, this);
        
				

			}
		}];
		me.callParent();  //???作用
	},
	columns: [
	{   text:"id",
		dataIndex:"id",
		width:200,
	    hidden:true
	
	},{
		text: "account",
		id:"account",
		dataIndex: "account",
		width: 130
	}, {
		text: "realname",
		dataIndex: "realname",
		width: 100
	}, {
		text: "jobnumber",
		dataIndex: "jobnumber",
		width: 130
	}, {
		text: "role",
		dataIndex: "role",
		width: 180
	}, {
		text: "created time",
		dataIndex: "created_at",
		width: 180
	}	],
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	if(localStorage.role == 'staff') return;  //用户权限
        	var win = Ext.create('casco.view.manage.Useradd', {user: record});//这里初始化的什么玩意
            win.down('form').loadRecord(record);
            win.show();
        }
    }
})