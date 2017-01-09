Ext.define('casco.view.rs.ImportResult', {
  extend: 'Ext.window.Window',
  alias: 'widget.rs.importresult',
  requires: [
    'casco.store.Rss',
    'casco.store.Versions'
  ],
  modal: true,
  title: 'Document Import Result',
  width: 750,
  height: 500,
  scrollable: true,
  frame: true,
  id: 'import-result-window',
  viewModel: 'main',
  initComponent: function() {
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields: ['added', 'deleted', 'updated', 'unupdated']
    });
    me.items = [{
      xtype: 'grid',
      store: me.store,
      columns: [{
        text: 'Added', dataIndex: 'added', flex: 1, width: '25%', renderer: me.rd
      }, {
        text: 'Deleted', dataIndex: 'deleted', width: '25%', renderer: me.rd
      }, {
        text: 'Updated', dataIndex: 'updated', width: '25%', renderer: me.rd
      }, {
        text: 'Unupdated', dataIndex: 'unupdated', width: '25%', renderer: me.rd
      }]
    }];
    me.callParent(arguments);
  },
  rd: function(arr) {
    var str_arr = [];
    var count = 0;
    for (var i in arr) {
      str_arr.push(arr[i].tag);
      count++;
    }
    var str = "total: "+count+"<br>";
    str += str_arr.join('<br>');
    return str;
  }

});