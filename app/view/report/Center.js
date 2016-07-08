Ext.define('casco.view.report.Center', {
    extend: 'Ext.grid.Panel',
    xtype: 'report.center',
    controller:'report',
    requires:[
		//'casco.store.Center','casco.model.Center',
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
				child_id:me.child_doc.data.id?me.child_doc.data.id:''
    		}
    	});
    	
		var states = Ext.create('Ext.data.Store', {
		fields: ['abbr', 'name'],
		data : [
			{"abbr":"ALL","name":"All"},
			{"abbr":"AL", "name":"ReportCover"},
			{"abbr":"AK", "name":"ReportResults"},
			{"abbr":"AZ", "name":"ReportVerify"}			
		]
		});
		
		me.columns = [{
			text : 'version',
			dataIndex : 'version',
			width: 80
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
	  var v_id=combo.val_id;  //report id
	  var json=[];
      switch(irecord.get('name')){
      case 'ReportCover':
    	  json={'xtype':'reportcover','title':'需求覆盖状态','id':'cover'+v_id,
    		  'report':rec,'closable':true}; 
		  break;
	  case 'Childreport':
          json={'xtype':'childreport','title':rec.get('child_version').document.name+'_Tra','id':'childreport'+v_id,
        		'Center':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null};
		  
		  break;
	  case  'ReportVerify':
		  json={'xtype':'verify','title':'verify','id':'verify'+v_id,
		       'report':rec,'closable':true};
		  break;
	  case  'All':
		  	Ext.Array.each(rec.get('parent_versions'), function(v) {
			var tmp={'xtype':'parentreport','title':v.document.name+'_'+rec.get('child_version').document.name+'_Com','id':'parentreport'+v_id+v.id,
		    'Center':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null};
			tmp['parent_v_id']=v.id;
			json.push(tmp);
			}); 
		  	json.push({'xtype':'childreport','title':rec.get('child_version').document.name+'_Tra','id':'childreport'+v_id,
		        	'Center':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null});
			json.push({'xtype':'verify','title':'verify','id':'verify'+v_id,
		       'Center':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null});
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
		 text: 'Export Report',
		 scope: this,
		 handler:function(){
         window.open(API+'Center/export?project_id='+me.project.get('id')+'&child_id='+me.child_doc.data.id);
          return;
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
	           window.open(API+'Center/export_all_sheets?project_id='+me.project.get('id')+'&child_id='+me.child_doc.data.id+
	        		   '&v_id='+selection.get('id'));
	           return;
			 }
		}];
    	this.callParent();
    }
})