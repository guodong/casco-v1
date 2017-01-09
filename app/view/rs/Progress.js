Ext.define('casco.view.rs.progress', {
  extend: 'Ext.window.Window',
  alias: 'widget.rs.progress',
  requires: [
  ],
  modal: true,
  title: 'Loading...',
  width: 500,
  frame: true,
  viewModel: 'main',
  text: 'Loading...',

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