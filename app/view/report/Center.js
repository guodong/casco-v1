Ext.define('casco.view.report.Center', {
    extend: 'Ext.grid.Panel',
    xtype: 'report.center',
    controller:'report',
    requires:[
		'casco.view.report.CenterCreate',
		'casco.view.report.ReportController',
		'casco.view.report.Verify'],

//    listeners: {
//        itemdblclick: function(view, record, item, index, e, eOpts){
//    	}
//    },
		
    bodyPadding: 0,
	forceFit:true,
	
    initComponent: function(){
    	var me = this;
    	var p_id=me.id;
    	me.store = new casco.store.Center();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id'),
				doc_id:me.child_doc.data.id?me.child_doc.data.id:''
    		}
    	});
    	
		var states = Ext.create('Ext.data.Store', {
		fields: ['abbr', 'name'],
		data : [
			{"abbr":"All","name":"All"},
			{"abbr":"ReportCoverStatus", "name":"需求覆盖状态"},
			{"abbr":"TestCaseResults", "name":"用例测试结果"},
			{"abbr":"ReportVerify", "name":"分配本阶段需求"}			
		]
		});
		
		me.columns = [{
			text : 'version',
			dataIndex : 'version',
			width: 80,
			renderer:function(value,metadata,record){
				var tmp = [];
				//请判断一下,到处都是bug
				var rsvs = record.get('docs')||[];
				var str = "VAT信息："+((record.get('testjob')||'').vatbuild.name)+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+"TC文档信息：" +  record.get('testjob').tc_version.document.name + "-" +   record.get('testjob').tc_version.name + "<br/>" + "RS文档信息：";
				tmp.push(str);
				for(var i in rsvs){
					str = "[" + rsvs[i].document.name + "-" + rsvs[i].name + "]";
					tmp.push(str);
				}
				var value = tmp.join(' ');
			    metadata.tdAttr = 'data-qtip="' + value + '\n"'  ; //提示信息
			    return record.get('version');
			}
		}, {
			text : 'author',
			dataIndex : 'author',
			width: 80
		},{
			text: 'description',
			dataIndex: 'description',
			width: 100
		},{
			text: 'created at',
			dataIndex: 'created_at',
			width: 110
		},{
			text:'view',
			dataIndex:'id',
			width:140,
			renderer:function(val_id,metaData,rec){
			 var id = Ext.id();
             Ext.defer(function() {
               	Ext.create('Ext.form.ComboBox', {
				store: states,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'abbr',
				val_id:val_id,//依赖注入,组件扩展性很好哇 report id
			    emptyText: 'Switch View',
				listeners: {
            	select: function(combo,irecord){
				   me.switchView(combo,irecord,rec);
					}
               	},
				renderTo:id  //Ext.id
				}); 
            }, 50);
            return Ext.String.format('<div style="color:0xf0ce" id="{0}" ></div>', id);  //嵌入combobox
			}//renderer
		}];


	me.switchView=function(combo,irecord,rec){   //rec:report info
	  //有rec
      combo.setValue(combo.emptyText);
	  console.log(rec);
	  var v_id=combo.val_id;
	  var json=[];
      switch(irecord.get('abbr')){
      case 'ReportCoverStatus':
    	  json={'xtype':'reportcover','title':'需求覆盖状态','id':'reportcover_'+v_id,
        		'report':rec,'closable':true};
		  break;
	  case 'TestCaseResults':
          json={'xtype':'result','title':'用例测试结果','id':'testing_'+v_id,
        		'report':rec,'closable':true};
		  break;
	  case  'ReportVerify':
		   var tmps=[];
		   Ext.Array.each(rec.get('docs'), function(v) {
			var tmp={'xtype':'verify','title':v.document.name+":"+v.name,'id':'verify'+rec.id+v.id,
		    'report':rec,'doc_id':v.id,'closable':true};
			//tmp['doc_id']=v.id;//version_id
			tmps.push(tmp);
			}); 
			json={title:'分配给本阶段验证需求', xtype: 'tabpanel',items:tmps,'closable':true};
		  break;
	  case  'All':
		  	var tmps=[];
		    Ext.Array.each(rec.get('docs'), function(v) {
			var tmp={'xtype':'verify','title':v.document.name+":"+v.name,'id':'verify'+rec.id+v.id,
		    'report':rec,'doc_id':v.id,'closable':true};
			tmps.push(tmp);
			}); 
			json.push({title:'分配给本阶段验证需求', xtype: 'tabpanel',items:tmps,'closable':true});
		  	json.push({'xtype':'result','title':'用例测试结果','id':'testing_'+v_id,
        		'report':rec,'closable':true});
			json.push({'xtype':'reportcover','title':'需求覆盖状态','id':'reportcover_'+v_id,
        		'report':rec,'closable':true});
		  break;
	   default:
	  }

      
       //写个递归方便多了啊
       var create_tab=function(record){
       if(Array.isArray(record)){
       Ext.Array.each(record,function(name,index){create_tab(name)});
	   }
       else{
		var tabs= Ext.getCmp('reportpanel');
		var tab=tabs.child('#'+record.id);
		if(!tab)tab=tabs.add(record);
	    tabs.setActiveTab(tab);
	   }
	   }
       create_tab(json);
	},

		me.tbar = [{
			text: 'Create Report',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var job = Ext.create('casco.model.Center');
				var win = Ext.create('widget.report.create', {
					project: me.project,
					job: job,
					child_doc:me.child_doc,
					p_id:p_id?p_id:''
				});
//				console.log(child_doc);
				console.log(job);
				win.down('form').loadRecord(job);
				win.show();
			}
		},'-',{
			text: 'Delete Report',
			glyph: 0xf068,
			scope: this,
			handler:function(){
               Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){   //confirm
					if(choice == 'yes'){
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (selection) {
							me.store.remove(selection);
							selection.erase(/*{
							waitMsg : '正在删除......',
							failure: function(record, operation) {
								// do something if the erase failed
								Ext.Msg.alert('删除失败!');
							},
							success: function(record, operation) {
								Ext.Msg.alert('删除成功!');
								// do something if the erase succeeded
							},
							callback: function(record, operation, success) {
								// do something if the erase succeeded or failed
							}
							}*/);
							//view.refresh();
						}
					}}, this);
			}
		},'-',{
			 text: 'Export All Sheets',
			 scope: this,
			 handler:function(){
			  
				var view=me.getView();
				var selection =view.getSelectionModel().getSelection()[0];
				if (!selection) {
				 Ext.Msg.alert('请选择某一个版本!');
				}
	           window.open(API+'center/export_all_sheets?report_id='+selection.get('id')||'');
	           return;
			 }
		}];
    	this.callParent();
    }
})