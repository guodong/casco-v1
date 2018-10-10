Ext.define('casco.view.rs.RsImport', {
    extend: 'Ext.window.Window',
    alias: 'widget.rs.rsimport',
    requires: [
        'casco.store.Rss',
        'casco.store.Versions'
    ],
    modal: true,
    title: '导入文档',
    width: 500,
    frame: true,
    id: 'import-window',
    viewModel: 'main',
    filename: '',

    initComponent: function () {
        var me = this;
        // window.addEventListener('message', function(event) { 
        //     if (event.origin.indexOf(FILEAPI)>=0) { 
        //         console.log(event.data); 
        //         me.parseDocument();
        //     } else { 
        //         return; 
        //     } 
        // }); 
        var headers = null, regrex = null;
        // 获取最近一次的列名吧
        me.versions = new casco.store.Versions();
        me.versions.load({
            params: {
                document_id: me.document_id,
                newest: 'newest'
            },
            callback: function (records, operation, success) {
                // 必须要同步才能取值
                //console.log(records[0]);
                if (records[0]
                    && records[0].getData()
                    && records[0].getData().headers) {
                    headers = me.versions.getAt(0).get('headers');
                    regrex = me.versions.getAt(0).get('regrex');
                    //me.down('form').loadRecord(me.versions.getAt(0));
                    me.down('form').items.getAt(1).setValue(headers);
                    me.down('form').items.getAt(3).setValue(regrex);
                } else {
                    if (me.type == "rs") {
                        me.down('form').items.getAt(1).setValue("description,implement,source,priority,contribute,category,allocation");
                    }
                    else if (me.type == "tc") {
                        me.down('form').items.getAt(1).setValue("description,safety,source,test_method,pre_condition,test_steps");
                    }
                }
            }// callback
        });


        me.aflag = '';
        me.items = [{
            xtype: 'form',
            bodyPadding: 10,
            items: [{
                // version_id在这里啊
                xtype: 'combobox',
                fieldLabel: '版本',
                name: 'version_id',
                labelWidth: 60,
                store: me.vstore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                editable: true,
                width: '100%',
                allowBlank: false,
                blankText: '版本不能为空，请输入或选择',
                msgTarget: 'side',
                lastQuery: '',
                listeners: {
                    beforequery: function (e) {
                        e.query = new RegExp(e.query.trim(), 'i');
                        e.forceAll = true;
                    },
                    blur: function (e) {
                        var input = e.getRawValue().trim();
                        e.setRawValue(input);
                        //输入为空的判断
                        //						if(input == '') 
                        //							Ext.Msg.alert('Error','Vesrion is NULL ！');
                        //						else 
                        if (input != '' && e.store.find('name', input) == -1) {
                            //Ext.Msg.alert('注意', '您创建了版本: ' + input + ' ,将在该版本中导入文档');
                            me.aflag = input;
                        }
                        // else Ext.Msg.alert('注意','Exist Version: '+
                        // input);
                    }
                }
            },
            /*
             * { fieldLabel: 'Version', name: 'version_id', xtype:
             * 'hiddenfield', value: me.version_id },
             */
            {
                xtype: 'textfield',
                fieldLabel: '列',
                name: 'column',
                labelWidth: 60,
                width: '100%',
                editable: 'true',
                value: headers,
                validator: function (val) {
                    //哥写的正则,666
                    var re = /(([\w]\\+\s?)+){1,}/g;
                    var tn = val.match(re),
                        errMsg = "输入格式不符合规范,请检查";
                    // console.log(tn);
                    return true;
                },
                listeners: {
                    render: function (field, p) {
                        Ext.QuickTips.init();
                        Ext.QuickTips.register({
                            target: field.el,
                            text: '大小写无关,多个单词请空一格'
                        });
                    },
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                        }
                    }
                }// listenres
            }, {
                xtype: 'checkboxfield',
                fieldLabel: '合并单元格',
                checked: false,
                name: 'ismerge',
                hidden: me.type != 'tc' ? true : false,
                inputValue: '1',
                uncheckedValue: '0',
                boxLabel: '是否含有合并单元格'
            }, {
                xtype: 'textfield',
                fieldLabel: 'TC regex',
                name: 'regrex',
                labelWidth: 60,
                width: '100%',
                hidden: me.type != 'tc' ? true : false,
                editable: 'true',
                validator: function (obj) {
                    //作为一个json字符串形式来进行验证的
                    var re = /(([\w]+\s?)+,?){1,}/g;
                    var tn = obj.match(re),
                        errMsg = "输入格式不符合规范,请检查";
                    // console.log(tn);
                    return true;
                },
                listeners: {
                    render: function (field, p) {
                        Ext.QuickTips.init();
                        Ext.QuickTips.register({
                            target: field.el,
                            text: ''
                        });
                    },
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                        }
                    }
                }// listenres
            }, {
                xtype: 'filefield',
                name: 'file',
                fieldLabel: '文件',
                labelWidth: 60,
                msgTarget: 'side',
                allowBlank: false,
                blankText: '请选择需要导入的文档',
                anchor: 0,
                width: '100%',
                buttonText: '选择文件'
            }, {
                xtype: 'hiddenfield',
                name: 'type',
                value: me.type,
                allowBlank: false,
            }, {
                xtype: 'hiddenfield',
                name: 'isNew',
                value: 0,
            }, {
                xtype: 'hiddenfield',
                name: 'document_id',
                value: me.document_id
            }],

            buttons: [{
                text: '导入',
                handler: function () {
                    var self = this;
                    var form = this.up('form').getForm();
                    if (me.aflag) {
                        form.findField('isNew').setValue(1);
                    }
                    if (form.isValid()) {
                        // ajax请求
                        Ext.Ajax.request({
                            url: API + 'docfile_pre',
                            method: 'get',
                            success: function (response, opts) {
                                this.obj = response.responseText;
                                Ext.Msg.show({
                                    title: '提示',
                                    icon: Ext.MessageBox.INFO,
                                    msg: '队列已有' + this.obj + '项任务正在进行,确定继续?',
                                    width: 300,
                                    buttonText: { yes: '继续', cancel: '取消' },
                                    fn: function (buttonid) {
                                        if (buttonid == 'cancel') {
                                            self.up('window').destroy();
                                            return;
                                        }
                                        //var filename = Math.random() + '.doc';
                                        var filename = ((+new Date())) + '.doc';
                                        me.filename = filename;
                                        document.domain = document.domain;

                                        form.submit({// 为什么一直为false
                                            url: FILEAPI + filename,
                                            method: 'POST',
                                            params: {
                                                domain: document.domain
                                            },
                                            cors: true,
                                            success: function (form, action) {
                                                Ext.Msg.alert('成功', action.response.responseText);
                                            },
                                            failure: function (form, action) {
                                                me.parseDocument(action.result);
                                            }// failure
                                        });// submit
                                    }// function
                                });// show
                            }
                        });//ajax

                    }//valid


                }//handler

            }],
        }];

        me.callParent(arguments);
    },

    doHide: function () {
        this.hide();
    },

    parseDocument: function (result) {
        var me = this;
        var form = this.down('form').getForm();
        var pgs = Ext.create('widget.rs.progress', {
            text: '正在解析文档，请等待...'
        });
        pgs.down('progressbar').wait({
            text: '正在解析文档，请等待...'
        });
        pgs.show();
        var params = form.getValues();
        //var savedFile = result.url.replace("/", "");
        var savedFile = this.filename;
        params.filename = savedFile; //this.filename;
        params.name = me.aflag;
        Ext.Ajax.request({
            url: API + 'import',
            method: 'post',
            params: params,
            timeout: 1000 * 60 * 100,
            failure: function (response, opts) {
                pgs.destroy();
                console.log(response);
                Ext.Msg.alert('错误', '错误信息: ' + response.responseText);
            },
            success: function (response) {
                var pjt = me.pjt;
                pgs.destroy();
                console.log(response);
                var d = Ext.decode(response.responseText);
                var winResult = Ext.create('widget.rs.importresult');
                winResult.store.loadData([d.data]);
                winResult.show();
                me.destroy();
                var tabs = Ext.getCmp('workingpanel') || Ext.getCmp('workpanel');
                var tab = tabs.child('#tab-' + me.document.get('id'));
                if (tab) {
                    tabs.remove(tab);
                }

                casco.model.Document.load(me.document.get('id'), {
                    success: function (record) {
                        tab = tabs.add({
                            id: 'tab-' + record.get('id'),
                            xtype: record.get('type'),
                            title: record.get('name'),
                            document: record,
                            closable: true,
                            project: pjt
                        });
                        tabs.setActiveTab(tab);
                    }
                });
            }
        })
    }
});