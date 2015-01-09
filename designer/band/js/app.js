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
		tabbar.addTab('tabStructure', 'Structure');
		tabbar.addTab('tabDataSource', 'Data Source');

		var tabStructure = tabbar.cells('tabStructure');
		var tabDataSource = tabbar.cells('tabDataSource');
		
		tabStructure.setActive();

		// structure tree
		var structureTree = tabStructure.attachTree();
		structureTree.setImagePath(this.imagePath + 'dhxtree_skyblue/');
		structureTree.loadJSON('json/structure.default.json', function(){
			structureTree.openItem('report');
		});

		// data source tree
		var dataSourceTree = tabDataSource.attachTree();
		dataSourceTree.setImagePath(this.imagePath + 'dhxtree_skyblue/');
		dataSourceTree.loadJSON('json/datasource.default.json', function(){
			dataSourceTree.openItem('q1');
		});

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
	};

	App.prototype.WorkspaceInit = function()
	{
		// toolbar workspace
		var cellB = this.layout.cells('b');
		cellB.hideHeader();

		var toolBarWorkspace = cellB.attachToolbar();
		toolBarWorkspace.setIconsPath(this.imagePath + 'dhxtoolbar_skyblue/');
		toolBarWorkspace.loadStruct('json/workspace.toolbar.json');

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