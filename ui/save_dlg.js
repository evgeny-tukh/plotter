SaveDlg = function (object, parent, callbacks)
{
    this.callbacks = callbacks;
    this.object    = object;
    
    Cary.ui.Window.apply (this, [{ position: { hcenter: true, vcenter: true, width: 370, height: 140, absolute: true }, title: stringTable.saveTitle, visible: true, parent: parent, zOrder: 2222 }]);
};

SaveDlg.saveTypes = { JSON: 0, CSV: 1 };

SaveDlg.prototype = Object.create (Cary.ui.Window.prototype);

SaveDlg.prototype.onInitialize = function ()
{
    var ctlBlkStyle     = { padding: 0, 'padding-left': 10, 'margin-bottom': 8, 'margin-top': 8, height: 25, 'text-align': 'left', 'line-height': 25, 'font-size': 17 };
    var buttonBlock     = new Cary.ui.ControlBlock ({ parent: this.client, visible: true, anchor: Cary.ui.anchor.BOTTOM });
    var nameBlock       = new Cary.ui.ControlBlock ({ parent: this.client, visible: true, text: stringTable.name }, ctlBlkStyle);
    var typeBlock       = new Cary.ui.ControlBlock ({ parent: this.client, visible: true, text: stringTable.type }, ctlBlkStyle);
    var buttonStyle     = { width: 'fit-content', height: 30, float: 'right', 'padding-left': 15, 'padding-right': 15 };
    var instance        = this;
    var nameCtl         = new Cary.ui.EditBox ({ parent: nameBlock.htmlObject, text: stringTable.primitive, visible: true }, { display: 'inline', float: 'right', width: 293, height: 22, 'margin-right': 20, padding: 0, 'padding-left': 5, 'font-size': 17, 'text-align': 'left' });
    var typeCtl         = new Cary.ui.ListBox ({ parent: typeBlock.htmlObject, comboBox: true, visible: true }, { display: 'inline', float: 'right', width: 300, height: 22, 'margin-right': 20, padding: 0, 'font-size': 17 });
    
    typeCtl.addItem (stringTable.fullObj, SaveDlg.saveTypes.JSON, true);
    typeCtl.addItem (stringTable.csvFile, SaveDlg.saveTypes.CSV);
    
    new Cary.ui.Button ({ text: stringTable.cancel, parent: buttonBlock.htmlObject, visible: true, onClick: forceClose }, buttonStyle);
    new Cary.ui.Button ({ text: stringTable.ok, parent: buttonBlock.htmlObject, visible: true, onClick: onOk }, buttonStyle);
    
    function forceClose ()
    {
        instance.close ();
        
        if ('onClose' in instance.callbacks)
            instance.callbacks.onClose ();
    }
    
    function onOk ()
    {
        var result = { name: nameCtl.getValue (), type: typeCtl.getSelectedData (), object: instance.object };
        
        instance.close (true);
        
        if ('onOk' in instance.callbacks)
            instance.callbacks.onOk (result);
    }
};
