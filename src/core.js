// Generated by CoffeeScript 1.8.0
define(function(require, exports, module) {
  'use strict';
  var CommandManager, Dialogs, ExtensionUtils, Menus, ProjectManager, chain, convertFile, detectEncoding, handleDetectEncoding, init, nodeConnection, utfUI;
  ProjectManager = brackets.getModule('project/ProjectManager');
  nodeConnection = brackets.getModule('utils/NodeConnection');
  ExtensionUtils = brackets.getModule('utils/ExtensionUtils');
  Dialogs = brackets.getModule("widgets/Dialogs");
  Menus = brackets.getModule('command/Menus');
  CommandManager = brackets.getModule('command/CommandManager');
  utfUI = require('./ui');
  this.currentItem;
  this.nodeConnection;
  chain = function() {
    var firstFunction, firstPromise, functions;
    functions = Array.prototype.slice.call(arguments, 0);
    if (functions.length > 0) {
      firstFunction = functions.shift;
      firstPromise = firstFunction.call;
      return firstPromise.done(function() {
        return chain.apply(null, functions);
      });
    }
  };
  init = function() {
    var MY_COMMAND_ID;
    this.nodeConnection = new NodeConnection;
    connect((function(_this) {
      return function() {
        var connectionPromise;
        connectionPromise = _this.nodeConnection.connect(true);
        connectionPromise.fail(function() {
          return console.error('[UTF8-Converter] failed to establish a connection with Node');
        });
        return connectionPromise;
      };
    })(this));
    loadUtfDomain((function(_this) {
      return function() {
        var loadPromise, path;
        path = ExtensionUtils.getModulePath(module, 'node/brutfDomain');
        loadPromise = _this.nodeConnection.loadDomains([path], true);
        loadPromise.fail(function() {
          return console.log('[UTF8-Converter] failed to load domain');
        });
        loadPromise.done(function() {
          return console.log('[UTF8-Converter] successfully loaded');
        });
        return loadPromise;
      };
    })(this));
    chain(connect, loadUtfDomain);
    MY_COMMAND_ID = 'brutf.detectEncoding';
    CommandManager.register('Detect Encoding', MY_COMMAND_ID, this.handleDetectEncoding);
    return Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU).addMenuItem(MY_COMMAND_ID);
  };
  convertFile = function() {
    var convertPromise;
    this.currentItem = $(this);
    convertPromise = this.nodeConnection.domains.utfconverter.convertFileEncoding(this.currentItem.data('file'));
    convertPromise.fail(function() {
      return console.log('[UTF8-Converter] failed to convert the file');
    });
    return convertPromise.done(function(newFilePath) {
      console.log('[UTF8-Converter] converted a file');
      return this.currentItem.html('Converted');
    });
  };
  detectEncoding = function() {
    var encodingPromise;
    encodingPromise = this.nodeConnection.domains.azenc.getFilesEncoding(ProjectManager.getSelectedItem()._path.toString());
    encodingPromise.fail(function(err) {
      return console.error('[UTF8-Converter] failed to detect encoding of files', err);
    });
    encodingPromise.done(function(data) {
      return utfUI.showPanel(data.files);
    });
    return encodingPromise;
  };
  handleDetectEncoding = function() {
    if (ProjectManager.getSelectedItem()._isDirectory) {
      chain(brutfCore.detectEncoding);
    } else {
      Dialogs.showModalDialog('', 'UTF8-Converter', 'You must select a <b>directory</b> to detect encodings.<br />This extension doesn\'t work with a single files.');
    }
    return null;
  };
  exports.init = init;
  exports.convertFile = convertFile;
  exports.detectEncoding = detectEncoding;
  exports.handleDetectEncoding = handleDetectEncoding;
});