/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.dialog.wizard = function () {
	this.total_step = null;
	this.step = null;
	this.panel = null;
	this.context_menu = null;
	this.path = null;
	this.title = null;
	this.type = null;
	this.left = null;
	this.top = null;
	this.width = null;
	this.height = null;
	this.yes = null;
	this.no = null;
	this.buttons = null;
	this.success = null;
	this.kind = null;
};

org.goorm.core.dialog.wizard.prototype = {
	init: function (option) {
		var self = this;
		
		this.step = 1;
		
		this.title = option["title"];
		this.path = option["path"];		
		this.width = option["width"];
		this.height = option["height"];
		this.modal = option["modal"];
		
		// this.yes_text = option["yes_text"];
		// this.no_text = option["no_text"];	
		this.buttons = option["buttons"];
		// this.yes = option["yes"];
		// this.no = option["no"];
		
		this.success = option["success"];

	
		this.title = this.title.split(" ").join("_");
		this.kind = option["kind"];		

		
		if ($("#goorm_dialog_container").find("#panelContainer_" + this.title)) {
			$("#goorm_dialog_container").find("#panelContainer_" + this.title).remove();
		}
		
		$("#goorm_dialog_container").append("<div id='panelContainer_" + this.title + "'></div>");
		
		var handle_next = function() { 
			var stop_next = false;
			$("#goorm_dialog_container").find("#panelContainer_" + self.title).find(".bd").find(".wizard_step").each(function (i){
				if(i==self.step-1) {
					$(this).find("input[checkField=yes]").each(function (i){
						if($(this).attr("value")=="") {
							stop_next = true;
						}
					});
				}
			});
			if (stop_next) {
				alert.show(core.module.localization.msg["alertDialogMissing"]);
				return false;
			}
			
			if (self.step < self.total_step) {
				self.show_previous_button(true);
			
				$("#goorm_dialog_container").find("#panelContainer_" + self.title).find(".bd").find(".wizard_step[step='" + self.step + "']").hide();
			
				if ($("#goorm_dialog_container").find("#panelContainer_" + self.title).find(".bd").find(".wizard_step[step='" + self.step + "']")) {
					self.step++;
					$("#goorm_dialog_container").find("#panelContainer_" + self.title).find(".bd").find(".wizard_step[step='" + self.step + "']").show();
					if (self.step == self.total_step) {
						self.show_next_button(false);
					}	
				}
			}
		};
		
		var handle_prev = function() { 
			if (1 < self.step) {
				self.show_next_button(true);
				$("#goorm_dialog_container").find("#panelContainer_" + self.title).find(".bd").find(".wizard_step[step='" + self.step + "']").hide();			
				self.step--;
				
				if (self.step == 1) {
					self.show_previous_button(false);
				}
				
				$("#goorm_dialog_container").find("#panelContainer_" + self.title).find(".bd").find(".wizard_step[step='" + self.step + "']").show();		
			}
		};

		this.buttons.unshift({ text:"Next", handler:handle_next });
		this.buttons.unshift({ text:"Previous", handler:handle_prev });
		
		
		
		this.panel = new YAHOO.widget.Dialog(
			"panelContainer_" + this.title, { 
				width: self.width+'px',
				height: self.height+'px', 
				visible: false, 
				underlay: "none",
				close: true,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true,
				modal: self.modal,
				fixedcenter: true,
				effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.2},
				buttons:  this.buttons
			} 
		);
		
		this.panel.setHeader(this.title.split("_").join(" "));
		this.panel.setBody("Loading Data...");
		this.panel.render();
		
		
		//$(document).unbind('keydown', 'esc');
		$(document).bind('keydown', 'esc', function () {
			if (confirmation.panel == undefined) {
				confirmation.panel = {};
				confirmation.panel.cfg = {};
				confirmation.panel.cfg.config = {};
				confirmation.panel.cfg.config.visible = {};
				confirmation.panel.cfg.config.visible.value = false;
			}
			
			if (self.buttons && self.panel.cfg.config.visible.value && !core.status.keydown && !alert.panel.cfg.config.visible.value && !notice.panel.cfg.config.visible.value && !confirmation.panel.cfg.config.visible.value) {
				$(self.buttons).each(function (i) { 
					if (this.text == "Cancel") {
						this.hide = function(){};
						this.handler();
						
						core.status.keydown = true;
				
						self.panel.hide();						
					}
				});
			}
		});
		
		//$(document).unbind('keydown', 'return');
		$(document).bind('keydown', 'return', function (e) {
			if (confirmation.panel == undefined) {
				confirmation.panel = {};
				confirmation.panel.cfg = {};
				confirmation.panel.cfg.config = {};
				confirmation.panel.cfg.config.visible = {};
				confirmation.panel.cfg.config.visible.value = false;
			}
			
			if (self.buttons && self.panel.cfg.config.visible.value && !core.status.keydown && !alert.panel.cfg.config.visible.value && !notice.panel.cfg.config.visible.value && !confirmation.panel.cfg.config.visible.value) {
				$(self.buttons).each(function (i) {
					if (this.isDefault) {
						this.hide = function(){};
						this.handler();
						
						core.status.keydown = true;
					}
				});
			}
		});	
		
		
		var url = "file/get_contents";	
		
		$.ajax({
			url: url,			
			type: "GET",
			data: "path=public/"+self.path,
			success: function(data) {

				self.panel.setBody(data);
				
				if ( typeof self.success == "function" )
					self.success();			


				core.dialog.loaded_count++;

				if (core.dialog.loaded_count == (Object.keys(core.dialog).length - 1)) {
/*
					$(core).trigger("coreDialogLoaded");
*/
				}
			
				$(core).trigger("goorm_loading");
			}
		});
		
		self.show_previous_button(false);
		return this;
	},
	
	show_previous_button: function(show) {
		var self = this;

		if (show) {
			self.panel._aButtons[0].set("disabled", false);
		}
		else {
			self.panel._aButtons[0].set("disabled", true);
		}
	},
	
	show_next_button: function(show) {
		var self = this;

		if (show) {
			self.panel._aButtons[1].set("disabled", false);
		}
		else {
			self.panel._aButtons[1].set("disabled", true);
		}
	},
	
	showFirstPage: function() {
		var self = this;
		self.step=1;
		$("#goorm_dialog_container").find("#panelContainer_" + self.title).find(".bd").find(".wizard_step").each(function (i){
			$(this).hide();
			if(i==0) {
				$(this).show();
			}
		});
		self.show_previous_button(false);
		self.show_next_button(true);
	}
	
};