function Band(arg)
{
	this.level = (arg.level === undefined ? alert('Invalid band level!') : arg.level);
	this.name = (arg.name === undefined ? 'Group-' + arg.level : arg.name);

	Band.prototype.Build = function()
	{
		if (this.level === 0) // root level
		{
			this.pageHeader = $('<div class="band pageHeader" data-level="'+ this.level +'"></div>');
			this.pageFooter = $('<div class="band pageFooter" data-level="'+ this.level +'"></div>');
			this.reportHeader = $('<div class="band reportHeader" data-level="'+ this.level +'"></div>');
			this.reportFooter = $('<div class="band reportFooter" data-level="'+ this.level +'"></div>');
		}

		this.header = $('<div class="band header" data-level="'+ this.level +'"></div>');
		this.footer = $('<div class="band footer" data-level="'+ this.level +'"></div>');
		this.body = $('<div class="band body" data-level="'+ this.level +'"></div>');
		this.noData = $('<div class="band noData" data-level="'+ this.level +'"></div>');
	};

	Band.prototype.GenerateHTML = function()
	{
		var html = '';

		if (this.level === 0)
		{
			html += '<div class="resizeHandler top">Page Header</div>';
			html += this.pageHeader.prop('outerHTML');
			html += '<div class="resizeHandler">Report Header</div>';
			html += this.reportHeader.prop('outerHTML');
			html += '<div class="resizeHandler"> Header</div>';
			html += this.header.prop('outerHTML');
			html += '<div class="resizeHandler">Body</div>';
			html += this.body.prop('outerHTML');
			html += '<div class="resizeHandler">No Data</div>';
			html += this.noData.prop('outerHTML');
			html += '<div class="resizeHandler">Footer</div>';
			html += this.footer.prop('outerHTML');
			html += '<div class="resizeHandler">Report Footer</div>';
			html += this.reportFooter.prop('outerHTML');
			html += '<div class="resizeHandler">Page Footer</div>';
			html += this.pageFooter.prop('outerHTML');
		}
		else
		{
			html += '<div class="resizeHandler">Header</div>';
			html += this.header.prop('outerHTML');
			html += '<div class="resizeHandler">Body</div>';
			html += this.body.prop('outerHTML');
			html += '<div class="resizeHandler">No Data</div>';
			html += this.noData.prop('outerHTML');
			html += '<div class="resizeHandler">Footer</div>';
			html += this.footer.prop('outerHTML');
		}

		return html;
	};

	// constructor
	this.Build();
}