var map         = null;
var pane        = null;
var stringTable = null;
var primitive   = null;
var modes       = { POLYLINE: 1, POLYGON: 2 };
var mode        = modes.POLYLINE;

function init ()
{
    var settingsButton;
    var zoomInButton;
    var zoomOutButton;
    var polylineButton;
    var polygonButton;
    var locateButton;
    var settingsPane;
    var posInd;
    var activeSubMenu = null;
    var mapDiv        = document.getElementById ("map");

    stringTable = new strings.StringTable ('russian.st', 2000);
    
    map = new Cary.Map ();
    
    Cary.settings.activeItemClass   = 'activeItem';
    Cary.settings.selectedItemClass = 'selectedItem';
    
    Cary.tools.createCssClass (Cary.settings.activeItemClass, { color: 'black' });
    Cary.tools.createCssClass (Cary.settings.activeItemClass + ':hover', { color: 'blue' });
    Cary.tools.createCssClass (Cary.settings.selectedItemClass, { color: 'red', 'font-weight': 'bold' });
    
    map.attach (mapDiv);
    map.createMap ();
    map.setupPredefinedBaseMaps ();
    map.setCenter (Cary.tools.degMinToDouble (60, 0.262), Cary.tools.degMinToDouble (29, 45.283));
    
    map.addEventListener ('mousemove', function (event) { posInd.onMouseEvent (event); });
    map.addEventListener ('mouseover', function () { posInd.show (true); });
    map.addEventListener ('mouseout', function () { posInd.show (false); });
    map.addEventListener ('click', onClick);

    settingsButton = map.createImgButton (google.maps.ControlPosition.TOP_LEFT, 'res/settings26.png', { onClick: showSettingsPane });
    zoomInButton   = map.createImgButton (google.maps.ControlPosition.RIGHT_BOTTOM, 'res/zoom-in-20.png', { onClick: function () { map.zoomIn (); } });
    zoomOutButton  = map.createImgButton (google.maps.ControlPosition.RIGHT_BOTTOM, 'res/zoom-out-20.png', { onClick: function () { map.zoomOut (); } });
    polylineButton = map.createImgButton (google.maps.ControlPosition.TOP_RIGHT, 'res/polyline26.png', { onClick: onNewPolyline });
    polygonButton  = map.createImgButton (google.maps.ControlPosition.TOP_RIGHT, 'res/polygon26.png', { onClick: onNewPolygon });
    locateButton   = map.createImgButton (google.maps.ControlPosition.TOP_RIGHT, 'res/finger26.png', { onClick: onSetLocation });
    settingsPane   = map.createGMPanel (google.maps.ControlPosition.TOP_LEFT, { onInit: onInitSettingsPane });
    posInd         = map.createPosIndicator (google.maps.ControlPosition.TOP_CENTER);

    posInd.setText ('hehehe');
    posInd.setValue (10, 20);
    
    settingsButton.show ();
    zoomInButton.show ();
    zoomOutButton.show ();
    polylineButton.show ();
    polygonButton.show ();
    locateButton.show ();

    setTimeout (function ()
    {
        pane = new Pane ({ onDelete: onDelete, onSave: onSave }, { parent: document.getElementById ('pane') });

        pane.show ();
    }, 1000);

    function drawPrimitive ()
    {
        primitive.drawer.draw (map.map, { editMode: true, onVertexHover: onPointHover, onPointChanged: onPointChanged });
        
        function onPointChanged (index, point)
        {
            pane.setItemText (index, 1, Cary.tools.formatLat (point.lat));
            pane.setItemText (index, 2, Cary.tools.formatLon (point.lon));
        }
        
        function onPointHover (point)
        {
            var index = primitive.points.indexOf (point);
            
            if (index >= 0)
                pane.selectPoint (index);
        }
    }
    
    function onSave (result)
    {
        var content, name;
        
        if (result.type === SaveDlg.saveTypes.CSV)
        {
            content = '';
            name    = result.name + '.csv';
            
            result.object.points.forEach (function (point)
                                          {
                                              content += ',' + point.lat.toString () + ',' + point.lon.toString () + '\n';
                                          });
        }
        else
        {
            var tempObj;
            
            content = result.object.toJSON ();
            name    = result.name + '.json';
            
            tempObj = JSON.parse (content);
            
            tempObj.name = result.name;
            
            content = JSON.stringify (tempObj);
        }
        
        Cary.tools.saveFile (content, name);
    }
    
    function onDelete (index)
    {
        primitive.points.splice (index, 1);
        primitive.drawer.undraw ();
        
        drawPrimitive ();
    }
    
    function onNewPrimitive ()
    {
        pane.cleanUp ();
        
        if (primitive)
        {
            if (primitive.drawObjects)
                primitive.drawer.undraw ();
        }

        if (mode === modes.POLYLINE)
            primitive = new Cary.userObjects.UserPolyline ();
        else
            primitive = new Cary.userObjects.UserPolygon ();

        primitive.drawer = primitive.createDrawer ();
    }
    
    function onNewPolyline ()
    {
        mode = modes.POLYLINE;
        
        onNewPrimitive ();
    }
    
    function onSetLocation ()
    {
        var position = map.map.getCenter ();
        
        new Cary.ui.PositionEditWnd (null, { lat: position.lat (), lon: position.lng () }, { onOk: onPositionSet });

        function onPositionSet (pos)
        {
            map.map.setCenter ({ lat: pos.lat, lng: pos.lon });
        }
    }
    
    function onNewPolygon ()
    {
        mode = modes.POLYGON;
        
        onNewPrimitive ();
    }
    
    function onClick (event)
    {
        var point = { lat: event.latLng.lat (), lon: event.latLng.lng () };
        
        if (!primitive)
            onNewPrimitive ();
        
        primitive.points.push (point);
        
        primitive.drawer.undraw ();
        
        drawPrimitive ();
        
        pane.addPoint (point);
    }
    
    function showSettingsPane ()
    {
        map.lock (closeAllMenus);
        
        settingsButton.show (false);
        //settingsPane.slideIn ();
        settingsPane.show ();
        
        function closeAllMenus ()
        {
            if (activeSubMenu !== null)
                activeSubMenu.show (false);
            
            settingsPane.unlock ();
            settingsPane.slideOut ();
            
            map.unlock ();
            settingsButton.show (true);
        }
    }
    
    function onInitSettingsPane (panel)
    {
        var baseMapMenu;
        var overlaysMenu;
        
        baseMapMenu  = map.createGMPanel (google.maps.ControlPosition.TOP_LEFT, { onInit: onInitBaseMapMenu, height: 'fit-content', onOpen: setActiveSubMenu, onClose: resetActiveSubMenu });
        overlaysMenu = map.createGMPanel (google.maps.ControlPosition.TOP_LEFT, { onInit: onInitOverlaysMenu, height: 'fit-content', onOpen: setActiveSubMenu, onClose: resetActiveSubMenu });
        
        baseMapMenu.container.style.marginLeft  = '330px';//'280px';
        overlaysMenu.container.style.marginLeft = '330px';// '280px';
        
        map.addEventListener ('zoom_changed', 
                              function ()
                              {
                                  // Some magic here
                                  baseMapMenu.container.style.marginLeft  = '280px';
                                  overlaysMenu.container.style.marginLeft = '280px';
                              });
        
        map.addEventListener ('maptypeid_changed', 
                              function ()
                              {
                                  // Some magic here
                                  baseMapMenu.container.style.marginLeft  = '330px';
                                  overlaysMenu.container.style.marginLeft = '330px';
                                  
                                  map.addEventListener ('tilesloaded', function () { userObj.realertAreas (); });
                              });
        
        panel.addTitle (stringTable.settings, null, function () { settingsButton.show (true); map.unlock (); });
        panel.addSubMenu ({ text: stringTable.baseMap, className: 'settingsPaneSubMenu', onClick: function () { baseMapMenu.show (); } });
        panel.addSubMenu ({ text: stringTable.overlays, className: 'settingsPaneSubMenu', onClick: function () { overlaysMenu.show (); } });
        
        function setActiveSubMenu (subMenu)
        {
            activeSubMenu = subMenu;
        }
        
        function resetActiveSubMenu (subMenu)
        {
            activeSubMenu = null;
        }
        
        function onInitBaseMapMenu (menu)
        {
            var items = [];
            
            menu.addTitle (stringTable.baseMap, null, function () { panel.unlock (); });
            
            addItem ('Roadmap', Cary.maps.baseMaps.RoadMap);
            addItem ('Terrain', Cary.maps.baseMaps.Terrain);
            addItem ('Satellite', Cary.maps.baseMaps.Satellite);
            addItem ('Hybrid', Cary.maps.baseMaps.Hybrid);
            addItem ('Navionics', Cary.maps.baseMaps.Navionics);
            addItem ('Abris', Cary.maps.baseMaps.CustomMap);
            addItem ('OpenStreet', Cary.maps.baseMaps.OpenStreet);
            addItem ('Sentinel-2', Cary.maps.baseMaps.Sentinel2);
            addItem ('Landsat 8', Cary.maps.baseMaps.Landsat8);
            addItem ('ScanEx (demo)', Cary.maps.baseMaps.ScanEx);
            
            function addItem (itemName, mapFlag)
            {
                items.push (menu.addItem (itemName, {}, function (item) { selectBaseMap (item); }, { checked: itemName === 'Roadmap', data: map.getBaseMapIndex (mapFlag) }));
            }
            
            function selectBaseMap (activeItem)
            {
                baseMapMenu.show (false);
                //hideSettingsPane ();
                panel.unlock ();
                
                items.forEach (function (item)
                               {
                                   menu.checkItem (item, item === activeItem);
                               });
                
                selectMapType (activeItem.data);
            }
        }
        
        function onInitOverlaysMenu (menu)
        {
            var items = [];
            
            menu.addTitle (stringTable.overlays, null, function () { panel.unlock (); });
            
            addItem ('OpenSea', Cary.maps.overlayMaps.Layers.OpenSea);
            addItem ('OpenWeather (Temperature)', Cary.maps.overlayMaps.Layers.OpenWeatherTemp);
            addItem ('OpenWeather (Precipitation)', Cary.maps.overlayMaps.Layers.OpenWeatherPrecipitation);
            addItem ('OpenWeather (Wind)', Cary.maps.overlayMaps.Layers.OpenWeatherWind);
            addItem ('OpenWeather (Pressure)', Cary.maps.overlayMaps.Layers.OpenWeatherPressure);
            addItem ('OpenWeather (Clouds)', Cary.maps.overlayMaps.Layers.OpenWeatherClouds);
            addItem ('ScanEx/Sentinel', Cary.maps.overlayMaps.Layers.ScanExSentinel);
            addItemCB (stringTable.aisTargets, toggleAISTargets);
            addItem (stringTable.aisTargetsMT, Cary.maps.overlayMaps.Layers.AISTargetsMT);
            
            function toggleAISTargets ()
            {
                if (aisTargetTable.started ())
                    aisTargetTable.stop ();
                else
                    aisTargetTable.start (true);
            }
            
            function addItemCB (itemName, callback)
            {
                items.push (menu.addItem (itemName, { textWidth: '240px', backgroundColor: 'yellow' },
                            function (item)
                            {
                                menu.checkItem (item, !menu.isItemChecked (item));
                                
                                if (callback)
                                    callback ();
                            }, 
                            { checked: false, data: null, textWidth: 240 }));
            }
            
            function addItem (itemName, mapFlag)
            {
                items.push (menu.addItem (itemName, { textWidth: '240px', backgroundColor: 'yellow' },
                            function (item)
                            {
                                var show = !menu.isItemChecked (item);
                                
                                map.showOverlayLayer (map.getOverlayIndex (item.data), show);
                                
                                menu.checkItem (item, show);
                            }, 
                            { checked: false, data: mapFlag, textWidth: 240 }));
            }
        }
    }
}

function addBaseMap (baseMap)
{
    var select = document.getElementById ('baseMap');
    var option = document.createElement ('option');

    option.text = baseMap.getName ();

    select.add (option);
}

function selectMapType (index)
{
    map.selectBaseMap (index);
}

function showOverlay (index, show)
{
    map.showOverlayLayer (index, show);
}

