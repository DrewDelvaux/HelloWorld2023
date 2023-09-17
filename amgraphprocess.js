//var totalDays = stockPriceArray.length();
/*I want to put all the stock prices into the array above and just call it 
at the bottom of this file to make the formated array
*/

//useless for loop I set up for testing
function drawGraph(inputData) {
    
    let stockPriceArray = inputData;
    console.log(typeof stockPriceArray[2]);
    //console.log(stockPriceArray);

    let totalDays = stockPriceArray.length;
    let counter = 1; 
    let calendarDays = [];
    let month = 1;
    let year = 2015;
    let subtractDays = 0;
    let realDays = 0;
    let realMonth = 0;
    let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let skipOverflow = false;
    let monthString = "";

    function numPad(num, size) {
        num = num.toString();
        while (num.length < size) {
            num =  "0" + num;
        }
        return num;
    } 

    for (var i = 1; i < totalDays; i++) {
        realDays = i - subtractDays;
        //console.log("Month: ", realMonth, " Day: ", realDays);
        //console.log(year + '/' + numPad(realMonth + 1, 2) + '/' + numPad((i - subtractDays), 2))
        if (realMonth > 11){
            //console.log("Next Year!!")
            realMonth = 1;
            year += 1;
        }
        monthString = String(year + '-' + numPad(realMonth + 1, 2) + '-' + numPad((i - subtractDays), 2));
        calendarDays.push(monthString);

        if (realDays >= months[realMonth] && !skipOverflow)
        {
            //console.log("Next Month2")
            subtractDays += months[realMonth];
            realMonth++;
            skipOverflow = false;
        }
    }

    //array that gets fed to the graph itself in the html file
    //console.log(calendarDays);
    //console.log(stockPriceArray);
    let dataPoints = [];
    for (var x = 0; x <= calendarDays.length; x++ ) {
        dataPoints.push({"date": calendarDays[x], "value": stockPriceArray[x]},);
    }
    //console.log(dataPoints);
    am5graph(dataPoints);
}
