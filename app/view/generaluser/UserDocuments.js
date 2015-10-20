Ext.define('casco.view.manage.UserDocuments', {
	extend: 'Ext.window.Window',

	alias: 'widget.userdocuments',
	requires: ['Ext.grid.plugin.CellEditing'],
	resizable: true,
	maximizable: true,
	modal: true,
	title: 'Edit Documents',
	width: 600,
	height: 550,
	autoScroll: true,
	layout: {
		type: 'border'
	},
	initComponent: function() {
		var me = this;
		var projects = Ext.create('casco.store.Projects');
		projects.load();
		var documents=Ext.create('casco.store.Documents');
		documents.load();
		me.addSources = function(record){
			me.participants.loadData([{realname: record.data.realname,id: record.data.id}], true);
		};
		me.items = [{
			xtype: 'grid',
			region: 'west',
			store: documents,
			width: 300,
	        split: true,
	        collapsible: true,
			autoScroll: true,
			title: 'Avaliable Documents',
		    columns: [
				        { text: 'project_name',  dataIndex: 'project_name'},
				        { text: 'document_name',  dataIndex: 'document_name'},
				        { text: 'document_type',  dataIndex: 'document_type'}
				   
				        //{ text: 'jobnumber',  dataIndex: 'jobnumber'}
		    ],
		    listeners : {
		        itemdblclick: function(view, record, item, index, e, eOpts){
					me.addSources(record);
				}
		    }
		}, {
			xtype: 'grid',
			region: 'center',
			//itemId: 'sources',
			title: 'Selected Documents',
			id: 'selecteddocuments',
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
		    columns: [
				        { text: 'realname',  dataIndex: 'realname', flex: 1},
				       {
				            //xtype: 'gridcolumn',
				            renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
				                console.log(value)
				            },  
				            text: 'Role',
				            dataIndex: 'role',
				            editor: {
				                xtype: 'combo',
				                displayField: 'text',
				                valueField: 'value',
				                store: Ext.create('Ext.data.Store', {
									fields : [ 'text', 'value' ],
									data : [ {
										"text" : "leader",
										"value" : "leader"
									}, {
										"text" : "member",
										"value" : "member"
									} ]
								}),
								listeners: {
							        change: function (filed, newValue, oldValue, op) {console.log(arguments)
							        }
								}
				            }
				        }
		    ],
		    store: me.participants,
		    listeners : {
		        itemdblclick: function(dv, record, item, index, e) {
		        	me.participants.remove(record);
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
		//this.getSelectionModel().on('selectionchange', function(){}, this);
	}
});