// Ext.define('plugins.myRowEditor', {
//     extend: 'Ext.grid.plugin.RowEditing',
//     alias: 'plugin.myRowEditor',
//     mixins: [
//         'Ext.grid.plugin.Editing'
//     ],
//     // override row editable
//     startEdit: function(record, columnHeader) {
//         // return this.callParent(arguments);
//         var me = this,
//             editor = me.getEditor(),
//             context;

//         if (editor.beforeEdit() !== false) {
//             context = me.callParent(arguments);
//             if (context) {
//                 me.context = context;

//                 // If editing one side of a lockable grid, cancel any edit on the other side.
//                 if (me.lockingPartner) {
//                     me.lockingPartner.cancelEdit();
//                 }
                
//                 editor.startEdit(context.record, context.column, context);
//                 return true;
//             }
//         }
//         return false;

//         // if(record.data.id < 20) return false;

//         // create row editor
//         // var base = this.callParent(arguments);
//         // return base;
//     },
//     // isCellEditable: function(colIndex, rowIndex){
//     //     debugger;
//     // }
//     // isCellEditable: function(record, columnHeader) {
//     //     debugger;

//     //     var base = this.callParent(arguments);
//     //     return base;  
//     // }
//     // startEditing: function(rowIndex, doFocus){
//     //     debugger;
//     //     return this.callParent(arguments);
//     // }
//     // init: function(grid) {
//     //     // init events and add listeners...
//     // },

//     // customFunction: function(par1, par2) {

//     //    // some code...
//     // },
// }); 