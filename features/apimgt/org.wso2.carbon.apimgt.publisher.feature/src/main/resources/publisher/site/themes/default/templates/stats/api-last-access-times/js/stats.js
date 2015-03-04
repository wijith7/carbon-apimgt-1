var t_on = {
    'apiChart': 1,
    'subsChart': 1,
    'serviceTimeChart': 1,
    'tempLoadingSpace': 1
};
var currentLocation;

var chartColorScheme1 = ["#3da0ea", "#bacf0b", "#e7912a", "#4ec9ce", "#f377ab", "#ec7337", "#bacf0b", "#f377ab", "#3da0ea", "#e7912a", "#bacf0b"];
//fault colors || shades of red
var chartColorScheme2 = ["#ED2939", "#E0115F", "#E62020", "#F2003C", "#ED1C24", "#CE2029", "#B31B1B", "#990000", "#800000", "#B22222", "#DA2C43"];
//fault colors || shades of blue
var chartColorScheme3 = ["#0099CC", "#436EEE", "#82CFFD", "#33A1C9", "#8DB6CD", "#60AFFE", "#7AA9DD", "#104E8B", "#7EB6FF", "#4981CE", "#2E37FE"];
currentLocation = window.location.pathname;
var statsEnabled = isDataPublishingEnabled();

require(["dojo/dom", "dojo/domReady!"], function (dom) {
    currentLocation = window.location.pathname;
    //Initiating the fake progress bar
    jagg.fillProgress('apiChart');
    jagg.fillProgress('subsChart');
    jagg.fillProgress('serviceTimeChart');
    jagg.fillProgress('tempLoadingSpace');

    jagg.post("/site/blocks/stats/api-last-access-times/ajax/stats.jag", { action: "getFirstAccessTime", currentLocation: currentLocation  },
        function (json) {

            if (!json.error) {

                if (json.usage && json.usage.length > 0) {
                    var d = new Date();
                    var firstAccessDay = new Date(json.usage[0].year, json.usage[0].month - 1, json.usage[0].day);
                    var currentDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(),d.getHours(),d.getMinutes());


                        //day picker
                        $('#today-btn').on('click',function(){
                            var to = convertTimeString(currentDay);
                            var from = convertTimeString(currentDay-86400000);
                            var dateStr= from+" to "+to;
                            $("#date-range").html(dateStr);
                            $('#date-range').data('dateRangePicker').setDateRange(from,to);
                            drawProviderAPIVersionUserLastAccess(from,to);

                        });

                        //hour picker
                        $('#hour-btn').on('click',function(){
                            var to = convertTimeString(currentDay);
                            var from = convertTimeString(currentDay-3600000);
                            var dateStr= from+" to "+to;
                            $("#date-range").html(dateStr);
                            $('#date-range').data('dateRangePicker').setDateRange(from,to);
                            drawProviderAPIVersionUserLastAccess(from,to);
                        })

                        //week picker
                        $('#week-btn').on('click',function(){
                            var to = convertTimeString(currentDay);
                            var from = convertTimeString(currentDay-604800000);
                            var dateStr= from+" to "+to;
                            $("#date-range").html(dateStr);
                            $('#date-range').data('dateRangePicker').setDateRange(from,to);
                            drawProviderAPIVersionUserLastAccess(from,to);
                        })

                        //month picker
                        $('#month-btn').on('click',function(){

                            var to = convertTimeString(currentDay);
                            var from = convertTimeString(currentDay-(604800000*4));
                            var dateStr= from+" to "+to;
                            $("#date-range").html(dateStr);
                            $('#date-range').data('dateRangePicker').setDateRange(from,to);
                            drawProviderAPIVersionUserLastAccess(from,to);
                        });

                        //date picker
                        $('#date-range').dateRangePicker(
                            {
                                startOfWeek: 'monday',
                                separator : ' to ',
                                format: 'YYYY-MM-DD HH:mm',
                                autoClose: false,
                                time: {
                                    enabled: true
                                },
                                shortcuts:'hide',
                                endDate:currentDay
                            })
                            .bind('datepicker-change',function(event,obj)
                            {

                            })
                            .bind('datepicker-apply',function(event,obj)
                            {
                                 var from = convertDate(obj.date1);
                                 var to = convertDate(obj.date2);
                                 $('#date-range').html(from + " to "+ to);
                                 drawProviderAPIVersionUserLastAccess(from,to);
                            })
                            .bind('datepicker-close',function()
                            {
                        });

                        //setting default date
                        var to = new Date();
                        var from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 30);

                        $('#date-range').data('dateRangePicker').setDateRange(from,to);
                        $('#date-range').html($('#date-range').val());
                        var fromStr = convertDate(from);
                        var toStr = convertDate(to);
                        drawProviderAPIVersionUserLastAccess(fromStr,toStr);


                        $('#date-range').click(function (event) {
                        event.stopPropagation();
                        });

                        $('body').on('click', '.btn-group button', function (e) {
                            $(this).addClass('active');
                            $(this).siblings().removeClass('active');
                        });

                    var width = $("#rangeSliderWrapper").width();
                    //$("#rangeSliderWrapper").affix();
                    $("#rangeSliderWrapper").width(width);
                }

                else if (json.usage && json.usage.length == 0 && statsEnabled) {
                    $('#middle').html("");
                    $('#middle').append($('<div class="errorWrapper"><img src="../themes/default/templates/stats/images/statsEnabledThumb.png" alt="Stats Enabled"></div>'));
                }

                else {
                    $('#middle').html("");
                    $('#middle').append($('<div class="errorWrapper"><span class="label top-level-warning"><i class="icon-warning-sign icon-white"></i>'
                        + i18n.t('errorMsgs.checkBAMConnectivity') + '</span><br/><img src="../themes/default/templates/stats/api-last-access-times/images/statsThumb.png" alt="Smiley face"></div>'));
                }
            }
            else {
                if (json.message == "AuthenticateError") {
                    jagg.showLogin();
                } else {
                    jagg.message({content: json.message, type: "error"});
                }
            }
            t_on['apiChart'] = 0;
        }, "json");

});

var drawProviderAPIVersionUserLastAccess = function(from,to){
    var fromDate = from;
    var toDate = to;
    jagg.post("/site/blocks/stats/api-last-access-times/ajax/stats.jag", { action:"getProviderAPIVersionUserLastAccess",currentLocation:currentLocation,fromDate:fromDate,toDate:toDate  },
        function (json) {
            if (!json.error) {

                var length = json.usage.length;
                $('#tempLoadingSpace').empty();
                $('div#lastAccessTable_wrapper.dataTables_wrapper.no-footer').remove();

                var $dataTable =$('<table class="display defaultTable" width="100%" cellspacing="0" id="lastAccessTable"></table>');

                //getting timezone value
                var date=new Date();
                var offset = date.getTimezoneOffset();

                function convertToHHMM(info) {
                   var hrs = parseInt(Number(info));
                   var min = Math.round((Number(info)-hrs) * 60);
                   return (('' + hrs).length < 2 ? '0' : '') + hrs+':'+(('' + min).length < 2 ? '0' : '')+min;
                }

                var timezone;
                if(offset>=(-840) && offset<=720){
                     if(offset==0 || offset<0){
                        timezone=" (GMT+"+convertToHHMM(Math.abs(offset)/60)+")";
                     }
                     else{
                        timezone=" (GMT-"+ convertToHHMM(Math.abs(offset)/60)+")";
                     }
                }else{
                   timezone=" ";
                }

                $dataTable.append($('<thead class="tableHead"><tr>'+
                                        '<th width="20%">API</th>'+
                                         '<th  width="15%">Version</th>'+
                                        '<th  width="15%">Subscriber</th>'+
                                        '<th   width="30%">Access Time'+ timezone+'</th>'+
                                    '</tr></thead>'));

                for (var i = 0; i < json.usage.length; i++) {
                   $($dataTable).append($('<tr><td>' + json.usage[i].api_name + '</td><td>' + json.usage[i].api_version + '</td><td>' + json.usage[i].user + '</td><td >' + jagg.getDate(json.usage[i].lastAccess)+ '</td></tr>'));
                }
                if (length == 0) {
                    $('#lastAccessTable').hide();
                    $('#tempLoadingSpace').html('');
                    $('#tempLoadingSpace').append($('<span class="label label-info">'+i18n.t('errorMsgs.noData')+'</span>'));

                }else{
                    $('#tableContainer').append($dataTable);
                    $('#tableContainer').show();
                    $('#lastAccessTable').dataTable({
                         "order": [[ 3, "desc" ]]
                    });
                    $('select').css('width','60px');
                }

            } else {
                if (json.message == "AuthenticateError") {
                    jagg.showLogin();
                } else {
                    jagg.message({content:json.message,type:"error"});
                }
            }
            t_on['tempLoadingSpace'] = 0;
        }, "json");
}

function isDataPublishingEnabled(){
    jagg.post("/site/blocks/stats/api-last-access-times/ajax/stats.jag", { action: "isDataPublishingEnabled"},
        function (json) {
            if (!json.error) {
                statsEnabled = json.usage;
                return statsEnabled;
            } else {
                if (json.message == "AuthenticateError") {
                    jagg.showLogin();
                } else {
                    jagg.message({content: json.message, type: "error"});
                }
            }
        }, "json");        
}

var convertTimeString = function(date){
    var d = new Date(date);
    var formattedDate = d.getFullYear() + "-" + formatTimeChunk((d.getMonth()+1)) + "-" + formatTimeChunk(d.getDate())+" "+formatTimeChunk(d.getHours())+":"+formatTimeChunk(d.getMinutes());
    return formattedDate;
};

var convertTimeStringPlusDay = function (date) {
    var d = new Date(date);
    var formattedDate = d.getFullYear() + "-" + formatTimeChunk((d.getMonth() + 1)) + "-" + formatTimeChunk(d.getDate() + 1);
    return formattedDate;
};

var formatTimeChunk = function (t) {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
};

function convertDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour=date.getHours();
    var minute=date.getMinutes();
    return date.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '')
        + month + '-' + (('' + day).length < 2 ? '0' : '') + day +" "+ (('' + hour).length < 2 ? '0' : '')
        + hour +":"+(('' + minute).length < 2 ? '0' : '')+ minute;
}
