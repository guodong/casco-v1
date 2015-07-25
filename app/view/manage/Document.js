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
    controller: 'main',
    viewModel: {
        type: 'main'
    },
    layout: {
		type: 'border'
	},
    initComponent : function() {
		Ext.setGlyphFontFamily('FontAwesome'); // 设置图标字体文件，只有设置了以后才能用glyph属性
		var me = this;
		this.items = [{
	        xtype: 'tree',
	        id: 'mtree',
	        itemId: 'mtree',
	        title: me.project.name,
	        project: me.project,
	        region: 'west',
	        width: 200,
	        split: true,
	        collapsible: true,
	        editable: true
	    },{
	        region: 'center',
	        xtype: 'tabpanel',
	        reference: 'main',
	        items:[{
	            title: 'Main',
	            html: '<iframe id="draw" src="/draw/index.html?'+me.project.id+'" style="width:100%;height:100%;border:0"></iframe>'
	        }]
	    }]
		this.callParent();
	},

    
});
