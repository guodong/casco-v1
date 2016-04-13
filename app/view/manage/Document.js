Ext.define('casco.view.manage.Document', {
    extend: 'Ext.window.Window',
    requires: [
        'casco.view.main.MainController',
        'casco.view.main.MainModel',
        'casco.view.main.Top',
        'casco.view.project.Project',
        'casco.view.main.Tree',
        'casco.store.TcSteps'
    ],
    width: '65%',
	height: '80%',
	modal: true,
	maximizable: true,
    controller: 'manage',
    viewModel: {
        type: 'manage'
    },
    layout: {
		type: 'border'
	},
    initComponent : function() {
		Ext.setGlyphFontFamily('FontAwesome'); // 设置图标字体文件，只有设置了以后才能用glyph属性
		var me = this;//接受传过来的参数
		var store = Ext.create('casco.store.TreeDocuments', {
    		proxy: {
    			extraParams: {
    				project_id: me.project.get('id')
    			}
    		}
    	});
		this.items = [{
	        xtype: 'tree',
	        id: 'mtree',
	        itemId: 'mtree',
			store:store,
	        title: me.project.name,
	        project: me.project,//parameters是可以自动设置从而调用的
	        region: 'west',
			width: 200,
	        split: true,
	        collapsible: true,
	        editable: true
	    },{
	        region: 'center',
	        xtype: 'tabpanel',
			id:'workingpanel',
	        reference: 'main',
	        items:[{
	            title: 'Main',
	            html: '<iframe id="draw" src="/draw/index.html?'+me.project.id+'&_d='+Date.parse(new Date())+'" style="width:100%;height:100%;border:0"></iframe>'
	           
			}]
	    }]
		 
		this.callParent();
	},

    
});
