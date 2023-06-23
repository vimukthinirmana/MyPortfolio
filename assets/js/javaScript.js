// web page loding animation
/*
window.addEventListener('load', function () {
    // Show the loader initially
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('html').style.display = 'none';

    // Hide the loader and show the content after 5 seconds
    setTimeout(function () {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('html').style.display = 'block';
    }, 5000); // 5 seconds (5000 milliseconds)
});
*/





var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    for (tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}


window.addEventListener('scroll', toggleScrollButton);
function toggleScrollButton() {
    var scrollButton = document.getElementById('scrollButton');
    if (window.pageYOffset > 0) {
        scrollButton.style.display = 'block'; // Show the button when scrolling down
    } else {
        scrollButton.style.display = 'none'; // Hide the button when at the top
    }
}

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}


