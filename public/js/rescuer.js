function openCard(victimID) {
    $(".victims").css("display", "none");
    $("#e"+victimID).css("display", "block");
}

function dismiss() {
    $(".expanded").css("display", "none");
    $(".victims").css("display", "block");
}
const socket = io();

socket.emit('joinRescueChannel');

socket.on('newVictim', data => {
    console.log(data);
    $(".victims").append(
        `<div class="card" id="c${data.id}" onclick="openCard(${data.id})">
            <div class="info-wrapper">
                <h4 class="card-header-text">${data.name}</h4>
                <div class="details body-text">
                    <div class="info-block">Distance: ${data.location.coordinates[0]} ${data.location.coordinates[1]}</div> <div class="info-block">Severity: ${data.emergencyLevel}</div>
                </div>
            </div>
        </div>`
    );
    $("body").append(
        `<div class="card expanded" id="e${data.id}">
            <button class="btn-dismiss" onclick="dismiss()"><i class="fas fa-times"></i></button>
            <div class="info-container">
                <div class="expanded-card-header">
                    <h4 class="card-header-text">${data.name}</h4>
                </div>
                <div class="info-wrapper">
                    <p class="body-text">Phone #: ${data.phone}</p>
                    <p class="body-text">Distance: ${data.location.coordinates[0]} ${data.location.coordinates[1]}</p>
                    <p class="body-text">Severity: ${data.emergencyLevel}</p>
                    <p class="body-text">Description: ${data.info}</p>
                    <p class="body-text">Number of People: ${data.numPeople}</p>
                </div>
                <div class="button-wrapper">
                    <button class="btn">Rescue</button>
                </div>
            </div>
        </div>`
    )
})
