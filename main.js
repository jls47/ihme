//Upon loading the document, one must load the csv first.  CSS Spinner or something to be added later.
$(document).ready(function(){
	var processed = [];
	$.ajax({
		type: "GET",
		url: 'https://raw.githubusercontent.com/jls47/ihme/master/ihme.csv',
		dataType: 'text',
		success: function(data){
			//upon loading the csv, parse it into a big old array!
			processed = processData(data);
			//This will become a click event.  It handles the drawing and everything, and eventually will accept as parameters
			//input from a couple forms.  There are two primary means of comparison, and each will likely wind up looking
			//different in the code: starting with gender or country needs different sublevels, but I will try my best
			//to make the sorting code more universal than not.
			drawCountryLevels(processed);
		}
	});
});
//Sunburst with modifiers
//12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender
//on page load, load and parse the csv.  On changing the parameters and pressing submit, use the function to redraw.  Animate?
//split by gender in a second level?  How to parse?  OH!  The drawing by gender is already there!  How to dynamically set conditions?
//DIFFERENT METHODS OF SORTING:
//Gender, country, or year top level?
//Start with country/year -> gender to get a handle on things
//gender/year -> top 5 countries each side?
//year -> avg rates worldwide?


//hold up.  Instead of just top 10, should I also include the rest of the world?  Stretch goal?
const processData = (data) => {
	var lines = data.split(/\r\n|\n/);
	lines.shift();
	lines.pop();
	var x = 0
	entries = [];
	lines.forEach(function (line){
		newline = line.split(',');
		entries.push(newline);
	})
	return entries;
}

const drawMainBurst = (top10, graph) =>{
	let totalRates = 0;
	let angles = [];
	for(item in top10){
		totalRates += parseFloat(top10[item][13]);
	}
	console.log(totalRates);
	start = 0;
	//dynamically change rgb values based on place in the top 10?  Would it make for a more uniform approach?
	let colors = ["rgb(102, 0, 0)", "rgb(128, 0, 0)", "rgb(204, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 102, 0)", "rgb(255, 133, 51)", "rgb(255, 204, 0)", "rgb(255, 219, 77)", "rgb(255, 255, 0)", "rgb(255, 255, 102)"];

	for(item in top10){
		let country = top10[item][3];
		angles.push({});
		let end = start + ((2 * Math.PI) * (top10[item][13] / totalRates));
		let arc = d3.arc()
			.innerRadius(70)
			.outerRadius(150)
			.startAngle(start)
			.endAngle(end);

		graph.append("path")
			.attr("class", "arc")
			.attr("stroke", "black")
			.attr("fill", colors[item])
			.attr("d", arc);
		angles[item] = {'start': start, 'end': end};
		start += (2 * Math.PI) * (top10[item][13] / totalRates);
	}
	return angles;
}


const drawSecondBurst = (top10g, angles, graph) =>{
	for(key in top10g){
		let mRate = top10g[key]["Male"];
		let fRate = top10g[key]["Female"];
		let total = mRate + fRate;
		let mStart = angles[key]['start'];
		let mEnd = mStart + ((mRate / total) * (angles[key]['end'] - angles[key]['start']));
		let fStart = mEnd;
		let fEnd = angles[key]['end'];
		console.log([mStart, mEnd, fStart, fEnd]);
		let arcM = d3.arc()
			.innerRadius(150)
			.outerRadius(190)
			.startAngle(mStart)
			.endAngle(mEnd);

		graph.append("path")
			.attr("class", "arc")
			.attr("stroke", "black")
			.attr("fill", "red")
			.attr("d", arcM);

		let arcF = d3.arc()
			.innerRadius(150)
			.outerRadius(190)
			.startAngle(fStart)
			.endAngle(fEnd);

		graph.append("path")
			.attr("class", "arc")
			.attr("stroke", "black")
			.attr("fill", "blue")
			.attr("d", arcF);
	}
}

//Starting with a main level of top 10 countries, with sublevels broken down based on gender
//Starts off by sorting by year.
const drawCountryLevels = (entries) => {
	let mainSort = [];
	let gSort = [];
	for(entry in entries){
		let item = entries[entry]
		if(parseInt(item[12]) == 2017 && item[5] == "Both"){
			mainSort.push(item);
		}else if(parseInt(item[12]) == 2017){
			gSort.push(item);
		}
	}

	let graph = d3.select(".graph")
		.append("svg")
		.attr("width", "600")
		.attr("height", "600")
		.append("g")
		.attr("transform", "translate(300,300)");

	let mainDrawing = bubblesort(mainSort);
	let gDrawing = genderSort(gSort, mainDrawing);
	let countryAngles = drawMainBurst(mainDrawing, graph);
	drawSecondBurst(gDrawing, countryAngles, graph);
	//Time for a bunch of D3!  Do the sunburst but with the top 10 and whatnot.  
}

//accepts arrays of unsorted male/female and bubble-sorted totals
//This function will roll through the bSort, adding male and female data
//points to a new array of objects to be paired with each country.

//Remember: 12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender

const genderSort = (gSort, bSort) => {
	let gArr = [];
	for(item in bSort){
		gArr.push({});
		let country = bSort[item][3];
		for(entry in gSort){
			if(gSort[entry][3] == country){
				gArr[item][gSort[entry][5]] = parseFloat(gSort[entry][13]);
			}
		}
	}
	return gArr;
}

const bubblesort = (toBeSorted) => {
	sorting = true;
	while(sorting == true){
		let swaps = 0;
		for(let i = 0; i < toBeSorted.length -1; i++){
			if(parseFloat(toBeSorted[i][13]) > parseFloat(toBeSorted[i+1][13])){
				let h = toBeSorted[i+1];
				toBeSorted[i+1] = toBeSorted[i];
				toBeSorted[i] = h;
				swaps += 1;
			}
		}
		if(swaps == 0){
			sorting = false;
		}
	}
	return [toBeSorted[toBeSorted.length - 1], toBeSorted[toBeSorted.length - 2], toBeSorted[toBeSorted.length - 3], toBeSorted[toBeSorted.length - 4], toBeSorted[toBeSorted.length - 5], toBeSorted[toBeSorted.length - 6], toBeSorted[toBeSorted.length - 7], toBeSorted[toBeSorted.length - 8], toBeSorted[toBeSorted.length - 9], toBeSorted[toBeSorted.length - 10]];
}

