
Ext.define('casco.view.document.DocTree', {
    extend : 'Ext.tree.Panel',
    alias : 'widget.doctree',
    title : 'Related Items',
    rootVisible : false,
    lines : true,
    viewModel : 'main',
    hideHeaders: true,

    initComponent : function() {
        var me = this;

        this.store = Ext.create('Ext.data.TreeStore', {
            root : {
                text : 'root',
                leaf : false,
                expanded : true,
                children: [{
                    text: 'TSP-SyRS',
                    children: [{
                        text: '<input type="checkbox">TSP-SyRS-0002',
                        leaf: true

                    },{
                        text: '<input type="checkbox">TSP-SyRS-0003',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-SyRS-0004',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-SyRS-0005',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-SyRS-0006',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-SyRS-0007',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-SyRS-0008',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-SyRS-0009',
                        leaf: true
                    }]
                },{
                    text: 'TSP-MPS-SyRS',
                    children: [{
                        text: '<input type="checkbox">TSP-MPS-SyRS-0002',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-MPS-SyRS-0003',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-MPS-SyRS-0004',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-MPS-SyRS-0005',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-MPS-SyRS-0006',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-MPS-SyRS-0007',
                        leaf: true
                    },{
                        text: '<input type="checkbox">TSP-MPS-SyRS-0008',
                        leaf: true
                    }]
                }]
            }
        });
        this.on('itemclick', function(view,record,item,index,e){
            //window.open("detail.html","","width=1000,height=500")
        	Ext.dom.Element.query("input").checked = true;
        });
        this.callParent(arguments);
    }
})