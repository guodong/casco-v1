Ext.define('casco.view.rs.ImportResult', {
  extend: 'Ext.window.Window',
  alias: 'widget.rs.importresult',
  requires: [
    'casco.store.Rss',
    'casco.store.Versions'
  ],
  modal: true,
  title: '文档导入结果',
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
        text: '添加', dataIndex: 'added', flex: 1, width: '25%', renderer: me.rd
      }, {
        text: '删除', dataIndex: 'deleted', width: '25%', renderer: me.rd
      }, {
        text: '更新', dataIndex: 'updated', width: '25%', renderer: me.rd
      }, {
        text: '无更新', dataIndex: 'unupdated', width: '25%', renderer: me.rd
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
    var str = "总数: "+count+"<br>";
    str += str_arr.join('<br>');
    return str;
  }

});