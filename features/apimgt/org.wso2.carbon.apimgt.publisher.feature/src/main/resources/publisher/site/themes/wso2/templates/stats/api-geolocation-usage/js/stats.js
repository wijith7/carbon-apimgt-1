var currentLocation = "allAPIs";
var statsEnabled = isDataPublishingEnabled();
var apiNameVersionMap = {};
var apiName;
var width;
var height;
var padding_horizontal;
var padding_top;
var drilldown = "ALL";
var version = "ALL";
var ratio = 3/4;
var enableVersion = false; 
var d = new Date();
var currentDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(),d.getSeconds());
var to = new Date();
var from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 30);
$( document ).ready(function() {
   populateAPIList();
    width = $("#chartContainer").width();
    padding_horizontal = width/9;
    padding_top = width/3;
    height = width * ratio;
    $(window).resize(function() {
    width = $("#chartContainer").width();
    padding_horizontal = width/9;
    padding_top = width/3;
    height = width * ratio;
    renderGraph(from,to);        
    });
   $("#apiSelect").change(function (e) {
       apiName = this.value;
       populateVersionList(apiName,false);
    });
      $("#apiFilter").change(function (e) {
      currentLocation = this.value;
      populateAPIList();
    });
     $('#select-version').on('click', function () {
        enableVersion = true;
         populateVersionList(apiName,false);
       $("#select-version-div-label").css('display','none');
       $("#select-version-btn").css('display','none');
       $("#version-select").css('display','inline');
       $("#version-label").css('display','inline');
    });
      $('#button-clear').on('click', function () {
       $("#select-version-div-label").css('display','inline');
       $("#select-version-btn").css('display','inline');
       $("#version-select").css('display','none');
       $("#version-label").css('display','none');
       version="ALL";
       enableVersion = false;
       renderGraph(from,to);        
    });
    $("#versionSelect").change(function (e) {
      if (enableVersion) {
      version = this.value;        
      }
      renderGraph(from,to);        
    });
    $('#today-btn').on('click', function () {
      currentDay = getDate();
      from = currentDay - 86400000;
      to = currentDay;
      renderGraph(from,to);
    });
       $('#week-btn').on('click', function () {
        currentDay = getDate();
        from = currentDay - 604800000;
        to = currentDay;
        renderGraph(from,to);         
      });
       $('#month-btn').on('click', function () {
        currentDay = getDate();
        from = currentDay - (604800000 * 4);
        to = currentDay;
        renderGraph(from,to);        
        });
        $('#date-range').click(function () {
         $(this).removeClass('active');
         }); 
                   //date picker
        $('#date-range').daterangepicker({
                        timePicker: false,
                        timePickerIncrement: 30,
                        format: 'YYYY-MM-DD h:mm',
                        opens: 'left'
                    });
        $('#date-range').on('apply.daterangepicker', function (ev, picker) {
                        btnActiveToggle(this);
                        from = picker.startDate;
                        to = picker.endDate;

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
            var fromStr = convertTimeString(from).split(" ");
            var toStr = convertTimeString(to).split(" ");
            var dateStr = fromStr[0] + " <i>" + fromStr[1] + "</i> <b>to</b> " + toStr[0] + " <i>" + toStr[1] + "</i>";
            $("#date-range span").html(dateStr);
            renderGraph(from, to);
        });
});
var populateAPIList = function(){
           jagg.post("/site/blocks/stats/ajax/stats.jag", { action : "getAPIList" ,currentLocation:currentLocation},
        function (json) {
        if (!json.error) {
              apiNameVersionMap = json.apiNameVersionMap;
                var i=0;
               var apis = '';
                for (var name in apiNameVersionMap) {
                    if (i==0) {
                    apis += '<option selected="selected" value'+name+'>' + name + '</option>';
                }else{
                    apis+= '<option value='+name+'>' + name+ '</option>';
                }
                i++;
            }
        $('#apiSelect')
                    .empty()
                    .append(apis)
                    .selectpicker('refresh')                    
                    .trigger('change');
                        }
        else {
            if (json.message == "AuthenticateError") {
                jagg.showLogin();
            }
        }
        });
};
var populateVersionList = function(apiName,compare){
        var i=0;
       var selectVersion = '';
        for (var version in apiNameVersionMap[apiName]) {
            var tempVersion = apiNameVersionMap[apiName][version];
                    if (i==0) {
                    selectVersion += '<option selected="selected" value='+tempVersion+'>' + tempVersion + '</option>';
                }else{
                    selectVersion +='<option value='+tempVersion+'>' + tempVersion+ '</option>';
                }
                i++;
}
        $('#versionSelect')
                    .empty()
                    .append(selectVersion)
                    .selectpicker('refresh')                    
                    .trigger('change');
        };
function renderGraph(fromDate,toDate){
  if (statsEnabled) {
    var toDateString = convertTimeStringUTC(toDate);
    var fromDateString = convertTimeStringUTC(fromDate);
    getDateTime(toDate,fromDate);
    var data = [];
           jagg.post("/site/blocks/stats/api-geolocation-usage/ajax/stats.jag", { action : "getGeolocationUsageByAPI" , apiName : apiName , apiVersion : version , fromDate : fromDateString , toDate : toDateString,drilldown:drilldown},
        function (json) {
            if (!json.error) {
                if (json.usage && json.usage.length > 0) {
                  for(var usage1 in json.usage ){
                  var values = json.usage[usage1].values;
                  var count = values.count;
                  var country;
                  if (drilldown != "ALL") {
                   country = values.key_country_city_facet[1];
                  }else{
                   country = values.key_country_city_facet[0];
                  }
                  data.push([country,count]);
                  }
                    drawGraphInArea(data);
                }
                else if (json.usage && json.usage.length == 0 && statsEnabled) {
                    $('#noData').html('');
                    $('#noData').append('<div class="center-wrapper"><div class="col-sm-4"/><div class="col-sm-4 message message-info"><h4><i class="icon fw fw-info" title="No Data Available"></i>'+i18n.t("No Data Available")+'</h4>'+ "<p> " + i18n.t('Generate some traffic to see statistics') + "</p>" +'</div></div>');
                    $('#chartContainer').hide();
                }
                else {
                         $('.stat-page').html("");
                    showEnableAnalyticsMsg();
           }
            }
            else {
                if (json.message == "AuthenticateError") {
                    jagg.showLogin();
                } else {
                    jagg.message({content: json.message, type: "error"});
                }
            }
        }, "json");    
  }else{
                    $('.stat-page').html("");
                    showEnableAnalyticsMsg();
  }
}

function drawGraphInArea(rdata){
      $('#chartContainer').show();
      $('#chartContainer').empty();
      $('#noData').empty();
      $('#temploadinglatencytTime').empty();
  var data =  [
        {
            "metadata" : {
                "names" : ["Country","Count"],
                "types" : ["ordinal", "linear"]
            },
            "data": rdata
        }
    ];
    var configWorld = {
        type: "map",
        x : "Country",
        renderer : "canvas",
        charts : [{type: "map",  y : "Count", mapType : "world"}],
        width: width,
        height: height,
        colorScale:["#99ccff","#193366"],
        color:["#f7f7f7"],
        padding: {"top": padding_top, "left": padding_horizontal, "bottom": padding_horizontal, "right": padding_horizontal}
    };
var configUsa = {
        type: "map",
        x : "Country",
        renderer : "canvas",
        charts : [{type: "map",  y : "Count", mapType : "usa"}],
        width: width*1.5,
        height: height*1.5,
        colorScale:["#99ccff","#193366"],
        color:["#f7f7f7"],
        padding: {"top":padding_top/100, "left": padding_horizontal/100, "bottom": padding_horizontal*5, "right": padding_horizontal*8}
    };
    var callbackmethod = function(event, item) { 

        if (item != null) {
          var country = item.datum.zipped.unitName;
          if (country =="United States") {
            drilldown = "United States";
            renderGraph(from, to);
          }else{
            drilldown = "ALL";
            renderGraph(from, to);
          }
          }
          }
    var worlHelperInfoJsonUrl = $("#countryInfo").val();
    var worldGeoCodesUrl = $("#world").val();
    var usahelperJson = $("#usainfo").val();
    var usaGeocodeJson = $("#usa").val();
    var worldChart;
    if (drilldown == "ALL") {
        configWorld.helperUrl = worlHelperInfoJsonUrl;
        configWorld.geoCodesUrl = worldGeoCodesUrl;
        worldChart = new vizg(data, configWorld);
    }else{
        configUsa.helperUrl = usahelperJson;
        configUsa.geoCodesUrl = usaGeocodeJson;
        worldChart = new vizg(data, configUsa);
    }
    worldChart.draw("#chartContainer", [{type:"click", callback:callbackmethod}]);
    $('#chartContainer').show();
        };
function getDateTime(currentDay,fromDay){
    toDateString = convertTimeString(currentDay);
    fromDateString = convertTimeString(fromDay);
    var toDate = toDateString.split(" ");
    var fromDate = fromDateString.split(" ");
    var dateStr= fromDate[0]+" <i>"+fromDate[1]+"</i> <b>to</b> "+toDate[0]+" <i>"+toDate[1]+"</i>";
    $("#date-range span").html(dateStr);
    $('#date-range').data('daterangepicker').setStartDate(from);
    $('#date-range').data('daterangepicker').setEndDate(to);
}
