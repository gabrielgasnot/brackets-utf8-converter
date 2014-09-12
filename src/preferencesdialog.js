// Generated by CoffeeScript 1.8.0
define(function(require, exports) {
  var CommandManager, Dialogs, Preferences, assignActions, collectValues, dialogTemplate, init, questionTemplate, setValues, showRestartDialog;
  CommandManager = brackets.getModule("command/CommandManager");
  Dialogs = brackets.getModule("widgets/Dialogs");
  Preferences = require("./preferences");
  dialogTemplate = require("text!templates/preferences-dialog.html");
  questionTemplate = require("text!templates/question-dialog.html");
  this.dialog;
  this.$dialog;
  setValues = (function(_this) {
    return function(values) {
      return $("*[settingsProperty]", _this.$dialog).each(function() {
        var $this, property, type;
        $this = $(this);
        type = $this.attr('type');
        property = $this.attr("settingsProperty");
        if (type === "checkbox") {
          $this.prop("checked", values[property]);
        } else {
          $this.value(values[property]);
        }
      });
    };
  })(this);
  collectValues = (function(_this) {
    return function() {
      return $("*[settingsProperty]", _this.$dialog).each(function() {
        var $this, property, type;
        $this = $(this);
        type = $this.attr('type');
        property = $this.attr("settingsProperty");
        if (type === "checkbox") {
          Preferences.set(property, $this.prop("checked"));
        } else {
          Preferences.set(property, $this.val().trim() || null);
        }
        Preferences.save();
      });
    };
  })(this);
  assignActions = (function(_this) {
    return function() {
      $("button[data-button-id='defaults']", _this.$dialog).on("click", function(e) {
        e.stopPropagation();
        setValues(Preferences.getDefaults());
      });
    };
  })(this);
  init = function() {
    setValues(Preferences.getAll());
    assignActions();
  };
  showRestartDialog = function() {
    var compiledTemplate;
    compiledTemplate = Mustache.render(questionTemplate, {
      title: "Restart",
      question: "Do you wish to restart Brackets to apply new settings?"
    });
    Dialogs.showModalDialogUsingTemplate(compiledTemplate).done(function(buttonId) {
      if (buttonId === "ok") {
        CommandManager.execute("debug.refreshWindow");
      }
    });
  };
  exports.show = (function(_this) {
    return function() {
      var compiledTemplate;
      compiledTemplate = Mustache.render(dialogTemplate);
      _this.dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate);
      _this.$dialog = _this.dialog.getElement();
      init();
      _this.dialog.done(function(buttonId) {
        if (buttonId === "ok") {
          collectValues();
          showRestartDialog();
        }
      });
    };
  })(this);
});
