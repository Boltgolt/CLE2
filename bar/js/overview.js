function updateList(list) {
    document.getElementById("overviewList").innerHTML = ""

    for (var key in list) {
        var btn = document.createElement("div");
        document.body.appendChild(btn); 
    }
}