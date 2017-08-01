//Variables

//trash holds the initial buttons for the web page.
var trash = ["trash","mullets","leopard print","twinky",
"trailer park","john waters", "pink flamingos"];

//the thing that gets plugged into url
var query;


//Functions

//populate takes an array and creates 
//buttons with values storing the strings in the array.
function populate(arr)
{
	$(".buttonDiv").empty();
	for (var i = 0; i < arr.length; i++) 
	{
		var newButton = $("<button>");
		var space = $("<br/>");
		newButton.text(arr[i]);
		newButton.attr(
		{
			"name-data": arr[i],
			"class": "btn btn-primary btn-default center-block gifBtn",
		});
		$(".buttonDiv").append(newButton);
		$(".buttonDiv").append(space);
	}
}

//makes call to ajax to retrieve gif data. 
function retrieveData(search,button)
{
	var queryUrl = "http://api.giphy.com/v1/gifs/search?q=" +
        search + "&api_key=0387a3f4742c418897ee71e22d5f6a8c&limit=10&rating=pg-13";

    //ajax call
    $.ajax(
    {
    	url: queryUrl,
    	method: "GET"
    }).done(function(res)
    {
    	var results = res.data;
    	console.log(results);
    	if(results.length === 0)
    	{
    		return;
    	}

		if(trash.indexOf(search) === -1)
		{
			trash.push(search);
			populate(trash);
			return results;
		}
    	makeGifs(results);
    });
}

//looks at button that was pressed and makes gifs appear.
function makeGifs(res)
{
    for (var i = 0; i < res.length; i++) 
    {
    	var imageDiv = $("<div class='item'>");
    	var newImage = $("<img>");
    	var p = $("<p>");
    	p.text("Rating: "+res[i].rating);
    	newImage.attr(
    	{
    		"class": "gif",
    		"src": res[i].images.fixed_height_still.url,
    		"imageStill": res[i].images.fixed_height_still.url,
    		"imageAnime": res[i].images.fixed_height.url,
    		"state": "still"
    	});
    	imageDiv.append(p,newImage);
    	$(".gifDiv").append(imageDiv);
    }
}

//changes image from still to animated by changing source attribute
function animate(button)
{
	if(button.attr("state") === "still")
	{
		button.attr("src", button.attr("imageAnime"));
        button.attr("state", "animate");
	}

	else
	{
		button.attr("src", button.attr("imageStill"));
        button.attr("state", "still");
	}
}

//adds new searches to button bar, if gif's exist for them.
function addTrash()
{
	var newTrash = $("#searchBar").val().trim();

	retrieveData(newTrash);
}

//Code for web page
$(document).ready(function() 
{	
	//adds initial buttons
	populate(trash);

	//whenever a gifBtn is pressed the gifDiv is empties
	//it stores a query as the name data stored in the gifBtn
	//and passes that data to makeGifs.
	$(document).on("click", ".gifBtn", function()
	{
		var thisBtn = $(this);
		$(".gifDiv").empty();
		query = $(this).attr("name-data");
		retrieveData(query,thisBtn);
	})

	//calls for animate function
	$(document).on("click", ".gif", function()
	{
		animate($(this));
	});

	//when submit button is clicked 
	//adds new buttons
	$("#submitBtn").click(function(event)
	{
		event.preventDefault();
		addTrash();
		$(".gifDiv").empty();
	});

});