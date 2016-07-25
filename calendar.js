var Calendar = {
    today: new Date(),
    calendarList: false,
    mobileSafari: null,
    timeout: null,
    months: new Array('January','February','March','April','May','June','July','August','September','October','November','December'),
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    events: dummyData(),
    initialize: function () {
        var date = new Date();
        var Events = Calendar.getThisMonthsEvents();
        if (Calendar.calendarList) {
            calendarList(date, Events);
        }
        else {
            calendar(date, Events);
        }
        Calendar.attachEventHandlers();
    },
    getThisMonthsEvents: function() {        
        if (Calendar.events != undefined) {
            var Events = Calendar.events.Years[Calendar.selectedYear][Calendar.months[Calendar.selectedMonth]];
            return Events;
        } else {
            return null;
        }
    },
    backMonth: function () {
        if(Calendar.selectedMonth == 0) {
            Calendar.selectedMonth = 11;
            Calendar.selectedYear = 2014
        } else {
            Calendar.selectedMonth--;
        }
        
        var date = new Date(Calendar.selectedYear, Calendar.selectedMonth, 1);
        var Events = Calendar.getThisMonthsEvents();        
        if (Calendar.calendarList) {
            calendarList(date, Events);
        }
        else {
            calendar(date, Events);
        }
        Calendar.attachEventHandler();
    },
    fowardMonth: function() {   
        if(Calendar.selectedMonth == 11) {
            Calendar.selectedMonth = 0;
            Calendar.selectedYear = 2015
        } else {
            Calendar.selectedMonth += 1;
        }
        
        var date = new Date(Calendar.selectedYear, Calendar.selectedMonth, 1);
        var Events = Calendar.getThisMonthsEvents();        
        if (Calendar.calendarList) {
            calendarList(date, Events);
        }
        else {
            calendar(date, Events);
        }
        Calendar.attachEventHandler();
    },
    overlayEvents: function(selectedDay) {
        var events = Calendar.getThisMonthsEvents();
        var overlayhtml = '<div class="eventsHeader"><h2>'
                            + selectedDay + " " + Calendar.months[Calendar.selectedMonth] + " " 
                            + Calendar.selectedYear+'</div></h2><div class="eventsBox">';
        var check = false;
        _.each(events, 
            function(e) {
                if (new Date(e.Date).getDate() == selectedDay ) {
                    check = true;
                    overlayhtml += '<div><h3>'+e.Name+'</h3>' 
                    + '<div>Start Time: ' + e.StartTime 
                    +'</div><div>End Time: ' + e.EndTime+'</div>'
                    +'<div class="eventDescription">' + e.Description +  '</div></div>';    
                }          
            }
        );
        overlayhtml += '</div>';
        if ( check ) {
            $(".overlayContent").html(overlayhtml); 
            Calendar.doOverlayOpen();
        }
    },
    isOpen: false,
    showOverlayBox: function() {
        if( Calendar.isOpen == false ) return;
        $('.overlayBox').css({
            display:'block',
            left:( $(window).width() - $('.overlayBox').width() ) / 2,
            top:( $(window).height() - $('.overlayBox').height() ) / 2 -12,
            position:'fixed'
        });
        $('.bgCover').css({
            display:'block',
            width: $(window).width(),
            height:$(window).height() + 70,
        });
    },
    doOverlayOpen: function() {
        Calendar.isOpen = true;
        Calendar.showOverlayBox();
        $('.bgCover').css({opacity:0}).animate( {opacity:0.5, backgroundColor:'#000'} );
        return false;
    },
    doOverlayClose: function () {
        Calendar.isOpen = false;
        $('.overlayBox').css( 'display', 'none' );
        $('.bgCover').animate( {opacity:0}, null, null, function() { $(this).hide(); } );
    },
    doneResizing: function() {
        if ($(window).width() < 600 && !Calendar.calendarList) {
            Calendar.calendarList = true;
            Calendar.initialize();
        } else if ($(window).width() > 600 && Calendar.calendarList) {
            Calendar.calendarList = false;
            Calendar.initialize();
        }
    },
    getIcon: function (icon_name) {
        switch (icon_name) {
            case "christmas": 
                return '<div class="christmas_icon"></div>';
                break;
            
//            case "youth_icon":
//                return '<div class="youth_icon"></div>'
//                break;
//                
//            case "church_icon":
//                return '<div class="church_icon"></div>'
//                break;
                
            default:
                return '<div></div>';
        }
    },
    openContactOverlay: function() {
         
        var leadersDets = leadersDetails();
        var overlayhtml = '<div class="eventsHeader"><h2>Contact Details</h2></div><div class="leaderBox">';
        
        _.each(leadersDets, function(l){
            overlayhtml += '<div class="leader"><h5>' + l.Name + '</h5><div>' + l.Phone + '</div><div>' + l.Email + '</div></div>'
        })
        overlayhtml += '</div>';
        
        $(".overlayContent").html(overlayhtml); 
        Calendar.doOverlayOpen();
        
    },
    attachEventHandler: function () {
        $("td").click(function(ele){
            Calendar.overlayEvents($(this).attr('data-day'));
        });
    },
    attachEventHandlers: function () {
        $("#fowardMonth").click(function(){
            Calendar.fowardMonth();    
        });
        $("#backMonth").click(function(){
            Calendar.backMonth();    
        });
        
        $(".bgCover").click(function(){
            Calendar.doOverlayClose();
        });
        
        $("td").click(function(ele){
            Calendar.overlayEvents($(this).attr('data-day'));
        });
        
        $(".contact").click(function() {
           Calendar.openContactOverlay(); 
        });
        
        $( window ).resize(function() {
            clearTimeout(Calendar.timeout);
            Calendar.timeout = setTimeout(Calendar.doneResizing, 500);
            
            //if(Calendar.mobileSafari)
        });
        
    }
}

function calendarList(date, Events) {
        
    var counter = 0;
    var eventDate = "noEvents";
    if (Events != undefined && Events.length > 0) {
        eventDate = new Date(Events[counter].Date);
    }
    
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    if (month == new Date().getMonth() ) {
        day = new Date().getDate();
    }
    
    var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
    var monthDays = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    var weekDay = new Array('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday');
    var days_in_this_month = monthDays[month];

    $("#MonthTitle").text(months[month] + ' ' + year )
    
    var calendar_html = '<table class="calendarListTable">';
    var first_week_day = new Date(year, month, 1).getDay();
    calendar_html += '</tr><tr>';

    week_day = first_week_day;
    for(day_counter = 1; day_counter <= days_in_this_month; day_counter++) {
        
        week_day %= 7;
        var week_day_s = week_day; 
        week_day_s--;
        if (week_day_s == -1) {
            week_day_s = 6;
        }
        if(week_day == 0)
            calendar_html += '</tr><tr>';
            
        if (eventDate != "noEvents" && eventDate.getDate() == day_counter) {
            calendar_html += '<td class="monthDay ' + Events[counter].Type + '" data-day="' + day_counter + '"> ' + day_counter + " " + weekDay[week_day_s];;
            while (eventDate.getDate() == day_counter && counter < Events.length ) {
                if( Events[counter].Icon  != ""  ) {
                    calendar_html += Calendar.getIcon(Events[counter].Icon);
                }
                calendar_html += ' <div class="eventTitle">' + Events[counter].Name + '</div>';
                counter++;
                if (counter < Events.length) {
                    eventDate = new Date(Events[counter].Date);
                }
            }
            calendar_html += '</td></tr><tr>';
        } else if (day == day_counter && month == new Date().getMonth()) {
            calendar_html += '<td class="currentDay" data-day="' + day_counter + '">' + day_counter + " " + weekDay[week_day_s] + '<div class=""></div></td>';
            calendar_html += '</tr><tr>';
        }
        else {
            calendar_html += '<td class="monthDay" data-day="' + day_counter + '"> ' + day_counter + " " + weekDay[week_day_s] +' <div></div></td>';
            calendar_html += '</tr><tr>';
        }
        
        week_day++;
    }
    calendar_html += '</tr>';
    calendar_html += '</table>';
    // Display the calendar.
    $(".CalendarContainer").html(calendar_html);
    //document.write(calendar_html);
}

function calendar(date, Events) {
  
    var counter = 0;
    var eventDate = "noEvents";
    if (Events != undefined && Events.length > 0) {
        eventDate = new Date(Events[counter].Date);
    }
    
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    if (month == new Date().getMonth() ) {
        day = new Date().getDate();
    }
    
    var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
    var monthDays = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    var weekDay = new Array('Su', 'Mo','Tu','We','Th','Fr','Sa');
    var days_in_this_month = monthDays[month];

    $("#MonthTitle").text(months[month] + ' ' + year )
    
  // Create the basic Calendar structure.
    var calendar_html = '<table class="calendarTable">';
    //calendar_html += '<tr><th class="monthHead" colspan="7">' + months[month] + ' ' + year + '</th></tr>';
    //calendar_html += '<tr>';
    var first_week_day = new Date(year, month, 1).getDay();
    for(week_day= 0; week_day < 7; week_day++) {
        calendar_html += '<td class="weekDay">' + weekDay[week_day] + '</td>';
    }
    calendar_html += '</tr><tr>';

  // Fill the first week of the month with the appropriate number of blanks.
    for(week_day = 0; week_day < first_week_day; week_day++) {
        calendar_html += '<td> </td>';
    }
    week_day = first_week_day;
    for(day_counter = 1; day_counter <= days_in_this_month; day_counter++) {
        week_day %= 7;
        if(week_day == 0)
            calendar_html += '</tr><tr>';
            
        if (eventDate != "noEvents" && eventDate.getDate() == day_counter) {
            
            calendar_html += '<td class="monthDay ' + Events[counter].Type + '" data-day="' + day_counter + '"> ' + day_counter
            while (eventDate.getDate() == day_counter && counter < Events.length ) {
            
                if( Events[counter].Icon  != ""  ) {
                    calendar_html += Calendar.getIcon(Events[counter].Icon);
                }
                calendar_html += ' <div class="eventTitle">' + Events[counter].Name + '</div>';
                counter++;
                if (counter < Events.length) {
                    eventDate = new Date(Events[counter].Date);
                }
            }
            calendar_html += '</td>'
        } else if (day == day_counter && month == new Date().getMonth()){
            calendar_html += '<td class="currentDay" data-day="' + day_counter + '">' + day_counter  + '<div class=""></div></td>';
        }
        else {
            calendar_html += '<td class="monthDay" data-day="' + day_counter + '"> ' + day_counter + ' <div></div></td>';
        }
        
        week_day++;
    }
    calendar_html += '</tr>';
    calendar_html += '</table>';
    // Display the calendar.
    $(".CalendarContainer").html(calendar_html);
    //document.write(calendar_html);
}


function dummyData() {
    var data = {
        Years: 
        { 
            2015: {

                July: [
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/1", Description: "Talk - Playing your part in social justice" },
    //                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/5", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/6", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/7", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/8", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/9", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/10", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/22", Description: "Xtend sharing and catch up" },
                    {Id: "", Icon: "youth_icon", Name: "BYM Combined", Type: "BYM", StartTime: "6:30", EndTime: "10:00", Date: "2015/7/26", Description: "BYM Combined at Hutt City" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group - MWG", Type: "MWG", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/29", Description: "Sharing baptisim testimonies" }
                ],
                 August: [
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/8/5", Description: "Why do we share" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/8/12", Description: "Big Question Forum" },
                    {Id: "", Icon: "", Name: "K - Serve", Type: "GN", StartTime: "TBC", EndTime: "TBC", Date: "2015/8/15", Description: "Awesomeness will happen today"},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "MWG", StartTime: "6:30", EndTime: "8:30", Date: "2015/8/19", Description: "Awesomeness will be shared" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/8/26", Description: "Sharing" }
                 ],
                 September: [
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/9/2", Description: "More Sharing" },
                    {Id: "", Icon: "youth_icon", Name: "KBC Quiz", Type: "NC", StartTime: "TBC", EndTime: "TBC", Date: "2015/9/5", Description: "A Quiz night that will probably blow your mind" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/9/9", Description: "Sharing"},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/9/16", Description: "Sharing" },
                    {Id: "", Icon: "youth_icon", Name: "Makara Overnighter", Type: "GN", StartTime: "All Day", EndTime: "All Day", Date: "2015/9/19", Description: "Details to come" },
                    {Id: "", Icon: "youth_icon", Name: "Makara Overnighter", Type: "GN", StartTime: "All Day", EndTime: "All Day", Date: "2015/9/20", Description: "Details to come" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/9/23", Description: "Sharing" }
                ]
            },
            2016: {
            	July: [
            		{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2016/7/27", Description: "Sex, dating, relating" }
            	],
            	August: [
            		{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2016/8/3", Description: "Whanau night (night in the community)" },
            		{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2016/8/10", Description: "Something Awesome!" },
            		{Id: "", Icon: "youth_icon", Name: "Combined", Type: "BYM", StartTime: "tbc", EndTime: "tbc", Date: "2016/8/17", Description: "Combined Manguraki Baptist - Olympic themed tbc" },
            		{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2016/8/24", Description: "Something Awesome!" },
            		{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2016/8/31", Description: "Story & Song" }
            	],
            	September: [
            		{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2016/9/7", Description: "Something Awesome!" },
            		{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2016/9/14", Description: "Check in and Chat" },
            		{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2016/9/21", Description: "Something Awesome!" }
            	]
            }
        }
    }
    
    return data;
}

function leadersDetails() {
    var data = [
        { Name: "Alex", Phone: "027 506 2565"}
    ];
    return data;
}
