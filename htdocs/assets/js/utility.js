// Utility Class & Function Here

function refreshData(seconds) {
  setTimeout(function () {
    location.reload();
  }, seconds * 1000);
}

function makeDateYYYYMMDDHHMM(timeStamp) {
  const year = timeStamp.getFullYear() + '.';
  const month = (timeStamp.getMonth() + 1 + '').padStart(2, '0') + '.';
  const date = (timeStamp.getDate() + '').padStart(2, '0') + ' ';
  const hours = (timeStamp.getHours() + '').padStart(2, '0') + ':';
  const mins = (timeStamp.getMinutes() + '').padStart(2, '0');
  const YYYYMMDDHHMM = year + month + date + hours + mins;
  return YYYYMMDDHHMM;
}
