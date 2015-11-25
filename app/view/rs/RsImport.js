Ext.define('casco.view.rs.RsImport', {
	extend : 'Ext.window.Window',
	alias : 'widget.rs.rsimport',
	
	requires : [ 
	             'casco.store.Rss', 
	             'casco.store.Versions',
	             //'casco.view.document.version.Create' 
	             ],
	//uses : [],

	modal : true,
	title : 'Document Import',
	width : 400,
	frame : true,
	id : 'import-window',
	viewModel : 'main',
	initComponent : function() {
		var me = this;
		var headers=null;
		//获取最近一次的列名吧
		me.versions = new casco.store.Versions();
		me.versions.load({
			params:{
				document_id: me.document_id,
				newest:'newest'
			},
			callback:function(records, operation, success){
            
			//必须要同步才能取值
			//console.log(records[0].getData().responseText);
			if(records[0].getData().responseText!=""){
			headers=me.versions.getAt(0).get('headers');
		//	console.log(me.down('form').items.getAt(0));
            me.down('form').items.getAt(1).setValue(headers);
			}else{
           
		    if(me.type=="rs") me.down('form').items.getAt(1).setValue("description,implement,source,priority,contribute,category,allocation");
        else if(me.type="tc") me.down('form').items.getAt(1).setValue("test case description,safety,source,test method,pre_condition,test steps");
			}
		}//callback
		});
		

		me.aflag = '';
		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			items : [ {
				//version_id在这里啊
				xtype : 'combobox',
				fieldLabel : 'Version',

				name:'version_id',

				labelWidth : 60,

				store : me.vstore,
				displayField : 'name',
				valueField : 'id',
				queryMode : 'local',
				editable : true,
				width : '100%',
				lastQuery: '',
				listeners : {
					beforequery : function(e) {
						e.query = new RegExp(e.query.trim(), 'i');
						e.forceAll = true;
					},
					blur:function(e){
						var input = e.getRawValue().trim();
						e.setRawValue(input);
						if(input == '') 
							Ext.Msg.alert('Error','Vesrion is NULL ！');
						else if(e.store.find('name',input) == -1){
							Ext.Msg.alert('Notice','New Version: '+ input);
							me.aflag = input;
						}
							//else Ext.Msg.alert('Notice','Exist Version: '+ input);
					}
				}
			}, 
			/*
			 * { fieldLabel: 'Version', name: 'version_id', xtype:
			 * 'hiddenfield', value: me.version_id },
			 */
			{
				xtype:'textfield',
				fieldLabel:'Columns',
				name:'column',
				labelWidth:60,
//				allowBlank:false,
				width:'100%',
				editable:'true',
				value:headers,
				listeners:{
					render:function(field,p){
						Ext.QuickTips.init();
						Ext.QuickTips.register({
							target:field.el,
							text:'请用逗号分隔不同属性,大小写无关,单词之间请空一格'
						})
					}
				}
				
			},{
				xtype : 'filefield',
				name : 'file',
				fieldLabel : 'File',
				labelWidth : 60,
				msgTarget : 'side',
				allowBlank : false,
				anchor : 0,
				width : '100%',
				buttonText : 'Select File'
			}, {
				xtype : 'hiddenfield',
				name : 'type',
				value : me.type, 
				allowBlank : false,
			},{
				xtype:'hiddenfield',
				name:'isNew',
				value: 0,
			},{
				xtype: 'hiddenfield',
				name: 'document_id',
				value: me.document_id
			}],
		
			buttons : [ {
				text : 'Import',
				handler : function() {
					var self = this;
					var form = this.up('form').getForm();
					//Ext.Msg.alert('Test',);
					if(me.aflag) form.findField('isNew').setValue(1);
					if (form.isValid()) {
						form.submit({//为什么一直为false
							url : API + 'docfile',
							waitMsg : 'Uploading file...',
						    params:{'name':me.aflag},
							success : function(form,action) {
							 Ext.Msg.alert('Success',action.response.responseText);
							
							 // console.log(action);
							},
	                        failure: function(form,action) { 
							
	            
							 var   versions = new casco.store.Versions();
							 versions.load({
						     synchronous: true,
                             scope:this,
					         callback:function(){
					   		 
							 // console.log((versions.getAt(0)));
			                  Ext.Msg.alert('导入结果!',(versions.getAt(0).get('result')));
							  // Ext.Msg.alert(record.get('result'));
							 }
							 });


							 self.up('window').destroy();
                              var t=Ext.getCmp("docv-"+me.document_id);
							  t.store.reload();
    	                     /* var t = Ext.ComponentQuery.query("#tab-"+me.document_id)[0];
    	          		      t.store_rs.reload();
							  t.getView().refresh();
							  */
							  }//failure
											  
							 
						});//submit
					}
				}
			} ],
		} ];

		me.callParent(arguments);
	},

	doHide : function() {
		this.hide();
	}
});