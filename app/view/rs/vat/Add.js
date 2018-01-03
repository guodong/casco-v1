Ext.define('casco.view.rs.vat.Add', {
	extend: 'Ext.window.Window',

	alias: 'widget.rs.vat.add',
	requires: ['casco.view.main.ItemTree'],
	
	resizable: true,
	maximizable: true,
	modal: true,
	title: '添加Vat',
	width: 600,
	height: 550,
	autoScroll: true,
	layout: {
		type: 'border'
	},
	initComponent: function() {
		var me = this;
		me.vatstrstore = Ext.create('casco.store.Vatstrs');
		me.vatstrstore.load({
			params: {
				project_id: localStorage.project_id
			}
		});
		me.addSources = function(record) {
			console.log(record);
			if (record.data.type != 'item') {
				return;
			}
			me.vat.loadData([{
				tag: record.data.name,
				id: record.data.item_id
			}], true);
		};
		me.addVatstring = function(record){
			me.vat.loadData([{
				tag: record.get('name'),
				id: record.get('id')
			}], true);
		};
		me.items = [{
			xtype: 'itemtree',
			region: 'west',
			width: 200,
			title: 'Vat Sources',
			split: true,
			collapsible: true,
			autoScroll: true,
			listeners: {
				itemdblclick: function(view, record, item, index, e, eOpts) {
					console.log(record);
					console.log('Ohhh fuck!shit');
					me.addSources(record);
				}
			}
		}, {
			xtype: 'grid',
			title: 'Vat Strings',
			region: 'west',
			width: 200,
			split: true,
			collapsible: true,
			autoScroll: true,
			columns: [{
				text: '定版',
				dataIndex: 'name',
				flex: 1
			}],
			store: me.vatstrstore,
			queryMode: 'local',
			hideHeaders: true,
			listeners: {
				itemdblclick: function(view, record, item, index, e, eOpts) {
					console.log(record);
					me.addVatstring(record);
				}
			}
		}, {
			xtype: 'grid',
			region: 'center',
			columns: [{
				text: '定版',
				dataIndex: 'tag',
				flex: 1
			},{
				text:'备注',
				editable:true,
			}],
			store: me.vat,
			listeners: {
				itemdblclick: function(dv, record, item, index, e) {
					console.log('fuck shit!');
					me.vat.remove(record);
				}
			}
		}];
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: '确定',
				glyph: 0xf112,
				scope: me,
				handler: this.destroy
			}]
		}];

		me.callParent(arguments);
	}
});