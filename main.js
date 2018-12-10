$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: 'ihme.csv',
		dataType: 'text',
		success: function(data){processData(data);}
	});
});

function processData(data){
	var lines = data.split(/\r\n|\n/);
	console.log(lines);
}