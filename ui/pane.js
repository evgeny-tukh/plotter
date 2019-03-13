function Pane (callbacks, options)
{
    var parent, height;
    
    this.embedMode = 'parent' in options;
    
    if (this.embedMode)
    {
        parent = options.parent;
        height = parent.clientHeight - 20;
    }
    else
    {
        parent = document.getElementsByTagName ('body') [0];
        height = window.innerHeight - 20;
    }
    
    this.paneHeight = height;
    
    if (Cary.tools.isNothing (callbacks))
        callbacks = {};
    
    if (Cary.tools.isNothing (options))
        options = {};
    
    this.options   = Cary.tools.isNothing (options) ? {} : options;
    this.callbacks = Cary.tools.isNothing (callbacks) ? {} : callbacks;
    
    Cary.ui.Window.apply (this, [{ position: { top: 0, right: 0, width: '370px', height: Cary.tools.int2pix (height), absolute: true }, 
                                 title: stringTable.points, parent: parent, noCloseIcon: true }]);
}

Pane.prototype = Object.create (Cary.ui.Window.prototype);

Pane.prototype.onInitialize = function ()
{
    var instance     = this;
    var columns      = [{ title: stringTable.name, width: 150, onItemClick: onSelectPoint },
                        { title: stringTable.lat, width: 100, onItemClick: onSelectPoint },
                        { title: stringTable.lon, width: 100, onItemClick: onSelectPoint }];
    var listHeight   = this.embedMode ? this.paneHeight : 250;
    var pointList    = new Cary.ui.ListView ({ parent: this.client, columns: columns, visible: true, onItemClick: onSelectPoint },
                                             { position: 'absolute', top: 0, left: 5, width: 390, height: listHeight - 50 });
    var buttonBlock  = new Cary.ui.ControlBlock ({ parent: this.client, visible: true, anchor: Cary.ui.anchor.BOTTOM });
    var buttonStyle  = { width: 'fit-content', height: 30, float: 'right', 'padding-left': 15, 'padding-right': 15 };
    
    new Cary.ui.Button ({ text: stringTable.delete, parent: buttonBlock.htmlObject, visible: true, onClick: onDelete }, buttonStyle);
    new Cary.ui.Button ({ text: stringTable.save, parent: buttonBlock.htmlObject, visible: true, onClick: onSave }, buttonStyle);
    new Cary.ui.Button ({ text: stringTable.load, parent: buttonBlock.htmlObject, visible: true, onClick: onLoad }, buttonStyle);

    this.addPoint = function (point)
    {
        pointList.insertItem (['', Cary.tools.formatLat (point.lat), Cary.tools.formatLon (point.lon), point]);
    };
    
    this.cleanUp = function ()
    {
        pointList.removeAllItems ();
    };

    this.selectPoint = function (index)
    {
        pointList.selectItem (index);
    };
    
    this.setItemText = function (index, column, text)
    {
        pointList.setItemText (index, column, text);
    };
    
    function onDelete ()
    {
        var selection = pointList.getSelectedItem ();
        
        if (confirm (stringTable.deleteConf))
        {
            pointList.removeItem (selection);
            
            if ('onDelete' in instance.callbacks)
                instance.callbacks.onDelete (selection);
        }
    }
    
    function onSave ()
    {
        new SaveDlg (primitive, null/*document.getElementById ('pane')*/, { onOk: onOk });
        
        function onOk (result)
        {
            if ('onSave' in instance.callbacks)
                instance.callbacks.onSave (result);
        }
    }
    
    function onLoad ()
    {
        
    }
    
    function onSelectPoint ()
    {
        
    }
};

Pane.prototype.queryClose = function ()
{
    return false;
};

