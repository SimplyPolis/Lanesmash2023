var socket = io();
socket.emit('subscribe');

socket.on('refresh',function(data) {
  if (data.team1 != undefined && data.team2 != undefined) {
    $.getJSON('http://jaegerevents.com/api/lanesmash/teams/roster/'+data.team1.name, function(data) {
        var text =''
        var text2 =''
        var count = 0;
    data.forEach(element => {
        if(count <= 25){
         text += `${element}<br >`;
        }else {
         text2 += `${element}<br >`;
        }
        count++
        });
        $("#scoreTeam1-1").html(text)
        $("#scoreTeam1-2").html(text2)

    });
    $.getJSON('http://jaegerevents.com/api/lanesmash/teams/roster/'+data.team2.name, function(data) {
        var text =''
        var text2 =''
        var count = 0;
    data.forEach(element => {
        if(count <= 25){
         text += `${element}<br >`;
        }else {
         text2 += `${element}<br >`;
        }
        count++
        });
        $("#scoreTeam2-1").html(text)
        $("#scoreTeam2-2").html(text2)
    });

  }
});
