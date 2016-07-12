Ext.define('casco.view.tc.source.Add', {
	extend: 'Ext.window.Window',
	alias: 'widget.tc.source.add',
	requires: ['casco.view.main.ItemTree'],
	controller: 'tc',
	
	resizable: true,
	maximizable: true,
	modal: true,
	title: 'Add Tc Sources',
	width: 600,
	height: 550,
	autoScroll: true,
	layout: {
		type: 'border'
	},
	
	initComponent: function() {
		var me = this;
		console.log(me);
		me.addSources = function(record){
			console.log(record);
			if(record.data.type != 'item'){		//详见ItemTree
				return;
			}
			me.sources.loadData([{tag: record.data.name,id: record.data.item_id}], true);	//ture 保留existing data
		};
		
		me.items = [{
			xtype: 'itemtree',
			region: 'west',
			width: 300,
	        split: true,
	        collapsible: true,
			autoScroll: true,
			document_id: me.document_id,
			project: me.project,
			listeners: {
				itemdblclick: function(view, record, item, index, e, eOpts){
					me.addSources(record);
				}
			}
		},{
			xtype: 'grid',
			region: 'center',
			itemId: 'sources',
		    columns: [
		        { text: 'Sources',  dataIndex: 'tag', flex: 1}
		    ],
		    store: me.sources,
		    listeners : {
		        itemdblclick: function(dv, record, item, index, e) {
		        	me.sources.remove(record);
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
				text: 'Ok',
				glyph: 0xf112,
				scope: me,
				handler: this.destroy
			}]
		}];
		
		me.callParent(arguments);
	}
});