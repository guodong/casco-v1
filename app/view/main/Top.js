Ext.define('casco.view.main.Top', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.top',
    
    style: {background: '#32404e',padding: '10px',color: '#fff'},
    initComponent: function(){
    	this.items = [{
            xtype: 'label',
            html: 'CASCO TEST CENTER',
            style: 'font-size: 27px;'
        },'->',{
            text: 'Manage',
            xtype: 'button',
            handler: function(){
            	localStorage.view = 'manage';
            	location.reload();
            },
            hidden: localStorage.view == 'manage'?true:false
        }
        ,{
            text: 'Testing',
            xtype: 'button',
            handler: 'testing',
            hidden: localStorage.view == 'manage'?true:false
        },{
            text: 'Project Stat',
            xtype: 'button',
            handler: function(){
            	window.open("/prostat/projectstat-tmp.htm");
            },
            hidden: localStorage.view == 'manage'?false:true
        },{
            text: 'Relation view',
            xtype: 'button',
            handler: function(){
            	window.open('/draw/graph2.html');
            }
        }];
    	this.callParent();
    }
})