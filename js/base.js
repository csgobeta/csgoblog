var lang = "en";
var xmlhttp = new XMLHttpRequest();
//var authors = [];
var isstandard = true;
var blogpostcalls = [];
var updatecalls = [];
var idcalls = [];
//adds page
var page = 1;
if (getparameter("p") != "" && getparameter("p") > 0) { page = getparameter("p"); }
var blogposttotalpages;
var updatetotalpages;
var searchtotalpages;
var hasPlayed = false;

$(document).ready(function() {
    $(".icon, .Dresources").mouseenter(function() {
        if (hasPlayed == true) {
            document.getElementById('Dhover').play();
        }
    });
    //this is the volume slider
    $(".slider").on('input', function() {
        $(this).parent().parent().children(".slidervalue").text(this.value);
    });
    $('.model-tgl').change(function() {
        if (this.checked) {
            $(".model-container").show();
            $(".agent-helper").hide();
            Cookies.set("mtoggle", "true");
        } else {
            $(".model-container").hide();
            //$(".agent-helper").show();
            Cookies.set("mtoggle", "false");
        }
    });
    $(".settings-wrapper").click(function(e) {
        if ($(e.target).hasClass("settings-wrapper") || $(e.target).hasClass("settingsclick")) {
            $(this).children(".settings-dropdown").toggleClass("showMenu");
            $(".settings-dropdown").not($(this).children(".settings-dropdown")).removeClass("showMenu");
        }
    });
});

$(document).on('click', function(e) {
    if (($(e.target).hasClass("settings-wrapper") == false && $(e.target).hasClass("settingsclick") == false)) {
        $(".settings-dropdown").removeClass("showMenu");
    }
    if ($(e.target).hasClass("checkbox") == false) {
        $('.checkbox').prop("checked", false);
    }
});


//tab fix/escapes tab so site doesnt break
$(document).keydown(function(e) {
    var keycode1 = (e.keyCode ? e.keyCode : e.which);
    if (keycode1 == 0 || keycode1 == 9) {
        e.preventDefault();
        e.stopPropagation();
    }
});

$(window).on("orientationchange", function() {
    //ios orientation change fix
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        location.reload();
    }
});

function csbetalog(info) {
    console.log("%c[CS:GO BLOG 2.0]" + "%c " + info, 'color: #8c0f12', "color:black");
}

function load() {

    //lang parameter and querry ?l=en
    if (getparameter("l") != "") {
        changelang(getparameter("l"));
    } else {
        if (Cookies.get('l') != undefined) {
            changelang(Cookies.get('l'));
        } else {
            //changelang("en");
            deleteparameter("l");
        }
    }
    csbetalog("");
    csbetalog("Language: " + lang);

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && Cookies.get("not_firsttime") != "true") { //checks for firefox
        if (Cookies.get("not_firsttime") == "true") {
            $(".agent-helper").hide();
        }
        //Mozilla warning
        popup(getlang()[0][25], getlang()[0][27], getlang()[0][26]);
        csbetalog("First Time: false");
        Cookies.set("not_firsttime", "true");
    } else if ((navigator.userAgent.indexOf('Trident/') > 0 || navigator.userAgent.indexOf('MSIE ') > 0) && Cookies.get("not_firsttime") != "true") {
        if (Cookies.get("not_firsttime") == "true") {
            $(".agent-helper").hide();
        }
        popup(getlang()[0][25], getlang()[0][28], getlang()[0][26]);
        csbetalog("First Time: false");
        Cookies.set("not_firsttime", "true");
    } else {
        if (Cookies.get("not_firsttime") == "true") {
            $(".agent-helper").hide();
            csbetalog("First Time: false");
        } else {
            csbetalog("First Time: true");
        }
        Cookies.set("not_firsttime", "true");
    }

    if (Cookies.get("v") != undefined) {
        adjustvolume(parseInt(Cookies.get("v")) / 100);
        $(".Svolume").val(Cookies.get("v"));
        $(".Svolumeval").text(Cookies.get("v"));
    } else {
        adjustvolume(0.2);
    }
    csbetalog("Volume: " + $(".Svolumeval").text());

    //background video
    if (Cookies.get("b") != undefined) {
        vidchange(Cookies.get("b"));
    } else {
        vidchange("ancient");
    }
    csbetalog("Background Video: " + Cookies.get("b"));

    //model viewer
    if (Cookies.get("mtoggle") == "true" && /iPad|iPhone|iPod/.test(navigator.userAgent) == false) {
        if (Cookies.get("m") != undefined) {
            modelchange(Cookies.get("m"));
        } else {
            modelchange("condom_man");
        }
        $('.model-tgl').prop("checked", true);
        $(".model-container").show();
        $(".agent-helper").hide();
    } else {
        if (Cookies.get("m") != undefined) {
            modelchange(Cookies.get("m"));
        } else {
            modelchange("condom_man");
        }
    }

    //the posts
    loadblogpostpreviews(doacall("blogpost", 1));
    loadupdatepreviews(doacall("update", 1));

    //parameter check
    if (getparameter("c") == "" && getparameter("id") == "" && getparameter("s") == "") {
        //gotopage("main");
    } else if (getparameter("id") != "") {
        gotopage("id", getparameter("id"));
        //determine the page and make the page visible and show inside
    } else if (getparameter("s") != "") {
        var searchtext = getparameter("s");
        var tab = getparameter("c");
        if (tab == "blogposts") {
            if (page > blogposttotalpages) {
                popup(getlang()[0][32], getlang()[0][29], getlang()[0][26]);
                page = 1;
            }
            gotopage("search", searchtext, page, "blogpost");
        } else if (tab == "releasenotes") {
            if (page > updatetotalpages) {
                popup(getlang()[0][32], getlang()[0][29], getlang()[0][26]);
                page = 1;
            }
            gotopage("search", searchtext, page, "update");
        }
    } else if (getparameter("c") != "") {
        var tab = getparameter("c");
        if (tab == "blogposts") {
            if (page > blogposttotalpages) {
                popup(getlang()[0][32], getlang()[0][29], getlang()[0][26]);
                page = 1;
            }
            gotopage("category", "blogpost", page);
        } else if (tab == "releasenotes") {
            if (page > updatetotalpages) {
                popup(getlang()[0][32], getlang()[0][29], getlang()[0][26]);
                page = 1;
            }
            gotopage("category", "update", page);
        }
    } else {
        popup(getlang()[0][32], getlang()[0][32], getlang()[0][26]); //stuff went wrong with use of parameters
    }

    //gets all the authors, disabled for performance and we dont use it
    //authors = doacall("author", 20);
    hundocalls()
}

function hundocalls() {
    //async stuff
    setTimeout(() => { hundo("blogpost", 1, 100); }, 4000);
    setTimeout(() => { hundo("update", 1, 100); }, 6000);
    setTimeout(() => { hundo("blogpost", 2, 100); }, 8000);
    setTimeout(() => { hundo("update", 2, 100); }, 10000);
    setTimeout(() => { hundo("blogpost", 3, 100); }, 12000);
    setTimeout(() => { hundo("update", 3, 100); }, 14000);
    setTimeout(() => { hundo("blogpost", 4, 100); }, 16000);
    setTimeout(() => { hundo("update", 4, 100); }, 18000);
}

function hundo(type, extra, extra1) {
    var inurl = ""
    if (type == "blogpost") {
        if (extra == undefined) { extra = 1 }
        inurl = "posts/" + "?page=" + extra + "&per_page=" + extra1 + "&exclude=29510,29057,29077,19463";
    } else if (type == "update") {
        if (extra == undefined) { extra = 1 }
        if (lang == "en") { extra + "&exclude=30858,30847,30862,30864,30533" }
        inurl = "posts/" + "?page=" + extra + "&per_page=" + extra1 + "&categories=193";
    }
    var posts = "";
    if (lang == "en") {
        try {
            var url = "https://blog.counter-strike.net/wp-json/wp/v2/" + inurl;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(this.responseText);
                    posts = result;
                    if (type == "blogpost") {
                        //blogpostcalls[extra] = posts;
                        var i, j, temparray, chunk = 10;
                        var b = 1 + (10 * (extra - 1));
                        for (i = 0, j = posts.length; i < j; i += chunk) {
                            temparray = posts.slice(i, i + chunk);
                            blogpostcalls[b] = temparray;
                            b = b + 1;
                        }
                        var ac = 0;
                        do {
                            idcalls[parseposts(posts, ac)[3]] = posts[ac];
                            ac = ac + 1;
                        } while (ac <= posts.length - 1)
                    } else if (type == "update") {
                        //updatecalls[extra] = posts;
                        var i, j, temparray, chunk = 10;
                        var b = 1 + (10 * (extra - 1));
                        for (i = 0, j = posts.length; i < j; i += chunk) {
                            temparray = posts.slice(i, i + chunk);
                            updatecalls[b] = temparray;
                            b = b + 1;
                        }
                        var ac = 0;
                        do {
                            idcalls[parseposts(posts, ac)[3]] = posts[ac];
                            ac = ac + 1;
                        } while (ac <= posts.length - 1)
                    }
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        } catch (error) {
            //console.log(error);
        }
    } else if (lang != undefined || lang != "") {
        try {
            var url = "https://blog.counter-strike.net/" + lang + "/wp-json/wp/v2/" + inurl;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(this.responseText);
                    posts = result;
                    if (type == "blogpost") {
                        //blogpostcalls[extra] = posts;
                        var i, j, temparray, chunk = 10;
                        var b = 1 + (10 * (extra - 1));
                        for (i = 0, j = posts.length; i < j; i += chunk) {
                            temparray = posts.slice(i, i + chunk);
                            blogpostcalls[b] = temparray;
                            b = b + 1;
                        }
                        var ac = 0;
                        do {
                            idcalls[parseposts(posts, ac)[3]] = posts[ac];
                            ac = ac + 1;
                        } while (ac <= posts.length - 1)
                    } else if (type == "update") {
                        //updatecalls[extra] = posts;
                        var i, j, temparray, chunk = 10;
                        var b = 1 + (10 * (extra - 1));
                        for (i = 0, j = posts.length; i < j; i += chunk) {
                            temparray = posts.slice(i, i + chunk);
                            updatecalls[b] = temparray;
                            b = b + 1;
                        }
                        var ac = 0;
                        do {
                            idcalls[parseposts(posts, ac)[3]] = posts[ac];
                            ac = ac + 1;
                        } while (ac <= posts.length - 1)
                    }
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        } catch (error) {
            //console.log(error);
        }
    }
}

function doacall(type, extra, extra2, extra3) {
    var inurl = ""
    if (type == "blogpost") {
        if (extra == undefined) { extra = 1 }
        inurl = "posts/" + "?page=" + extra + "&exclude=29510,29057,29077,19463";
    } else if (type == "update") {
        if (extra == undefined) { extra = 1 }
        if (lang == "en") { extra + "&exclude=30858,30847,30862,30864,30533" }
        inurl = "posts/" + "?page=" + extra + "&categories=193";
    } else if (type == "id") {
        inurl = "posts/" + extra;
    } else if (type == "search") {
        inurl = "posts/" + "?search=" + extra + "&page=" + extra2;
        if (extra3 == "blogpost") {
            inurl = inurl + "&exclude=29510,29057,29077,19463";
        } else if (extra3 == "update") {
            inurl = inurl + "&categories=193,229,253";
            if (lang == "en") { inurl = inurl + "&exclude=30858,30847,30862,30864,30533"; }
        }
    } else if (type == "author") {
        inurl = "users" + "?per_page=" + extra;
    }
    var posts = "";
    var totalpages;
    if ((type == "search" || type === "author") || (type == "blogpost" && blogpostcalls[extra] == undefined) || (type == "update" && updatecalls[extra] == undefined) || (type == "id" && idcalls[extra] == undefined)) {
        if (lang == "en") {
            try {
                var url = "https://blog.counter-strike.net/wp-json/wp/v2/" + inurl;
                xmlhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        totalpages = this.getResponseHeader("x-wp-totalpages");
                        var result = JSON.parse(this.responseText);
                        posts = result;
                        posts["totalpages"] = totalpages
                        if (type == "blogpost") {
                            blogposttotalpages = totalpages;
                        } else if (type == "update") {
                            updatetotalpages = totalpages;
                        } else if (type == "search") {
                            searchtotalpages = totalpages;
                        }
                    }
                };
                xmlhttp.open("GET", url, false);
                xmlhttp.send();
            } catch (error) {
                csbetalog(error);
            }
        } else if (lang != undefined || lang != "") {
            try {
                var url = "https://blog.counter-strike.net/" + lang + "/wp-json/wp/v2/" + inurl;
                xmlhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        totalpages = this.getResponseHeader("x-wp-totalpages");
                        var result = JSON.parse(this.responseText);
                        posts = result;
                        posts["totalpages"] = totalpages
                        if (type == "blogpost") {
                            blogposttotalpages = totalpages;
                        } else if (type == "update") {
                            updatetotalpages = totalpages;
                        } else if (type == "search") {
                            searchtotalpages = totalpages;
                        }
                    }
                };
                xmlhttp.open("GET", url, false);
                xmlhttp.send();
            } catch (error) {
                csbetalog(error);
            }
        }
        if (type == "blogpost") {
            blogpostcalls[extra] = posts;
            var ac = 0;
            do {
                idcalls[parseposts(posts, ac)[3]] = posts[ac];
                ac = ac + 1;
            } while (ac <= posts.length - 1)
        } else if (type == "update") {
            updatecalls[extra] = posts;
            var ac = 0;
            do {
                idcalls[parseposts(posts, ac)[3]] = posts[ac];
                ac = ac + 1;
            } while (ac <= posts.length - 1)
        } else if (type == "id") {
            idcalls[extra] = posts;
        }
    } else {
        if (type == "blogpost") {
            posts = blogpostcalls[extra];
        } else if (type == "update") {
            posts = updatecalls[extra];
        } else if (type == "id") {
            posts = idcalls[extra];
        }
    }
    return posts;
}

function gotopage(type, extra, extra1, extra2) {
    loadblogpostpreviews(blogpostcalls[1]);
    if (type == "main") { //this is basically factory reset
        page = 1;
        tabvisiblity("settings", "hide");
        tabvisiblity("releasenotes", "hide");
        tabvisiblity("blogposts", "hide");
        tabvisiblity("status", "hide");
        writeblogposts(blogpostcalls[1]);
        writeupdates(updatecalls[1]);
        //clears parameters
        deleteparameter("id");
        deleteparameter("s");
        deleteparameter("c");
        deleteparameter("p");
        //the arrows
        $(".back").show();
        $(".forward").show();
        $(".pagecounter").show();
        $(".single").hide();
    } else if (type == "id") {
        deleteparameter("s");
        deleteparameter("c");
        deleteparameter("p");
        updateparameter("id", extra);
        var id = extra;
        var idcall = doacall("id", id);
        if (idcall["message"] != "Invalid post ID.") {
            if (parsepost(idcall)[4] == "update") {
                writeupdate(idcall);
                if ($(".R").hasClass("tabmovefor")) { tabvisiblity("blogposts", "hide"); }
                if ($(".ST").hasClass("tabmovefor")) { tabvisiblity("status", "hide"); }
                if ($(".S").hasClass("tabmovefor")) { tabvisiblity("settings", "hide"); }
                tabvisiblity("releasenotes", "show");
                $(".notes").prop("checked", true);
            } else {
                writeblog(idcall);
                if ($(".R").hasClass("tabmovefor")) { tabvisiblity("releasenotes", "hide"); }
                if ($(".ST").hasClass("tabmovefor")) { tabvisiblity("status", "hide"); }
                if ($(".S").hasClass("tabmovefor")) { tabvisiblity("settings", "hide"); }
                tabvisiblity("blogposts", "show");
                $(".blog").prop("checked", true);
            }
            $(".back").hide();
            $(".forward").hide();
            $(".pagecounter").hide();
            $(".single").show();
            //twenty
            $(".twentytwenty-container").twentytwenty();
        } else {
            popup(getlang()[0][31], getlang()[0][30], getlang()[0][26]);
        }
        isstandard = false;
        //determine the page and make the page visible and show inside
    } else if (type == "search") {
        // "search", searchtext, page number, category
        //use search to get data and show inside given c or blogpost
        var tab;
        if (extra2 != undefined) { tab = extra2; } else { tab = "blogpost"; }
        var call = "";
        var searchtext = extra;
        var totalpages;
        call = doacall("search", searchtext, extra1, tab);
        totalpages = searchtotalpages;
        if (call != "") {
            if (extra1 <= parseInt(totalpages) && extra1 > 0) {
                if (extra1 != "") { page = extra1; } else { page = 1; }
                if (searchtext != "") {
                    $(".back.arrow").removeClass("firstpage");
                    $(".forward.arrow").removeClass("lastpage");
                    if (page == 1 && page == parseInt(totalpages)) {
                        $(".back.arrow").addClass("firstpage");
                        $(".forward.arrow").addClass("lastpage");
                    } else if (page == 1) {
                        $(".back.arrow").addClass("firstpage");
                        $(".forward.arrow").removeClass("lastpage");
                    } else if (page == parseInt(totalpages)) {
                        $(".back.arrow").removeClass("firstpage");
                        $(".forward.arrow").addClass("lastpage");
                    }
                    isstandard = false;
                    if (tab == "blogpost") {
                        updateparameter("c", "blogposts");
                        writeblogposts(call);
                        tabvisiblity("blogposts", "show");
                        if (page != 1) { updateparameter("p", page) } else(deleteparameter("p"))
                        $(".pagecounter").val(page)
                        updateparameter("s", searchtext);
                        $(".blog").prop("checked", true);
                    } else if (tab == "update") {
                        updateparameter("c", "releasenotes");
                        writeupdates(call);
                        tabvisiblity("releasenotes", "show");
                        if (page != 1) { updateparameter("p", page) } else(deleteparameter("p"))
                        $(".pagecounter").val(page)
                        updateparameter("s", searchtext);
                        $(".notes").prop("checked", true);
                    }
                    //arrow stuff
                    deleteparameter("id");
                    $(".searchbar").val(searchtext);
                    $(".back").show();
                    $(".forward").show();
                    $(".pagecounter").show();
                    $(".single").hide();
                    //twenty
                    $(".twentytwenty-container").twentytwenty();
                }
            }
        } else {
            popup(getlang()[0][32], getlang()[0][31], getlang()[0][26]);
        }
    } else if (type == "category") {
        var tab = extra;
        var call = "";
        var totalpages;
        if (tab == "blogpost") {
            totalpages = blogposttotalpages;
            updateparameter("c", "blogposts");
        } else if (tab == "update") {
            totalpages = updatetotalpages;
            updateparameter("c", "releasenotes");
        }
        if (extra1 <= parseInt(totalpages) && extra1 > 0) {
            page = extra1;
            call = doacall(tab, page);
            $(".back.arrow").removeClass("firstpage");
            $(".forward.arrow").removeClass("lastpage");
            deleteparameter("id");
            deleteparameter("s");
            if (page == 1 && page == parseInt(totalpages)) {
                $(".back.arrow").addClass("firstpage");
                $(".forward.arrow").addClass("lastpage");
                isstandard = false;
            } else if (page == parseInt(totalpages)) {
                $(".back.arrow").removeClass("firstpage");
                $(".forward.arrow").addClass("lastpage");
                isstandard = false;
            } else if (page == 1) {
                $(".back.arrow").addClass("firstpage");
                $(".forward.arrow").removeClass("lastpage");
                isstandard = true;
            } else {
                isstandard = false;
            }

            if (tab == "blogpost" && call != "") {
                writeblogposts(call);
                tabvisiblity("blogposts", "show");
                if (page != 1) { updateparameter("p", page) } else(deleteparameter("p"))
                $(".pagecounter").val(page);
                $(".blog").prop("checked", true);
            } else if (tab == "update" && call != "") {
                writeupdates(call);
                tabvisiblity("releasenotes", "show");
                if (page != 1) { updateparameter("p", page) } else(deleteparameter("p"))
                $(".pagecounter").val(page);
                $(".notes").prop("checked", true);
            }
            //arrow stuff
            $(".searchbar").val("");
            $(".back").show();
            $(".forward").show();
            $(".pagecounter").show();
            $(".single").hide();
            //twenty
            $(".twentytwenty-container").twentytwenty();
        }
    }
}

function playaudio(audio) {
    hasPlayed = true;
    document.getElementById(audio).play();
}

function pagechange(inside, direction) {
    var pg = 0;
    if (direction == "forw") {
        pg = parseInt(page) + 1;
    } else if (direction == "back") {
        pg = parseInt(page) - 1;
    }
    if (getparameter('s') == "") {
        gotopage('category', inside, pg);
    } else {
        gotopage("search", getparameter('s'), pg, inside);
    }
}

function updateparameter(first, second) {
    const url = new URL(window.location);
    url.searchParams.set(first, second);
    window.history.pushState("", '', url);
}

function getparameter(type) {
    const url = new URL(window.location);
    var result = url.searchParams.get(type);
    if (result != null) {
        return result;
    } else {
        return "";
    }

}

function deleteparameter(type) {
    const url = new URL(window.location);
    url.searchParams.delete(type);
    window.history.pushState("", '', url);
}

$(document).keypress(function(e) {
    var pagecounter = $(".tabmovefor").children(".tabtopbar").children(".features-container").children(".arrowcontainer").children(".pagecounter");
    if (e.which == 13 && $(".popup").is(":hidden") && ($(".B").hasClass("tabmovefor") || $(".R").hasClass("tabmovefor")) && page != $(pagecounter).val()) {
        //registers enter for page counter so you can enter custom values
        if ($(pagecounter).val() == "" || parseInt($(pagecounter).val()) < 1 || $.isNumeric($(pagecounter).val()) == false) {
            $(pagecounter).val(page);
        } else if (getparameter("s") != "" && $(".B").hasClass("tabmovefor") && parseInt($(pagecounter).val()) <= searchtotalpages) {
            page = $(pagecounter).val();
            gotopage('search', getparameter("s"), page, 'blogpost')
        } else if (getparameter("s") != "" && $(".R").hasClass("tabmovefor") && parseInt($(pagecounter).val()) <= searchtotalpages) {
            page = $(pagecounter).val();
            gotopage('search', getparameter("s"), page, 'update')
        } else if (getparameter("s") == "" && $(".B").hasClass("tabmovefor") && parseInt($(pagecounter).val()) <= blogposttotalpages) {
            page = $(pagecounter).val();
            gotopage("category", "blogpost", page);
        } else if (getparameter("s") == "" && $(".R").hasClass("tabmovefor") && parseInt($(pagecounter).val()) <= updatetotalpages) {
            page = $(pagecounter).val();
            gotopage("category", "update", page);
        } else {
            popup(getlang()[0][32], getlang()[0][29], getlang()[0][26]);
            $(pagecounter).val(page);
        }
    } else if (e.which == 13 && $(".popup").is(":visible")) {
        //registers enter for popup
        $('.popup').hide();
    } else if (e.which == 13 && $(".tab").hasClass("tabmovefor") && $(".popup").is(":hidden")) {
        //registers enter for search
        $(".tab.tabmovefor").children(".tabtopbar").children(".features-container").children(".searcharea").children(".searchicon").click();
    }
});
//handles valve's sliders
$(document).on('click', '.ssArrowRight,.sArrowRight,.ssArrowRight3,.ssArrowRight2', function() {
    var next
    if ($(this).parent().children(".picslide").children(":visible").next().length) {
        next = $(this).parent().children(".picslide").children(":visible").next()
    } else {
        next = $(this).parent().children(".picslide").children(":hidden").first()
    }
    var old = $(this).parent().children(".picslide").children(":visible");
    next.show();
    old.hide();
});
$(document).on('click', '.ssArrowLeft,.sArrowLeft,.ssArrowLeft3,.ssArrowLeft2', function() {
    var next
    if ($(this).parent().children(".picslide").children(":visible").prev().length) {
        next = $(this).parent().children(".picslide").children(":visible").prev()
    } else {
        next = $(this).parent().children(".picslide").children(":hidden").last()
    }
    var old = $(this).parent().children(".picslide").children(":visible");
    next.show();
    old.hide();
});

function getlang() {
    var langenum = "en";
    if (lang != "pt-pt" && lang != "pt-br" && lang != "zh-hans") {
        langenum = lang;
    } else {
        if (lang == "pt-pt") {
            langenum = "pt"
        } else if (lang == "pt-br") {
            langenum = "br";
        } else if (lang == "zh-hans") {
            langenum = "zh";
        }
    }
    if (window[langenum + "_lang"] != undefined) {
        return window[langenum + "_lang"];
    } else {
        return en_lang;
    }
}

function updatelangstrings() {
    var langstrings = getlang()
    $(".Mtop").children(".Mtitle").children(".title").text(langstrings[0][0]); //News
    $(".Mbottom").find(".lupdates_t").text(langstrings[0][1]); //Latest Updates
    $(".Mtile-alttitle").children(".alttile-main").text(langstrings[0][2]); //Release Notes for
    $("html").find(".tabB_l").text(langstrings[0][3]); //Blogposts
    $("html").find(".tabR_l").text(langstrings[0][4]); //Release Notes
    $("html").find(".tabST_l").text(langstrings[0][5]); //CS:GO Status
    $("html").find(".tabS_l").text(langstrings[0][6]); //Settings
    $(".Dresourcesdropdown").find(".about_t").text(langstrings[0][7]); //About
    $(".Dresourcesdropdown").find(".faq_t").text(langstrings[0][8]); //FAQ
    $(".Dresourcesdropdown").find(".community_t").text(langstrings[0][9]); //Community
    $("#update_history").children(".uniques").eq(0).text(langstrings[0][10]); //Major Updates
    $("#update_history").children(".uniques").eq(1).text(langstrings[0][11]); //Major Tournament Champions
    $("#update_history").children(".uniques").eq(2).text(langstrings[0][12]); //CS:GO Community Workshops
    $(".searchbar").attr("placeholder", langstrings[0][13]); //Type search here
    $(".S").children(".tabbottom").find(".visual_set_t").text(langstrings[0][14]); //Visual Settings
    $(".S").children(".tabbottom").find(".background_scenery_t").text(langstrings[0][15]); //Background Scenery
    $(".S").children(".tabbottom").find(".language_t").text(langstrings[0][16]); //Language 
    $(".S").children(".tabbottom").find(".misccont").text(langstrings[0][17]); //Misc
    $(".S").children(".tabbottom").find(".volume_t").text(langstrings[0][18]); //Volume
    $(".S").children(".tabbottom").find(".about_t").text(langstrings[0][7]); //About
    $(".S").children(".tabbottom").find(".about-container").children("p").eq(0).html(langstrings[0][19]); //About Inner
    $(".S").children(".tabbottom").find(".creators_t").text(langstrings[0][20]); //Creators
    $(".S").children(".tabbottom").find(".about-container").children("p").eq(1).html(langstrings[0][21]); //You can contact us for any feedback and/or bug reports.
    $(".S").children(".tabbottom").find(".links_t").text(langstrings[0][22]); //Links
    $(".S").children(".tabbottom").find(".sourcecode_t").text(langstrings[0][23]); //Source code
    $("html").find(".about-ttl").html(langstrings[0][34]); //A community–made blog.
    $("html").find(".about-desc").html(langstrings[0][35]); //“Made with love and pain.”
    $("html").find(".agent-helper").text(langstrings[0][36]); //Toggle the Agent
    $("html").find(".resr-dd").text(langstrings[0][37]); // Resources
    $("html").find(".tabD_l").text(langstrings[0][38]); // Dashboard
    $("html").find(".url-tooltip").text(langstrings[0][39]); // Copied to Clipboard!
    $("#update_berlin2019").attr("onclick", "gotopage('id'," + langstrings[3][0] + ");" + "playaudio('Dblogposts');");
    $("#update_katowice2019").attr("onclick", "gotopage('id'," + langstrings[3][1] + ");" + "playaudio('Dblogposts');");
    $("#update_london2018").attr("onclick", "gotopage('id'," + langstrings[3][2] + ");" + "playaudio('Dblogposts');");
    $("#update_boston2018").attr("onclick", "gotopage('id'," + langstrings[3][3] + ");" + "playaudio('Dblogposts');");
    $("#update_krakow2017").attr("onclick", "gotopage('id'," + langstrings[3][4] + ");" + "playaudio('Dblogposts');");
    $("#update_atlanta2017").attr("onclick", "gotopage('id'," + langstrings[3][5] + ");" + "playaudio('Dblogposts');");
    $("#update_cologne2016").attr("onclick", "gotopage('id'," + langstrings[3][6] + ");" + "playaudio('Dblogposts');");
    $("#update_cluj-napoca2015").attr("onclick", "gotopage('id'," + langstrings[3][7] + ");" + "playaudio('Dblogposts');");
    $("#update_cologne2015").attr("onclick", "gotopage('id'," + langstrings[3][8] + ");" + "playaudio('Dblogposts');");
    $("#update_katowice2015").attr("onclick", "gotopage('id'," + langstrings[3][9] + ");" + "playaudio('Dblogposts');");
    $("#update_jonkoping2014").attr("onclick", "gotopage('id'," + langstrings[3][10] + ");" + "playaudio('Dblogposts');");
    $("#update_cologne2014").attr("onclick", "gotopage('id'," + langstrings[3][11] + ");" + "playaudio('Dblogposts');");
    $("#update_katowice2014").attr("onclick", "gotopage('id'," + langstrings[3][12] + ");" + "playaudio('Dblogposts');");
    $("#update_jonkoping2013").attr("onclick", "gotopage('id'," + langstrings[3][13] + ");" + "playaudio('Dblogposts');");
}

//on language combobox changed
function changelang(newlang) {
    if (newlang != lang) {
        $(".Slang").text($(".Slang").parent().children(".settings-dropdown").children("li").filter("[name='" + newlang + "']").text());
        lang = newlang;
        if (newlang != "en") {
            updateparameter("l", newlang);
            Cookies.set('l', newlang);
        } else {
            deleteparameter("l");
            Cookies.remove('l');
        }
        blogpostcalls.length = 0;
        updatecalls.length = 0;
        idcalls.length = 0;
        updatelangstrings();
        loadblogpostpreviews(doacall("blogpost", 1));
        loadupdatepreviews(doacall("update", 1));
        hundocalls();
    }
}

function popup(title, text, btntext) {
    $(".popuptitle").text(title);
    $(".popuptext").text(text);
    $(".popupbtn").text(btntext);
    $(".popup").show();
}

function vidchange(video) {
    if (video != $(".video").attr("src").replace("css/gfx/videos/", "").replace(".mp4", "")) {
        //document.getElementsByClassName("background")[0].pause();
        $(".video").attr("src", "css/gfx/videos/" + video + ".mp4");
        document.getElementsByClassName("background")[0].load();
        document.getElementsByClassName("background")[0].play();
        Cookies.set("b", video);
        $(".Sbackground").text($(".Sbackground").parent().children(".settings-dropdown").children("li").filter("[name='" + video + "']").text());
        $(".settings-dropdown").removeClass("showMenu")
    }
}

function modelchange(model) {
    if (model != $("model-viewer").attr("src").split("/")[3].replace(".glb", "")) {
        $("model-viewer").attr("src", "css/gfx/models/" + model + ".glb");
        Cookies.set("m", model);
    }
}

function tabvisiblity(tab, visiblitymode) {
    var tabfirst;
    if (tab == "status") { tabfirst = "ST" } else { tabfirst = tab[0].toUpperCase(); }
    if (visiblitymode == "hide") {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            $(".Mtop").show();
            $(".Mbottom").show();
        }
        if ($(".Mright").is(":hidden")) {
            $(".Mright").show();
        }
        setTimeout(() => { if ($(".Mright").is(":hidden")) { $(".Mright").show(); } }, 200);
        if ($(".tab").is(":visible") == false) {
            $(".Mtop").removeClass("animatezoomback");
            $(".Mtop").removeClass("animatezoomback");
            $(".Mtop").addClass("animatezoomforwards");
            $(".Mbottom").addClass("animatezoomforwards")
        }
        $("." + tabfirst).removeClass("tabmovefor");
        $("." + tabfirst).addClass("tabmoveback");

    } else if (visiblitymode == "show") {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            $(".Mtop").hide();
            $(".Mbottom").hide();
        }
        if ($(".Mright").is(":visible")) { setTimeout(() => { $(".Mright").hide(); }, 200); }
        $(".Mtop").removeClass("animatezoomforwards");
        $(".Mbottom").removeClass("animatezoomforwards");
        $(".Mtop").addClass("animatezoomback");
        $(".Mbottom").addClass("animatezoomback");
        $("." + tabfirst).addClass("tabmovefor");
        $("." + tabfirst).removeClass("tabmoveback");
    }
}

function Dicon(type) {
    if (type == "dashboard") {
        if ($(".R").hasClass("tabmovefor") || $(".B").hasClass("tabmovefor") || $(".S").hasClass("tabmovefor") || $(".ST").hasClass("tabmovefor")) {
            if ($(".B").hasClass("tabmovefor")) { tabvisiblity("blogposts", "hide"); }
            if ($(".R").hasClass("tabmovefor")) { tabvisiblity("releasenotes", "hide"); }
            if ($(".ST").hasClass("tabmovefor")) { tabvisiblity("status", "hide"); }
            if ($(".S").hasClass("tabmovefor")) { tabvisiblity("settings", "hide"); }
            $(".Mtop").addClass("animatezoomforwards");
            $(".Mbottom").addClass("animatezoomforwards");
            $(".Mtop").removeClass("animatezoomback");
            $(".Mbottom").removeClass("animatezoomback");
            deleteparameter("c");
            deleteparameter("id");
            deleteparameter("p");
            deleteparameter("s");
            playaudio('Ddashboard');
        }
    } else if (type == "blogposts") {
        if ($(".B").hasClass("tabmovefor") == false) {
            if ($(".R").hasClass("tabmovefor")) { tabvisiblity("releasenotes", "hide"); }
            if ($(".ST").hasClass("tabmovefor")) { tabvisiblity("status", "hide"); }
            if ($(".S").hasClass("tabmovefor")) { tabvisiblity("settings", "hide"); }
            playaudio('Dblogposts');
            if (isstandard == false) {
                gotopage("category", "blogpost", 1);
                isstandard = true;
            } else if ($(".B").hasClass("tabmovefor") == false) {
                gotopage("category", "blogpost", page);
            }
        }
    } else if (type == "releasenotes") {
        if ($(".R").hasClass("tabmovefor") == false) {
            if ($(".B").hasClass("tabmovefor")) { tabvisiblity("blogposts", "hide"); }
            if ($(".ST").hasClass("tabmovefor")) { tabvisiblity("status", "hide"); }
            if ($(".S").hasClass("tabmovefor")) { tabvisiblity("settings", "hide"); }
            playaudio('Dreleasenotes');
            if (isstandard == false) {
                gotopage("category", "update", 1);
                isstandard = true;
            } else if ($(".R").hasClass("tabmovefor") == false) {
                gotopage("category", "update", page);
            }
        }
    } else if (type == "resources") {
        playaudio('Dresources');
    } else if (type == "submenu") {
        playaudio('submenu');
        $(".checkbox").prop("checkbox", false);
    } else if (type == "status") {
        playaudio('Dstatus');
        /* Old code for displaying status tab
        if ($(".ST").hasClass("tabmovefor") == false) {
            if ($(".S").hasClass("tabmovefor")) { tabvisiblity("settings", "hide"); }
            if ($(".B").hasClass("tabmovefor")) { tabvisiblity("blogposts", "hide"); }
            if ($(".R").hasClass("tabmovefor")) { tabvisiblity("releasenotes", "hide"); }
            tabvisiblity("status", "show");
        }
        deleteparameter("c");
        deleteparameter("id");
        deleteparameter("p");
        deleteparameter("s"); */
    } else if (type == "settings") {
        if ($(".S").hasClass("tabmovefor") == false) {
            if ($(".ST").hasClass("tabmovefor")) { tabvisiblity("status", "hide"); }
            if ($(".B").hasClass("tabmovefor")) { tabvisiblity("blogposts", "hide"); }
            if ($(".R").hasClass("tabmovefor")) { tabvisiblity("releasenotes", "hide"); }
            tabvisiblity("settings", "show");
            playaudio('Dsettings');
        }
        deleteparameter("c");
        deleteparameter("id");
        deleteparameter("p");
        deleteparameter("s");
        //do the tab when we got it
    }
}

function adjustvolume(amount) {
    var input = document.getElementsByTagName("audio");
    for (let i = 0; i < input.length; i++) {
        input[i].volume = parseFloat(amount);
    }
}


/* function getauthorname(id) {
    var name = "unknown";
    var i = 0
    do {
        if (authors[i]["id"] == id) {
            name = authors[i]["name"];
        }
        i = i + 1;
    } while (i <= authors.length - 1)
    return name;
} */

function copyToClipboard(link) {
    var inputx = document.body.appendChild(document.createElement("input"));
    inputx.value = link;
    inputx.focus();
    inputx.select();
    document.execCommand('copy');
    inputx.parentNode.removeChild(inputx);
    var elem = $(event.target).closest('div').children(".url-tooltip");
    $(elem).addClass("copiedon");
    setTimeout(() => {
        $(elem).removeClass("copiedon");
        $(elem).addClass("copiedoff");
        setTimeout(() => { $(elem).removeClass("copiedoff"); }, 200);
    }, 1000);
}

function parsepost(posts) {
    var data = []
    var title = posts["title"]["rendered"];
    var date = new Date(Date.parse(posts["date"]));
    var date = posts["date"].split("T")[0] + " - " + posts["date"].split("T")[1];
    var content = posts["content"]["rendered"];
    var id = posts["id"];
    var type = "blogpost";
    if (posts["categories"][0] == 193 || posts["categories"][0] == 229 || posts["categories"][0] == 253) {
        type = "update";
    }
    var imgurl = "./css/gfx/default_news.png"
    if (content.includes("<img src=\"")) {
        imgurl = content.split("<img src=\"")[1].split("\"")[0];
    }
    var excerpt = posts["excerpt"]["rendered"];
    //var author = getauthorname(posts["author"]);
    data[0] = title;
    data[1] = date.toString();
    data[2] = content;
    data[3] = id;
    data[4] = type;
    data[5] = imgurl;
    data[6] = excerpt;
    //data[7] = author;
    return data;
}

function parseposts(posts, i) {
    var data = []
    var title = posts[i]["title"]["rendered"];
    var date = new Date(Date.parse(posts[i]["date"]));
    var content = posts[i]["content"]["rendered"];
    var id = posts[i]["id"];
    var type = "blogpost";
    if (posts[i]["categories"].includes("193") || posts[i]["categories"].includes("229") || posts[i]["categories"].includes("253")) {
        type = "update";
    }
    var imgurl = "./css/gfx/default_news.png"
    if (content.includes("<img src=\"")) {
        imgurl = content.split("<img src=\"")[1].split("\"")[0];
    }
    var excerpt = posts[i]["excerpt"]["rendered"];
    //var author = getauthorname(posts[i]["author"]);
    data[0] = title;
    data[1] = getlang()[1][parseInt(date.getDay())] + ", " + date.getDate() + " " + getlang()[2][parseInt(date.getMonth())] + " " + date.getFullYear() + ", " + date.toTimeString().split(" ")[0].replace(":" + date.toTimeString().split(" ")[0].split(":")[2], ""); //
    data[2] = content;
    data[3] = id;
    data[4] = type;
    data[5] = imgurl;
    data[6] = excerpt;
    data[7] = date.getDate() + " " + getlang()[2][parseInt(date.getMonth())] + " " + date.getFullYear();
    //data[8] = author;
    return data;
}

function loadblogpostpreviews(call) {
    var element = $(".Mtiles");
    $(element).html("");
    var i = 0;
    do {
        var posts = parseposts(call, i);
        var Mtile = document.createElement("div");
        var Mtilelink = document.createElement("a");
        var Mtilebottombar = document.createElement("div");
        var Mtiledate = document.createElement("div");
        var Mtiletitle = document.createElement("div");
        var Mtiledesc = document.createElement("div");
        Mtile.className = "Mtile";
        Mtilebottombar.className = "Mtilebottombar";
        Mtiledate.className = "Mtiledate";
        Mtiletitle.className = "Mtiletitle";
        Mtiledesc.className = "Mtiledesc";
        //title and link
        $(Mtile).attr("onclick", "gotopage('id'," + posts[3] + " ); playaudio('Dblogposts');");
        Mtiletitle.insertAdjacentHTML("beforeend", posts[0]);
        //date
        Mtiledate.append(posts[1]);
        //desc
        Mtiledesc.insertAdjacentHTML("beforeend", posts[6]);
        Mtile.style.backgroundImage = "url('" + posts[5] + "')";
        Mtilebottombar.append(Mtiledate);
        Mtilebottombar.append(Mtiletitle);
        Mtilebottombar.append(Mtiledesc);
        Mtile.append(Mtilebottombar);
        Mtilelink.append(Mtile);
        element.append(Mtilelink);
        i++;
    } while (i <= 4);
}

function loadupdatepreviews(call) {
    var element = document.getElementsByClassName("Mbottomtiles")[0]
        //$(element).html("");
    var i = 0;
    do {
        var posts = parseposts(call, i);
        $(element.children[i]).attr("onclick", "gotopage('id'," + posts[3] + "); playaudio('Dreleasenotes');")
        $(element.children[i].children[0].children[0].children[2]).text(posts[7])
        i = i + 1;
    }
    while (i <= 2)
}

var bloglink = new RegExp("href.?=.?\"http.?:\\/\\/blog.counter-strike\\.net\\/index.php\\/[0-9]+\\/[0-9]+\\/[0-9]+\\/");
var stylergx = new RegExp("style\\s*=\\s*\"(?!display\\s*:\\s*none(;|))[a-zA-Z0-9-# :;]+\"");
var rx = new RegExp("\\[.*\\]");
var scriptregx = new RegExp("<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>")

function writeblogposts(call) {
    //writes blogposts https://blog.counter-strike.net/LANG/index.php/page/1/
    var element = document.getElementsByClassName("B")[0].children[1].children[0];
    $(element).html("");
    $(element).scrollTop(0);
    var i = 0;
    var z = call.length - 1;
    do {
        var posts = parseposts(call, i);
        var feedseparator = document.createElement("div");
        feedseparator.className = "feedseparator";
        var shares = document.createElement("div");
        shares.className = "shares";
        var share = document.createElement("div");
        share.classList.add("sicons", "clipboard", "tooltip-container");
        $(share).attr("onclick", "copyToClipboard('" + "https://csbt.cc/" + "?id=" + posts[3] + "')");
        $(share).append("<span class='material-icons'>link</span><div class='url-tooltip'>" + getlang()[0][39] + "</div>");
        var tweet = document.createElement("a");
        $(tweet).attr("target", "_blank");
        $(tweet).attr("href", "https://twitter.com/intent/tweet?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&text=" + posts[0].replaceAll(" ", "+"));
        $(tweet).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Twitter" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm18.862 9.237c.208 4.617-3.235 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.079-4.03 3.198-4.03.944 0 1.797.398 2.396 1.037.748-.147 1.451-.42 2.085-.796-.245.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.44.656-.997 1.234-1.638 1.697z"/></svg>');
        var reddit = document.createElement("a");
        $(reddit).attr("target", "_blank");
        $(reddit).attr("href", "https://reddit.com/submit?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&title=" + posts[0].replaceAll(" ", "+"));
        $(reddit).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Reddit" viewBox="0 0 24 24"><path d="M14.558 15.827c.097.096.097.253 0 .349-.531.529-1.365.786-2.549.786l-.009-.002-.009.002c-1.185 0-2.018-.257-2.549-.786-.097-.096-.097-.253 0-.349.096-.096.254-.096.351 0 .433.431 1.152.641 2.199.641l.009.002.009-.002c1.046 0 1.765-.21 2.199-.641.095-.097.252-.097.349 0zm-.126-3.814c-.581 0-1.054.471-1.054 1.05 0 .579.473 1.049 1.054 1.049.581 0 1.054-.471 1.054-1.049 0-.579-.473-1.05-1.054-1.05zm9.568-12.013v24h-24v-24h24zm-4 11.853c0-.972-.795-1.764-1.772-1.764-.477 0-.908.191-1.227.497-1.207-.794-2.84-1.299-4.647-1.364l.989-3.113 2.677.628-.004.039c0 .795.65 1.442 1.449 1.442.798 0 1.448-.647 1.448-1.442 0-.795-.65-1.442-1.448-1.442-.613 0-1.136.383-1.347.919l-2.886-.676c-.126-.031-.254.042-.293.166l-1.103 3.471c-1.892.023-3.606.532-4.867 1.35-.316-.292-.736-.474-1.2-.474-.975-.001-1.769.79-1.769 1.763 0 .647.355 1.207.878 1.514-.034.188-.057.378-.057.572 0 2.607 3.206 4.728 7.146 4.728 3.941 0 7.146-2.121 7.146-4.728 0-.183-.019-.362-.05-.54.555-.299.937-.876.937-1.546zm-9.374 1.21c0-.579-.473-1.05-1.054-1.05-.581 0-1.055.471-1.055 1.05 0 .579.473 1.049 1.055 1.049.581.001 1.054-.47 1.054-1.049z"/></svg>');
        var telegram = document.createElement("a");
        $(telegram).attr("target", "_blank");
        $(telegram).attr("href", "https://t.me/share/url?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&text=" + posts[0].replaceAll(" ", "+"));
        $(telegram).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Telegram" viewBox="0 0 24 24"><path d="M0,0V24H23.81V0ZM18,17c-.2,1.06-.59,1.42-1,1.46-.83.07-1.46-.55-2.26-1.08-1.25-.82-2-1.33-3.18-2.13-1.41-.93-.49-1.44.31-2.27.21-.22,3.85-3.54,3.92-3.84a.29.29,0,0,0-.06-.25.35.35,0,0,0-.3,0c-.12,0-2.13,1.35-6,4a2.65,2.65,0,0,1-1.54.58,10.61,10.61,0,0,1-2.22-.53c-.89-.29-1.6-.44-1.54-.93,0-.26.39-.52,1.06-.79q6.24-2.71,8.31-3.58c4-1.65,4.78-1.93,5.32-1.94a1,1,0,0,1,.55.16.64.64,0,0,1,.2.39,2.63,2.63,0,0,1,0,.56C19.42,9,18.49,14.42,18,17Z"/></svg>');
        var facebook = document.createElement("a");
        $(facebook).attr("target", "_blank");
        $(facebook).attr("href", "https://facebook.com/sharer/sharer.php?u=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3]);
        $(facebook).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Facebook" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm16 7h-1.923c-.616 0-1.077.252-1.077.889v1.111h3l-.239 3h-2.761v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"/></svg>');
        var title = document.createElement("h2");
        title.insertAdjacentHTML("beforeend", posts[0]);
        var tilelink = document.createElement("a");
        $(tilelink).attr("onclick", "gotopage('id'," + posts[3] + " )");
        tilelink.append(title);
        var date = document.createElement("p");
        date.className = "post_date";
        date.append(posts[1]);
        var content = posts[2];
        if (content.match(bloglink) != null) {
            do {
                var cdat = content.match(bloglink);
                content = content.replace(bloglink, "onclick=\"" + "gotopage('id'," + cdat[0].split("/")[6] + " )")
            }
            while (content.match(bloglink) != null)
        }
        if (content.match(scriptregx) != null) {
            do {
                content = content.replace(scriptregx, "");
            }
            while (content.match(scriptregx) != null)
        }
        if (content.match(stylergx) != null) {
            do {
                content = content.replace(stylergx, "");
            }
            while (content.match(stylergx) != null)
        }
        content = content.replaceAll("&#8211;", "-");
        content = content.replaceAll("new.blog.counter-strike.net", "blog.counter-strike.net");
        element.append(tilelink);
        element.append(date);
        element.insertAdjacentHTML("beforeend", content);
        $(element).find("a").attr("target", "_blank");
        $(element).children().children().children(".picslide").children().attr("style", "pointer-events: none");
        $(element).children().children().children(".picslide").children().hide();
        $(element).children().children().children(".picslide").each(function(index, el1) {
            $(el1).children().first().show();
        });
        shares.append(tweet);
        shares.append(reddit);
        shares.append(facebook);
        shares.append(telegram);
        shares.append(share);
        element.append(shares);
        if (i != z) { element.append(feedseparator); }
        i = i + 1;
    }
    while (i <= z)
}


function writeupdates(call) {
    //loads updates https://blog.counter-strike.net/LANG/index.php/category/updates/page/1/
    var element = document.getElementsByClassName("R")[0].children[1].children[0];
    $(element).html("");
    $(element).scrollTop(0);
    var i = 0;
    var z = call.length - 1;
    do {
        var posts = parseposts(call, i);
        var shares = document.createElement("div");
        shares.className = "shares";
        var share = document.createElement("div");
        share.classList.add("sicons", "clipboard", "tooltip-container");
        $(share).attr("onclick", "copyToClipboard('" +  "https://csbt.cc/" + "?id=" + posts[3] + "')");
        $(share).append("<span class='material-icons'>link</span><div class='url-tooltip'>" + getlang()[0][39] + "</div>");
        var tweet = document.createElement("a");
        $(tweet).attr("target", "_blank");
        $(tweet).attr("href", "https://twitter.com/intent/tweet?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&text=" + posts[0].replaceAll(" ", "+"));
        $(tweet).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Twitter" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm18.862 9.237c.208 4.617-3.235 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.079-4.03 3.198-4.03.944 0 1.797.398 2.396 1.037.748-.147 1.451-.42 2.085-.796-.245.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.44.656-.997 1.234-1.638 1.697z"/></svg>');
        var reddit = document.createElement("a");
        $(reddit).attr("target", "_blank");
        $(reddit).attr("href", "https://reddit.com/submit?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&title=" + posts[0].replaceAll(" ", "+"));
        $(reddit).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Reddit" viewBox="0 0 24 24"><path d="M14.558 15.827c.097.096.097.253 0 .349-.531.529-1.365.786-2.549.786l-.009-.002-.009.002c-1.185 0-2.018-.257-2.549-.786-.097-.096-.097-.253 0-.349.096-.096.254-.096.351 0 .433.431 1.152.641 2.199.641l.009.002.009-.002c1.046 0 1.765-.21 2.199-.641.095-.097.252-.097.349 0zm-.126-3.814c-.581 0-1.054.471-1.054 1.05 0 .579.473 1.049 1.054 1.049.581 0 1.054-.471 1.054-1.049 0-.579-.473-1.05-1.054-1.05zm9.568-12.013v24h-24v-24h24zm-4 11.853c0-.972-.795-1.764-1.772-1.764-.477 0-.908.191-1.227.497-1.207-.794-2.84-1.299-4.647-1.364l.989-3.113 2.677.628-.004.039c0 .795.65 1.442 1.449 1.442.798 0 1.448-.647 1.448-1.442 0-.795-.65-1.442-1.448-1.442-.613 0-1.136.383-1.347.919l-2.886-.676c-.126-.031-.254.042-.293.166l-1.103 3.471c-1.892.023-3.606.532-4.867 1.35-.316-.292-.736-.474-1.2-.474-.975-.001-1.769.79-1.769 1.763 0 .647.355 1.207.878 1.514-.034.188-.057.378-.057.572 0 2.607 3.206 4.728 7.146 4.728 3.941 0 7.146-2.121 7.146-4.728 0-.183-.019-.362-.05-.54.555-.299.937-.876.937-1.546zm-9.374 1.21c0-.579-.473-1.05-1.054-1.05-.581 0-1.055.471-1.055 1.05 0 .579.473 1.049 1.055 1.049.581.001 1.054-.47 1.054-1.049z"/></svg>');
        var telegram = document.createElement("a");
        $(telegram).attr("target", "_blank");
        $(telegram).attr("href", "https://t.me/share/url?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&text=" + posts[0].replaceAll(" ", "+"));
        $(telegram).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Telegram" viewBox="0 0 24 24"><path d="M0,0V24H23.81V0ZM18,17c-.2,1.06-.59,1.42-1,1.46-.83.07-1.46-.55-2.26-1.08-1.25-.82-2-1.33-3.18-2.13-1.41-.93-.49-1.44.31-2.27.21-.22,3.85-3.54,3.92-3.84a.29.29,0,0,0-.06-.25.35.35,0,0,0-.3,0c-.12,0-2.13,1.35-6,4a2.65,2.65,0,0,1-1.54.58,10.61,10.61,0,0,1-2.22-.53c-.89-.29-1.6-.44-1.54-.93,0-.26.39-.52,1.06-.79q6.24-2.71,8.31-3.58c4-1.65,4.78-1.93,5.32-1.94a1,1,0,0,1,.55.16.64.64,0,0,1,.2.39,2.63,2.63,0,0,1,0,.56C19.42,9,18.49,14.42,18,17Z"/></svg>');
        var facebook = document.createElement("a");
        $(facebook).attr("target", "_blank");
        $(facebook).attr("href", "https://facebook.com/sharer/sharer.php?u=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3]);
        $(facebook).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Facebook" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm16 7h-1.923c-.616 0-1.077.252-1.077.889v1.111h3l-.239 3h-2.761v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"/></svg>');
        var feedseparator = document.createElement("div");
        feedseparator.className = "feedseparator";
        var title = document.createElement("h2");
        title.insertAdjacentHTML("beforeend", posts[0]);
        var tilelink = document.createElement("a");
        $(tilelink).attr("onclick", "gotopage('id'," + posts[3] + " )");
        tilelink.append(title);
        var date = document.createElement("p");
        date.className = "post_date";
        var content = posts[2];
        content = content.replaceAll(String.fromCharCode(160), "");
        content = content.replaceAll("&#8211;", "-");
        content = content.replaceAll("new.blog.counter-strike.net", "blog.counter-strike.net");
        if (content.match(bloglink) != null) {
            do {
                var cdat = content.match(bloglink);
                content = content.replace(bloglink, "onclick=\"" + "gotopage('id'," + cdat[0].split("/")[6] + " )")
            }
            while (content.match(bloglink) != null)
        }
        if (content.match(scriptregx) != null) {
            do {
                content = content.replace(scriptregx, "");
            }
            while (content.match(scriptregx) != null)
        }
        if (content.match(rx) != null) {
            do {
                var cdat = content.match(rx);
                var updatetitle = document.createElement("span");
                updatetitle.className = "feedupdate";
                updatetitle.append(cdat[0].replace("[", "").replace("]", ""));
                content = content.replace(rx, updatetitle.outerHTML);
            }
            while (content.match(rx) != null)
        }
        date.append(posts[1]);
        element.append(tilelink);
        element.append(date);
        element.insertAdjacentHTML("beforeend", content);
        shares.append(tweet);
        shares.append(reddit);
        shares.append(facebook);
        shares.append(telegram);
        shares.append(share);
        element.append(shares);
        if (i != z) { element.append(feedseparator); }
        i = i + 1;
    }
    while (i <= z)
}

function writeblog(call) {
    //loads a single blog https://blog.counter-strike.net/LANG/index.php?p=33688
    var element = document.getElementsByClassName("B")[0].children[1].children[0];
    var posts = parsepost(call);
    $(element).html("");
    $(element).scrollTop(0);
    var shares = document.createElement("div");
    shares.className = "shares";
    var share = document.createElement("div");
    share.classList.add("sicons", "clipboard", "tooltip-container");
    $(share).attr("onclick", "copyToClipboard('" +  "https://csbt.cc/" + "?id=" + posts[3] + "')");
    $(share).append("<span class='material-icons'>link</span><div class='url-tooltip'>" + getlang()[0][39] + "</div>");
    var tweet = document.createElement("a");
    $(tweet).attr("target", "_blank");
    $(tweet).attr("href", "https://twitter.com/intent/tweet?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&text=" + posts[0].replaceAll(" ", "+"));
    $(tweet).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Twitter" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm18.862 9.237c.208 4.617-3.235 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.079-4.03 3.198-4.03.944 0 1.797.398 2.396 1.037.748-.147 1.451-.42 2.085-.796-.245.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.44.656-.997 1.234-1.638 1.697z"/></svg>');
    var reddit = document.createElement("a");
    $(reddit).attr("target", "_blank");
    $(reddit).attr("href", "https://reddit.com/submit?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&title=" + posts[0].replaceAll(" ", "+"));
    $(reddit).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Reddit" viewBox="0 0 24 24"><path d="M14.558 15.827c.097.096.097.253 0 .349-.531.529-1.365.786-2.549.786l-.009-.002-.009.002c-1.185 0-2.018-.257-2.549-.786-.097-.096-.097-.253 0-.349.096-.096.254-.096.351 0 .433.431 1.152.641 2.199.641l.009.002.009-.002c1.046 0 1.765-.21 2.199-.641.095-.097.252-.097.349 0zm-.126-3.814c-.581 0-1.054.471-1.054 1.05 0 .579.473 1.049 1.054 1.049.581 0 1.054-.471 1.054-1.049 0-.579-.473-1.05-1.054-1.05zm9.568-12.013v24h-24v-24h24zm-4 11.853c0-.972-.795-1.764-1.772-1.764-.477 0-.908.191-1.227.497-1.207-.794-2.84-1.299-4.647-1.364l.989-3.113 2.677.628-.004.039c0 .795.65 1.442 1.449 1.442.798 0 1.448-.647 1.448-1.442 0-.795-.65-1.442-1.448-1.442-.613 0-1.136.383-1.347.919l-2.886-.676c-.126-.031-.254.042-.293.166l-1.103 3.471c-1.892.023-3.606.532-4.867 1.35-.316-.292-.736-.474-1.2-.474-.975-.001-1.769.79-1.769 1.763 0 .647.355 1.207.878 1.514-.034.188-.057.378-.057.572 0 2.607 3.206 4.728 7.146 4.728 3.941 0 7.146-2.121 7.146-4.728 0-.183-.019-.362-.05-.54.555-.299.937-.876.937-1.546zm-9.374 1.21c0-.579-.473-1.05-1.054-1.05-.581 0-1.055.471-1.055 1.05 0 .579.473 1.049 1.055 1.049.581.001 1.054-.47 1.054-1.049z"/></svg>');
    var telegram = document.createElement("a");
    $(telegram).attr("target", "_blank");
    $(telegram).attr("href", "https://t.me/share/url?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&text=" + posts[0].replaceAll(" ", "+"));
    $(telegram).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Telegram" viewBox="0 0 24 24"><path d="M0,0V24H23.81V0ZM18,17c-.2,1.06-.59,1.42-1,1.46-.83.07-1.46-.55-2.26-1.08-1.25-.82-2-1.33-3.18-2.13-1.41-.93-.49-1.44.31-2.27.21-.22,3.85-3.54,3.92-3.84a.29.29,0,0,0-.06-.25.35.35,0,0,0-.3,0c-.12,0-2.13,1.35-6,4a2.65,2.65,0,0,1-1.54.58,10.61,10.61,0,0,1-2.22-.53c-.89-.29-1.6-.44-1.54-.93,0-.26.39-.52,1.06-.79q6.24-2.71,8.31-3.58c4-1.65,4.78-1.93,5.32-1.94a1,1,0,0,1,.55.16.64.64,0,0,1,.2.39,2.63,2.63,0,0,1,0,.56C19.42,9,18.49,14.42,18,17Z"/></svg>');
    var facebook = document.createElement("a");
    $(facebook).attr("target", "_blank");
    $(facebook).attr("href", "https://facebook.com/sharer/sharer.php?u=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3]);
    $(facebook).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Facebook" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm16 7h-1.923c-.616 0-1.077.252-1.077.889v1.111h3l-.239 3h-2.761v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"/></svg>');
    var title = document.createElement("h2");
    title.insertAdjacentHTML("beforeend", posts[0]);
    var date = document.createElement("p");
    date.className = "post_date";
    date.append(posts[1]);
    var content = posts[2];
    content = content.replaceAll("&#8211;", "-");
    content = content.replaceAll("new.blog.counter-strike.net", "blog.counter-strike.net");
    if (content.match(bloglink) != null) {
        do {
            var cdat = content.match(bloglink);
            content = content.replace(bloglink, "onclick=\"" + "gotopage('id'," + cdat[0].split("/")[6] + " )")
        }
        while (content.match(bloglink) != null)
    }
    if (content.match(scriptregx) != null) {
        do {
            content = content.replace(scriptregx, "");
        }
        while (content.match(scriptregx) != null)
    }
    if (content.match(stylergx) != null) {
        do {
            content = content.replace(stylergx, "");
        }
        while (content.match(stylergx) != null)
    }
    element.append(title);
    element.append(date);
    element.insertAdjacentHTML("beforeend", content);
    shares.append(tweet);
    shares.append(reddit);
    shares.append(facebook);
    shares.append(telegram);
    shares.append(share);
    element.append(shares);
    $(element).find("a").attr("target", "_blank");
    $(element).children().children().children(".picslide").children().attr("style", "pointer-events: none");
    $(element).children().children().children(".picslide").children().hide();
    $(element).children().children().children(".picslide").each(function(index, el1) {
        $(el1).children().first().show();
    });
}

function writeupdate(call) {
    //loads a single update  https://blog.counter-strike.net/LANG/index.php?p=33160
    var element = document.getElementsByClassName("R")[0].children[1].children[0];
    var posts = parsepost(call);
    $(element).html("");
    $(element).scrollTop(0);
    var shares = document.createElement("div");
    shares.className = "shares";
    var share = document.createElement("div");
    share.classList.add("sicons", "clipboard", "tooltip-container");
    $(share).attr("onclick", "copyToClipboard('" +  "https://csbt.cc/" + "?id=" + posts[3] + "')");
    $(share).append("<span class='material-icons'>link</span><div class='url-tooltip'>" + getlang()[0][39] + "</div>");
    var tweet = document.createElement("a");
    $(tweet).attr("target", "_blank");
    $(tweet).attr("href", "https://twitter.com/intent/tweet?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&text=" + posts[0].replaceAll(" ", "+"));
    $(tweet).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Twitter" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm18.862 9.237c.208 4.617-3.235 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.079-4.03 3.198-4.03.944 0 1.797.398 2.396 1.037.748-.147 1.451-.42 2.085-.796-.245.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.44.656-.997 1.234-1.638 1.697z"/></svg>');
    var reddit = document.createElement("a");
    $(reddit).attr("target", "_blank");
    $(reddit).attr("href", "https://reddit.com/submit?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&title=" + posts[0].replaceAll(" ", "+"));
    $(reddit).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Reddit" viewBox="0 0 24 24"><path d="M14.558 15.827c.097.096.097.253 0 .349-.531.529-1.365.786-2.549.786l-.009-.002-.009.002c-1.185 0-2.018-.257-2.549-.786-.097-.096-.097-.253 0-.349.096-.096.254-.096.351 0 .433.431 1.152.641 2.199.641l.009.002.009-.002c1.046 0 1.765-.21 2.199-.641.095-.097.252-.097.349 0zm-.126-3.814c-.581 0-1.054.471-1.054 1.05 0 .579.473 1.049 1.054 1.049.581 0 1.054-.471 1.054-1.049 0-.579-.473-1.05-1.054-1.05zm9.568-12.013v24h-24v-24h24zm-4 11.853c0-.972-.795-1.764-1.772-1.764-.477 0-.908.191-1.227.497-1.207-.794-2.84-1.299-4.647-1.364l.989-3.113 2.677.628-.004.039c0 .795.65 1.442 1.449 1.442.798 0 1.448-.647 1.448-1.442 0-.795-.65-1.442-1.448-1.442-.613 0-1.136.383-1.347.919l-2.886-.676c-.126-.031-.254.042-.293.166l-1.103 3.471c-1.892.023-3.606.532-4.867 1.35-.316-.292-.736-.474-1.2-.474-.975-.001-1.769.79-1.769 1.763 0 .647.355 1.207.878 1.514-.034.188-.057.378-.057.572 0 2.607 3.206 4.728 7.146 4.728 3.941 0 7.146-2.121 7.146-4.728 0-.183-.019-.362-.05-.54.555-.299.937-.876.937-1.546zm-9.374 1.21c0-.579-.473-1.05-1.054-1.05-.581 0-1.055.471-1.055 1.05 0 .579.473 1.049 1.055 1.049.581.001 1.054-.47 1.054-1.049z"/></svg>');
    var telegram = document.createElement("a");
    $(telegram).attr("target", "_blank");
    $(telegram).attr("href", "https://t.me/share/url?url=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3] + "&text=" + posts[0].replaceAll(" ", "+"));
    $(telegram).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Telegram" viewBox="0 0 24 24"><path d="M0,0V24H23.81V0ZM18,17c-.2,1.06-.59,1.42-1,1.46-.83.07-1.46-.55-2.26-1.08-1.25-.82-2-1.33-3.18-2.13-1.41-.93-.49-1.44.31-2.27.21-.22,3.85-3.54,3.92-3.84a.29.29,0,0,0-.06-.25.35.35,0,0,0-.3,0c-.12,0-2.13,1.35-6,4a2.65,2.65,0,0,1-1.54.58,10.61,10.61,0,0,1-2.22-.53c-.89-.29-1.6-.44-1.54-.93,0-.26.39-.52,1.06-.79q6.24-2.71,8.31-3.58c4-1.65,4.78-1.93,5.32-1.94a1,1,0,0,1,.55.16.64.64,0,0,1,.2.39,2.63,2.63,0,0,1,0,.56C19.42,9,18.49,14.42,18,17Z"/></svg>');
    var facebook = document.createElement("a");
    $(facebook).attr("target", "_blank");
    $(facebook).attr("href", "https://facebook.com/sharer/sharer.php?u=" + "https%3A%2F%2Fcsbt.cc%2F" + "%3Fid%3D" + posts[3]);
    $(facebook).append('<svg class="sicons" xmlns="http://w3.org/2000/svg" alt="Facebook" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm16 7h-1.923c-.616 0-1.077.252-1.077.889v1.111h3l-.239 3h-2.761v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"/></svg>');
    var title = document.createElement("h2");
    title.insertAdjacentHTML("beforeend", posts[0]);
    var tilelink = document.createElement("a");
    tilelink.append(title);
    var date = document.createElement("p");
    date.className = "post_date";
    var content = posts[2];
    content = content.replaceAll(String.fromCharCode(160), "");
    content = content.replaceAll("&#8211;", "-");
    content = content.replaceAll("new.blog.counter-strike.net", "blog.counter-strike.net");
    if (content.match(bloglink) != null) {
        do {
            var cdat = content.match(bloglink);
            content = content.replace(bloglink, "onclick=\"" + "gotopage('id'," + cdat[0].split("/")[6] + " )")
        }
        while (content.match(bloglink) != null)
    }
    if (content.match(scriptregx) != null) {
        do {
            content = content.replace(scriptregx, "");
        }
        while (content.match(scriptregx) != null)
    }
    if (content.match(rx) != null) {
        do {
            var cdat = content.match(rx);
            var updatetitle = document.createElement("span");
            updatetitle.className = "feedupdate";
            updatetitle.append(cdat[0].replace("[", "").replace("]", ""));
            content = content.replace(rx, updatetitle.outerHTML);
        }
        while (content.match(rx) != null)
    }
    //content = content.replace(/<br\s*[\/]?>/gi, "");
    date.append(posts[1]);
    element.append(tilelink);
    element.append(date);
    element.insertAdjacentHTML("beforeend", content);
    shares.append(tweet);
    shares.append(reddit);
    shares.append(facebook);
    shares.append(telegram);
    shares.append(share);
    element.append(shares);
}