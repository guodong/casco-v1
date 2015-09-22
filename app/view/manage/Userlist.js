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
	            me.store.remove(selection);
				selection.erase();
	     
	            }
		       
    	}}, this);
        
				

			}
		}];
		me.callParent();   
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
		dataIndex: "role_id",
	    width: 180,
		renderer: function(value) {
            return Ext.String.format('{1}', value, value=='0'?'Staff':'Manager');
        }
	   
	}, {
		text: "created time",
		dataIndex: "created_at",
		width: 180
	},{
	   text:"Privileges",
		hidden: localStorage.role == 'staff' ? true: false,  //用户权限
		width: 220,
        renderer: function(val,meta,rec) {
            var id = Ext.id();
            Ext.defer(function() {
               Ext.widget('button', {
                  renderTo: id,
                  text: 'Edit Documents Privileges',
                  glyph: 0xf040,
                  scale: 'small',
                  handler: function() {
					  var win = Ext.create('casco.view.manage.UserDocuments', {user:rec});
                      win.show();
                  }
               });
            }, 50);
            return Ext.String.format('<div id="{0}"></div>', id);
         }

	},{
		text: "islock",
		dataIndex: "islock",
		width: 130,
		renderer: function(value) {
            return Ext.String.format('{1}', value, value=='0'?'No':'Yes');
        }
	}],
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	if(localStorage.role == 'staff') return;  //用户权限
			var win = Ext.create('casco.view.manage.Useredit', {user: record});//这里初始化的什么玩意
            win.down('form').loadRecord(record);
            win.show();
        }
    }
})