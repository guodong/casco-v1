//主界面Head-样式，按钮，Controller-main.MainController
Ext.define('casco.view.main.Top', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'top',
    controller: 'main',
    style: { background: '#167abc', padding: '10px', color: '#fff' },

    initComponent: function () {
        var store = Ext.create('casco.store.Projects');
        store.load({
            params: {
                user_id: JSON.parse(localStorage.user).id
            }
        });
        //    	console.log(me.project);
        var states = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: [
                { "abbr": "修改信息", "name": "1" },
                { "abbr": "注销登录", "name": "2" }
            ]
        });

        this.items = [{
            xtype: 'label',
            html: '卡斯柯测试平台',
            style: { 'font-size': '27px', 'font-weight': 'bold' }
        }, '->', {
            text: '管理',
            xtype: 'button',
            handler: 'manage',
            hidden: JSON.parse(localStorage.user).role_id == 0,
            disabled:true
        }, {
            text: '定版',
            xtype: 'button',
            handler: 'vat'
        }, {
            text: '测试',
            xtype: 'button',
            handler: 'testing'
        }, {
            text: '核验',
            xtype: 'button',
            handler: 'matrix'
        }, {
            text: '报告',
            xtype: 'button',
            handler: 'report'
        }, {
            text: 'Project Stat',
            xtype: 'button',
            handler: function () {
                window.open("/prostat/projectstat-tmp.htm");
            },
            hidden: localStorage.view !== 'manage'
        }, {
            xtype: 'combobox',
            editable: false,
            displayField: 'name',
            valueField: 'id',
            store: store,
            queryMode: 'local',
            itemId: 'switcher',	//ManageController使用
            emptyText: '（切换工程）',
            listeners: {
                select: 'switchProject'
            }
        }, {
            xtype: 'combobox',
            itemId: 'logoutBtn',
            editable: false,
            displayField: 'abbr',
            valueField: 'name',
            store: states,
            width: '10%',
            queryMode: 'local',
            emptyText: JSON.parse(localStorage.user).realname,
            listeners: {
                select: 'editUser'
            }
        }];
        this.callParent();
    }

})