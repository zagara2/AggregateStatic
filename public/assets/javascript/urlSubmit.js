const getTitle = (url) => {
    return fetch(`https://crossorigin.me/${url}`)
        .then((response) => response.text())
        .then((html) => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const title = doc.querySelectorAll('title')[0];
            return title.innerText;
        });
};

$('input').attr("style", "width:" + $('body').width() + ";" + "height:" + $('body').width() + "; border: none; color: transparent; background: transparent; z-layer: 2");

$('input').attr("onkeydown", "return false")



anon = (y) => y = $('input[id="targetField"]').val();
var Title = (r) => {
    // anon = (y) => y = $('input[id="targetField"]').val();
    r = anon();
    return getTitle(r).then(
        (title) => {
            var title = title
            var x = title.substr(0, 3);
            switch (x) {
                case "DNS":
                    alert("Could not grab article."); //modal pop should go here for manual entry
                    break;
                default:
                    $.post("/submitLink", { title: title, url: url, linkType: linkType, rating: rating, boardID: boardID }, function(data) {
                        if (data === 'done') {
                            window.location.href = "/eventPage/" + boardID;
                        } else if (data.level === "warning") {
                            // alert(JSON.stringify(data));
                            alert(data.msg);
                        }
                    }); //shoots ajax call to be sent to article section
            }
        })
}

// anon = (y) => y = $('input[id="targetField"]').val();
$('input[id="targetField"]').on("dragover", function(event) {
    event.stopPropagation();
});

$('input[id="targetField"]').on("dragleave", function(event) {
    event.preventDefault();
    event.stopPropagation();
});


$('input[id="targetField"]').on("drop", function(event) {
    event.stopPropagation();
    $('input[id="targetField"]').one("mousemove", function(event) {
        event.stopPropagation();
        var getLocation = function(href) {
            var l = document.createElement("a");
            l.href = href;
            return l;
        };
        url = anon();
        var l = getLocation(url);
        var w = l.hostname;
        url = $('input[id="targetField"]').val();
        var overallurl = window.location.href
        var overallurlArray = overallurl.split("/");
        var boardID = overallurlArray[overallurlArray.length - 1];
        var linkType = w;

        switch (w) {
            case "www.youtube.com":
                Title();
                break;
            case "vid.me":
                Title();
                $('input[id="targetField"]').val("") //shoots link to video iframe
                break;
            case "soundcloud.com":
                $.post("/submitLink", { title: title, url: url, linkType: linkType, rating: rating, boardID: boardID }, function(data) {
                    if (data === 'done') {
                        window.location.href = "/eventPage/" + boardID;
                    } else if (data.level === "warning") {
                        // alert(JSON.stringify(data));
                        alert(data.msg);
                    }
                });
                $('input[id="targetField"]').val("") //shoots link to podcast iframe
                break;
            case "twitter.com":
                $.post("/submitLink", { title: title, url: url, linkType: linkType, rating: rating, boardID: boardID }, function(data) {
                    if (data === 'done') {
                        window.location.href = "/eventPage/" + boardID;
                    } else if (data.level === "warning") {
                        // alert(JSON.stringify(data));
                        alert(data.msg);
                    }
                });
                $('input[id="targetField"]').val("") //shoots link to twitter component
                break;
            default:
                Title();
                $('input[id="targetField"]').val("")
        };
    })
});