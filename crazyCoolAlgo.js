//var totalDays = stockPriceArray.length();
/*I want to put all the stock prices into the array above and just call it 
at the bottom of this file to make the formated array
*/

//useless for loop I set up for testing
stockPriceArray = [];
for (var k = 0; k < 365; k++){
    stockPriceArray.push(22 + k ** 2);
}

var totalDays = 365;
var counter = 1; 
var calendarDays = [];
var month = 1;
var year = 2012;
var subtractDays = 0;
var realDays = 0;
var realMonth = 0;
var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var skipOverflow = false;

function numPad(num, size) {
    num = num.toString();
    while (num.length < size) {
        num =  "0" + num;
    }
    return num;
}

for (var i = 1; i < totalDays; i++){
    realDays = i - subtractDays;
    //console.log(realDays);
    if (month >= 13){
        month = 1;
        year += 1;
    }
    calendarDays.push(year + '/' + numPad(realMonth + 1, 2) + '/' + numPad((i - subtractDays), 2));

    if(counter == 5){
        //console.log("Month Days: ", months[realMonth]);
        if (months[realMonth] - realDays < 2)
        {
            //console.log("Overflow")
            subtractNum = 2 - (months[realMonth] - realDays);
            //console.log(subtractNum)
            subtractDays+=months[realMonth] + subtractNum;
            realMonth++;
            skipOverflow = true;
        }
        i += 2;
        counter = 0;
    }

    counter ++;

    if (i == 364){
        //console.log(calendarDays);
        continue;
    }

    if (realDays == months[realMonth] && !skipOverflow)
    {
        subtractDays += months[realMonth];
        realMonth++;
        skipOverflow = false;
    }
}

//array that gets fed to the graph itself in the html file
const dataPoints = [];
for (var x = 0; x <= calendarDays.length - 1; x++ ) {
  dataPoints.push({"date": calendarDays[x], "value": stockPriceArray[x]},);
}
console.log(dataPoints);
