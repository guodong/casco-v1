Ext.define('casco.view.report.ReportCover', {
    extend: 'Ext.panel.Panel',
    xtype: 'reportcover',
	layout: {
		type: 'border'
	},
	defaults: {
		bodyPadding: 0,
	},
    initComponent: function () {
        var me = this;
		var report=me.report?me.report:null;
		
		me.items = [{
			region: 'center',
			xtype: 'cover',
			report: report
		}, {
			region: 'south',
			xtype: 'reportwindow',
			project: me.project,
			width: 900,
			height: 250,
		}];
        this.callParent();
    },
    

})
