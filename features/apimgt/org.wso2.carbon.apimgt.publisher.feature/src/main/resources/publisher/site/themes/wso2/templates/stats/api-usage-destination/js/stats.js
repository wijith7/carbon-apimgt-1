var currentLocation;
var statsEnabled = isDataPublishingEnabled();
var apiFilter = "allAPIs";

//setting default date
var to = new Date();
var from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 30);

currentLocation=window.location.pathname;

    jagg.post("/site/blocks/stats/api-usage-destination/ajax/stats.jag", { action:"getFirstAccessTime",currentLocation:currentLocation  },
        function (json) {
            $('#spinner').hide();
            if (!json.error) {

                if( json.usage && json.usage.length > 0){
                    var d = new Date();
                    from = new Date(json.usage[0].year, json.usage[0].month-1, json.usage[0].day);
                    var currentDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(),d.getHours(),d.getMinutes());

                    //day picker
                    $('#today-btn').on('click',function(){
                        currentDay = getDate();
                        getDateTime(currentDay,currentDay-86400000);
                    });

                    //hour picker
                    $('#hour-btn').on('click',function(){
                        currentDay = getDate();
                        getDateTime(currentDay,currentDay-3600000);
                    })

                    //week picker
                    $('#week-btn').on('click',function(){
                        currentDay = getDate();
                        getDateTime(currentDay,currentDay-604800000);
                    })

                    //month picker
                    $('#month-btn').on('click',function(){
                        currentDay = getDate();
                        getDateTime(currentDay,currentDay-(604800000*4));
                    });

                    $('#date-range').click(function(){
                         $(this).removeClass('active');
                    });

                    //date picker
                    $('#date-range').daterangepicker({
                          timePicker: false,
                          timePickerIncrement: 30,
                          format: 'YYYY-MM-DD h:mm',
                          opens: 'left',
                    });

                    $("#apiFilter").change(function (e) {
                    	apiFilter = this.value;
                    	drawAPIUsageByDestination(from,to,apiFilter);
                    });

                    $('#date-range').on('apply.daterangepicker', function (ev, picker) {
                        btnActiveToggle(this);
                        var from = convertTimeString(picker.startDate);
                        var to = convertTimeString(picker.endDate);
                        // If the selected duration is more than 1 year, or the selected start date is older than 1 year,
                        // adjust the start date so that the date will be
                        // the 1st date of that selected month. The year won't be changed
                        // var durationInYears = dateDiffInYears(picker.startDate, picker.endDate);
                        var startDateAdjusted = false;
                        var endDateAdjusted = false;

                        var isStartDateOlderThanYear = dateDiffInYears(picker.startDate, new Date()) > 0;

                        if (isStartDateOlderThanYear) {
                            if (picker.startDate.date() != 1) {
                                picker.startDate.date(1);
                                var startDateAdjusted = true;
                                from = convertTimeString(picker.startDate);
                            }

                            if (
                                picker.endDate.isBefore(new Date) &&
                                picker.endDate.date() != 0 &&
                                picker.endDate.month() < new Date().getMonth()
                            ) {
                                picker.endDate.month(picker.endDate.month() + 1);
                                // this is done to do the next call picker.endDate.date(0); in order ot get the last
                                // date of current month.
                                // picker.endDate.date(0) sets the date to the last date of previous month, so needs to
                                // increase the current month by 1.
                                picker.endDate.date(0);
                                var endDateAdjusted = true;
                                to = convertTimeString(picker.endDate);
                                $('#date-range').data("daterangepicker").setStartDate(picker.startDate);
                                $('#date-range').data("daterangepicker").setEndDate(picker.endDate);
                            }
                            var reasonMsg = " start date of the selected duration is older than 1 year";
                            if (startDateAdjusted && endDateAdjusted) {
                                jagg.message({
                                    content: "Adjusted the start date to the 1st day of the selected month, and " +
                                    "end date to the last date of selected month as the" + reasonMsg, type: "info"
                                });
                            } else if (startDateAdjusted && !endDateAdjusted) {
                                jagg.message({
                                    content: "Adjusted the start date to the 1st day of the selected month, as " +
                                    reasonMsg, type: "info"
                                });
                            } else if (endDateAdjusted && !startDateAdjusted) {
                                jagg.message({
                                    content: "Adjusted the end date to the last day of the selected month, as " +
                                    reasonMsg, type: "info"
                                });
                            }
                        }
                        var fromStr = from.split(" ");
                        var toStr = to.split(" ");
                        var dateStr = fromStr[0] + " <i>" + fromStr[1] + "</i> <b>to</b> " + toStr[0] + " <i>" + toStr[1] + "</i>";
                        $("#date-range span").html(dateStr);
                        drawAPIUsageByDestination(from, to, apiFilter);
                    });

                    getDateTime(to,from);

                    $('#date-range').click(function (event) {
                    event.stopPropagation();
                    });

                    $('body').on('click', '.btn-group button', function (e) {
                        $(this).addClass('active');
                        $(this).siblings().removeClass('active');
                    });

                } else {
                    $('.stat-page').html("");
                    showEnableAnalyticsMsg();
                }
            } else {
                if (json.message == "AuthenticateError") {
                    jagg.showLogin();
                } else {
                    jagg.message({content:json.message,type:"error"});
                }
            }
        }, "json");


var drawAPIUsageByDestination = function(from,to){
    var fromDate = convertTimeStringUTC(from);
    var toDate = convertTimeStringUTC(to);

    jagg.post("/site/blocks/stats/api-usage-destination/ajax/stats.jag", { action:"getAPIUsageByDestination", currentLocation:currentLocation,fromDate:fromDate,toDate:toDate, apiFilter: apiFilter},
        function (json) {
            $('#spinner').hide();
            if (!json.error) {
                var length = json.usage.length;
                $('#noData').empty();
                $('div#destinationBasedUsageTable_wrapper.dataTables_wrapper.no-footer').remove();

                var $dataTable =$('<table class="display table table-striped table-bordered" width="100%" cellspacing="0" id="destinationBasedUsageTable"></table>');

                $dataTable.append($('<thead class="tableHead"><tr>'+
                                        '<th>API</th>'+
                                        '<th>VERSION</th>'+
                                        '<th>CONTEXT</th>'+
                                        '<th>DESTINATION ADDRESS</th>'+
                                        '<th style="text-align:right">NO OF ACCESS</th>'+
                                    '</tr></thead>'));

                for (var i = 0; i < json.usage.length; i++) {
                    $dataTable.append($('<tr><td>' + json.usage[i].apiName + '</td><td>' + json.usage[i].version + '</td><td>' + json.usage[i].context + '</td><td>' + json.usage[i].destination + '</td><td class="tdNumberCell">' + json.usage[i].count + '</td></tr>'));
                }
                if (length == 0) {
                    $('#destinationBasedUsageTable').hide();
                    $('div#destinationBasedUsageTable_wrapper.dataTables_wrapper.no-footer').remove();
                    $('#noData').html('');
                    $('#noData').append($('<div class="center-wrapper"><div class="col-sm-4"/><div class="col-sm-4 message message-info"><h4><i class="icon fw fw-info" title="No Stats"></i>'+i18n.t("No Data Available")+'</h4></div></div>'));

                }else{
                    $('#tableContainer').append($dataTable);
                    $('#tableContainer').show();
                    $('#destinationBasedUsageTable').datatables_extended({
                     "order": [[ 4, "desc" ]],
                     "fnDrawCallback": function(){
                         if(this.fnSettings().fnRecordsDisplay()<=$("#destinationBasedUsageTable_length option:selected" ).val()
                         || $("#destinationBasedUsageTable_length option:selected" ).val()==-1)
                             $('#destinationBasedUsageTable_paginate').hide();
                         else
                             $('#destinationBasedUsageTable_paginate').show();
                     },
                    });
                }

            } else {
                if (json.message == "AuthenticateError") {
                    jagg.showLogin();
                } else {
                    jagg.message({content:json.message,type:"error"});
                }
            }
        }, "json");

}
function getDateTime(currentDay,fromDay){
    to = convertTimeString(currentDay);
    from = convertTimeString(fromDay);
    var toDate = to.split(" ");
    var fromDate = from.split(" ");
    var dateStr= fromDate[0] + " <i>" + fromDate[1] + "</i> <b>to</b> " + toDate[0] + " <i>" + toDate[1] + "</i>";
    $("#date-range span").html(dateStr);
    $('#date-range').data('daterangepicker').setStartDate(from);
    $('#date-range').data('daterangepicker').setEndDate(to);
    drawAPIUsageByDestination(from,to,apiFilter);
}
