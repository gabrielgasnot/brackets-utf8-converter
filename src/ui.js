// Generated by CoffeeScript 1.8.0
define(function(require, exports, module) {
  'use strict';
  var ExtensionUtils, PanelManager, ProjectManager, core, init, initStylesheet, insertRows, showPanel, templatePanel, templateRow;
  ProjectManager = brackets.getModule('project/ProjectManager');
  PanelManager = brackets.getModule('view/PanelManager');
  ExtensionUtils = brackets.getModule('utils/ExtensionUtils');
  templatePanel = require('text!templates/panel.html');
  templateRow = require('text!templates/rows.html');
  core = require('./core');
  this.bracketsBottomPanel;
  this.$utfBottomPanel;
  insertRows = function(files) {
    var rowsHtml;
    rowsHtml = Mustache.render(brutfRowTemplate, {
      'fileList': files
    });
    return this.$utfBottomPanel.find('.row-container').empty().append(rowsHtml);
  };
  init = function() {
    var panelHtml;
    panelHtml = Mustache.render(templatePanel, '');
    this.bracketsBottomPanel = PanelManager.createBottomPanel('brutf.encoding.listfiles', $(panelHtml), 200);
    this.$utfBottomPanel = $('#brackets-utf8-converter-panel');
    this.$utfBottomPanel.on('click', '.close', function() {
      return bracketsBottomPanel.hide;
    }).on('click', '.btnConvert', core.convertFile);
    return $(ProjectManager.on("beforeProjectClose", function() {
      return bracketsBottomPanel.hide;
    }));
  };
  initStylesheet = function(cssname) {
    return ExtensionUtils.loadStyleSheet(module, "../" + cssname);
  };
  showPanel = function(files) {
    this.bottomPanel.show;
    return insertRows(files);
  };
  exports.init = init;
  exports.initStylesheet = initStylesheet;
  exports.showPanel = showPanel;
});
