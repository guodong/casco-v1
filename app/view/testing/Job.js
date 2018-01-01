Ext.define('casco.view.testing.Job', {
    extend: 'Ext.grid.Panel',
    xtype: 'testing.job',
    requires:['casco.store.Testjobs',
              'Ext.grid.filters.Filters'],
    
    forceFit: true,
    plugins: 'gridfilters',
    
    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	Ext.getCmp('result-main').job = record;
        	Ext.getCmp('result-main').store.load({
        		params: {
        			job_id: record.get('id')
        		}
        	});
    	}
    },
    bodyPadding: 0,
    initComponent: function(){
    	var me = this;
		me.addListener("datachanged",function(){
		Ext.getCmp('result-main').getStore().reload(); 
		Ext.getCmp('testing-step-panel').getStore().reload();
		});
    	me.store = new casco.store.Testjobs();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id')
    		}
    	});
    	
		me.columns = [{
			text : '名称',
			dataIndex : 'name'
		}, {
			text : 'build',
			dataIndex : 'build',
			renderer : function(v) {
				return v?v.name:'';
			},
			filter:{
				type: 'string',
			}
		},{
			text: '测试用例',
			dataIndex: 'tc_version',
			renderer: function(v){
				if(!v) return;
				var value = v.document.name +'-'+v.name;
				return value;
			},
		},{
			text: '定版',
			dataIndex: 'vatbuild',
			renderer: function(value,metadata,record){ //value-rs_versions(current cell); metadata-cell metadata; record-Ext.data.Model
				return getPreview(value,metadata,record);
			},
			filter:{
				type: 'string',
			}
		},{
			text: '状态',
			dataIndex: 'status',
			renderer: function(v){
				return v==0?'<span style="color:red">测试中</span>':'<span style="color: green">已提交</span>';
			}
		}, {
			text: '修改人',
			dataIndex: 'user',
			renderer: function(v){
				return v?v.realname:'';
			}
		},{
			text: '创建时间',
			dataIndex: 'created_at',
		}];
		me.tbar = [{
			text: '点击添加',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var job = Ext.create('casco.model.Testjob');
				var win = Ext.create('widget.testing.jobcreate', {
					project: me.project,
					job: job
				});
				win.down('form').loadRecord(job);
				win.show();
			}
		},{
			text: '删除选中',
			glyph: 0xf068,
			scope: this,
			handler: function() {
				Ext.MessageBox.buttonText.yes = '是';
				Ext.MessageBox.buttonText.no = '否';
				var view=me.getView();
				var selection =view.getSelectionModel().getSelection()[0];

				if(selection){
					Ext.Msg.confirm('确认', '确认删除选中的Testjob?', function(choice){   //confirm
						if(choice == 'yes'){
								me.store.remove(selection);
								selection.erase();
					}}, this);
				}else{
					Ext.Msg.alert('注意','请先选中需要删除的Testjob！');
				}
			}
		},{
			text: '编辑模板',
			glyph: 0xf093,
			scope: me,
			handler: function() {
				var win = Ext.create('widget.testing.templateedit', {
					project: me.project,
				});
				win.show();
			}
		}];
		
		function getPreview(value,metadata,record){ //record-rsversions
			var tmp = [];
			var docs = record.data.vatbuild.doc_versions;
			for(var i in docs){
				var str = "[" + docs[i].document.name + "-" + docs[i].name + "]";
				tmp.push(str);
			}
			var value = tmp.join(' ');
		    metadata.tdAttr = 'data-qtip="'+ "文档版本信息:  <br/>" + value + '"'  ; //提示信息
		    return record.data.vatbuild.name;
		};
		
    	this.callParent();
    }
})