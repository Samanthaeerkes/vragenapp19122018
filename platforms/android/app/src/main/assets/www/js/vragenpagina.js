// empty text variable that will later be filled with questions or no alarms text
var txt = "";

/** 
 * When the document is ready fill the page with questions or with a "Er zijn op dit moment geen vragen" message
 */
$(document).ready(function () {
    function getVragen() {
        // url with questions
        var url = "http://leondekraker.nl/vragenapp/vragenpagina/";
        // get JSON from url
        $.getJSON(url, function (data) {
            // for every question execute code below that checks if you meet the requirements to receive a question and if you do create questions
            for (var i = 0; i < data.length; i++) {
                // new date object
                var d = new Date();
                // variable with dateTime in format: yyyy-mm-dd hh:mm
                var dateTime = (
                    d.getFullYear() + "-" +
                    ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                    ("00" + d.getDate()).slice(-2) + " " +
                    ("00" + d.getHours()).slice(-2) + ":" +
                    ("00" + d.getMinutes()).slice(-2)
                );
                // variable with sliced datetime in yyyy/mm/dd hh:mm
                var slicedDatetime = data[i].verstuurTijd.slice(0, 16);
                // if the sliced datetime is current datetime or older than current datetime execute if statement that checks if user meets requirements. If met, create open question
                if (slicedDatetime == dateTime || slicedDatetime < dateTime) {
                    // if question type = 1 (open question) and localstorage doesn't include current question and question education equals chosen user education create questions
                    if (data[i].vraagSoort == 1 && !JSON.parse(localStorage.getItem("beantwoordeVragen")).includes(data[i].vraagId) && localStorage.getItem("gekozenOpleiding") === data[i].opleiding) {
                        // div with open question data
                        txt += "<div class='row'><div id='openvraagDiv' class='form-group'><label class='vragenpaginaTekst col-md-12' id='openVraag' name='" + data[i].vraagId + "'>" + data[i].vraag + "</label>"
                            + "<input required type='text' class='form-control vragenpaginaTekst vraagInput col-md-12' />"
                            + "<input type='image' class='float-right' src='img/BUTTON-Verzenden.png' name='opslaanKnop' id='submitOpenvraag' />"
                            + "</div> </div>";
                    }
                    // if question type = 0 (rating question) and localstorage doesn't include current question and question education equals chosen user education. If met, create rating question
                    if (data[i].vraagSoort == 0 && !JSON.parse(localStorage.getItem("beantwoordeVragen")).includes(data[i].vraagId) && localStorage.getItem("gekozenOpleiding") === data[i].opleiding) {
                        // create div with star questions. &#9733 = star icon
                        txt += " <div id='geslotenvraagDiv'>"
                            + " <div class='row' id='vraagTekst'>"
                            + " <label class='vragenpaginaTekst col-md-12' name='" + data[i].vraagId + "' id='sterVraag'>" + data[i].vraag + " </label>"
                            + " </div>"
                            + " <div class='row sterren'>"
                            + " <div class='sterren'>'"
                            + " <input class='star star-5 form-control' id= 'star-5-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;&#9733;&#9733;&#9733;&#9733;'/> "
                            + " <label class='star star-5' for='star-5-vraag" + i + "' ></label>"
                            + " <input class='star star-4 form-control' id= 'star-4-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;&#9733;&#9733;&#9733;'/> "
                            + " <label class='star star-4' for='star-4-vraag" + i + "' ></label>"
                            + " <input class='star star-3 form-control' id= 'star-3-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;&#9733;&#9733;'/> "
                            + " <label class='star star-3' for='star-3-vraag" + i + "' ></label>"
                            + " <input class='star star-2 form-control' id= 'star-2-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;&#9733;'/> "
                            + " <label class='star star-2' for='star-2-vraag" + i + "' ></label>"
                            + " <input class='star star-1 form-control' id= 'star-1-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;'/> "
                            + " <label class='star star-1' for='star-1-vraag" + i + "' ></label>"
                            + " </div>"
                            + " </div>"
                            + " <div id='submitButtonDiv'>"
                            + " <input type='image' src='img/BUTTON-Verzenden.png' name='opslaanKnop' id='submitGeslotenvraag'/>"
                            + " </div>"
                            + " </div>"
                    }
                    // fill vragen div with questions
                    document.getElementById("vragen").innerHTML = txt;
                }
            }
            // If variable txt is empty, add text to #vragen div
            if (txt === "") {
                txt = "<p id='geenVragenTekst' style='text-align:center; color:white;' class='vragenpaginaTekst'>Er zijn op dit moment geen vragen</p>";
                document.getElementById("vragen").innerHTML = txt;
            }
        })
    }
    // Execute getVragen function
    getVragen();
    // Execute getVragen every 60 seconds
    setInterval(getVragen, 60000);
})

/**
 * Onclick send open question button send answer
 */
$(document).on('click', "#submitOpenvraag", function () {
    // variable answer with answer from user
    var inputtedUserAnswer = $(this).parent().find('.vraagInput').val();
    // variable with user id from user's device
    var userId = device.uuid;
    // variable with id from answered question
    var vraagId = $(this).closest('div').find('#openVraag').attr('name');
    // variable datastring with data to send to server
    var dataString = "userAnswer=" + inputtedUserAnswer + "&userId=" + userId + "&vraagId=" + vraagId + "&voegAntwoordToe=";
    // ajax function
    $.ajax({
        // url to send data to
        url: "http://leondekraker.nl/vragenapp/afhandelpagina/",
        // type post because it sends data
        type: 'POST',
        // allow to send data to a other domain
        crossDomain: true,
        // data om te verzenden
        data: dataString,
        // on succes of the ajax function fill localStorage with data
        success: function () {
            alert("Uw antwoord is verzonden!");
            // Empty array variable for open questions
            var beantwoordeVragen = [];
            // Parse the serialized data back into an aray of objects
            beantwoordeVragen = JSON.parse(localStorage.getItem('beantwoordeVragen'));
            // Push the new data (whether it be an object or anything else) onto the array
            beantwoordeVragen.push(vraagId);
            // Re-serialize the array back into a string and store it in localStorage
            localStorage.setItem('beantwoordeVragen', JSON.stringify(beantwoordeVragen));
            location.reload();
        }
    });
});

/**
 * Onclick send rating question button send answer
 */
$(document).on('click', "#submitGeslotenvraag", function () {
    // variable with user id from user's device
    var userId = device.uuid
    // variable with id from answered question
    var vraagId = $(this).parent().parent('div').find('#sterVraag').attr('name');
    // variable inputtedUserAnswer with chosen star value from user
    var inputtedUserAnswer = $(this).parent().parent('div').find('.star:checked').attr('value');
    // variable datastring with data to send to server
    var dataString = "userAnswer=" + inputtedUserAnswer + "&userId=" + userId + "&vraagId=" + vraagId + "&voegAntwoordToe=";
    $.ajax({
        // url to send data to
        url: "http://leondekraker.nl/vragenapp/afhandelpagina/",
        // type post because it sends data
        type: 'POST',
        // allow to send data to a other domain
        crossDomain: true,
        // data to send
        data: dataString,
        // on succes of the ajax function do this
        success: function () {
            alert("Uw antwoord is verzonden!");
            // empty array variable for answered questions
            var beantwoordeVragen = [];
            // Parse the serialized data back into an aray of objects
            beantwoordeVragen = JSON.parse(localStorage.getItem('beantwoordeVragen'));
            // Push the new data (whether it be an object or anything else) onto the array
            beantwoordeVragen.push(vraagId);
            // Re-serialize the array back into a string and store it in localStorage
            localStorage.setItem('beantwoordeVragen', JSON.stringify(beantwoordeVragen));
            location.reload();
        }
    });
});