function getList() {
    var selectedBucket = document.getElementById("my_select").value;
    window.location.href= 'http://' + selectedBucket + '.s3.amazonaws.com/list.html';
} //window represents browser window. location is where you want to go to.

function getImages() {
    var selectedBucket = document.getElementById("my_select").value;
    window.location.href= '/images/' + selectedBucket;
}





