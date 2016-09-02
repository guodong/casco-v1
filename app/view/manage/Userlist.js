//151021 Q R
Ext.define('casco.view.manage.Userlist', {
	extend: 'Ext.grid.Panel',
	//alias: 'widget.userlist',
	xtype:'userlist',
	requires: ['casco.view.manage.Useradd'],
	uses:['casco.ux.ButtonTransparent'],
	id: 'userlist',
	itemId: 'userlist',  //???
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Users');
		store.load();
		me.store = store;
		var selModel=new Ext.selection.Model({mode:"MULTI"});
         me.selModel=selModel;
		me.tbar = [{
			//hidden: JSON.parse(localStorage.user).role_id == 0 ? true: false,  //用户权限
			text: 'Add User',
			glyph: 0xf067,	//resources
			xtype:'buttontransparent',	//
			handler: function() {
				var win = Ext.create('casco.view.manage.Useradd', {store: store});
				win.show();
			}
		}, {
			//hidden: JSON.parse(localStorage.user).role_id == 0 ? true: false,  //用户权限
			text: 'Delete User',
			glyph: 0xf068,
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
		width: 120
	}, {
		text: "realname",
		dataIndex: "realname",
		width: 120
	}, {
		text: "jobnumber",
		dataIndex: "jobnumber",
		width: 120
	}, {
		text: "role",
		dataIndex: "role_id",
	    width: 120,
		renderer: function(value) {		//render
            return Ext.String.format('{1}', value, value=='0'?'Staff':(value=='1'?'Manager':'Admin'));
        }
	   
	},
	{
		text: "islock",
		dataIndex: "islock",
		width: 120,
		renderer: function(value) {
            return Ext.String.format('{1}', value, value=='0'?'No':'Yes');
        }
	},{
		text:'created time',
		dataIndex:'created_at',
		width:170
	},{
		text:'updated time',
		dataIndex:'updated_at',
		width:170
	}],
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	//if(localStorage.role == 'staff') return;  //用户权限
			var win = Ext.create('casco.view.manage.Useredit', {user: record});	//record->Data Model
            win.down('form').loadRecord(record);
            win.show();
        }
    }

})