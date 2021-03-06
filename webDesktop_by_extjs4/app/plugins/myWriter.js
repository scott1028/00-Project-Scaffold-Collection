// http://docs.sencha.com/extjs/4.1.2/#!/api/Ext.data.proxy.Proxy-cfg-writer 直接克制一個 Writer 來取代原生的
// http://docs.sencha.com/extjs/4.1.2/source/Ajax.html#Ext-data-proxy-Ajax
// http://docs.sencha.com/extjs/4.1.2/source/Json3.html#Ext-data-writer-Json
// http://docs.sencha.com/extjs/4.1.2/source/Json3.html#Ext-data-writer-Json

Ext.define('plugins.myWriter', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Plugins.MyJsonWriter',
    alias: 'writer.myWriter',
    
    /**
     * @cfg {String} root The HTTP parameter name by which JSON encoded records will be passed to the server if the
     * {@link #encode} option is `true`.
     */
    root: undefined,
    
    /**
     * @cfg {Boolean} [encode=false] Configure `true` to send record data (all record fields if {@link #writeAllFields} is `true`)
     * as a JSON encoded HTTP parameter named by the {@link #root} configuration.
     * 
     * The encode option should only be set to true when a {@link #root} is defined, because the values will be
     * sent as part of the request parameters as opposed to a raw post. The root will be the name of the parameter
     * sent to the server.
     */
    encode: false,
    
    /**
     * @cfg {Boolean} [allowSingle=true] Configure with `false` to ensure that records are always wrapped in an array, even if there is only
     * one record being sent. When there is more than one record, they will always be encoded into an array.
     */
    allowSingle: true,
    
    //inherit docs
    writeRecords: function(request, data) {

        // debugger;

        var root = this.root;
        
        if (this.allowSingle && data.length == 1) {
            // convert to single object format
            data = data[0];
        }
        
        if (this.encode) {
            if (root) {
                // sending as a param, need to encode
                request.params[root] = Ext.encode(data);
            } else {
                //<debug>
                Ext.Error.raise('Must specify a root when using encode');
                //</debug>
            }
        } else {
            // send as jsonData
            request.jsonData = request.jsonData || {};
            if (root) {
                request.jsonData[root] = data;
            } else {
                request.jsonData = data;
            }
        }
        return request;
    }
});
