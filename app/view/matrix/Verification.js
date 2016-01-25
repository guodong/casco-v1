Ext.define('casco.view.matrix.Verification', {
    extend: 'Ext.grid.Panel',
    xtype: 'matrix.verification',
    controller:'matrix',
    requires:['casco.store.Verification','casco.model.Verification','casco.view.matrix.VerificationCreate',
		'casco.view.matrix.ParentMatrix','casco.view.matrix.ChildMatrix','casco.view.matrix.Summary',
		'casco.view.matrix.MatrixController'],

    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
    	}
    },
    bodyPadding: 0,
	forceFit:true,
    initComponent: function(){
    	var me = this;
    	me.store = new casco.store.Verification();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id'),
				child_id:me.child_id?me.child_id:''
    		}
    	});
		var states = Ext.create('Ext.data.Store', {
		fields: ['abbr', 'name'],
		data : [
			{"abbr":"ALL","name":"All"},
			{"abbr":"AL", "name":"ParentMatrix"},
			{"abbr":"AK", "name":"ChildMatrix"},
			{"abbr":"AZ", "name":"Summary"}			
		]
		});
		me.columns = [{
			text : 'version',
			dataIndex : 'version'
		}, {
			text : 'author',
			dataIndex : 'author'
		},{
			text : 'child:version',
			dataIndex : 'child_version',
			renderer : function(v) {
				return v?v.document.name+":"+v.name:'';
			}
		},{
			text: 'parent:versions',
			dataIndex: 'parent_versions',
			renderer: function(value){
						var arr = [];
						Ext.Array.each(value, function(v) {
							arr.push(v.document.name+':'+v.name);
						});
						return arr.join(',	');
			}
		}, {
			text: 'description',
			dataIndex: 'description'
		},{
			text: 'created at',
			dataIndex: 'created_at',
			 
		},{
			
			text:'view',
			dataIndex:'id',
			width:120,
			renderer:function(val_id,metaData,rec){
			 var id = Ext.id();	 
             Ext.defer(function() {
               	Ext.create('Ext.form.ComboBox', {
				store: states,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'abbr',
                glyph: 0xf0ce,
				val_id:val_id,//依赖注入,组件扩展性很好哇
			    emptyText: 'Switch View',
				listeners: {
            	select: function(combo,irecord){
				   me.switchView(combo,irecord,rec);
				}
				},
				renderTo:id
				});   
            }, 50);
            return Ext.String.format('<div style="color:0xf0ce" id="{0}" ></div>', id);
			}//renderer
		}, {
			text: 'status',
			dataIndex: 'status',
			renderer:function(val,meta,rec){
			var id=Ext.id();
			if(val==1){
		    Ext.defer(function(){
			  Ext.widget('button', {
			      renderTo:id,
			      text:'提交',
				  glyph: 0xf040,
                  scale: 'small',
                  listeners: {
                  click:function(self, e, eOpts){
				  rec.set('status',0);
				  //console.log(rec.data);
				  rec.save({
					//params:{status:rec.data.status},
					success: function(){
						var tabs = Ext.getCmp('matrixpanel');
						tabs.updateLayout();
						Ext.Msg.alert('','提交成功!');
						//还应该做一件事情就是刷新tabs
					},
					failure: function(){
						Ext.Msg.alert('','提交失败，请检查配置');
					}});
				 // me.store.setData(rec.data);
				  }
				  }
		      });
		   },70);	   
          return Ext.String.format('<div id="{0}"></div>',id);
          }else{
             Ext.defer(function(){
			  Ext.widget('button', {
			      renderTo:id,
			      text:'撤销',
				  glyph: 0xf040,
                  scale: 'small',
                  listeners: {
                  click:function(self, e, eOpts){
				  rec.set('status',1);
				  rec.save({
					success: function(){
						var tabs = Ext.getCmp('matrixpanel');
						tabs.updateLayout();
						Ext.Msg.alert('','撤销成功!');
						
					},
					failure: function(){
						Ext.Msg.alert('','撤销失败，请检查配置');
					}});
				  }
				  }
		      });
		   },70);
		   
          return Ext.String.format('<div id="{0}"></div>',id);
          }
          }
		 
		}];


	me.switchView=function(combo,irecord,rec){
     
	  //有rec
      combo.setValue(combo.emptyText);
	  var v_id=combo.val_id;
	  var json=[];
      switch(irecord.get('name')){
      case 'ParentMatrix':
    	  if(rec.get('parent_versions').length<=0){return;}
			Ext.Array.each(rec.get('parent_versions'), function(v) {
			var tmp={'xtype':'parentmatrix','title':v.document.name+'_'+rec.get('child_version').document.name+'_Com','id':'parentmatrix'+v.id,
		    'verification':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null};
			tmp['parent_v_id']=v.id;
			json.push(tmp);
			});  
		  break;
	  case 'ChildMatrix':
          json={'xtype':'childmatrix','title':rec.get('child_version').document.name+'_Tra','id':'childmatrix'+v_id,
        		'verification':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null};
		  
		  break;
	  case  'Summary':
		  json={'xtype':'summary','title':'summary','id':'summary'+v_id,
		       'verification':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null};
				  
		  break;
	  case  'All':
		  	Ext.Array.each(rec.get('parent_versions'), function(v) {
			var tmp={'xtype':'parentmatrix','title':v.document.name+'_'+rec.get('child_version').document.name+'_Com','id':'parentmatrix'+v.id,
		    'verification':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null};
			tmp['parent_v_id']=v.id;
			json.push(tmp);
			}); 
		  	json.push({'xtype':'childmatrix','title':rec.get('child_version').document.name+'_Tra','id':'childmatrix'+v_id,
		        	'verification':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null});
			json.push({'xtype':'summary','title':'summary','id':'summary'+v_id,
	        	'verification':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null}); 
		  break;
	   default:
	  }

       //写个递归方便多了啊
       var create_tab=function(record){
       if(Array.isArray(record)){
       Ext.Array.each(record,function(name,index){create_tab(name)});
	   }
       else{
		var tabs= Ext.getCmp('matrixpanel');
		var tab=tabs.child('#'+record.id);
		if(!tab)tab=tabs.add(record);
	    tabs.setActiveTab(tab);
	   }
	   }
       create_tab(json);
	},


		me.tbar = [{
			text: 'Create Verification',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var job = Ext.create('casco.model.Verification');
				var win = Ext.create('widget.matrix.create', {
					project: me.project,
					job: job
				});
				win.down('form').loadRecord(job);
				win.show();
			}
		},'-',{
			text: 'Delete Verification',
			glyph: 0xf068,
			scope: this,
			handler:function(){
               Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){   //confirm
					if(choice == 'yes'){
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (selection) {
							me.store.remove(selection);
							selection.erase();
						}
					}}, this);
			}
		},'-',{
		 text: 'Export',
		 scope: this,
		 handler:function(){
         window.open(API+'verification/export?project_id='+me.project.get('id')+'&child_id='+me.child_id);
          return;
		 }
		}];
    	this.callParent();
    }
})