function Component(details)
{
	/* Properties
	/*==========================================*/

	/**
	 * amik value dari details
	 * dan assign untuk dijadikan key dan value pada component ini
	 */
	 for (var key in details)
	 {
	 	this[key] = details[key];
	 }

	/**
	 * elem merujuk kepada jQuery DOM object
	 * @type object
	 */
	this.__elem = null;

	/**
	 * jika true, masa preview paparkan
	 * jika false, masa preview tidak dipaparkan
	 * @type bool
	 */
	this.__enablePreview = true;

	/**
	 * folder path untuk component
	 */
	this.__folderPath = 'comps/' + this.__folder + '/';

	/**
	 * properties form element (jquery)
	 * @type object
	 */
	this.__propertiesElem = null;

	/**
	 * default values untuk properties
	 * akan diassign mengikut "map" key yang ditetapkan
	 * @type object
	 */
	this.__defaultValues = {};


	/* Functions
	/*==========================================*/
	Component.prototype.ElemInit = function()
	{
		var component     = this;
		var options       = $('<ul class="options"></ul>');
		var setting       = $('<li><img src="support/img/gear.png"/></li>');
		var enablePreview = $('<li><img src="support/img/eye.png"/></li>');
		var preview       = $('<li><img src="support/img/control.png"/></li>');
		var remove        = $('<li><img src="support/img/cross-circle.png"/></li>');

		this._registerOptionsEvent({
			setting : setting,
			enablePreview : enablePreview,
			preview : preview,
			remove : remove
		});

		options.append(setting);
		options.append(enablePreview);
		options.append(preview);
		options.append(remove);

		var elemCode = '<div style="';
		elemCode += 'height:' + this.__visualHeight + 'px;" ';
		//elemCode += 'background-image:url(\'comps/' + this.__folder + '/bg.png\');" ';
		elemCode += 'class="component" ';
		elemCode += 'data-comp-type="' + this.__type + '" ';
		elemCode += 'id="comp_'+ this.__uniqueId +'">';
		elemCode += '<div style="display: block; position: absolute; font-size: 20px; color: #B0B0B0; text-align: center; left: 0; right: 0; top: 0; bottom: 0; line-height: '+ this.__visualHeight +'px;">' + this.__title + '</div>';
		elemCode += '<span class="name">' + this.__name + '</span>';
		elemCode += '</div>';

		var elem = $(elemCode);
		
		elem.append(options);
		this.__elem = elem;

		// load properties json beserta default value
		// (hanya jika component jenis ini belum pernah load)
		if (!app.componentDefaultValueCache[this.__type])
		{
			var component = this;

			$.getJSON(this.__folderPath + 'properties.json', function(data){
				var propForm = data.propertiesForm;
				component.__defaultValues = data.default;

				// apply default value
				for (var key in data.default)
				{
					var value = data.default[key];
					if (key !== 'name' && key !== 'type' && key !== 'connection' && key !== 'pageheader' !== 'pagefooter')
					{
						component[key] = value;
					}
				}

				component._createPropertiesFormElem(propForm);
			});
		}
	};

	Component.prototype._createPropertiesFormElem = function(prop)
	{
		var code = '<div class="componentSettings"><table border="1" style="width:100%; border-collapse:collapse;">';

		// column size
		// ada 2 column je
		code += '<col style="width:20%"/>';
		code += '<col style="width:80%"/>';

		for (var key in prop)
		{
			// label untuk subtitle (seperator)
			if (key.substr(0,3) === '___')
			{
				code += '<tr><td style="font-weight:bold" colspan="2">'+ prop[key].label +'</td></tr>';
			}

			// properties
			else
			{
				var property = prop[key];

				code += '<tr>';
				code += '<td>' + key + '</td>';
				code += '<td>';

				if (property.type === 'inputnumber')
				{
					code += '<input type="number" data-map="'+ (prop[key].map) +'"/>';
				}
				else if (property.type === 'inputtext')
				{
					code += '<input data-map="' + (prop[key].map) +  '" type="text" ';
					code += (property.readOnly) ? 'readOnly ' : '';

					// set default value
					if (this.__defaultValues[prop[key].map])
					{
						var defaultValue = '';

						if (this.__defaultValues[prop[key].map] === 'auto')
						{
							if      (prop[key].map === 'type') { defaultValue = this.__type; }
							else if (prop[key].map === 'name') { defaultValue = this.__name; }
							code += 'value ="' + defaultValue + '" ';
						}
					}

					code += '/>';
				}
				else if (property.type === 'dropdown')
				{
					code += '<select data-map="' + (prop[key].map) +  '">';

					// connection (auto)
					if (prop[key].map === 'connection')
					{
						for (var connName in app.connection)
						{
							code += '<option value="' + connName + '">' + connName + ' (' + (app.connection[connName].type) + ')</option>';
						}	
					}
					// else (dapatkan dari "source" key)
					else if (prop[key].source)
					{
						for (var dropdownKey in prop[key].source)
						{
							code += '<option value="' + (prop[key].source[dropdownKey]) + '">' + dropdownKey + '</option>';
						}
					}
					
					code += '</select>';
				}
				else if (property.type === 'textarea')
				{
					code += '<textarea data-map="' + (prop[key].map) +  '"></textarea>';
				}
				else if (property.type === 'checkbox')
				{
					code += '<input type="checkbox" data-map="'+ (prop[key].map) +'"/>';
				}
				else if (property.type === 'ckeditor')
				{
					code += '<div id="ckeditor"></div>';
				}
				
				code += '</td>';
				code += '</tr>';
			}
		}

		code += '</table>';
		code += '</div>'

		this.__propertiesElem = $(code);
	};

	Component.prototype.Setting = function()
	{
		var component = this;
		var window = new dhtmlXWindows();
		var settingWindow = window.createWindow({
			id:"settingWindow",
			x:20,
			y:30,
			width:700,
			height:400,
			center:true,
			modal:true,
			move:true,
			caption: 'Component Settings'
		});
		settingWindow.button('park').disable();
		settingWindow.progressOn();

		var toolbar = settingWindow.attachToolbar({
			icons_path : './support/img/'
		});

		toolbar.addButton('preview', 0, 'Save and Preview', 'control.png');
		toolbar.addButton('save', 1, 'Save and Exit', 'disk-return-black.png');
		toolbar.addButton('exit', 2, 'Exit without Save', 'cross.png');

		toolbar.attachEvent('onClick', function(id){

			// save and preview
			if (id === 'preview')
			{
				component._propertiesSetter();
				component.Preview();
			}

			// save and exit
			else if (id === 'save')
			{
				component._propertiesSetter();
				settingWindow.close();
				window.unload();
			}

			// exit without save
			else if (id === 'exit')
			{
				settingWindow.close();
				window.unload();
			}
		});

		//settingWindow.attachObject(this.__propertiesElem[0]);
		this._propertiesGetter();
		settingWindow.attachObject(this.__propertiesElem[0]);
		settingWindow.progressOff();
	};

	Component.prototype._loadData = function()
	{
		//load dari json buat kali pertama
		//selepas itu akan disimpan dalam cache
		//item2 yang sama selepas ini akan amik dari cache
		//instead of load dari json

		var component = this;

		if (app.componentDefaultValueCache[this.type] === undefined 
			&& app.componentMappingPropCache[this.type] === undefined
			&& app.componentMappingTypeCache[this.type] === undefined)
		{
			$.getJSON(this.folderPath + 'data.json', function(data){
				//default value (tidak apply jika open)
				if (data.default && app.loadFileData === null)
				{
					component._applyDefaultValue(data.default);
					app.componentDefaultValueCache[component.type] = data.default;
				}
				else
				{
					//app.componentDefaultValueCache[component.type] = {};
					app.componentDefaultValueCache[component.type] = data.default;
				}

				//mapping prop
				app.componentMappingPropCache[component.type] = data.map;

				//mapping prop type
				app.componentMappingTypeCache[component.type] = data.mapType;
			});
		}
		else
		{
			if (app.loadFileData === null) component._applyDefaultValue(app.componentDefaultValueCache[this.type]);
		}
	};

	Component.prototype._applyDefaultValue = function(data)
	{
		for (var key in data)
		{
			this[key] = data[key];
		}
	};

	Component.prototype._registerOptionsEvent = function(opt)
	{
		var component = this;

		//edit component
		opt.setting.on('click', function(){
			component.Setting();
		});
		opt.setting.on('mouseover', function(event){
			app.applayoutStatusBar.setText('Open component settings');
		});
		opt.setting.on('mouseout', function(event){
			app.applayoutStatusBar.setText('');
		});

		//toggle enable preview
		opt.enablePreview.on('click', function(){
			component.ToggleEnablePreview(this);
		});
		opt.enablePreview.on('mouseover', function(event){
			app.applayoutStatusBar.setText('Enable or disable component in preview mode');
		});
		opt.enablePreview.on('mouseout', function(event){
			app.applayoutStatusBar.setText('');
		});

		//preview this component only
		opt.preview.on('click', function(){
			component.Preview();
		});
		opt.preview.on('mouseover', function(event){
			app.applayoutStatusBar.setText('Preview this component only');
		});
		opt.preview.on('mouseout', function(event){
			app.applayoutStatusBar.setText('');
		});

		//buang component
		opt.remove.on('click', function(){
			component.RemovePrompt();
		});
		opt.remove.on('mouseover', function(event){
			app.applayoutStatusBar.setText('Permenantly remove this component');
		});
		opt.remove.on('mouseout', function(event){
			app.applayoutStatusBar.setText('');
		});
	};

	Component.prototype.SettingX = function()
	{
		var component = this;
		var window = new dhtmlXWindows();
		var settingWindow = window.createWindow({
			id:"settingWindow",
			x:20,
			y:30,
			width:700,
			height:400,
			center:true,
			modal:true,
			move:true,
			caption: 'Component Settings'
		});
		settingWindow.button('park').disable();
		settingWindow.progressOn();

		var toolbar = settingWindow.attachToolbar({
			icons_path : './support/img/'
		});

		toolbar.addButton('preview', 0, 'Save and Preview', 'control.png');
		toolbar.addButton('save', 1, 'Save and Exit', 'disk-return-black.png');
		toolbar.addButton('exit', 2, 'Exit without Save', 'cross.png');

		toolbar.attachEvent('onClick', function(id){
			if (id === 'exit')
			{
				settingWindow.close();
				window.unload();
			}
		});

		if (app.propertiesInterfaceElem[component.type] === undefined)
		{
			$.get('./comps/' + this.folder + '/properties.html', null, function(html){
				html = '<div class="componentSettings">'+ html + '</div>';

				//component settings
				var cs = $(html);

				settingWindow.attachObject(cs[0]);
				settingWindow.progressOff();

				component._loadPropertiesContent({
					cs : cs,
					toolbar : toolbar,
					settingWindow : settingWindow
				});

				//cache
				app.propertiesInterfaceElem[component.type] = cs;

			}, 'html');
		}
		//ambik dari cache
		else
		{
			var cs = app.propertiesInterfaceElem[component.type];

			settingWindow.attachObject(cs[0]);
			settingWindow.progressOff();

			component._loadPropertiesContent({
				cs : cs,
				toolbar : toolbar,
				settingWindow : settingWindow
			});
		}
	};

	Component.prototype._loadPropertiesContent = function(data)
	{
		var component = this;

		//getter
		component._propertiesGetter(data.cs);

		//setter
		data.toolbar.attachEvent('onClick', function(id){
			if (id === 'save')
			{
				component._propertiesSetter(data.cs);
				data.settingWindow.close();
			}
			else if (id === 'preview')
			{
				component._propertiesSetter(data.cs);
				component.Preview();
			}
		});
	};

	Component.prototype._propertiesGetter = function()
	{
		if (this.__propertiesElem !== null)
		{
			var component = this;

			// cari semua element yang ada 'data-map' attribute
			this.__propertiesElem.find('*[data-map]').each(function(){

				var key   = $(this).attr('data-map');

				// refresh content dropdown
				// untuk connection
				if (key === 'connection')
				{
					$(this).empty();
					var conn = '';
					for (var connName in app.connection)
					{
						conn += '<option value="'+ connName +'">'+ connName +' ('+ app.connection[connName].type +')</option>';
					}
					$(this).append(conn);
				}

				// get value
				if (key === 'name' || key === 'type' || key === 'connection' || key === 'pageheader' || key === 'pagefooter')
				{
					// jika checkbox
					if ($(this).attr('type') === 'checkbox')
					{
						$(this).prop('checked', component['__' + key]);
						// console.log(component['__' + key]);
					}
					else
					{
						$(this).val(component['__' + key]);
					}
				}	
				else
				{
					// jika checkbox
					if ($(this).attr('type') === 'checkbox')
					{
						$(this).prop('checked', component[key]);
					}
					else
					{
						$(this).val(app._htmlDecode(component[key]));
					}
				}
			});
		}
	}

	Component.prototype._propertiesSetter = function()
	{
		if (this.__propertiesElem !== null)
		{
			var component = this;

			// cari semua element yang ada 'data-map' attribute
			this.__propertiesElem.find('*[data-map]').each(function(){

				var key   = $(this).attr('data-map');
				var value = $(this).val();

				// reserve keyword (akan ditambah '__')
				if (key === 'name' || key === 'type' || key === 'connection' || key === 'pageheader' || key === 'pagefooter')
				{
					// jika checkbox
					if ($(this).attr('type') === 'checkbox')
					{
						component['__' + key] = ($(this).prop('checked'));
					}
					else
					{
						component['__' + key] = value;
					}
				}
				else
				{
					if ($(this).attr('type') === 'checkbox')
					{
						value = $(this).prop('checked');
						component[key] = value;
					}
					// number
					else if ($(this).attr('type') === 'number')
					{
						component[key] = parseFloat(value);
					}
					else
					{
						component[key] = app._htmlEscape(value);
					}
				}
			});

			// ubah 'name' pada visual
			this.__elem.find('span.name').text(this.__name);
		}
	};

	Component.prototype.Preview = function()
	{
		var window = new dhtmlXWindows();
		var previewWindow = window.createWindow({
			id:"previewWindow",
			x:20,
			y:30,
			width:app.reportProperties.layout.canvasWidth,
			height:500,
			center:true,
			modal:true,
			move:true,
			caption: 'Preview Component'
		});
		previewWindow.button('minmax1').disable();
		previewWindow.button('minmax2').disable();
		previewWindow.button('park').disable();

		var toolbar = previewWindow.attachToolbar({
			icons_path : './support/img/'
		});

		toolbar.addButton('close', 0, 'Close Preview', 'cross.png');
		toolbar.attachEvent('onClick', function(id){
			if (id === 'close')
			{
				previewWindow.close();
				window.unload();
			}
		});

		previewWindow.progressOn();

		var objectClone = $.extend({}, this);

		delete objectClone.__elem;
		delete objectClone.__propertiesElem;

		// connection details
		objectClone.__connectionDetails = $.extend({}, app.connection[this.__connection]);

		// report parameter
		objectClone.__reportParameter = $.extend({}, app.parameter);

		// object to string
		var objectCloneString = JSON.stringify(objectClone);
		objectCloneString = app._escapeSpecialChars(objectCloneString);
		objectCloneString = app._htmlEscape(objectCloneString);

		//instead of ajax, use iframe
		var viewer = $('<iframe style="width:100%; height:100%; border:none" name="viewer"></iframe>');
		var form   = $('<form method="post" target="viewer" action="support/view.component.php"><input type="hidden" name="__details" value="'+ objectCloneString +'"/></form>');

		previewWindow.attachObject(viewer[0]);

		form.submit();

		viewer.on('load', function(){
			previewWindow.progressOff();
			form.remove();
		});

		//### ASAL
		/*//bawak connection sekali
		objectClone.__connection = $.extend({}, app.connection[objectClone.connection]);

		objectClone.inAppPreview = true;

		//bawak parameter
		objectClone.reportParameter = $.extend({}, app.parameter);

		$.ajax({
			url : this.folderPath + 'template.php',
			data : {details : JSON.stringify(objectClone) },
			type : 'post'
		})
		.success(function(html){
			previewWindow.attachHTMLString('<div id="preview-all">' + html + '</div>');
			previewWindow.progressOff();
		});*/
	};

	Component.prototype.ToggleEnablePreview = function(li)
	{
		if (this.__enablePreview)
		{
			$(li).find('img').attr('src', './support/img/eye-half.png');
			this.__enablePreview = false;
		}
		else
		{
			$(li).find('img').attr('src', './support/img/eye.png');
			this.__enablePreview = true;	
		}
	};

	Component.prototype.RemovePrompt = function()
	{
		var component = this;
		app.ShowAlertModal({
			width : 300,
			height : 140,
			caption : 'Confirm Remove',
			message : 'You are going to remove this component. This action cannot be undone. Proceed?',
			prompt : true,
			submit : function(){
				component.__elem.remove();
				delete app.component[component.__uniqueId];
			}
		});
	};

	//caller
	this.ElemInit();
}