
Ext.define('casco.view.vat.VatView',{
	extend: 'Ext.grid.Panel',
	xtype: 'vat.view',
	viewModel: 'vat',
	requires: [],
	
    bodyPadding: 0,
	forceFit:true,
	
    initComponent: function(){
    	var me = this;
    	var p_id=me.id;
    	me.store = new casco.store.Vats();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id'),
				document_id:me.document.data.id
    		}
    	});
		
//		var states = Ext.create('Ext.data.Store', {
//		fields: ['abbr', 'name'],
//		data : [
//			{"abbr":"ALL","name":"All"},
//			{"abbr":"AL", "name":"ParentMatrix"},
//			{"abbr":"AK", "name":"ChildMatrix"},
//			{"abbr":"AZ", "name":"Summary"}			
//		]
//		});
		me.columns = [{
			text : 'name',
			dataIndex : 'name'
		},{
			text : 'tc',
			dataIndex : 'tc_version',
			renderer : function(v) {
				return v?v.document.name:'';
			}
		}, {
			text : 'tc version',
			dataIndex : 'tc_version',
			renderer : function(v) {
				return v?v.name:'';
			}
		}, {
			text: 'rs:version',
			dataIndex: 'rs_versions',
			flex: 1,
			renderer: function(v){
				var arr = [];
				for(var i in v){
					var str = v[i].document.name + ":" + v[i].name;
					arr.push(str);
				}
				return arr.join('; ');//处理过后渲染出来
			}
		}, {
			text: 'created at',
			dataIndex: 'created_at',
			width: 200
		}];
		
		me.tbar = [{
			text: 'Create View',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var vv = Ext.create('casco.model.Vat');
				console.log(vv);
				var win = Ext.create('widget.vat.viewcreate', {
					project: me.project,
					document: me.document,
					p_id:p_id?p_id:'',
					vat: vv
				});
				win.down('form').loadRecord(vv);
				win.show();
			}
		},{
			text: 'Delete View',
			glyph: 0xf068,
			scope: this,
			handler: function() {
				Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){   //confirm
					if(choice == 'yes'){
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (selection) {
							me.store.remove(selection);
							selection.erase();
							//view.refresh();
						}
					}}, this);
			}
		}];

    	this.callParent();
    }
})