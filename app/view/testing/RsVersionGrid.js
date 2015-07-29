Ext.define('casco.view.testing.RsVersionGrid', {
	extend: 'Ext.grid.Panel',
	xtype: 'testing.rsversiongrid',
	store: Ext.create('casco.store.Documents'),
	plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1,
        listeners: {
            beforeedit: function(editor, e) {
            	var combo = e.grid.columns[e.colIdx].getEditor(e.record);
            	var st = Ext.create('casco.store.Versions');
            	st.load({
            		params: {
            			document_id: e.record.get('id')
            		}
            	})
            	combo.setStore(st);
            }
        }
    },
	
	initComponent: function() {
		var me = this;
		me.columns = [{
			text: 'Rs doc',
			dataIndex: 'name',
			flex: 1
		}, {
			text: 'Version',
			dataIndex: 'version_id',
			renderer: function(v){
				if(versions.length == 0) return;
				return versions.findRecord('id', v)?versions.findRecord('id', v).get('name'):versions[0].name;
			},
			editor: {
		        xtype: 'combobox',
		        queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				editable: false
		    }
		}];
		this.callParent();
	}
});