const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
};

function formatDate(timestamp) {
    const date = new Date(timestamp*1000);
    try {
        const returnValue = new Intl.DateTimeFormat('en-GB', options).format(date)
        return returnValue
    } catch(error) {
        return "No expiration date"
    }
}


function getTimeRemaining(targetTimestamp) {
    const targetDate = targetTimestamp * 1000
    const now = new Date();
    const difference = targetDate - now;
      
    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }
      
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const oneHourInMs = 60 * 60 * 1000;
    const oneMinuteInMs = 60 * 1000;
      
    const days = Math.floor(difference / oneDayInMs);
    const hours = Math.floor((difference % oneDayInMs) / oneHourInMs);
    const minutes = Math.floor((difference % oneHourInMs) / oneMinuteInMs);
    const seconds = Math.floor((difference % oneMinuteInMs) / 1000);

    if(days==0 && hours==0 && minutes==0){
        return(seconds.toString() + " seconds")
    } else if(days==0 && hours==0){
        return(minutes.toString() + " minutes " + seconds.toString() + " seconds")
    } else if(days==0){
        return(hours.toString() + " hours " + minutes.toString() + " minutes " + seconds.toString() + " seconds")        
    } else {
         return(days.toString() + " days " + hours.toString() + " hours " + minutes.toString() + " minutes " + seconds.toString() + " seconds")
    }
}

module.exports = {
    formatDate,
    getTimeRemaining
}