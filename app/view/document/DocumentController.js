Ext.define('casco.view.document.DocumentController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.document',
	uses: ['casco.model.Document', 'casco.model.Folder'],
	createDocument: function () {
		var form = this.lookupReference('document_create_form');
		var pjt = new casco.model.Document(form.getValues());
		if (pjt.get('id')) {
			pjt.set('id', 0);
		}
		var regex;
		if (form.getValues().type == 'rs') {
			var v = form.getValues();
			regex = {
				tag: v.rstag,
				description: v.rsdescription,
				implement: v.rsimplement,
				priority: v.rspriority,
				contribution: v.rscontribution,
				category: v.rscategory,
				allocation: v.rsallocation
			};
			// regex = {
			// 	'标签': v.rstag,
			// 	'描述': v.rsdescription,
			// 	'实现': v.rsimplement,
			// 	'优先级': v.rspriority,
			// 	'贡献': v.rscontribution,
			// 	'分类': v.rscategory,
			// 	'分配': v.rsallocation
			// };
		}
		//pjt.set('regex', JSON.stringify(regex));

		pjt.save({
			callback: function () {
				var t = Ext.ComponentQuery.query("#mtree")[0];
				t.store.reload();
				document.getElementById('draw').contentWindow.location.reload();
			}
		});

	},
	createVersion: function () {
		var form = this.lookupReference('version_create_form');
		var document = form.document;
		var version = new casco.model.Version(form.getValues());
		if (version.get('id')) {
			version.set('id', 0);
		}

		version.save({
			callback: function () {
				var combo = Ext.getCmp('docv-' + document.get('id'));
				combo.store.reload();
				form.up('window').destroy();
			}
		});

	},
	createFolder: function () {
		var form = this.lookupReference('documentfolder_create_form');
		var pjt = new casco.model.Document(form.getValues());
		if (pjt.get('id')) {
			pjt.set('id', 0);
		}
		pjt.save({
			callback: function () {
				var t = Ext.ComponentQuery.query("#mtree")[0];
				t.store.reload()
			}
		});

	}

});