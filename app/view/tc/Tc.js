Ext.define('casco.view.tc.Tc', {
    extend : 'Ext.grid.Panel',
    xtype : 'tc',
    //requires: ['casco.view.tc.TcAdd', 'casco.store.Tcs'],
    title : 'TSP-SyRTC',
    allowDeselect: true,

    viewModel : 'main',
    initComponent: function(){
    	var me = this;
    	me.versions = new casco.store.Versions();
		me.store = new casco.store.Tcs();
		me.versions.load({
			params:{
				document_id: me.document.id
			},
			callback: function(){
				me.down('combobox').select(me.versions.getAt(0));
				var latest_v = me.versions.getCount() > 0?me.versions.getAt(0):0;
				me.curr_version = latest_v;
				if(latest_v){
					me.store.load({
						params: {
							version_id: latest_v.get('id')
						}
					});
				}
			}
		});
        me.tbar = [{
			xtype: 'combobox',
			id: 'docv-'+me.document.id,
			fieldLabel: 'version',
			labelWidth: 50,
			store: me.versions,
			displayField: 'name',
            valueField: 'id',
            queryMode: 'local',
            editable: false,
            listeners: {
            	select: function(combo, record){
            		me.curr_version = record;
            		me.store.load({
            			params:{
                			version_id: record.get('id')
            			}
            		})
            	}
            }
		},{
			text: 'Create Version',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var win = Ext.create('widget.version.create', {
					document: me.document,
				});
				win.show();
			}
		},{
			text: 'Import Document',
			glyph: 0xf093,
			scope: this,
			handler: function() {
				var win = Ext.create('widget.rs.rsimport', {
					listeners: {
						scope: this
					},
					version_id: me.down('combobox').getValue(),
					document_id: me.document.id,
					type: 'tc',
				});
				win.show();
			}
		},{
            text: 'Export Document',
            glyph: 0xf019,
            handler : function() {
            	window.open(API+'tc/export?document_id='+me.document_id);
            	return;
            	Ext.Ajax.request({
        			url : API + 'tc/export',
        			params : {doc_id: me.doc_id},
        			method: 'get',
        			success : function(response, opts) {
        				console.dir(response);
        			},
        			failure : function(response, opts) {
        				console.log('server-side failure with status code '
        						+ response.status);
        			}
        		});
            }
        }, {
            text: 'Add Item',
            glyph: 0xf067, 
            handler : function() {
                var win = Ext.create('widget.tcadd',{listeners:{scope: this}, version_id: me.curr_version.get('id')});
                win.show();
            }
        },{
            text: 'Delete Item',
            glyph: 0xf068,
            handler : function() {

            }
        },{
			text: 'View Document',
			glyph: 0xf108,
			scope: this,
			handler: function() {
				window.open("/viewdoc.html?file="+me.version.get('filename'),"_blank","width=800,height=900");
			}
		},{
			text: 'View Graph',
			glyph: 0xf0e8,
			scope: this,
			handler: function() {
				window.open('/draw/graph.html?document_id='+me.document_id);
			},
			hidden: true
		}];
        me.columns = [
		{text: "tag", dataIndex: "tag", width: 200, hideable: false,
		  summaryType: 'count',
		  summaryRenderer: function(value, summaryData, dataIndex) {
		      return Ext.String.format('{0} item{1}', value, value !== 1 ? 's' : '');
		  }},
		{text: "source", dataIndex: "source_json", width: 200, autoShow: false, renderer : function(value) {
			/*var arr = [];
			Ext.Array.each(value, function(v) {
		      arr.push(v.tag);
		  }   //之前数组的处理
		  
		  );
			return arr.join(', ');*/
		}},
		{text: "test method", dataIndex: "testmethod", width: 100, renderer: function(tm){return tm?tm.name:''}},
		{text: "pre condition", dataIndex: "pre_condition", flex: 1},
		];
    	me.callParent(arguments);
    },
    features: [{
    	ftype: 'summary',
    	dock: 'top'
    }],
    listeners : {
        celldblclick: function(a,b,c, record, item, index, e) {
        	if(c==0){
				window.open('/draw/graph2.html#'+record.get('tag'));
				return;
			}
        	var win = Ext.create('widget.tcadd',{tc: record, document_id: this.document_id});
            win.down('form').loadRecord(record);
            win.show();
        }
    }
})