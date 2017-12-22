Ext.define('casco.view.testing.Test', {
	extend: 'Ext.form.Panel',
	alias: 'widget.test',
	requires: ['casco.store.Tcs','casco.store.Documents','casco.store.Builds','Ext.layout.container.Column', 'casco.store.Versions','casco.view.testing.Testmore'],

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
		var resultStore = Ext.create('Ext.data.Store', {
        	model: 'casco.model.Result',
            data : [
	                {label: '未测试',   value: 0},
	                {label: '通过',   value: 1},
	                {label: '失败',   value: 2},
            ]
        });
		me.loadgrid = function(){
			var tc_v_id = Ext.getCmp('test-tc-version').getValue();
			var rs_v_id = Ext.getCmp('test-rs-version').getValue();
			var build_v_id = Ext.getCmp('test-build-version').getValue();
			if(tc_v_id && rs_v_id && build_v_id){
				var store = Ext.create('casco.store.Results');
				store.load({
					params: {
						tc_version_id: tc_v_id,
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
    				fieldLabel: 'Build版本',
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
    				fieldLabel: '测试用例文档',
    				displayField: 'name',
    				valueField: 'id',
    				store : tcdocs,
					allowBlank: false,
					blankText: "不能为空",
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
    				fieldLabel: '测试用例版本',
    				name: 'tag',
    				id: 'test-tc-version',
    				xtype: 'combobox',
					allowBlank: false,
					blankText: "不能为空",
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
    				fieldLabel: '需求文档',
    				displayField: 'name',
    				valueField: 'id',
    				store : rsdocs,
					allowBlank: false,
					blankText: "不能为空",
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
    				fieldLabel: '需求版本',
    				name: 'tag',
    				id: 'test-rs-version',
    				xtype: 'combobox',
    				allowBlank: false,
    				blankText: "不能为空",
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
				selModel: 'cellmodel',
			    plugins: {
			        ptype: 'cellediting',
			        clicksToEdit: 1
			    },
				listeners : {
			        celldblclick: function(a,b,c, record, item, index, e) {
			        	var win = Ext.create('widget.testmore',{tc: record});
			            win.show();
			        }
			    },
				columns: [{
					text: "标签",
					dataIndex: "tag",
					width: 200
				}, {
					text: "sources",
					dataIndex: "source_json",
					width: 200,
					autoShow: false,
					flex:1,
					renderer: function(value) {
						//plunk函数?
						var value = JSON.parse(value);
						var arr = [];
						Ext.Array.each(value, function(v) {
							arr.push(v.tag);
						});
						return arr.join(', ');
					}
				}, {
					text: "测试方法",
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
					text: "执行时间",
					dataIndex: "exe_at",
					width: 140,
					editor: {
						xtype: 'datefield',
						format: 'Y-m-d'
					},
					renderer: function(value){
						return Ext.util.Format.date(value, 'Y-m-d');
					}
				},{
				    xtype: 'gridcolumn',
				    dataIndex: 'result',
					  width: 120,
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
				        return resultStore.findRecord('value', value).get('label');
				    },
				    text: '结果',
				    editor: {
				        xtype: 'combobox',
				        queryMode: 'local',
	    				displayField: 'label',
	    				valueField: 'value',
	    				editable: false,
				        store: resultStore
				    }
				}, {
					text: "cr",
					dataIndex: "cr",
				}]
			}]
		}];
		me.callParent(arguments);
	}
})
function setresult(id, result){return;
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
