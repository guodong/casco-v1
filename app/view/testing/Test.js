Ext.define('casco.view.testing.Test', {
	extend: 'Ext.form.Panel',
	alias: 'widget.test',
	requires: ['casco.store.Tcs','casco.store.Documents','casco.store.Builds','Ext.layout.container.Column', 'casco.store.Versions'],

	bodyPadding: '10',
	width: '100%',
	initComponent: function() {
		var me = this;
		var tcdocs = Ext.create('casco.store.Documents');
		tcdocs.load({
			params: {
				project_id: me.project.get('id'),
				type: 'tc'
			}
		});
		var rsdocs = Ext.create('casco.store.Documents');
//		rsdocs.load({
//			params: {
//				project_id: me.project.get('id'),
//				type: 'rs'
//			}
//		});
		me.loadgrid = function(){
			var tc_v_id = Ext.getCmp('test-tc-version').getValue();
			var rs_v_id = Ext.getCmp('test-rs-version').getValue();
			var build_v_id = Ext.getCmp('test-build-version').getValue();
			if(tc_v_id && rs_v_id && build_v_id){
				var store = Ext.create('casco.store.Tcs');
				store.load({
					params: {
						version_id: tc_v_id,
						rs_version_id: rs_v_id,
						build_id: build_v_id
					},
					callback: function(){
						me.down('grid').reconfigure(store);
					}
				});
			}
				
		};
		var builds = Ext.create('casco.store.Builds');
		builds.load({
			params: {
				project_id: me.project.get('id')
			}
		});
		me.items = [{
			layout: 'column',
			items: [{
				columnWidth:0.25,   
                items:[{
    				fieldLabel: 'Build Version',
    				id: 'test-build-version',
    				name: 'build_id',
    				xtype: 'combobox',
    				editable: false,
    				displayField: 'version',
    				queryMode: 'local',
    				valueField: 'id',
    				store: builds,
    				listeners: {
    					select: function(f, r, i){
    						me.loadgrid();
    					}
    				}
    			}] 
			}]
		},{
			layout: 'column',
			items: [{
				columnWidth:0.25,   
                items:[{
    				xtype: 'combobox',
    				name: 'document_id',
    				editable: false,
    				fieldLabel: 'Tc Document',
    				displayField: 'name',
    				valueField: 'id',
    				store : tcdocs,
    				allowBlank: false,
    				queryMode: 'local',
    				listeners: {
    					select: function(f, r, i) {
    						var st = Ext.create('casco.store.Versions');
    						st.load({
    							params: {
    								document_id: r.get('id')
    							},
    							callback: function(){
    								Ext.getCmp('test-tc-version').store = st;
    							}
    						});
    						Ext.getCmp('test-rs').store.load({
    							params: {
    								document_id: r.get('id'),
    								type: 'rs',
    								mode: 'related'
    							}
    						});
						}
    				}
    			}] 
			},{
				columnWidth:0.25,   
                //layout:"form", 
                items:[{
    				fieldLabel: 'Tc Version',
    				name: 'tag',
    				id: 'test-tc-version',
    				xtype: 'combobox',
    				allowBlank: false,
    				editable: false,
    				queryMode: 'local',
    				displayField: 'name',
    				valueField: 'id',
    				listeners: {
    					select: function(f, r, i){
    						me.loadgrid();
    					}
    				}
    			}] 
			}]
		},{
			layout: 'column',
			items: [{
				columnWidth:0.25,   
                //layout:"form", 
                items:[{
    				xtype: 'combobox',
    				name: 'document_id',
    				id: 'test-rs',
    				editable: false,
    				fieldLabel: 'Rs Document',
    				displayField: 'name',
    				valueField: 'id',
    				store : rsdocs,
    				allowBlank: false,
    				queryMode: 'local',
    				listeners: {
    					select: function(f, r, i) {
    						var st = Ext.create('casco.store.Versions');
    						st.load({
    							params: {
    								document_id: r.get('id')
    							},
    							callback: function(){
    								Ext.getCmp('test-rs-version').store = st;
    							}
    						});
						}
    				}
    			}] 
			},{
				columnWidth:0.25,   
                //layout:"form", 
                items:[{
    				fieldLabel: 'Rs Version',
    				name: 'tag',
    				id: 'test-rs-version',
    				xtype: 'combobox',
    				allowBlank: false,
    				allowBlank: false,
    				editable: false,
    				queryMode: 'local',
    				displayField: 'name',
    				valueField: 'id',
    				listeners: {
    					select: function(f, r, i){
    						me.loadgrid();
    					}
    				}
    			}] 
			}]
		}, {
			layout: 'column',
			items: [{
				xtype: 'grid',
				columnWidth: 1,
				autoScroll: true,
				scroll: true,
				height: 600,
				columns: [{
					text: "tag",
					dataIndex: "tag",
					width: 200
				}, {
					text: "sources",
					dataIndex: "source_json",
					width: 200,
					autoShow: false,
					flex:1,
					renderer: function(value) {
						var value = JSON.parse(value);
						var arr = [];
						Ext.Array.each(value, function(v) {
							arr.push(v.tag);
						});
						return arr.join(', ');
					}
				}, {
					text: "test method",
					dataIndex: "testmethods",
					width: 100,
					renderer: function(tm) {
						var str="";
						for(var i in tm){
							str+=tm[i].name;
						}
						return str;
					}
				}, {
					text: "exe time",
					dataIndex: "tag",
				}, {
					text: "result",
					dataIndex: "result",
					width: 230,
					renderer: function(value, a, record) {
						var str;
						value *= 1; //转换为数字，在某版本pdo有bug
						switch (value) {
						case 0:
							str = '<form><input onclick="setresult(\''+record.get('id')+'\',0)" type="radio" name="result" checked="checked">untested <input onclick="setresult(\''+record.get('id')+'\',1)" type="radio" name="result">passed <input onclick="setresult(\''+record.get('id')+'\',2)" type="radio" name="result">failed</form>';
							break;
						case 1:
							str = '<form><input onclick="setresult(\''+record.get('id')+'\',0)" type="radio" name="result">untested <input onclick="setresult(\''+record.get('id')+'\',1)" type="radio" name="result" checked="checked">passed <input onclick="setresult(\''+record.get('id')+'\',2)" type="radio" name="result">failed</form>';
							break;
						case 2:
							str = '<form><input onclick="setresult(\''+record.get('id')+'\',0)" type="radio" name="result">untested <input onclick="setresult(\''+record.get('id')+'\',1)" type="radio" name="result">passed <input onclick="setresult(\''+record.get('id')+'\',2)" type="radio" name="result" checked="checked">failed</form>';
						}
						return str;
					}
				}, {
					text: "cr",
					dataIndex: "tag",
				}, {
					text: "comment",
					dataIndex: "tag",
				}]
			}]
			
		}];
		me.callParent(arguments);
	}
})
function setresult(id, result){
	var tc_v_id = Ext.getCmp('test-tc-version').getValue();
	var rs_v_id = Ext.getCmp('test-rs-version').getValue();
	var build_v_id = Ext.getCmp('test-build-version').getValue();
	Ext.Ajax.request({
	    url: API+'setresult',
	    params: {
	        tc_id: id,
	        result: result,
	        rs_version_id: rs_v_id,
	        build_id: build_v_id
	    },
	    success: function(response){
	    }
	});
}
