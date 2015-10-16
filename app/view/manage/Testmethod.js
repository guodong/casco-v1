<<<<<<< HEAD
Ext.define('casco.view.manage.Testmethod', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.testmethod',
	requires: ['casco.view.manage.Methodadd'],
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Testmethods');
		store.load();
		me.store = store;
		me.tbar = [{
			hidden: localStorage.role == 'staff' ? true: false,  //用户权限
			text: 'Add Method',
			glyph: 0xf067,
			handler: function() {
				var win = Ext.create('casco.view.manage.Methodadd', {store: store});
				win.show();
			}
		}];
		me.callParent();
	},
	columns: [{
		text: "name",
		dataIndex: "name",
		width: 130
	}, {
		text: "created time",
		dataIndex: "created_at",
		width: 180
	}],
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	if(localStorage.role == 'staff') return;  //用户权限
        	var win = Ext.create('casco.view.manage.Methodadd', {method: record});
            win.down('form').loadRecord(record);
            win.show();
        }
    }
=======
Ext.define('casco.view.manage.Testmethod', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.testmethod',
	requires: ['casco.view.manage.Methodadd'],
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Testmethods');
		store.load();
		me.store = store;
		me.tbar = [{
			hidden: localStorage.role == 'staff' ? true: false,  //用户权限
			text: 'Add Method',
			glyph: 0xf067,
			handler: function() {
				var win = Ext.create('casco.view.manage.Methodadd', {store: store});
				win.show();
			}
		}];
		me.callParent();
	},
	columns: [{
		text: "name",
		dataIndex: "name",
		width: 130
	}, {
		text: "created time",
		dataIndex: "created_at",
		width: 180
	}, {
		text: "updated time",
		dataIndex: "updated_at",
		width: 180
	}],
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	if(localStorage.role == 'staff') return;  //用户权限
        	var win = Ext.create('casco.view.manage.Methodadd', {method: record});
            win.down('form').loadRecord(record);
            win.show();
        }
    }
>>>>>>> 9f33e85b1f51e65073d256ba200429a4188d38aa
})