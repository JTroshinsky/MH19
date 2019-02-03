//----------------------------------VELOCITY-------------------------------
var altitude = function(p) {
	// Global variables
	var plot1;

	// Initial setup
	p.setup = function() {
		// Create the canvas
		var canvas = p.createCanvas(600, 400);

		// Create the first plot
		plot1 = new GPlot(p);
		plot1.setPos(0, 0);
		plot1.setMar(60, 70, 40, 70);
		plot1.setDim(460, 300);
		plot1.setAxesOffset(4);
		plot1.setTicksLength(4);

		// Prepare the points
		var points = [];

		var count=0;
		for(x in data){
			if(x < data.length-1){
				var row = data[x];
				if(row[3]>500 && row[8]==0){
					points[count]= new GPoint(count,row[3]);
					count++;
				}

			}
		}

		// Set the points, the title and the axis labels
		plot1.setPoints(points);
		plot1.setTitleText("Altitude");
		plot1.getYAxis().setAxisLabelText("Alt. (ft)");
		plot1.getXAxis().setAxisLabelText("Time (minutes)");

		plot1.activatePanning();
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(150);

		// Draw the plot
		plot1.beginDraw();
		plot1.drawBackground();
		plot1.drawBox();
		plot1.drawXAxis();
		plot1.drawYAxis();
		plot1.drawTitle();
		plot1.drawPoints();
		plot1.drawLines();
		plot1.endDraw();

	};

};


//----------------------------------VELOCITY-------------------------------
var velocity = function(p) {
	// Global variables
	var plot1;

	// Initial setup
	p.setup = function() {
		// Create the canvas
		var canvas = p.createCanvas(600, 400);

		// Prepare the points
		var points = [];

	 	var count = 0;
		for(x in data){
			if(x < data.length-1){
				var row = data[x];
				if(row[3]>500 && row[8]==0){
					points[count]= new GPoint(count,row[6]);
					count++
				}
			}
		}

		// Create the first plot
		plot1 = new GPlot(p);
		plot1.setPos(0, 0);
		plot1.setMar(60, 70, 40, 70);
		plot1.setDim(460, 300);
		plot1.setAxesOffset(4);
		plot1.setTicksLength(4);

		// Set the points, the title and the axis labels
		plot1.setPoints(points);
		plot1.setTitleText("Velocity");
		plot1.getYAxis().setAxisLabelText("Vel. (ft/s)");
		plot1.getXAxis().setAxisLabelText("Time (minutes)");

		plot1.activatePanning();
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(150);

		// Draw the plot
		plot1.beginDraw();
		plot1.drawBackground();
		plot1.drawBox();
		plot1.drawXAxis();
		plot1.drawYAxis();
		plot1.drawTitle();
		plot1.drawPoints();
		plot1.drawLines();
		plot1.endDraw();

	};
};
