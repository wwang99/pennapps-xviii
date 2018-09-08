$("document").ready(function() {
    $(".victims > .card").click(function() {
        const victimID = $(this).attr("id").replace(/\D/g,'');
        $(".victims").css("display", "none");
        $("#e"+victimID).css("display", "block");
    });
    $("button.btn-dismiss").on("click", function() {
        $(".expanded").css("display", "none");
        $(".victims").css("display", "block");
    })
});
const socket = io();
