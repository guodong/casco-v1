Ext.define('casco.view.testing.Testmore', {
	extend: 'Ext.window.Window',
	alias: 'widget.testmore',
	requires: [],
	modal: true,
	width: 800,
	maxHeight: 600,
	autoScroll: true,
	controller: 'testing',

	initComponent: function() {
		var me = this;
		me.setTitle(me.result.get('tc').tag);
		me.steps = Ext.create('casco.store.TcSteps');
		if (me.result) {
			me.steps.setData(me.result.get('tc').steps);
		}

		me.items = [{
			xtype: 'form',
			bodyPadding: 10,
			items: [{
				xtype: 'textfield',
				fieldLabel: 'cr',
				name: 'cr',
				anchor: '100%'
			}, {
				xtype: 'textareafield',
				fieldLabel: 'comment',
				name: 'comment',
				anchor: '100%'
			}, {
				xtype: 'tcstepresult',
				reference: 'mgrid',
				store: me.steps
			}],
			buttons: ['->', {
				text: 'Ok',
				formBind: true,
				glyph: 0xf0c7,
				handler: function() {
					var form = this.up('form');
					var record = form.getRecord();
					//form.updateRecord(record);
					record.set(form.getValues());
					me.destroy();
				}
			}, {
				text: 'Cancel',
				glyph: 0xf112,
				scope: me,
				handler: this.destroy
			}]
		}];
		me.callParent();
	}
});