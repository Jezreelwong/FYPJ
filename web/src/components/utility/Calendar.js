// https://codepen.io/jenniferperrin/pen/IAhKv
import $ from "jquery";

function Calendar() {
    function c(passed_month, passed_year, calNum) {
        var calendar = calNum === 0 ? calendars.cal1 : calendars.cal2;
        makeWeek(calendar.weekline);
        calendar.datesBody.empty();
        var calMonthArray = makeMonthArray(passed_month, passed_year);
        var r = 0;
        var u = false;
        while (!u) {
            if (daysArray[r] === calMonthArray[0].weekday) {
                u = true
            } else {
                calendar.datesBody.append('<div class="blank"></div>');
                r++;
            }
        }
        for (var cell = 0; cell < 42 - r; cell++) { // 42 date-cells in calendar
            if (cell >= calMonthArray.length) {
                calendar.datesBody.append('<div class="blank"></div>');
            } else {
                var shownDate = calMonthArray[cell].day;
                var iter_date = new Date(passed_year, passed_month, shownDate);
                var m = "";
                if (
                (
                (shownDate !== today.getDate() && passed_month === today.getMonth()) || passed_month !== today.getMonth()) && iter_date < today) {
                    m = '<div class="past-date">';
                } else {
                    m = checkToday(iter_date) ? '<div class="today">' : "<div>";
                }
                calendar.datesBody.append(m + shownDate + "</div>");
            }
        }

        var color = "#444444";
        calendar.calHeader.find("h2").text(i[passed_month] + " " + passed_year);
        calendar.weekline.find("div").css("color", color);

        // find elements (dates) to be clicked on each time
        // the calendar is generated
        var clicked = false;
        selectDates(selected);

        clickedElement = calendar.datesBody.find('div');
        clickedElement.on("click", function () {
            clicked = $(this);
            //var whichCalendar = calendar.name;
            var firstClickDateObj = "";
            var secondClickDateObj = "";
            if (firstClick && secondClick) {
                thirdClicked = getClickedInfo(clicked, calendar);
                firstClickDateObj = new Date(firstClicked.year,
                firstClicked.month,
                firstClicked.date);
                secondClickDateObj = new Date(secondClicked.year,
                secondClicked.month,
                secondClicked.date);
                var thirdClickDateObj = new Date(thirdClicked.year,
                thirdClicked.month,
                thirdClicked.date);
                if (secondClickDateObj > thirdClickDateObj && thirdClickDateObj > firstClickDateObj) {
                    secondClicked = thirdClicked;
                    // then choose dates again from the start :)
                    bothCals.find(".calendar_content").find("div").each(function () {
                        $(this).removeClass("selected");
                        $(this).removeClass("clicked");
                    });
                    selected = {};
                    selected[firstClicked.year] = {};
                    selected[firstClicked.year][firstClicked.month] = [firstClicked.date];
                    selected = addChosenDates(firstClicked, secondClicked, selected);
                } else { // reset clicks
                    selected = {};
                    firstClicked = [];
                    secondClicked = [];
                    firstClick = false;
                    secondClick = false;
                    bothCals.find(".calendar_content").find("div").each(function () {
                        $(this).removeClass("selected");
                        $(this).removeClass("clicked");
                    });
                }
            }
            if (!firstClick) {
                firstClick = true;
                firstClicked = getClickedInfo(clicked, calendar);
                selected[firstClicked.year] = {};
                selected[firstClicked.year][firstClicked.month] = [firstClicked.date];
            } else {
                secondClick = true;
                secondClicked = getClickedInfo(clicked, calendar);

                // what if second clicked date is before the first clicked?
                firstClickDateObj = new Date(firstClicked.year,
                firstClicked.month,
                firstClicked.date);
                secondClickDateObj = new Date(secondClicked.year,
                secondClicked.month,
                secondClicked.date);

                if (firstClickDateObj > secondClickDateObj) {

                    var cachedClickedInfo = secondClicked;
                    secondClicked = firstClicked;
                    firstClicked = cachedClickedInfo;
                    selected = {};
                    selected[firstClicked.year] = {};
                    selected[firstClicked.year][firstClicked.month] = [firstClicked.date];

                } else if (firstClickDateObj.getTime() === secondClickDateObj.getTime()) {
                    selected = {};
                    firstClicked = [];
                    secondClicked = [];
                    firstClick = false;
                    secondClick = false;
                    $(this).removeClass("selected");
                    $(this).removeClass("clicked");
                }
                // add between dates to [selected]
                selected = addChosenDates(firstClicked, secondClicked, selected);
            }
            if(document.getElementById("bookingSelectedDates") !== null){
                let bookingElement = document.getElementById("bookingSelectedDates");
                if(Object.keys(selected).length !== 0){
                    let startYear = Object.keys(selected)[0];
                    let startMonth = Object.keys(selected[startYear])[0];
                    let startDate = selected[startYear][startMonth][0];
                    let endYear = Object.keys(selected)[Object.keys(selected).length - 1];
                    let endMonth = Object.keys(selected[endYear])[Object.keys(selected[endYear]).length - 1];
                    
                    let len = Object.keys(selected[endYear][endMonth]).length;
                    let endDate = selected[endYear][endMonth][len - 1];

                    //let endDate = selected[endYear][endMonth][selected[startYear][endMonth].length];
                        
                    bookingElement.setAttribute("data-startdate", startYear + "-" + formatIfLT10(parseInt(startMonth) + 1) + "-" + formatIfLT10(startDate));
                    bookingElement.setAttribute("data-enddate", endYear + "-" + formatIfLT10(parseInt(endMonth) + 1) + "-" + formatIfLT10(endDate));
                    bookingElement.click();
                }
                else{
                    bookingElement.setAttribute("data-startdate", "");
                    bookingElement.setAttribute("data-enddate", "");
                    bookingElement.click();
                }
            }
            selectDates(selected);
        });

    }

    function formatIfLT10(value){
        let newValue = value;
        if (parseInt(value) < 10)
            newValue = "0" + value;
        return newValue;
    }

    function selectDates(selected) {
        if (!$.isEmptyObject(selected)) {
            var dateElements1 = datesBody1.find('div');
            var dateElements2 = datesBody2.find('div');

            function highlightDates(passed_year, passed_month, dateElements) {
                if (passed_year in selected && passed_month in selected[passed_year]) {
                    let firstSelectedYear = parseInt(Object.keys(selected)[0]);
                    let firstSelectedMonth = parseInt(Object.keys(selected[firstSelectedYear])[0]);
                    let lastSelectedYear = parseInt(Object.keys(selected)[Object.keys(selected).length - 1]);
                    let lastSelectedMonth = parseInt(Object.keys(selected[lastSelectedYear])[Object.keys(selected[lastSelectedYear]).length - 1]);
                    var daysToCompare = selected[passed_year][passed_month];
                    for (let d in daysToCompare) {
                        dateElements.each(function () {
                            if(parseInt($(this).text()) === selected[firstSelectedYear][firstSelectedMonth][0] && passed_year === firstSelectedYear && passed_month === firstSelectedMonth){
                                $(this).addClass('clicked');
                            }
                            if(parseInt($(this).text()) === selected[lastSelectedYear][lastSelectedMonth][daysToCompare.length-1] && passed_year === lastSelectedYear && passed_month === lastSelectedMonth){
                                $(this).addClass('clicked');
                            }
                            if (parseInt($(this).text()) === daysToCompare[d]) {
                                $(this).addClass('selected');
                            }
                        });
                    }
                }
            }

            highlightDates(year, month, dateElements1);
            highlightDates(nextYear, nextMonth, dateElements2);
        }
    }

    function makeMonthArray(passed_month, passed_year) { // creates Array specifying dates and weekdays
        var e = [];
        for (var r = 1; r < getDaysInMonth(passed_year, passed_month) + 1; r++) {
            e.push({
                day: r,
                // Later refactor -- weekday needed only for first week
                weekday: daysArray[getWeekdayNum(passed_year, passed_month, r)]
            });
        }
        return e;
    }

    function makeWeek(week) {
        week.empty();
        for (var e = 0; e < 7; e++) {
            week.append("<div>" + daysArray[e].substring(0, 3) + "</div>")
        }
    }

    function getDaysInMonth(currentYear, currentMon) {
        return (new Date(currentYear, currentMon + 1, 0)).getDate();
    }

    function getWeekdayNum(e, t, n) {
        return (new Date(e, t, n)).getDay();
    }

    function checkToday(e) {
        var todayDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var checkingDate = e.getFullYear() + '/' + (e.getMonth() + 1) + '/' + e.getDate();
        return todayDate === checkingDate;
    }

    function getAdjacentMonth(curr_month, curr_year, direction) {
        var theNextMonth;
        var theNextYear;
        if (direction === "next") {
            theNextMonth = (curr_month + 1) % 12;
            theNextYear = (curr_month === 11) ? curr_year + 1 : curr_year;
        } else {
            theNextMonth = (curr_month === 0) ? 11 : curr_month - 1;
            theNextYear = (curr_month === 0) ? curr_year - 1 : curr_year;
        }
        return [theNextMonth, theNextYear];
    }

    function b() {
        today = new Date();
        year = today.getFullYear();
        month = today.getMonth();
        var nextDates = getAdjacentMonth(month, year, "next");
        nextMonth = nextDates[0];
        nextYear = nextDates[1];
    }

    //var e = 480;

    var today;
    var year,
    month,
    nextMonth,
    nextYear;

    //var r = [];
    var i = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER"];
    var daysArray = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"];

    var cal1 = $("#calendar_first");
    var calHeader1 = cal1.find(".calendar_header");
    var weekline1 = cal1.find(".calendar_weekdays");
    var datesBody1 = cal1.find(".calendar_content");

    var cal2 = $("#calendar_second");
    var calHeader2 = cal2.find(".calendar_header");
    var weekline2 = cal2.find(".calendar_weekdays");
    var datesBody2 = cal2.find(".calendar_content");

    var bothCals = $(".calendar");

    var switchButton = bothCals.find(".calendar_header").find('.switch-month');

    var calendars = {
        "cal1": {
            "name": "first",
                "calHeader": calHeader1,
                "weekline": weekline1,
                "datesBody": datesBody1
        },
            "cal2": {
            "name": "second",
                "calHeader": calHeader2,
                "weekline": weekline2,
                "datesBody": datesBody2
        }
    }


    var clickedElement;
    var firstClicked,
    secondClicked,
    thirdClicked;
    var firstClick = false;
    var secondClick = false;
    var selected = {};

    b();
    c(month, year, 0);
    c(nextMonth, nextYear, 1);
    switchButton.on("click", function () {
        var clicked = $(this);
        var generateCalendars = function (e) {
            var nextDatesFirst = getAdjacentMonth(month, year, e);
            var nextDatesSecond = getAdjacentMonth(nextMonth, nextYear, e);
            month = nextDatesFirst[0];
            year = nextDatesFirst[1];
            nextMonth = nextDatesSecond[0];
            nextYear = nextDatesSecond[1];

            c(month, year, 0);
            c(nextMonth, nextYear, 1);
        };
        if (clicked.attr("class").indexOf("left") !== -1) {
            generateCalendars("previous");
        } else {
            generateCalendars("next");
        }
        clickedElement = bothCals.find(".calendar_content").find("div");
    });


    //  Click picking stuff
    function getClickedInfo(element, calendar) {
        var clickedInfo = {};
        var clickedCalendar,
        clickedMonth,
        clickedYear;
        clickedCalendar = calendar.name;
        clickedMonth = clickedCalendar === "first" ? month : nextMonth;
        clickedYear = clickedCalendar === "first" ? year : nextYear;
        clickedInfo = {
            "calNum": clickedCalendar,
                "date": parseInt(element.text()),
                "month": clickedMonth,
                "year": clickedYear
        }
        return clickedInfo;
    }


    // Finding between dates MADNESS. Needs refactoring and smartening up :)
    function addChosenDates(firstClicked, secondClicked, selected) {
        if (secondClicked.date > firstClicked.date || secondClicked.month > firstClicked.month || secondClicked.year > firstClicked.year) {

            var added_year = secondClicked.year;
            var added_month = secondClicked.month;
            var added_date = secondClicked.date;

            if (added_year > firstClicked.year) {
                // first add all dates from all months of Second-Clicked-Year
                selected[added_year] = {};
                selected[added_year][added_month] = [];
                for (var i = 1;
                i <= secondClicked.date;
                i++) {
                    selected[added_year][added_month].push(i);
                }

                added_month = added_month - 1;
                while (added_month >= 0) {
                    selected[added_year][added_month] = [];
                    for (var v = 1;
                    v <= getDaysInMonth(added_year, added_month);
                    v++) {
                        selected[added_year][added_month].push(v);
                    }
                    added_month = added_month - 1;
                }

                added_year = added_year - 1;
                added_month = 11; // reset month to Dec because we decreased year
                added_date = getDaysInMonth(added_year, added_month); // reset date as well

                // Now add all dates from all months of inbetween years
                while (added_year > firstClicked.year) {
                    selected[added_year] = {};
                    for (var j = 0; j < 12; j++) {
                        selected[added_year][j] = [];
                        for (var d = 1; d <= getDaysInMonth(added_year, j); d++) {
                            selected[added_year][j].push(d);
                        }
                    }
                    added_year = added_year - 1;
                }
            }

            if (added_month > firstClicked.month) {
                if (firstClicked.year === secondClicked.year) {
                    selected[added_year][added_month] = [];
                    for (var k = 1;
                    k <= secondClicked.date;
                    k++) {
                        selected[added_year][added_month].push(k);
                    }
                    added_month = added_month - 1;
                }
                while (added_month > firstClicked.month) {
                    selected[added_year][added_month] = [];
                    for (var l = 1;
                    l <= getDaysInMonth(added_year, added_month);
                    l++) {
                        selected[added_year][added_month].push(l);
                    }
                    added_month = added_month - 1;
                }
                added_date = getDaysInMonth(added_year, added_month);
            }

            for (var n = firstClicked.date + 1;
            n <= added_date;
            n++) {
                selected[added_year][added_month].push(n);
            }
        }
        return selected;
    }
};

export default Calendar;