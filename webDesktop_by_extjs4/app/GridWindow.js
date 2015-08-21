/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.GridWindow', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'
    ],

    id:'grid-win',

    init : function(){
        this.launcher = {
            text: 'Grid Window',
            iconCls:'icon-grid'
        };
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('grid-win');
        if(!win){
            win = desktop.createWindow({
                id: 'grid-win',
                title:'Grid Window',
                width:740,
                height:480,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [
                    {
                        border: false,
                        xtype: 'grid',
                        store: new Ext.data.ArrayStore({
                            fields: [
                               { name: 'id' },
                               { name: 'faq_tc_question' },
                               { name: 'faq_tc_answer' },
                               // { name: 'price', type: 'float' },
                               // { name: 'change', type: 'float' },
                               // { name: 'pctChange', type: 'float' }
                            ],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: '/api/ssd/faq/?extraColumn=1&suspend=skip&audit_name=Faq+Query&limit=10&offset=0',
                                reader: {
                                    type: 'json',
                                    root: 'objects'
                                }
                            }
                            // data: MyDesktop.GridWindow.getDummyData()
                        }),
                        columns: [
                            new Ext.grid.RowNumberer(),
                            {
                                text: "ID",
                                width: 70,
                                sortable: true,
                                dataIndex: 'id'
                            },
                            {
                                text: "Faq Question",
                                flex: 1,
                                sortable: true,
                                // renderer: Ext.util.Format.usMoney,
                                dataIndex: 'faq_tc_question'
                            },
                            {
                                text: "Faq Answer",
                                flex: 1,
                                sortable: true,
                                dataIndex: 'faq_tc_answer'
                            },
                            // {
                            //     text: "% Change",
                            //     width: 70,
                            //     sortable: true,
                            //     dataIndex: 'pctChange'
                            // }
                        ]
                    }
                ],
                tbar:[{
                    text:'Add Something',
                    tooltip:'Add a new row',
                    iconCls:'add',
                    handler: function(e){


                        // ref: http://stackoverflow.com/questions/14165617/get-selected-row-column-value-extjs-grid
                        // ref: http://stackoverflow.com/questions/9068842/how-to-load-a-create-and-load-a-new-record-into-a-form-in-extjs-4-0
                        this.up('#grid-win').down('grid').getSelectionModel().getSelection().every(function(row){
                            console.log(row);
                        });
                    }
                }, '-', {
                    text:'Options',
                    tooltip:'Modify options',
                    iconCls:'option'
                },'-',{
                    text:'Remove Something',
                    tooltip:'Remove the selected item',
                    iconCls:'remove'
                }]
            });
        }
        return win;
    },

    statics: {
        getDummyData: function () {
            return [
                ['3m Co',71.72,0.02,0.03],
                ['Alcoa Inc',29.01,0.42,1.47],
                ['American Express Company',52.55,0.01,0.02],
                ['American International Group, Inc.',64.13,0.31,0.49],
                ['AT&T Inc.',31.61,-0.48,-1.54],
                ['Caterpillar Inc.',67.27,0.92,1.39],
                ['Citigroup, Inc.',49.37,0.02,0.04],
                ['Exxon Mobil Corp',68.1,-0.43,-0.64],
                ['General Electric Company',34.14,-0.08,-0.23],
                ['General Motors Corporation',30.27,1.09,3.74],
                ['Hewlett-Packard Co.',36.53,-0.03,-0.08],
                ['Honeywell Intl Inc',38.77,0.05,0.13],
                ['Intel Corporation',19.88,0.31,1.58],
                ['Johnson & Johnson',64.72,0.06,0.09],
                ['Merck & Co., Inc.',40.96,0.41,1.01],
                ['Microsoft Corporation',25.84,0.14,0.54],
                ['The Coca-Cola Company',45.07,0.26,0.58],
                ['The Procter & Gamble Company',61.91,0.01,0.02],
                ['Wal-Mart Stores, Inc.',45.45,0.73,1.63],
                ['Walt Disney Company (The) (Holding Company)',29.89,0.24,0.81]
            ];
        }
    }
});

