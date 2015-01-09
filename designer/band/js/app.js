$(function(){
	window.app = new App();
});

/**
 * Lime & Rose Application
 * Grid Report Designer
 * author  Luqman B. Shariffudin (luqman.shariffudin@nc.com.my)
 */
function App()
{
	// app properties
	this.layout = null;
	this.menu = null;
	this.toolbar = null;
	this.statusBar = null;
	this.imagePath = '../../libs/dhtmlx/imgs/';
	this.elements = {
		id:0,
		item:[
			{id:'report', text:"Report",child:"1",im1:"application-blue.png", im2:"application-blue.png",
			item:[
				{id:'pageHeader', text:"Page Header", im0:"application.png"},
				{id:'reportHeader', text:"Report Header", im0:"application.png"},
				{id:'header', text:"Header", im0:"application.png"},
				{id:'body', text:"Body", im0:"application.png"},
				{id:'noData', text:"No Data", im0:"application.png"},
				{id:'footer', text:"Footer", im0:"application.png"},
				{id:'reportFooter', text:"Report Footer", im0:"application.png"},
				{id:'pageFooter', text:"Page Footer", im0:"application.png"}
			]}
		]
	};
	this.band = {};

	// editor config
	this.editor = {
		cursorAtPage : 1,
		fontSize : 11
	};

	App.prototype.LayoutInit = function()
	{
		this.layout = new dhtmlXLayoutObject('app', '3J', 'dhx_skyblue');
		
		var cellA = this.layout.cells('a');
		cellA.setWidth(250);

		// tabs
		var tabbar = cellA.attachTabbar();
		tabbar.addTab('tabElement', 'Elements');
		tabbar.addTab('tabDataSource', 'Data Source');

		var tabElement = tabbar.cells('tabElement');
		var tabDataSource = tabbar.cells('tabDataSource');

		tabElement.setActive();

		// element tree
		var elementTree = tabElement.attachTree();
		elementTree.setImagePath(this.imagePath + 'dhxtree_skyblue/');
		elementTree.loadJSONObject(this.elements, function(){
			elementTree.openItem('report');
		});

		var cellB = this.layout.cells('b');
		cellB.hideHeader();

		var toolBarWorkspace = cellB.attachToolbar();
		toolBarWorkspace.setIconsPath(this.imagePath + 'dhxtoolbar_skyblue/');
		toolBarWorkspace.addButton('label',1,'','edit-style.png',null);
		toolBarWorkspace.addButton('field',2,'','ui-text-field-format.png',null);
		toolBarWorkspace.addSeparator('sep1',3);
		toolBarWorkspace.addButton('image',4,'','picture.png',null);
		toolBarWorkspace.addButton('chart',5,'','chart.png',null);
		toolBarWorkspace.addSeparator('sep2',6);
		toolBarWorkspace.addButton('rectangle',7,'','layer-shape.png',null);
		toolBarWorkspace.addSeparator('sep3',8);
		toolBarWorkspace.addButton('barcode',9,'','barcode.png',null);
		toolBarWorkspace.addButton('qrcode',10,'','barcode-2d.png',null);

		toolBarWorkspace.setItemToolTip('label','Label');
		toolBarWorkspace.setItemToolTip('field','Field');
		toolBarWorkspace.setItemToolTip('image','Image');
		toolBarWorkspace.setItemToolTip('chart','Chart');
		toolBarWorkspace.setItemToolTip('rectangle','Rectangle');
		toolBarWorkspace.setItemToolTip('barcode','Barcode');
		toolBarWorkspace.setItemToolTip('qrcode','QR Code');

		var cellC = this.layout.cells('c');
		cellC.setText('Properties');

		// status bar
		this.statusBar = this.layout.attachStatusBar();
		this.statusBar.setText('Ready');
	};

	App.prototype.MenuInit = function()
	{
		this.menu = this.layout.attachMenu();
		this.menu.loadStruct('json/app.menu.json');
		this.menu.setIconsPath(this.imagePath + 'dhxmenu_skyblue/');
	};

	App.prototype.ToolbarInit = function()
	{
		this.toolbar = this.layout.attachToolbar();
		this.toolbar.loadStruct('json/app.toolbar.json');
		this.toolbar.setIconsPath(this.imagePath + 'dhxtoolbar_skyblue/');
		
		/*this.toolbar.setIconsPath(this.imagePath + 'dhxtoolbar_skyblue/');
		this.toolbar.addButton('a',0,'New','blue-document.png',null);
		this.toolbar.addButton('b',1,'Parameter','paper-plane.png',null);
		this.toolbar.addButton('c',2,'Publish','fruit-lime.png',null);
		this.toolbar.addSeparator('sep1',3);
		this.toolbar.addButton('d',4,'Refresh','arrow-circle-315.png',null);
		this.toolbar.addSeparator('sep2',5);
		this.toolbar.addButton('e',6,'','magnifier-zoom-in.png',null);
		this.toolbar.addButton('f',7,'','magnifier-zoom-out.png',null);
		this.toolbar.addSeparator('sep3',8);
		this.toolbar.addButton('g',9,'Preview','magnifier-left.png',null);

		this.toolbar.attachEvent('onClick', function(id){
			// refresh button
			if (id === 'd') app.layout.cells('c').setWidth(250);
		});*/
	};

	App.prototype.WorkspaceInit = function()
	{
		// init new report
		this.report = new Report();

		var html = '<div id="workspace">';
		html += '<div class="sheet" style="width:'+ this.ConvertMmToPixel(this.report.sheetWidthMm) +'px;">';
		html += '<div class="dragArea" style="margin:'+ this.ConvertMmToPixel(this.report.marginInMm.top) +'px '+ this.ConvertMmToPixel(this.report.marginInMm.right) +'px '+ this.ConvertMmToPixel(this.report.marginInMm.bottom) +'px '+ this.ConvertMmToPixel(this.report.marginInMm.left) +'px; border:1px solid #8D8D8D;">';

		this.band.main = new Band({
			level : 0,
			name : 'Report'
		});
		html += this.band.main.GenerateHTML();

		html += '</div>'; // tutup dragArea
		html += '</div>'; // tutup sheet
		html += '</div>'; // tutup workspace

		this.layout.cells('b').attachHTMLString(html);

		// apply drag pada resizeHandler
		var bandAbove;
		var blocker;

		$('#workspace .resizeHandler:not(.top)').draggable({
			axis : 'y',
			containment : '.dragArea',
			zIndex : 10,
			start : function(){
				bandAbove = $(this).prev();
				blocker = $('<div style="position:absolute; z-index:9; top:0; left:0; right:0; bottom:0; background-color:#fff; opacity:.7"></div>');
				$('#workspace .dragArea').append(blocker);
			},
			stop : function(event, ui){
				bandAbove.height( bandAbove.height() + ui.position.top );
				$(this).css('top','0');
				blocker.remove();
			}
		});
	};

	App.prototype.PropertiesGridInit = function()
	{
		this.propertiesGrid = this.layout.cells('c').attachGrid();
		this.propertiesGrid.setHeader("Description, Value");
		this.propertiesGrid.setColTypes('ro,ed');
		this.propertiesGrid.init();
		this.propertiesGrid.load('json/properties.band.json', null, 'json');
	};

	App.prototype.ConvertMmToPixel = function(mm)
	{
		mm = Number(mm);
		return mm * this.report.pixelPerMm;
	};

	// app constructor
	// "di sini lahirnya sebuah cinta"
	this.LayoutInit();
	this.MenuInit();
	this.ToolbarInit();
	this.WorkspaceInit();
	this.PropertiesGridInit();
}