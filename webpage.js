var xhttp = new XMLHttpRequest();

function onload() 
{
    searchButton = document.getElementById("searchBarButton");
    clearButton = document.getElementById("clearIcon");
    searchField = document.getElementById("search")
}

function resetField()
{
    searchField = document.getElementById("search")
    searchField.value = "";
    clearButton.style.visibility = "hidden";
}

function compileData(input) {
    //console.log(input)
    //console.log(input.length)
    returnArray = [];
    buildString = "";
    for (var i = 0; i < input.length; i++) {
        if(input[i] == '[' || input[i] == ' ') {
            // Do Nothing
        }
        else if(input[i] == ',') {
            returnArray.push(parseFloat(buildString));
            buildString = "";
           // console.log(returnArray);
        }
        else if(input[i] == ']') {
            returnArray.push(parseFloat(buildString));
            buildString = "";
        }
        else {
            buildString += input[i];
        }
    }
    //console.log(returnArray)
    console.log("Finished Compiling Data")
    return returnArray
}

function initiateDataVisualisation(returned_data) {
    console.log("Visualising Data")
    document.getElementById("emptyBox").style.visibility = "hidden";
    document.getElementById("emptyMessage").style.visibility = "hidden";

    dataContent = document.getElementsByClassName("dataContent")
    for (i = 0; i < dataContent.length; i++) {
        dataContent[i].style.visibility = "visible";    
    }

    drawGraph(compileData(returned_data));
}

function searchSelection()
{
    returned_data = "";
    let searchField = document.getElementById("search").value;
    if (searchField != "")
    {
        resetField();
        fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({searchField})
        }).then(async e => {
            //console.log(await e.text());
            returned_data = String(await e.text());
            initiateDataVisualisation(returned_data);
        })
    }
}

function waitForUpdate()
{
    const file = document.getElementById('file-selector');
    console.log(file)
    fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
}

function repeat() 
{
    searchButton = document.getElementById("searchBarButton");
    clearButton = document.getElementById("clearIcon");
    searchField = document.getElementById("search")

    userInput = searchField.value;
    if (userInput != "")
    {
        clearButton.style.visibility = "visible";
    }
    else
    {
        clearButton.style.visibility = "hidden";
    }
}