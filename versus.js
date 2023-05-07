var socket = io();
socket.emit('subscribe');

socket.on('refresh',function(data) {
  if (data.team1 != undefined && data.team2 != undefined) {
    $("#team1").text(data.team1.name)
    $("#team2").text(data.team2.name)
    $(".MainBackground").removeClass("NC-TR")
    $(".MainBackground").removeClass("NC-VS")
    $(".MainBackground").removeClass("VS-NC")
    $(".MainBackground").removeClass("VS-TR")
    $(".MainBackground").removeClass("TR-NC")
    $(".MainBackground").removeClass("TR-VS")
    $(".MainBackground").addClass(data.team1.faction + "-" + data.team2.faction)
    $("#scoreTeam1").text("" + data.team1.score)
    $("#scoreTeam2").text("" + data.team2.score)
  }
});
