/**
 * Application init
 * assign variable "app" kepada window (global)
 * dan merujuk kepada aplikasi LimeNRose.
 * Untuk akses apa-apa function boleh menggunakan
 * object "app" sebab dah global
 */
$(function(){ window.app = new LimeNRose() });

/**
 * Lime & Rose Application
 * @author Luqman
 */
function LimeNRose()
{
	/* Properties
	/*==========================================*/
	this.logged = false;
	this.apptopbar = null;
	this.applayout = null;
	this.applayoutStatusBar = null;
	this.componentRegistration = {};
	this.component = {};
	this.runningNumber = {};
	this.propertiesInterfaceElem = {};
	this.connection = {};
	this.componentDefaultValueCache = {};
	this.componentMappingPropCache = {};
	this.componentMappingTypeCache = {};
	this.reportPropertiesForm = null;
	this.reportProperties = {};
	this.loadFileData = null;
	this.parameter = {};
	this.permission = {};
	

	/* Functions
	/*==========================================*/
	LimeNRose.prototype.AppTopbarInit = function()
	{
		this.apptopbar = new dhtmlXToolbarObject({
			parent : 'apptopbar',
			icons_path : './support/img/'
		});

		var previewOpts = Array(Array('previewPDF', 'obj', 'Preview As PDF' , 'document-pdf-text.png'));
	
		this.apptopbar.addButton('new',        0, 'New', 'report--plus.png');
		this.apptopbar.addButton('open',       1, 'Open', 'folder-horizontal-open.png');
		this.apptopbar.addButton('save',       2, 'Save', 'disk.png');
		this.apptopbar.addSeparator('sep1',    3);
		this.apptopbar.addButton('properties', 4, 'Report Properties', 'report--pencil.png');
		this.apptopbar.addSeparator('sep2',    5);
		this.apptopbar.addButton('conManager', 6, 'Connection', 'lightning.png');
		this.apptopbar.addButton('parameter',  7, 'Parameter', 'paper-plane.png');
		this.apptopbar.addButton('ckeditor',   8, 'CKEditor', 'pencil.png');
		this.apptopbar.addSeparator('sep3',    9);
		this.apptopbar.addButton('refresh',    10, 'Refresh', 'application-resize.png');
		this.apptopbar.addSeparator('sep4',    11);
		this.apptopbar.addButtonSelect('preview',    12, 'Preview', previewOpts, 'fruit-lime.png', 'fruit-lime.png', 'disabled');
		this.apptopbar.addSeparator('sep5',    13);
		this.apptopbar.addButton('publish',     14, 'Publish', 'rose2.png');
   
		this.apptopbar.attachEvent('onClick', function(id){
			switch (id)
			{
				case 'new': window.open('./', '_blank'); break;
				case 'open': app.OpenFile(); break;
				case 'save': app.SaveFile(); break;
				case 'properties': app.ReportPropertiesWindow(); break;
				case 'refresh': app.Refresh(); break;
				case 'preview': app.ShowPreviewWindow(); break;
				case 'previewPDF': app.PreviewInNewWindow('pdf'); break;
				case 'conManager': app.ConnectionWindow(); break;
				case 'parameter': app.ParameterWindow(); break;
				case 'publish': app.Publish(); break;
				case 'ckeditor': app.CKEditorWindow(); break;
			}
		});
	};

	/**
	 * Setup dan init Layout application.
	 * Menggunakan DHTMLX punya layout component
	 * untuk memaparkan 2 bahagian utama (kiri dan kanan)
	 * kiri  : senarai report component yang availble
	 * kanan : workspace utama
	 * disertakan sekali adalah status bar di bawah aplikasi
	 * untuk tujuan tertentu (contoh, papar mesej)
	 */
	LimeNRose.prototype.AppLayoutInit = function()
	{
		// setup 2 bahagian utama
		this.applayout = new dhtmlXLayoutObject({
			parent : 'applayout',
			pattern : '2U',
			cells : [
				{
					id : 'a',
					text : 'Components',
					width: 280
				},
				{
					id : 'b',
					text : 'Workspace'
				}
			]
		});

		// enable scroll pada component list
		this.applayout.cells('a').showInnerScroll();

		// wujudkan status bar
		this.applayoutStatusBar = this.applayout.attachStatusBar({
			height : 20
		});

		// load segala report components
		this._loadComponentsInit();

		// load workspace utama
		this._loadWorkspaceInit();
	};

	/**
	 * Load segala component yang didaftarkan
	 * yang terdapat dalam "comps/register.json"
	 */
	LimeNRose.prototype._loadComponentsInit = function()
	{
		var cell = this.applayout.cells('a');

		cell.progressOn();

		// dapatkan sumber dari JSON
		$.getJSON('comps/register.json', function(comps){

			var components = $('<div>');

			$.map(comps, function(comp){
				var code = '<div class="components"><table>';
				code += '<tr><td><img src="./comps/'+ comp.folder +'/icon.png"/></td>';
				code += '<td><b>'+ comp.title +'</b> - '+ comp.description +'</td></tr>';
				code += '</table></div>';
				var obj = $(code);

				// component drag
				obj.draggable({
					helper : function(){
						var helper = $('<div class="componentDragHelper">'+ comp.title +'</div>');
						helper.appendTo('body');
						return helper;
					},
					cursorAt : {
						left : 30,
						top : 30
					},
					connectToSortable : '.sheet'
				});

				obj.appendTo(components);

				// store component registration
				app.componentRegistration[comp.title] = comp;
			});

			cell.attachObject(components[0]);
			cell.progressOff();
		});
	};

	/**
	 * Load workspace utama.
	 * Kat sini ada kod event drop component
	 * (apa yang akan terjadi sebaik sahaja component diletakkan)
	 */
	LimeNRose.prototype._loadWorkspaceInit = function()
	{
		var ws = $('<div class="workspace">');
		var sheet = $('<div class="sheet">');
		var componentText = null;
		var comp = null;

		sheet.sortable({
			placeholder : 'dropHelper',
			cursor : 'move',
			receive : function(e, ui){
				var details = {};
				componentText = ui.helper.text();

				// memang sengaja pakai prefix 2x underscore (__)
				// sebab kebarangkalian untuk component menggunakan key yang sama itu ada
				details = {
					__uniqueId     : app.GenerateUniqueID(),
					__type         : app.componentRegistration[componentText].name,
					__folder       : app.componentRegistration[componentText].folder,
					__visualHeight : app.componentRegistration[componentText].visualHeight,
					__title        : componentText
				};

				// generate name
				var type = details.__type;
				app.runningNumber[type] = (app.runningNumber[type] === undefined) ? 1 : app.runningNumber[type] + 1;
				details.__name      = type + '_' + app.runningNumber[type];

				// buat satu object component baru
				// dan hantar info mengenai component
				comp = new Component(details);
			},
			stop : function(e,ui){
				if (comp !== null)
				{
					ui.item.replaceWith(comp.__elem);

					// register dalam collection
					app.component[comp.__uniqueId] = comp;

					comp = null;
				}				
			}
		});

		sheet.appendTo(ws);
		this.applayout.cells('b').attachObject(ws[0]);
	};

	LimeNRose.prototype.AppUnloadInit = function()
	{
		$(window).bind('beforeunload', function(){
			return 'Are you sure you want to leave?';
		});
	};

	LimeNRose.prototype.LockerInit = function()
	{
		var window = new dhtmlXWindows();
		var signInWindow = window.createWindow({
			id:"signInWindow",
			center:true,
			width:550,
			height:200,
			modal:true,
			resize:false,
			caption: 'Authentication Required'
		});
		signInWindow.button('close').disable();
		signInWindow.button('minmax1').disable();
		signInWindow.button('minmax2').disable();
		signInWindow.button('park').disable();

		var html = '<div class="applocker"><p>This application requires a valid password.<br/>Please insert the password:</p><input class="password" type="password"/><input class="submit" type="button" value="OK"/><p class="message" style="color:red; display:none;">Access Denied!</p></p></div>';
		html = $(html);

		html.find('input.submit').click(function(){
			signInWindow.progressOn();
			html.find('p.message').hide();

			var password = html.find('input.password').val();

			//check password
			$.ajax({
				url : 'support/checkpassword.php',
				data : {password : password},
				type : 'post'
			})
			.success(function(flag){
				signInWindow.progressOff();
				if (flag === '1')
				{
					app.logged = true;
					signInWindow.close();
					window.unload();
					$('#applocker').remove();
				}
				else
				{
					html.find('p.message').show();
				}
			});
		});

		signInWindow.attachObject(html[0]);
	};

	LimeNRose.prototype.OpenFile = function()
	{
		var iframe = $('<iframe style="position:none;" name="openFrame"></iframe>')
		var form = $('<form target="openFrame" enctype="multipart/form-data" method="post" action="support/load.php"></form>');
		var inputFile = $('<input type="file" name="file"/>');

		inputFile.appendTo(form);
		iframe.appendTo('body');

		inputFile.on('change', function(){
			app.applayout.cells('a').progressOn();
			app.applayout.cells('b').progressOn();
			app.applayoutStatusBar.setText('Loading...');
			form.submit();
			form.remove();
		});

		inputFile.click();

		iframe.on('load', function(){
			app.loadFileData = $(this).contents().find('#data').text();

			if (app.loadFileData === 'Invalid source file!')
			{
				alert('Invalid source file!');
				app.applayout.cells('a').progressOn();
				app.applayout.cells('b').progressOn();
				app.applayoutStatusBar.setText('');
				return false;
			}

			//firefox bug
			//dia load dulu padahal data belum ada lagi
			if (app.loadFileData === '') return false;

			app.loadFileData = JSON.parse(app.loadFileData);

			app.ApplyLoadedData(app.loadFileData);
			$(this).remove();
		});
	};

	LimeNRose.prototype.SaveFile = function()
	{
		var saveData = this.WriteSaveFile();
		saveData = this._escapeSpecialChars(saveData);
		saveData = this._htmlEscape(saveData);

		var form = $('<form style="display:none" method="post" action="support/save.php" target="_blank">');
		var input = '<input type="hidden" name="__details" value="'+ saveData +'"/>';

		form.append(input);
		form.appendTo('body').submit();
		form.remove();
	};

	LimeNRose.prototype.WriteSaveFile = function()
	{
		var app = this;
		var dateCreated = new Date();
		var saveData = {};

		saveData.dateCreated = dateCreated.toString();

		saveData.reportProperties = $.extend({}, this.reportProperties);

		saveData.component = [];
		$('.component').each(function(){
			var id = this.id.substr(5);
			var tempObj = $.extend({}, app.component[id]);
			delete tempObj.__elem;
			delete tempObj.__propertiesElem;

			for (var propKey in tempObj)
			{
				if (typeof tempObj[propKey] === 'string')
				{
					tempObj[propKey] = app._htmlEscape(tempObj[propKey]);
				}
			}

			saveData.component.push(tempObj);
		});

		saveData.connection = $.extend({}, this.connection);

		saveData.parameter = $.extend({}, this.parameter);

		saveData.permission = $.extend({}, this.permission);

		return JSON.stringify(saveData);
	};

	LimeNRose.prototype.ApplyLoadedData = function(data)
	{
		var sheet = $('.workspace .sheet');

		this.HardReset();
		
		this.reportProperties.general = {};
		this.reportProperties.general.name = data.reportProperties.general.name;
		this.reportProperties.general.description = data.reportProperties.general.description;
		this.reportProperties.general.author = data.reportProperties.general.author;

		this.reportProperties.layout = {};
		this.reportProperties.layout.canvasWidth = data.reportProperties.layout.canvasWidth;
		this.reportProperties.layout.marginBottom = data.reportProperties.layout.marginBottom;
		this.reportProperties.layout.marginFooter = data.reportProperties.layout.marginFooter;
		this.reportProperties.layout.marginHeader = data.reportProperties.layout.marginHeader;
		this.reportProperties.layout.marginLeft = data.reportProperties.layout.marginLeft;
		this.reportProperties.layout.marginRight = data.reportProperties.layout.marginRight;
		this.reportProperties.layout.marginTop = data.reportProperties.layout.marginTop;

		this.reportProperties.pdf = {};
		this.reportProperties.pdf.format = data.reportProperties.pdf.format;
		this.reportProperties.pdf.orientation = data.reportProperties.pdf.orientation;

		$.map(data.component, function(comp){
			var component = new Component(comp);
			component.__elem.appendTo(sheet);
			app.component[component.__uniqueId] = component;

			if (app.runningNumber[comp.__type] === undefined)
				app.runningNumber[comp.__type] = 1;
			else
				app.runningNumber[comp.__type]++;
		});

		this.connection = data.connection;

		this.parameter = data.parameter;

		this.permission = data.permission;

		this.applayout.cells('a').progressOff();
		this.applayout.cells('b').progressOff();
		this.applayoutStatusBar.setText('');
	};

	LimeNRose.prototype.HardReset = function()
	{
		//hard reset
		this.reportProperties = {};
		this.component = {};
		this.connection = {};
		this.parameter = {}
		$('.workspace .sheet').empty();
		//this.loadFileData = null;
	};

	LimeNRose.prototype.ShowAlertModal = function(data)
	{
		var window = new dhtmlXWindows();
		var alertWindow = window.createWindow({
			id:"alertWindow",
			width:data.width,
			height:data.height,
			center:true,
			modal:true,
			resize:false,
			caption: data.caption
		});
		alertWindow.button('park').hide();
		alertWindow.button('minmax1').hide();
		alertWindow.button('minmax2').hide();

		var message = $('<div id="alertContent"><p class="modalMessage">'+ data.message +'</p></br></div>');
		if (data.prompt)
		{
			var buttonOK = $('<input class="btnBlue" type="button" value="OK"/>');
			buttonOK.appendTo(message);
			buttonOK.on('click', function(){
				data.submit();
				alertWindow.close();
				window.unload();
			})
		}
		var buttonClose = $('<input class="btnBlue" type="button" value="Close"/>');

		buttonClose.appendTo(message);
		message.appendTo('body');

		buttonClose.on('click', function(){
			alertWindow.close();
			window.unload();
		});
		alertWindow.attachObject(document.getElementById('alertContent'));
	};

	LimeNRose.prototype.GenerateUniqueID = function()
	{
		return Math.random().toString(36).substring(7);
	};

	LimeNRose.prototype.ReportPropertiesInit = function()
	{
		this.reportProperties = {
			general : {
				name : 'Untitled',
				description : '',
				author : ''
			},
			layout : {
				canvasWidth  : 840,
				marginHeader : 5,
				marginTop    : 12,
				marginBottom : 12,
				marginLeft   : 13,
				marginRight  : 13,
				marginFooter : 5
			},
			pdf : {
				format      : 'A4',
				orientation : 'P'
			}
		};
	};

	LimeNRose.prototype.ReportPropertiesWindow = function()
	{
		var window = new dhtmlXWindows();
		var propertiesWindow = window.createWindow({
			id:"propertiesWindow",
			center:true,
			width:450,
			height:500,
			modal:true,
			caption: 'Report Properties'
		});
		propertiesWindow.button('park').disable();

		var toolbar = propertiesWindow.attachToolbar({
			icons_path : './support/img/'
		});
		toolbar.addButton('save', 1, 'Save and Exit', 'disk-return-black.png');
		toolbar.addButton('exit', 2, 'Exit without Save', 'cross.png');

		if (this.reportPropertiesForm === null)
		{
			$.get('./support/report.properties.html', function(html){
				propertiesWindow.progressOn();
				html = '<div class="componentSettings">' + html + '</div>';
				elem = $(html);
				app._reportPropertiesGetter(elem);
				propertiesWindow.attachObject(elem[0]);
				app.reportPropertiesForm = elem[0];
				propertiesWindow.progressOff();
			});
		}
		else
		{
			propertiesWindow.progressOn();
			app._reportPropertiesGetter($(this.reportPropertiesForm));
			propertiesWindow.attachObject(this.reportPropertiesForm);
			propertiesWindow.progressOff();
		}

		toolbar.attachEvent('onClick', function(id){
			if (id === 'save')
			{
				app._reportPropertiesSetter($(app.reportPropertiesForm));
				propertiesWindow.close();
			}
			else if (id === 'exit')
			{
				propertiesWindow.close();
			}
		});
	};

	LimeNRose.prototype._reportPropertiesGetter = function(elem)
	{
		elem.find('input.name').val(this.reportProperties.general.name);
		elem.find('input.description').val(this.reportProperties.general.description);
		elem.find('input.author').val(this.reportProperties.general.author);
		elem.find('input.canvasWidth').val(this.reportProperties.layout.canvasWidth);
		elem.find('input.marginHeader').val(this.reportProperties.layout.marginHeader);
		elem.find('input.marginTop').val(this.reportProperties.layout.marginTop);
		elem.find('input.marginBottom').val(this.reportProperties.layout.marginBottom);
		elem.find('input.marginLeft').val(this.reportProperties.layout.marginLeft);
		elem.find('input.marginRight').val(this.reportProperties.layout.marginRight);
		elem.find('input.marginFooter').val(this.reportProperties.layout.marginFooter);
		elem.find('select.format').val(this.reportProperties.pdf.format);
		elem.find('select.orientation').val(this.reportProperties.pdf.orientation);
	};

	LimeNRose.prototype._reportPropertiesSetter = function(elem)
	{
		this.reportProperties.general.name = elem.find('input.name').val();
		this.reportProperties.general.description = elem.find('input.description').val();
		this.reportProperties.general.author = elem.find('input.author').val();
		this.reportProperties.layout.canvasWidth = elem.find('input.canvasWidth').val();
		this.reportProperties.layout.marginHeader = elem.find('input.marginHeader').val();
		this.reportProperties.layout.marginTop = elem.find('input.marginTop').val();
		this.reportProperties.layout.marginBottom = elem.find('input.marginBottom').val();
		this.reportProperties.layout.marginLeft = elem.find('input.marginLeft').val();
		this.reportProperties.layout.marginRight = elem.find('input.marginRight').val();
		this.reportProperties.layout.marginFooter = elem.find('input.marginFooter').val();
		this.reportProperties.pdf.format = elem.find('select.format').val();
		this.reportProperties.pdf.orientation = elem.find('select.orientation').val();
	};

	LimeNRose.prototype.ShowPreviewWindow = function()
	{
		var window = new dhtmlXWindows();
		var previewWindow = window.createWindow({
			id:"previewWindow",
			center:true,
			width:app.reportProperties.layout.canvasWidth,
			height:600,
			modal:true,
			caption: 'Preview Report'
		});
		previewWindow.button('minmax1').disable();
		previewWindow.button('minmax2').disable();
		previewWindow.button('park').disable();
		previewWindow.maximize();

		var toolbar = previewWindow.attachToolbar({
			icons_path : './support/img/'
		});
		toolbar.addButton('close', 0, 'Close Preview', 'cross.png');

		toolbar.attachEvent('onClick', function(id){
			switch (id)
			{
				case 'close':
					previewWindow.close();
					window.unload();
					break;
			}
		});

		//content
		var data = this.WriteSaveFile();
		data = this._escapeSpecialChars(data);
		data = this._htmlEscape(data);

		var viewer = $('<iframe style="width:100%; height:100%; border:none" name="viewer"></iframe>');
		var form   = $('<form method="post" target="viewer" action="support/view.all.php"><input type="hidden" name="__details" value="'+ data +'"/></form>');

		previewWindow.attachObject(viewer[0]);

		form.submit();

		viewer.on('load', function(){
			previewWindow.progressOff();
			form.remove();
		});
	};

	LimeNRose.prototype.PreviewInNewWindow = function(type)
	{
		var data = this.WriteSaveFile();
		data = this._escapeSpecialChars(data);
		data = this._htmlEscape(data);

		var action = 'support/preview.php';

		if (type === 'pdf') action = 'support/previewpdf.php';

		var form = $('<form method="post" target="_blank" action="'+ action +'"><input name="data" type="hidden" value="'+ data +'"/></form>');
		form.submit();
	};

	LimeNRose.prototype.ConnectionWindow = function()
	{
		var window = new dhtmlXWindows();
		var connectionWindow = window.createWindow({
			id:"connectionWindow",
			center:true,
			width:550,
			height:500,
			modal:true,
			resize:false,
			caption: 'Connection'
		});
		connectionWindow.button('minmax1').disable();
		connectionWindow.button('minmax2').disable();
		connectionWindow.button('park').disable();

		var statusBar = connectionWindow.attachStatusBar();

		var toolbar = connectionWindow.attachToolbar({
			icons_path : './support/img/'
		});

		var layout = connectionWindow.attachLayout({
			pattern : '2U',
			cells : [
				{
					id : 'a',
					header : false,
					width : 170
				},
				{
					id : 'b',
					header : false
				}
			]
		});

		var emptyMessage1 = '<div style="display:table; height:100%; width:100%; text-align:center"><p style="display:table-cell; vertical-align:middle;">No Connection Found</p></div>';
		var emptyMessage2 = '<div style="display:table; height:100%; width:100%; text-align:center"><p style="display:table-cell; vertical-align:middle;">No Connection Selected</p></div>';
		
		var tree;

		//empty connection
		if ($.isEmptyObject(this.connection))
		{
			layout.cells('a').attachHTMLString(emptyMessage1);
			layout.cells('b').attachHTMLString(emptyMessage2);
		}
		//load existing connection (dalam tree)
		else
		{
			app._connTreeInit(layout, app._convertConnToTree(), statusBar, connectionWindow);
			layout.cells('b').attachHTMLString(emptyMessage2);
		}

		//toolbar event (new connection, remove connection)
		toolbar.addButton('newConn', 1, 'New Connection', 'lightning--plus.png');
		toolbar.addButton('removeConn', 2, 'Remove Connection', 'cross-script.png');
		toolbar.attachEvent('onClick', function(id){
			if (id === 'newConn')
			{
				var window = new dhtmlXWindows();
				var addNewConnectionWindow = window.createWindow({
					id:"addNewConnectionWindow",
					center:true,
					width:400,
					height:200,
					modal:true,
					resize:false,
					caption: 'Add New Connection'
				});

				addNewConnectionWindow.progressOn();

				//toolbar
				var toolbar = addNewConnectionWindow.attachToolbar({
					icons_path : './support/img/'
				});

				toolbar.addButton('save', 1, 'Save', 'disk-return-black.png');
				toolbar.addButton('cancel', 2, 'Cancel', 'cross.png');

				//temp connection object
				var tempConn = {};
				var elem;

				//add new interface
				$.getJSON('conns/register.json', function(data){
					var html = '';
					html += '<div class="componentSettings">';
					html += '<table border="0">';
					html += '<tr><td class="subtitle" colspan="3">GENERAL</td></tr>';
					html += '<tr><td>Type</td><td>:</td><td> <select class="connType"></select></td></tr>';
					html += '<tr><td>Connection Name</td><td>:</td><td><input type="text" class="name" value=""/></td></tr>';
					html += '</table>';
					html += '</div>';

					elem = $(html);

					// bind connection list
					var connList = '';
					for (var c=0; c<data.length; c++)
					{
						connList += '<option value="'+ (data[c].type) +'">'+ (data[c].name) +'</option>';
					}
					elem.find('select.connType').append(connList);

					addNewConnectionWindow.attachObject(elem[0]);
					addNewConnectionWindow.progressOff();
				});

				/*$.get('./conns/new.html', null, function(html){
					html = '<div class="componentSettings">' + html + '</div>';
					elem = $(html);

					//addNewConnectionWindow.attachObject(elem[0]);

					addNewConnectionWindow.progressOff();
				}, 'html');*/

				toolbar.attachEvent('onClick', function(id){
					//save new connection
					if (id === 'save')
					{
						var name = elem.find('.name').val();
						var type = elem.find('.connType').val();
						var errorWindow = new dhtmlXWindows();

						//error handling
						if (name === '' || app.connection[name] !== undefined)
						{
							var msg = '';
							var w;
							var h;

							//error
							if (name === '')
							{
								msg = 'Invalid connection name.';
								w = 200;
								h = 130;
							}
							//error - ada nama sama
							else if (app.connection[name] !== undefined)
							{
								msg = 'Please use another name. The name "'+ name +'" is already exist.';
								w = 300;
								h = 150;
							}

							app.ShowAlertModal({
								width:w,
								height:h,
								caption:'Error',
								message: msg
							});
						}
						else
						{
							var conn = new Connection({
								name : name,
								type : type
							});

							addNewConnectionWindow.close();
							
							//refresh tree
							if (tree === undefined)
							{
								app._connTreeInit(layout, app._convertConnToTree(), statusBar, connectionWindow);
							}
							else
							{
								tree.deleteChildItems(0);
								tree.loadJSONObject(app._convertConnToTree());
							}
						}
					}
					else if (id === 'cancel')
					{
						addNewConnectionWindow.close();
					}
				});
			}
			//remove connection
			else if (id === 'removeConn')
			{
				var tree = layout.cells('a').getAttachedObject();

				if (tree !== null)
				{
					app.ShowAlertModal({
						width : 400,
						height : 150,
						caption : 'Confirm Remove',
						message : 'You are about to remove this connection. Any component using this connection will be affected. Proceed?',
						prompt : true,
						submit : function(){
							var id = tree.getSelectedItemId();
							tree.deleteItem(id);
							delete app.connection[id];

							if (tree.getAllSubItems(0) === '') layout.cells('a').attachHTMLString(emptyMessage1);
							layout.cells('b').attachHTMLString(emptyMessage2);
						}
					});
				}
			}
		});
	};

	LimeNRose.prototype.ParameterWindow = function()
	{
		var window = new dhtmlXWindows();
		var parameterWindow = window.createWindow({
			id:"parameterWindow",
			center:true,
			width:550,
			height:400,
			modal:true,
			resize:false,
			caption: 'Report Parameter'
		});
		parameterWindow.button('minmax1').disable();
		parameterWindow.button('minmax2').disable();
		parameterWindow.button('park').disable();

		var statusBar = parameterWindow.attachStatusBar();

		var toolbar = parameterWindow.attachToolbar({
			icons_path : './support/img/'
		});

		toolbar.addButton('add', 0, 'Add Parameter', 'paper-plane--plus.png');

		var table = $('<table class="parameter" cellpadding="3" border="1"><col style="width:22.5%"><col style="width:22.5%"><col style="width:22.5%"><col style="width:22.5%"><col style="width:10%"><tr><th>Name</th><th>Type</th><th>Data Type</th><th>Temporary Value</th><th></th></tr></table>');

		//existing parameter
		for (var key in app.parameter)
		{
			var row = '<tr id="'+ key +'">';
			row += '<td style="text-align:center">'+ app.parameter[key].name +'</td>';
			row += '<td style="text-align:center">'+ app.parameter[key].type +'</td>';
			row += '<td style="text-align:center">'+ app.parameter[key].dataType +'</td>';
			row += '<td style="text-align:center">'+ app.parameter[key].value +'</td>';
			row += '<td style="text-align:center"><a href="javascript:void(0)"><img title="Remove" class="remove" src="support/img/cross-script.png"/></a></td>';
			row += '</tr>';

			//remove register event
			row = $(row);
			row.find('img').on('click', function(){
				var currentRow = $(this).closest('tr');
				delete app.parameter[currentRow[0].id];
				currentRow.remove();
			});

			table.append(row);
		}

		parameterWindow.attachObject(table[0]);

		toolbar.attachEvent('onClick', function(id){
			if (id === 'add')
			{
				var window2 = new dhtmlXWindows();
				var addNewParameterWindow = window.createWindow({
					id:"addNewParameterWindow",
					center:true,
					width:300,
					height:200,
					modal:true,
					resize:false,
					caption: 'Add New Parameter'
				});
				addNewParameterWindow.button('minmax1').disable();
				addNewParameterWindow.button('minmax2').disable();
				addNewParameterWindow.button('park').disable();

				var toolbar2 = addNewParameterWindow.attachToolbar({
					icons_path : './support/img/'
				});

				toolbar2.addButton('save', 0, 'Save', 'disk-return-black.png');
				toolbar2.addButton('cancel', 1, 'Cancel', 'cross.png');

				var html = '<div class="componentSettings"><table>';
				html += '<col style="width:30%">';
				html += '<tr><td>Name</td><td>:</td><td><input type="text" class="name" value=""/></td></tr>';
				html += '<tr><td>Type</td><td>:</td><td>';
				html += '<select class="type">';
				html += '<option value="post">POST</option>';
				html += '<option value="get">GET</option>';
				html += '<option value="session">SESSION</option>';
				html += '</select>';
				html += '</td></tr>';
				html += '<tr><td>Data Type</td><td>:</td><td>';
				html += '<select class="dataType">';
				html += '<option value="string">String</option>';
				html += '<option value="number">Number</option>';
				html += '</select>';
				html += '</td></tr>';
				html += '<tr><td>Value</td><td>:</td><td><input type="text" class="value" value=""/></td></tr>';
				html += '</table></div>';

				var form = $(html);

				addNewParameterWindow.attachObject(form[0]);

				toolbar2.attachEvent('onClick', function(id){
					if (id === 'cancel')
					{
						addNewParameterWindow.close();	
					}
					else if (id === 'save')
					{
						var name = form.find('input.name').val();
						var type = form.find('select.type').val();
						var dataType = form.find('select.dataType').val();
						var value = form.find('input.value').val();

						if (name === '')
						{
							app.ShowAlertModal({
								width:170,
								height:140,
								caption:'Error',
								message: 'Invalid name!'
							});
						}
						else
						{
							var id = app.GenerateUniqueID();
							app.parameter[id] = {
								name : name,
								type : type,
								dataType : dataType,
								value : (dataType === 'string') ? value : parseFloat(value)
							};

							var row = '<tr id="'+ id +'">';
							row += '<td style="text-align:center">'+ name +'</td>';
							row += '<td style="text-align:center">'+ type +'</td>';
							row += '<td style="text-align:center">'+ dataType +'</td>';
							row += '<td style="text-align:center">'+ value +'</td>';
							row += '<td style="text-align:center"><a href="javascript:void(0)"><img title="Remove" class="remove" src="support/img/cross-script.png"/></a></td>';
							row += '</tr>';

							row = $(row);
							row.find('img').on('click', function(){
								var currentRow = $(this).closest('tr');
								delete app.parameter[currentRow[0].id];
								currentRow.remove();
							});

							table.append(row);

							addNewParameterWindow.close();
						}
					}
				});
			}
		});
	};

	LimeNRose.prototype.CKEditorWindow = function()
	{
		var window = new dhtmlXWindows();
		var ckeditorWindow = window.createWindow({
			id:"ckeditorWindow",
			center:true,
			width:550,
			height:400,
			modal:true,
			caption: 'Report Parameter'
		});
		ckeditorWindow.button('park').disable();

		ckeditorWindow.progressOn();

		ckeditorWindow.attachURL('support/ckeditor.html');

		ckeditorWindow.attachEvent('onContentLoaded', function(win){
			ckeditorWindow.progressOff();
		});
	};

	LimeNRose.prototype.Publish = function()
	{
		var window = new dhtmlXWindows();
		var publishWindow = window.createWindow({
			id:"publishWindow",
			center:true,
			width:550,
			height:400,
			modal:true,
			resize:false,
			caption: 'Publish Report'
		});
		publishWindow.button('minmax1').disable();
		publishWindow.button('minmax2').disable();
		publishWindow.button('park').disable();

		var statusBar = publishWindow.attachStatusBar();

		var html = '<div class="componentSettings">';
		html += '<table border="0">';
		html += '<tr><td colspan="3"><p>Published report will be created inside the <b>\'publish\'</b> folder</p></td></tr>'
		html += '<tr><td class="subtitle" colspan="3">GENERAL</td></tr>';
		html += '<tr><td>File name</td><td>:</td><td><input type="text" class="filename" value=""/></td></tr>'
		html += '<tr><td class="subtitle" colspan="3">PERMISSION</td></tr>';
		html += '<tr><td colspan="3">';

		//table permission
		html += '<table border="0" class="permission">';
		html += '<col style="width:30%">';
		html += '<col style="width:30%">';
		html += '<col style="width:30%">';
		html += '<col style="width:10%">';
		html += '<tr><th>Key</th><th>Value</th><th>Type</th><th></th></tr>';

		for (var key in app.permission)
		{
			html += '<tr id="'+ key +'">';
			html += '<td><input type="text" class="key" value="'+ app.permission[key].key +'"/></td>';
			html += '<td><input type="text" class="value" value="'+ app.permission[key].value +'"/></td>';
			html += '<td>';
			html += '<select class="type">';
			html += '<option value="post"' + (app.permission[key].type === 'post' ? ' selected ' : '') + '>POST</option>';
			html += '<option value="get"' + (app.permission[key].type === 'get' ? ' selected ' : '') + '>GET</option>';
			html += '<option value="session"' + (app.permission[key].type === 'session' ? ' selected ' : '') + '>SESSION</option>';
			html += '</select>';
			html += '<td><a href="javascript:void(0)"><img title="Remove" class="remove" src="support/img/cross-script.png"/></a></td>';
			html += '</td>';
			html += '</tr>';
		}

		html += '</table>';
		//end table permssion
		
		html += '</td></tr>';
		html += '</table>';
		html += '<br/>';
		html += '<div style="text-align:center">';
		html += '<input type="button" class="addPermission btnBlue" value="Add Key"/>';
		html += '<input type="button" class="publish btnBlue" value="Publish"/>';
		html += '</div>';
		html += '</div>';

		var form = $(html);
		publishWindow.attachObject(form[0]);

		//register event
		form.find('input.key').on('blur', function(){
			var tr = $(this).closest('tr');
			var id = tr[0].id;
			app.permission[id].key = $(this).val();
		});

		form.find('input.value').on('blur', function(){
			var tr = $(this).closest('tr');
			var id = tr[0].id;
			app.permission[id].value = $(this).val();
		});

		form.find('select.type').on('change', function(){
			var tr = $(this).closest('tr');
			var id = tr[0].id;
			app.permission[id].type = $(this).val();
		});

		form.find('img.remove').on('click', function(){
			var tr = $(this).closest('tr');
			var id = tr[0].id;
			delete app.permission[id];
			tr.remove();
		});

		form.find('input.addPermission').on('click', function(){
			var table = form.find('table.permission');

			var id = app.GenerateUniqueID();

			var row = '<tr id="'+ id +'">';
			row += '<td><input type="text" class="key"/></td>';
			row += '<td><input type="text" class="value"/></td>';
			row += '<td>';
			row += '<select class="type">';
			row += '<option value="post">POST</option>';
			row += '<option value="get">GET</option>';
			row += '<option value="session">SESSION</option>';
			row += '</select>';
			row += '<td><a href="javascript:void(0)"><img title="Remove" class="remove" src="support/img/cross-script.png"/></a></td>';
			row += '</td>';
			row += '</tr>';

			row = $(row);
			table.append(row);

			app.permission[id] = {
				key : row.find('input.key').val(),
				value : row.find('input.value').val(),
				type : row.find('select.type').val()
			};

			row.find('input.key').on('blur', function(){
				app.permission[id].key = $(this).val();
			});

			row.find('input.value').on('blur', function(){
				app.permission[id].value = $(this).val();
			});

			row.find('select.type').on('change', function(){
				app.permission[id].type = $(this).val();
			});

			row.find('img.remove').on('click', function(){
				var tr = $(this).closest('tr');
				var id = tr[0].id;
				delete app.permission[id];
				tr.remove();
			});
		});

		form.find('input.publish').on('click', function(){
			var filename = form.find('input.filename').val();

			if (filename === '')
			{
				app.ShowAlertModal({
					width : 180,
					height : 150,
					caption : 'Error',
					message : 'Invalid File Name!'
				});
			}
			else
			{
				//check ada tak nama sama
				publishWindow.progressOn();
				statusBar.setText('Loading...');
				$.ajax({
					url : 'support/publish.php',
					data : {task : 'checkFile', filename: filename, data:app.WriteSaveFile()},
					type : 'post'
				})
				.success(function(message){
					if (message === 'OK')
					{
						app.ShowAlertModal({
							width:300,
							height:150,
							caption:'Success',
							message : 'Report has been successfully published'
						})
						publishWindow.progressOff();
						statusBar.setText('Publish success');
						publishWindow.close();
					}
					else
					{
						app.ShowAlertModal({
							width:300,
							height:150,
							caption:'Unable To Publish',
							message : message
						})
						publishWindow.progressOff();
						statusBar.setText('Publish failed');
					}
				});
			}
		});
	};

	LimeNRose.prototype._connTreeInit = function(layout, treeContent, statusBar, connectionWindow)
	{
		tree = layout.cells('a').attachTree();
		tree.setImagePath('./libs/dhtmlx/imgs/dhxtree_skyblue/');
		tree.loadJSONObject(treeContent);
		app._connTreeAttachEvent(tree, layout, statusBar, connectionWindow);
	};

	LimeNRose.prototype._connTreeAttachEvent = function(tree, layout, statusBar, connectionWindow)
	{
		//tree event
		tree.attachEvent('onClick', function(id){
			var name = id;
			var type = app.connection[id].type;
			var propHtml = './conns/' + type + '/properties.html';

			layout.cells('b').progressOn();

			$.get(propHtml, null, function(html){

				var obj = $('<div class="componentSettings">' + html + '</div>');

				//dom object
				var inputName = obj.find('span.name');
				var inputType = obj.find('span.type');
				var inputHost = obj.find('.host');
				var inputPort = obj.find('.port');
				var inputUser = obj.find('.username');
				var inputPass = obj.find('.password');

				//getter
				inputName.text(id);
				inputType.text(type);
				inputHost.val(app.connection[id].host);
				inputPort.val(app.connection[id].port);
				inputUser.val(app.connection[id].username);
				inputPass.val(app.connection[id].password);

				//test connection button
				obj.find('input.test').on('click', function(){
					var details = {
						task : 'testConnection',
						host : inputHost.val(),
						port : inputPort.val(),
						username : inputUser.val(),
						password : inputPass.val()
					};

					$.ajax({
						url : './conns/' + type + '/conn.' + type + '.php',
						type : 'post',
						data : details
					})
					.success(function(message){
						if (message.length >= 70)
						{
							var shortMessage = message.substr(0,70);
							shortMessage += ' <a href="javascript:void(0)" title="'+ message +'">...</a>';
							statusBar.setText(shortMessage);
						}
						else
						{
							statusBar.setText(message);
						}
					});
				});

				//save button
				obj.find('input.save').on('click', function(){
					app.connection[id].host = inputHost.val();
					app.connection[id].port = inputPort.val();
					app.connection[id].username = inputUser.val();
					app.connection[id].password = inputPass.val();
					connectionWindow.close();
				});

				layout.cells('b').attachObject(obj[0]);
				layout.cells('b').progressOff();

			}, 'html');
		});
	};

	LimeNRose.prototype._convertConnToTree = function()
	{
		var root = {id:0, item:[]};
		for (var connName in this.connection)
		{
			var conn = {};
			conn.id = connName;
			conn.text = connName;
			root.item.push(conn);
		}
		return root;
	};

	LimeNRose.prototype.Refresh = function()
	{
		this.applayout.cells('a').setWidth(280);
	};

	LimeNRose.prototype._htmlEscape = function(str)
	{
		return String(str)
		        .replace(/&/g, '&amp;')
		        .replace(/"/g, '&quot;')
		        .replace(/'/g, '&#39;')
		        .replace(/</g, '&lt;')
		        .replace(/>/g, '&gt;');
	};

	LimeNRose.prototype._htmlDecode = function(str)
	{
		if (str === undefined) str = '';
		return String(str)
		        .replace(/&amp;/g, '&')
		        .replace(/&quot;/g, '"')
		        .replace(/&#39;/g, "'")
		        .replace(/&lt;/g, '<')
		        .replace(/&gt;/g, '>');
	};

	LimeNRose.prototype._escapeSpecialChars = function(str){
		return str
			.replace(/[\\]/g, '\\\\')
			.replace(/[\"]/g, '\\\"')
			.replace(/[\/]/g, '\\/')
			.replace(/[\b]/g, '\\b')
			.replace(/[\f]/g, '\\f')
			.replace(/[\n]/g, '\\n')
			.replace(/[\r]/g, '\\r')
			.replace(/[\t]/g, '\\t');
	};

	/**
	 * CALLER
	 * ========================
	 * Functions yang akan dipanggil
	 * sebaik sahaja instance dibuat
	 * (constructor)
	 */
	this.LockerInit();
	this.AppTopbarInit();
	this.AppLayoutInit();
	this.ReportPropertiesInit();
	this.AppUnloadInit();
}