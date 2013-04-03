
    
/*// Store time used by duration.
var oldTime = $.timePicker(".timeStart").getTime();

// Keep the duration between the two inputs.
$(".timeStart").change(function() {
  if ($(".timeEnd").val()) { // Only update when second input has a value.
    // Calculate duration.
    var duration = ($.timePicker(".timeEnd").getTime() - oldTime);
    var time = $.timePicker(".timeStart").getTime();
    // Calculate and update the time in the second input.
    $.timePicker(".timeEnd").setTime(new Date(new Date(time.getTime() + duration)));
    oldTime = time;
  }
});
// Validate.
$(".timeEnd").change(function() {
  if($.timePicker(".timeStart").getTime() > $.timePicker(this).getTime()) {
    $(this).addClass("error");
  }
  else {
    $(this).removeClass("error");
  }
});*/