var $ = document.querySelector.bind(document),
  openBtn = $("#openBtn"),
  topNav = $(".topNav"),
  sideNav = $("#mySideNav"),
  closeBtn = $(".sideNav .closeBtn")
  main = $(".main");

function open(e) {
		e.preventDefault();
		sideNav.classList.add("slideIn");
}
function close() {
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