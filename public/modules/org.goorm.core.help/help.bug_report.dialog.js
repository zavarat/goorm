/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

org.goorm.core.help.bug_report.dialog = function () {
	this.dialog = null;
};

org.goorm.core.help.bug_report.dialog.prototype = {
	init: function (option) {
		this.dialog = new org.goorm.core.dialog();
		this.dialog.init(option);
		
		return this;
	}
};
