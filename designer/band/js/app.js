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
			{id:1,text:"first"},
			{id:2, text:"middle",child:"1",im0:"book.gif",
			item:[
				{id:"21", text:"child"}
			]},
			{id:3,text:"last"}
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
		elementTree.loadJSONObject(this.elements);

		var cellB = this.layout.cells('b');
		cellB.hideHeader();

		var toolBarWorkspace = cellB.attachToolbar();
		toolBarWorkspace.setIconsPath(this.imagePath + 'dhxtoolbar_skyblue/');
		toolBarWorkspace.addButton('a',1,'','edit-style.png',null);
		toolBarWorkspace.addButton('b',2,'','ui-text-field-format.png',null);
		toolBarWorkspace.addSeparator('sep1',3);
		toolBarWorkspace.addButton('c',4,'Image','',null);
		toolBarWorkspace.addButton('d',5,'Chart','',null);
		toolBarWorkspace.addSeparator('sep2',6);
		toolBarWorkspace.addButton('e',7,'Rectangle','',null);
		toolBarWorkspace.addSeparator('sep3',8);
		toolBarWorkspace.addButton('f',9,'Barcode','',null);
		toolBarWorkspace.addButton('g',10,'QRCode','',null);

		toolBarWorkspace.setItemToolTip('a','Label');
		toolBarWorkspace.setItemToolTip('b','Field');

		var cellC = this.layout.cells('c');
		cellC.setText('Properties');

		// status bar
		this.statusBar = this.layout.attachStatusBar();
		this.statusBar.setText('Ready');
	};

	App.prototype.MenuInit = function()
	{
		this.menu = this.layout.attachMenu();
		this.menu.addNewChild(null, 0, "file", "File");
		this.menu.addNewChild(null, 1, "edit", "Edit");
		this.menu.addNewChild(null, 2, "view", "View");
		this.menu.addNewChild(null, 3, "help", "Help");
	};

	App.prototype.ToolbarInit = function()
	{
		this.toolbar = this.layout.attachToolbar();
		this.toolbar.setIconsPath(this.imagePath + 'dhxtoolbar_skyblue/');
		this.toolbar.addButton('a',0,'New Report',null,null);
		this.toolbar.addButton('b',1,'Parameter',null,null);
		this.toolbar.addButton('c',2,'Publish',null,null);
		this.toolbar.addSeparator('sep1',3);
		this.toolbar.addButton('d',4,'Refresh','arrow-circle-315.png',null);
		this.toolbar.addSeparator('sep2',5);
		this.toolbar.addButton('e',6,'','magnifier-zoom-in.png',null);
		this.toolbar.addButton('f',7,'','magnifier-zoom-out.png',null);
		this.toolbar.addSeparator('sep3',8);
		this.toolbar.addButton('g',9,'Preview','',null);

		this.toolbar.attachEvent('onClick', function(id){
			// refresh button
			if (id === 'd') app.layout.cells('c').setWidth(250);
		});
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
}