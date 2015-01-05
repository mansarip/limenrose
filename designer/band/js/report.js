/**
 * Report Object
 * author  Luqman B. Shariffudin (luqman.shariffudin@nc.com.my)
 */
function Report()
{
	// report properties
	this.orientation = 'P';
	this.format = 'A4';
	this.sheetWidthMm = 210;
	this.sheetHeightMm = 297;
	this.marginInMm = {
		top : 10,
		left : 13,
		right : 13,
		bottom :10
	};
	this.pixelPerMm = 4;
}