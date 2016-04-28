Ext.define('casco.view.testing.TemplateEdit',{
	extend : 'Ext.window.Window',
	xtype : 'testing.templateedit',
	require : ['casco.store.Testjobs','casco.view.testing.uploadPanel'],
	layout : 'fit',
//	resizable :true,
	modal : true,
	title : 'Template Edit',
	frame : true,
	width : 750,
	controller: 'testing',
	initComponent : function(){
		var me=this;
		this.store = Ext.create('casco.store.TestJobTmp');
		this.store.load({
			params : {
				project_id :this.project.get('id')
			}
		});
        this.items =[  
            {  
                xtype:'uploadPanel',  
                border : false,  
                uploadUrl : '',
				height : 300,
				id:'uploadPanel',
                flashUrl : 'swfupload.swf',
				store:this.store,
				project : this.project,
                filePostName : 'file', //后台接收参数  
                fileTypes : '*.*',//可上传文件类型  
                postParams : {savePath:'upload\\'} //上传文件存放目录  
            }  
        ];
		this.callParent(arguments);
	}
});