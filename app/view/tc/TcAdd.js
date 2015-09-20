Ext.define('casco.view.tc.TcAdd', {
	extend: 'Ext.window.Window',

	alias: 'widget.tcadd',
	requires: ['casco.view.document.DocTree', 'casco.view.tc.TcStep',
			'casco.view.document.DocumentController',
			 'casco.view.tc.TcController',
			 'casco.view.tc.source.Add','casco.store.TcSteps','casco.store.Sources'],
	controller: 'tc',
	
	modal: true,
	title: 'Tc Item',
	width: 800,
	height: 600,
//	autoScroll: true,
	maximizable: true,
    resizable: true,
    layout: {
		type: 'fit'
	},

	initComponent: function() {
		var me = this;
	 
		me.sources = Ext.create('casco.store.Sources');
		me.steps = Ext.create('casco.store.TcSteps');
		if(me.tc){
			me.sources.setData(me.tc.get('sources'));
			me.steps.setData(me.tc.get('steps'));
		}
		var tm = Ext.create('casco.store.Testmethods');
		tm.load({
			params: {
				project_id: me.project.get('id')
			}
		});
		me.items = [{
			xtype: 'form',
			reference: 'TcAddform',
			bodyPadding: 10,
			items: [{
				name : 'id',
				xtype : 'hiddenfield',
			},{
				name: 'version_id',
				xtype: 'hiddenfield',
				value: me.version_id
			},{
				anchor : '100%',
				fieldLabel : 'Tag',
				name : 'tag',
				//labelAlign : 'top',
				xtype : 'textfield',
	            allowBlank: false,
				value: me.tag_id
			}, {
				anchor : '100%',
				fieldLabel : 'Description',
				name : 'description',
				//labelAlign : 'top',
				xtype : 'textarea',
	            allowBlank: false
			}, {
				xtype : 'tagfield',
				//defaultType:'checkbox',
				name : 'testmethod_id',
			    queryMode: 'local',
                  
				anchor : '100%',
				editable : true,
				fieldLabel : 'Test Methods',
			 
				labelAlign : 'top',
				displayField : 'name',
				valueField : 'id',
				store:tm,
	            allowBlank: false
			},{
				anchor : '100%',
				fieldLabel : 'Pre condition',
				name : 'pre_condition',
				//labelAlign : 'top',
				xtype : 'textarea',
				maxHeight: 50,
	            allowBlank: false
			}/*, {
				xtype : 'combobox',
				name : 'result',
				anchor : '100%',
				hidden: me.tc?false:true,
				editable : false,
				fieldLabel : 'result',
				//labelAlign : 'top',
				displayField : 'text',
				valueField : 'value',
				store : Ext.create('Ext.data.Store', {
					fields : [ 'text', 'value' ],
					data : [ {
						"text" : "untested",
						"value" : 0
					}, {
						"text" : "passed",
						"value" : 1
					}, {
						"text" : "failed",
						"value" : 2
					} ]
				}),
	            allowBlank: false
			}*/, {
				xtype: 'grid',
				region: 'center',
				fieldLabel: 'Sources',
				dockedItems: [{
	    	        xtype: 'toolbar', 
	    	        dock: 'bottom',
	    	        items: [{
	    	            glyph: 0xf067,
	    	            text: 'Edit Sources',
	    	            handler: function(){
	    					var wd = Ext.create("casco.view.tc.source.Add", {
	    						sources: me.sources,
	    						document_id: me.document_id,
	    						project: me.project
	    					});
	    					wd.show();
	    				}
	    	        }]
	    	    }],
			    columns: [
			        { text: 'Sources',  dataIndex: 'tag', flex: 1}
			    ],
			    store: me.sources
			}, {
				xtype : 'tcstep',
				reference : 'mgrid',
				id: 'mgrid',
				store: me.steps
			}],
			buttons: ['->', {
				text: 'Save',
				formBind: true,
				glyph: 0xf0c7,
				listeners: {
					click: 'createTc'
				}
			}, {
				text: 'Cancel',
				glyph: 0xf112,
				scope: me,
				handler: this.destroy
			}]
		}];
		me.callParent(arguments);
	}
});