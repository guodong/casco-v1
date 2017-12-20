Ext.define('casco.view.rs.progress', {
  extend: 'Ext.window.Window',
  alias: 'widget.rs.progress',
  requires: [
  ],
  modal: true,
  title: '加载中...',
  width: 500,
  frame: true,
  viewModel: 'main',
  text: '加载中...',

  initComponent: function() {
    var me = this;


    me.aflag = '';
    me.items = [{
      xtype: 'progressbar',
      width: 500,
      text: me.text
    }];

    me.callParent(arguments);
  }
});