<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Polygon Plotter</title>
        <script src="https://maps.googleapis.com/maps/api/js?libraries=geometry&key=AIzaSyCsZWmFuiHNNNIh5GSgkz6bhJuWhbtk21g"></script>
        <script src="https://jecat.ru/2019/cary/cary.js"></script>
        <script src="https://jecat.ru/2019/cary/tools.js"></script>
        <script src="https://jecat.ru/2019/cary/service.js"></script>
        <script src="https://jecat.ru/2019/cary/geo.js"></script>
        <script src="https://jecat.ru/2019/cary/geo_util.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/maps.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/map_controls.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/mf_balloon.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/map_locker.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/pos_indicator.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/img_button.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/brg_rgn_tag.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/gm_panel.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/map_menu.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/drawers/gen_drawer.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/drawers/polyline_drawer.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/drawers/polygon_drawer.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/drawers/icon_drawer.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/drawers/circle_drawer.js"></script>
        <script src="https://jecat.ru/2019/cary/gm/drawers/icon_grp_drawer.js"></script>
        <script src="https://jecat.ru/2019/cary/usr_obj/gen_obj.js"></script>
        <script src="https://jecat.ru/2019/cary/usr_obj/multi_pt_obj.js"></script>
        <script src="https://jecat.ru/2019/cary/usr_obj/usr_pln.js"></script>
        <script src="https://jecat.ru/2019/cary/usr_obj/usr_plg.js"></script>
        <script src="https://jecat.ru/2019/cary/usr_obj/usr_icn.js"></script>
        <script src="https://jecat.ru/2019/cary/usr_obj/usr_icn_grp.js"></script>
        <script src="https://jecat.ru/2019/cary/usr_obj/usr_circle.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/wnd.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/gen_ctl.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/buttons.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/editbox.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/slider.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/treeview.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/listview.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/listbox.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/browser.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/browsebox.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/checkbox.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/details.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/calendar.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/datehourbox2.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/generic/flashing_img.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/dlg/coord_edit.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/dlg/pos_edit.js?a=b"></script>
        <script src="https://jecat.ru/2019/cary/ui/dlg/usr_pln_props.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/dlg/usr_plg_props.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/dlg/msg_box.js"></script>
        <script src="https://jecat.ru/2019/cary/ui/dlg/browser_wnd.js "></script>
        <script src="main.js "></script>
        <script src="strings.js "></script>
        <script src="ui/pane.js "></script>
        <script src="ui/save_dlg.js "></script>
        <link rel="stylesheet" href="https://jecat.ru/2019/cary/styles.css"/>
        <link rel="stylesheet" href="https://jecat.ru/2019/cary/classic.css"/>
        <link rel="stylesheet" href="https://jecat.ru/2019/cary/ui/generic/calendar.css"/>
        <link rel="stylesheet" href="plotter.css"/>
    </head>
    <body onload="init ();">
        <div id="map" class="pane map">Map here</div>
        <div id="pane" class="pane points">Pane here</div>
    </body>
</html>
