function Connection(details)
{
	this.host = null;
	this.port = null;
	this.user = null;
	this.pass = null;

	this.name = null;
	this.type = null;
	this.driver = null;

	for (var key in details)
	{
		this[key] = details[key];
	}

	Connection.prototype.ConnInit = function()
	{
		app.connection[this.name] = {
			type : this.type
		};
	};

	//caller
	this.ConnInit();
}