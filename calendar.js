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
            { 2014: {
                October:[
                        {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2014/10/22", Description: "Respectful relationships", Description2: "Respectful relationships" },
                        {Id: "", Icon: "", Name: "Mid Week Church", Type: "MWG", StartTime: "6:30", EndTime: "8:30", Date: "2014/10/29", Description: "Alex - Jesus' Closeness with God", Description2: "Alex - Jesus' Closeness with God"}
                        
                    ],
                 November: [
                        {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2014/11/2", Description: "Prayers of the Courageous - Esther's Courage"},
                        {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2014/11/5", Description: "Reuben - Jesus' Mercy"},
                        {Id: "", Icon: "youth_icon", Name: "Boys Night", Type: "GN", StartTime: "TBC", EndTime: "Late", Date: "2014/11/7", Description: "Boy's Night - Pulse crossover - Details to come! "},
                        {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2014/11/9", Description: "Prayers of the Courageous - Joseph's integrity "},           
                        {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2014/11/12", Description: "Attitude parents and youth"},
                        {Id: "", Icon: "youth_icon", Name: "Girls Night", Type: "GN", StartTime: "TBC", EndTime: "Late", Date: "2014/11/15", Description: "Girl's Night - Pulse crossover - Details to come"},
                        {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "7:30", EndTime: "9:00", Date: "2014/11/17", Description: "Monday Night Church - Special worship service - SOAK - 7.30pm @ KBC"},
                        {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2014/11/19", Description: "Abi - Jesus' Friendships"},
                        {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2014/11/23", Description: "Nehimiah's Commitment to Celebration"},
                        {Id: "", Icon: "", Name: "Mid Week Church", Type: "MWG", StartTime: "6:30", EndTime: "8:30", Date: "2014/11/26", Description: "Chris - Jesus' Servant leadership"},
                        {Id: "", Icon: "", Name: "BYM Amazing race", Type: "GN", StartTime: "3:15pm", EndTime: "7ish", Date: "2014/11/30", Description: "BYM Amazing race - Meet at KBC, bring $5"},
                        {Id: "", Icon: "", Name: "Easter camp Road show", Type: "GN", StartTime: "7:15pm", EndTime: "10:00pm", Date: "2014/11/30", Description: "Easter camp Road show - 7.30pm @ Cental Baptist - Home by 10pm"}                    ],
                 December: [
                        {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2014/12/3", Description: "Last Youth of 2014- Grace - Jesus putting people first"},
                        {Id: "", Icon: "", Name: "End of Year Event", Type: "GN", StartTime: "6:00", EndTime: "11:00", Date: "2014/12/6", Description: "End of Year Event - Details to come - Keep this date free"},
                        {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2014/11/7", Description: "The last night church of the year"},
                        {Id: "", Icon: "christmas", Name: "Christmas Day", Type: "PH", StartTime: "12:00", EndTime: "12:00", Date: "2014/12/25", Description: ""}
                        
                    ]
                },
             2015: {
                February: [
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/2/11", Description: "", Description2: "" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/2/18", Description: "", Description2: "" },
                    {Id: "", Icon: "youth_icon", Name: "Groups Night", Type: "GN", StartTime: "TBC", EndTime: "Late", Date: "2015/2/20", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/2/25", Description: "", Description2: "" }
                    ],
                March:[
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/3/4", Description: "", Description2: "" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/3/11", Description: "", Description2: "" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/3/18", Description: "", Description2: "" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/3/25", Description: "", Description2: "" }
                        
                    ],
                April:[
                    {Id: "", Icon: "youth_icon", Name: "Easter Camp", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/4/3", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Easter Camp", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/4/4", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Easter Camp", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/4/5", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Easter Camp", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/4/6", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/4/22", Description: "", Description2: "" },
                    {Id: "", Icon: "youth_icon", Name: "Mid Week Gathering", Type: "MWG", StartTime: "6:30", EndTime: "8:30", Date: "2015/4/29", Description: "", Description2: "" }
                    
                    ],
                May:[                    
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/5/3", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/5/6", Description: "", Description2: "" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/5/10", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/5/13", Description: "", Description2: "" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/5/17", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/5/20", Description: "", Description2: "" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/5/24", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Mid Week Gathering", Type: "MWG", StartTime: "6:30", EndTime: "8:30", Date: "2015/5/27", Description: "", Description2: "" }           
                    ],
                 June:[
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/6/3", Description: "" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/6/7", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/6/10", Description: "" },
                    {Id: "", Icon: "", Name: "BYM", Type: "BYM", StartTime: "7", EndTime: "9", Date: "2015/6/12", Description: "Details to come" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/6/14", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/6/17", Description: "" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/6/21", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/6/24", Description: "" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/6/28", Description: ""}
                 ],
                 July: [
                    {Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/1", Description: "" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/5", Description: ""},
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/6", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/7", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/8", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/9", Description: "" },
                    {Id: "", Icon: "youth_icon", Name: "Xtend", Type: "BYM", StartTime: "All Day", EndTime: "All Day", Date: "2015/7/10", Description: "" },
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/12", Description: ""},
                    {Id: "", Icon: "church_icon", Name: "Night Church", Type: "NC", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/19", Description: ""}
                    //{Id: "", Icon: "youth_icon", Name: "Youth Group", Type: "YG", StartTime: "6:30", EndTime: "8:30", Date: "2015/7/22", Description: "" },  
                 ]
                }
            }
    }
    
    return data;
}

function leadersDetails() {
    var data = [
        { Name: "Alex", Phone: "027 506 2565", Email: "karoribyc@gmail.com" },
        { Name: "Chris", Phone: "021 136 9967", Email: "karoribyc@gmail.com" },
        { Name: "Freddie", Phone: "027 393 5503", Email: "" },
        { Name: "Reuben", Phone: "027 753 9283", Email: "" },
        { Name: "Grace", Phone: "027 775 8692", Email: "" },
        { Name: "Abi", Phone: "021 026 64568", Email: "" },
        { Name: "Esther", Phone: "027 841 3432", Email: "" },
        { Name: "Nat", Phone: "027 208 4443", Email: "" }
        
    ];
    return data;
}
