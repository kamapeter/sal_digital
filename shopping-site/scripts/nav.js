var $ = document.querySelector.bind(document);
var openBtn = $("#openBtn");
var topNav = $(".topNav")
var sideNav = $("#mySideNav");
var closeBtn = $(".sideNav .closeBtn");;
var main = $(".main");
//var topMargin = topNav.getBoundingClientRect().bottom;
//main.style.marginTop = topMargin + "px";
//var h = $(".footer").getBoundingClientRect().top + "px";
//onsole.log(h);
//sideNav.style.height = h;
function open(e) {
		e.preventDefault();
		sideNav.classList.add("slideIn");
		//console.log("wo");
}
function close() {
		//var elem = e.target;
		if($(".slideIn")){
				sideNav.classList.add("slideOut")
				$(".slideOut")
						.addEventListener("webkitAnimationEnd",function (e) {
						if ($(".slideOut"))
						$(".slideOut").classList.remove("slideIn","slideOut");
		}, false);
		}
}
openBtn.addEventListener("click", open, false);
closeBtn.addEventListener("click", close, false);
main.addEventListener("click", close, false);
topNav.addEventListener("click", function (e) {
		if(e.target.getAttribute("ID") == "open") 
		  return;
		else
		   close();
}, false);

/*var current =0;
function slideInImages(parent,inClass,outClass,inc) {
		var parent = $(parent), 
		imgs = parent.querySelectorAll("img"),
		imgsNo = imgs.length;
		if(imgs[current].classList.contains(inClass))
				imgs[current].classList.replace(inClass,outClass);
		current = Math.abs((current +inc)) % imgsNo;
		
		if(imgs[current].classList.contains(outClass))
				imgs[current].classList.replace(outClass,inClass);
		parent.addEventListener("click", cancelAuto,false);
}

var slidingAnim = setInterval(
		function () {
				slideInImages(".productPicCon","moveIn","moveOut",1)

		},2000
);
function cancelAuto(e) {
		clearInterval(slidingAnim);
		var t = e.target;
		if (t.getAttribute("id") == "prevBtn")
				slideInImages(".productPicCon","moveIn","moveOut",-1);
		else if (t.getAttribute("id") == "nextBtn")
				slideInImages(".productPicCon","moveIn","moveOut",1);		
}
*/