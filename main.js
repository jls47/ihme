$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: 'https://raw.githubusercontent.com/jls47/ihme/master/ihme.csv',
		dataType: 'text',
		success: function(data){processData(data);}
	});
});
//Sunburst with modifiers
//12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender, 
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

	let toSort = [];

	for(entry in entries){
		let item = entries[entry]
		console.log(entries[entry])
		if(parseInt(item[12]) == 2002 && item[5] == "Female"){
			toSort.push(item);
		}
	}
	console.log(toSort);
	

	const bubblesort = function(tobesorted){
		sorting = true;
		while(sorting == true){
			let swaps = 0;
			for(let i = 0; i < tobesorted.length - 1; i++){
				if(tobesorted[i][13] > tobesorted[i+1][13]){
					let h = tobesorted[i+1];
					tobesorted[i+1] = tobesorted[i];
					tobesorted[i] = h;
					swaps += 1;
				}
			}
			console.log(swaps);
			if(swaps == 0){
				sorting = false;
			}
		}
		console.log(toSort);
		return [toSort[toSort.length - 1], toSort[toSort.length - 2], toSort[toSort.length - 3], toSort[toSort.length - 4], toSort[toSort.length - 5], toSort[toSort.length - 6], toSort[toSort.length - 7], toSort[toSort.length - 8], toSort[toSort.length - 9], toSort[toSort.length - 10]];
	}
	console.log(bubblesort(toSort));
}