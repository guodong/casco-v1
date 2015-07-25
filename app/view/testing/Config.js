Ext.define('casco.view.testing.Config', {
	extend: 'Ext.window.Window',

	alias: 'widget.testing.config',
	requires: [],
	modal: true,
	title: 'Testing Config',
	width: 800,
	maxHeight: 600,
	autoScroll: true,

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
				project_id: localStorage.project_id
			}
		});
		me.items = [{
			xtype: 'form',
			reference: 'TcAddform',
			bodyPadding: 10,
			items: [{
				anchor : '100%',
				fieldLabel : 'Build Version',
				name : 'tag',
				//labelAlign : 'top',
				xtype : 'textfield',
	            allowBlank: false
			}, {
				xtype : 'combobox',
				name : 'testmethod_id',
				anchor : '100%',
				editable : false,
				fieldLabel : 'Tc',
				//labelAlign : 'top',
				displayField : 'name',
				valueField : 'id',
				store : tm,
	            allowBlank: false
			}, {
				anchor : '100%',
				fieldLabel : 'Version',
				name : 'tag',
				//labelAlign : 'top',
				xtype : 'textfield',
	            allowBlank: false
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