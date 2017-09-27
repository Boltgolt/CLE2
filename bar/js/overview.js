function updateList(list) {
    var totalUsers = 0

    document.getElementById("overviewList").innerHTML = ""

    for (var id in list) {
        var totalMl = 0
        var userList = []

        for (var drinkId in list[id].drinks) {
            totalMl += list[id].drinks[drinkId].amount

            if (userList.indexOf(list[id].drinks[drinkId].usercode) == -1) {
                userList.push(list[id].drinks[drinkId].usercode) 
            }
        }

        var html = '<span>Groep: ' + list[id].groupcode + '</span><span>€'
        html += (Math.round(totalMl * .008 * 100) / 100).toString().replace(".", ",") + ' (' + userList.length + ' gla'
        html += (userList.length == 1 ? "s" : "zen") + ')</span>'

        var div = document.createElement("div");
        div.innerHTML = html
        document.getElementById("overviewList").appendChild(div); 

        totalUsers += userList.length
    }

    document.getElementById("overviewBills").innerHTML = list.length
    document.getElementById("overviewGlasses").innerHTML = 30 - totalUsers    
}

setInterval(function() {
    var dayList = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"]
    var monthList = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
    var d = new Date()

    document.getElementById("overviewTime").innerHTML = d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/,  "$1");
    document.getElementById("overviewDate").innerHTML = dayList[d.getDay()] + ", " + d.getDate() + " " + monthList[d.getMonth()] + " " + d.getFullYear();
}, 1000);
