

var processed = [];
$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: 'https://raw.githubusercontent.com/jls47/ihme/master/ihme.csv',
		dataType: 'text',
		success: function(data){
			processed = processData(data);
			drawData(processed);
		}
	});
});
//Sunburst with modifiers
//12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender, 
//on page load, load and parse the csv.  On changing the parameters and pressing submit, use the 
function processData(data){
	var lines = data.split(/\r\n|\n/);
	lines.shift();
	lines.pop();
	var x = 0
	entries = [];
	lines.forEach(function (line){
		newline = line.split(',');
		entries.push(newline);
	})
	console.log(entries);
	return entries;

	
}

const bubblesort = function(toBeSorted){
	sorting = true;
	while(sorting == true){
		let swaps = 0;
		for(let i = 0; i < toBeSorted.length - 1; i++){
			if(toBeSorted[i][13] > toBeSorted[i+1][13]){
				let h = toBeSorted[i+1];
				toBeSorted[i+1] = toBeSorted[i];
				toBeSorted[i] = h;
				swaps += 1;
			}
		}
		console.log(swaps);
		if(swaps == 0){
			sorting = false;
		}
	}
	console.log(toBeSorted);
	return [toBeSorted[toBeSorted.length - 1], toBeSorted[toBeSorted.length - 2], toBeSorted[toBeSorted.length - 3], toBeSorted[toBeSorted.length - 4], toBeSorted[toBeSorted.length - 5], toBeSorted[toBeSorted.length - 6], toBeSorted[toBeSorted.length - 7], toBeSorted[toBeSorted.length - 8], toBeSorted[toBeSorted.length - 9], toBeSorted[toBeSorted.length - 10]];
}

const drawBurst = function(top10){
	let totalRates = 0;
	for(item in top10){
		console.log(top10[item][13]);
		totalRates += parseFloat(top10[item][13]);
	}
	console.log(totalRates);
	start = 0;
	
	let graph = d3.select(".graph")
		.append("svg")
		.attr("width", "600")
		.attr("height", "600")
		.append("g")
		.attr("transform", "translate(300,300)");

	let colors = ["rgb(102, 0, 0)", "rgb(128, 0, 0)", "rgb(204, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 102, 0)", "rgb(255, 133, 51)", "rgb(255, 204, 0)", "rgb(255, 219, 77)", "rgb(255, 255, 0)", "rgb(255, 255, 102)"];

	for(item in top10){
		let arc = d3.arc()
			.innerRadius(70)
			.outerRadius(150)
			.startAngle(start)
			.endAngle(start + ((2 * Math.PI) * (top10[item][13] / totalRates)));

		graph.append("path")
			.attr("class", "arc")
			.attr("stroke", "black")
			.attr("fill", colors[item])
			.attr("d", arc);

		start += (2 * Math.PI) * (top10[item][13] / totalRates);
	}
}

const drawData = function(entries){
	let toSort = [];

	for(entry in entries){
		let item = entries[entry]
		console.log(entries[entry])
		if(parseInt(item[12]) == 2001 && item[5] == "Female"){
			toSort.push(item);
		}
	}
	console.log(toSort);
	let drawing = bubblesort(toSort);
	drawBurst(drawing);
	//Time for a bunch of D3!  Do the sunburst but with the top 10 and whatnot.  
}

