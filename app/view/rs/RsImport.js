Ext.define('casco.view.rs.RsImport', {
	extend : 'Ext.window.Window',
	alias : 'widget.rs.rsimport',
	requires : [ 
	             'casco.store.Rss', 
	             'casco.store.Versions'
	             ],
	modal : true,
	title : 'Document Import',
	width : 500,
	frame : true,
	id : 'import-window',
	viewModel : 'main',
	initComponent : function() {
		var me = this;
		var headers=null,regrex=null;
		// 获取最近一次的列名吧
		me.versions = new casco.store.Versions();
		me.versions.load({
			params:{
				document_id: me.document_id,
				newest:'newest'
			},
			callback:function(records, operation, success){
			// 必须要同步才能取值
			if(records[0].getData().responseText!=""){
			//用loadRecord多好
			headers=me.versions.getAt(0).get('headers');
			regrex=me.versions.getAt(0).get('regrex');
			//me.down('form').loadRecord(me.versions.getAt(0));
            me.down('form').items.getAt(1).setValue(headers);
			me.down('form').items.getAt(3).setValue(regrex);
			}else{
           
		    if(me.type=="rs") {me.down('form').items.getAt(1).setValue("description,implement,source,priority,contribute,category,allocation");}
		    else if(me.type="tc") me.down('form').items.getAt(1).setValue("test case description,safety,source,test method,pre_condition,test steps");
			}
		}// callback
		});
		

		me.aflag = '';
		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			items : [ {
				// version_id在这里啊
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
				allowBlank: false,
				blankText: 'Version不能为空，请输入或选择',
				msgTarget : 'side',
				lastQuery: '',
				listeners : {
					beforequery : function(e) {
						e.query = new RegExp(e.query.trim(), 'i');
						e.forceAll = true;
					},
					blur:function(e){
						var input = e.getRawValue().trim();
						e.setRawValue(input);
						//输入为空的判断
//						if(input == '') 
//							Ext.Msg.alert('Error','Vesrion is NULL ！');
//						else 
						if(input != '' && e.store.find('name',input) == -1){
							Ext.Msg.alert('Notice','您创建了版本: '+ input + ' ,将在该版本中导入文档');
							me.aflag = input;
						}
							// else Ext.Msg.alert('Notice','Exist Version: '+
							// input);
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
				width:'100%',
				editable:'true',
				value:headers,
				validator: function (val) {
					//哥写的正则,666
				     	var re=/(([\w]\\+\s?)+){1,}/g;
				        var tn = val.match(re),
				        errMsg = "输入格式不符合规范,请检查";
				       // console.log(tn);
				        return true;
				},
				listeners:{
					render:function(field,p){
						Ext.QuickTips.init();
						Ext.QuickTips.register({
							target:field.el,
							text:'大小写无关,多个单词请空一格'
						});
					},
					specialkey: function(field,e){    
                        if (e.getKey() == e.ENTER){
                        }  
                    }  
				}// listenres
			},{
				   xtype:'checkboxfield',
				   fieldLabel:'IsMerge',
				   checked:false,
				   name:'ismerge',
				   hidden:me.type!='tc'?true:false,
                   inputValue:'1',
				   uncheckedValue:'0',
				   boxLabel:'是否含有合并单元格'
			},{
				xtype:'textfield',
				fieldLabel:'TC regex',
				name:'regrex',
				labelWidth:60,
				width:'100%',
				hidden:me.type!='tc'?true:false,
				editable:'true',
				validator: function (obj) {
					//作为一个json字符串形式来进行验证的
				     	var re=/(([\w]+\s?)+,?){1,}/g;
				        var tn = obj.match(re),
				        errMsg = "输入格式不符合规范,请检查";
				       // console.log(tn);
				        return true;
				},
				listeners:{
					render:function(field,p){
						Ext.QuickTips.init();
						Ext.QuickTips.register({
							target:field.el,
							text:''
						});
					},
					specialkey: function(field,e){    
                        if (e.getKey() == e.ENTER){
                        }  
                    }  
				}// listenres
			},{
				xtype : 'filefield',
				name : 'file',
				fieldLabel : 'File',
				labelWidth : 60,
				msgTarget : 'side',
				allowBlank : false,
				blankText: '请选择需要导入的文档',
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
					var self = this;var obj=null;
					var form = this.up('form').getForm();
					console.log(form);
					// Ext.Msg.alert('Test',);
					if(me.aflag) form.findField('isNew').setValue(1);
					if (form.isValid()) {
						// ajax请求
						setTimeout(function ask_signal(){
								Ext.Ajax.request({
									url: API + 'docfile_pre',
									method: 'get',
									success: function(response,opts){
									this.obj=response.responseText;
										Ext.Msg.show({
											title:'提示',
											icon:Ext.MessageBox.INFO,
											msg:'队列已有'+this.obj+'项任务正在进行,确定继续?',
											width:300,
											buttonText:{yes:'Continue',cancel:'Cancel'},
											fn:function(buttonid){
											if(buttonid=='cancel'){self.up('window').destroy();return;}
											form.submit({// 为什么一直为false
												url : API + 'docfile',
												waitMsg : 'Uploading file...',
											    params:{'name':me.aflag},
												success : function(form,action) {
												 Ext.Msg.alert('Success',action.response.responseText);
												},
						                        failure: function(form,action) {
												 console.log(action.response);
												 var versions = new casco.store.Versions();
												 versions.load({
												 params:{'document_id': me.document_id,'new_update':true},
											     synchronous: true,
					                             scope:this,
										         callback:function(){
												 // console.log((versions.getAt(0)));
								                  Ext.Msg.alert('导入结果!',(versions.getAt(0).get('result')));
												 }
												 });
												 self.up('window').destroy();
					                              var t=Ext.getCmp("docv-"+me.document_id);
												  t.store.reload();
					    	                     /*
													 * var t =
													 * Ext.ComponentQuery.query("#tab-"+me.document_id)[0];
													 * t.store_rs.reload();
													 * t.getView().refresh();
													 */
												  }// failure
											});// submit
										}// function
										});// show
									}
								});//ajax
								},0001);
							
						 }//valid
						
					
					
						
					}//handler
			
			} ],
		} ];

		me.callParent(arguments);
	},

	doHide : function() {
		this.hide();
	}
});