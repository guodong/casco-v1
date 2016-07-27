
Ext.define('casco.view.vat.VatView',{
	extend: 'Ext.grid.Panel',
	xtype: 'vat.view',
	viewModel: 'vat',
	requires: [],
	
//    bodyPadding: 0,
	forceFit:true,
	columnLines: true,
	
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
		
		var chioces = Ext.create('Ext.data.Store', {
		fields: ['abbr', 'name'],
		data : [
		    {"abbr":"all", "name":"ALL"},
			{"abbr":"forward","name":"TC-RS"},
			{"abbr":"backward", "name":"RS-TC"}
		]
		});
		
		me.columns = [{
			text : 'name',
			dataIndex: 'name'
		},{
			text: 'description',
			dataIndex: 'description'
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
			width: 150
		},{
			text:'view',
			dataIndex:'id',
			width:130,
			renderer:function(val_id,metaData,rec){ //data value from current cell,column_cell,vat_build_data
			 var id = Ext.id();	 
             Ext.defer(function(e) {	//延迟调用 miliseconds
               	Ext.create('Ext.button.Button', {
				text: 'Show Relation',
				renderTo: id,
				handler: function(){
					console.log(rec);
					var json = [];
					json.push({
						'xtype': 'vatrelations',
						'title': rec.get('tc_version').document.name+'-'+rec.data.name,
						'id': 'vatrelation'+val_id,
					    'relation': rec,
					    'closable':true,
//					    version:irecord.get('version')?irecord.get('version'):null
					});
					console.log(json);
					var tabs = Ext.getCmp('vatpanel');
					console.log(tabs);
					var tab = tabs.child('#'+json[0].id);
					console.log(tab);
					if(!tab) tab = tabs.add(json[0]);
					tabs.setActiveTab(tab);
				}
				});   
            }, 50);
            return Ext.String.format('<div style="color:0xf0ce" id="{0}" ></div>', id);
			}//renderer
		}];
		
		me.tbar = [{
			text: 'Create Vat',
			glyph: 0xf067,
			scope: this,
			handler: function() {
				var vv = Ext.create('casco.model.Vat',{
					id: null
				});
//				console.log(vv);
				var win = Ext.create('widget.vat.vatcreate', {
					project: me.project,
					document: me.document,
					p_id:p_id?p_id:'',
					vat: vv
				});
				win.down('form').loadRecord(vv);
				win.show();
			}
		},{
			text: 'Delete Vat',
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
		
		me.chooseView = function(combo,irecord,rec){ //combo-chose,combo-record,vat_build_record
			console.log(rec);
			console.log(combo);
			console.log(irecord);
			  //有rec
//		      combo.setValue(combo.emptyText);
			  var v_id=combo.val_id;
			  var json=[];
		      switch(irecord.get('name')){
		      case 'TC-RS':
		    	  if(rec.get('parent_versions').length<=0){return;}
					Ext.Array.each(rec.get('parent_versions'), function(v) {
					var tmp={'xtype':'parentmatrix','title':v.document.name+'_'+rec.get('child_version').document.name+'_Com','id':'parentmatrix'+v_id+v.id,
				    'verification':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null};
					tmp['parent_v_id']=v.id;
					json.push(tmp);
					});  
				  break;
			  case 'RS-TC':
		          json={'xtype':'childmatrix','title':rec.get('child_version').document.name+'_Tra','id':'childmatrix'+v_id,
		        		'verification':rec,'closable':true,version:irecord.get('version')?irecord.get('version'):null};
				  
				  break;
			  case  'All':
				  	Ext.Array.each(rec.get('parent_versions'), function(v) {
					var tmp={'xtype':'parentmatrix','title':v.document.name+'_'+rec.get('child_version').document.name+'_Com','id':'parentmatrix'+v_id+v.id,
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
			
		};

    	this.callParent();
    }
})