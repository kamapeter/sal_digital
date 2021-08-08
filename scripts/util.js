var $ = document.querySelector.bind(document),
	$$ = document.querySelectorAll.bind(document)
current = 0,
	count = $(".count");
//loading items from json file
var dynamicCons = $$(".loadContents");
var itemsList;
fetch('product.json').then(function(response) {
	if (response.ok) {
		response.json().then(function(json) {
			itemsList = json;
			DomUtils.displayItems();
			DomUtils.eventExec();
		});
	} else {
		console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
		Cart.displayCount();
	}
});
var f = new Intl.NumberFormat('en-NG', {
	style: 'currency',
	currency: 'NGN',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
String.prototype.firstWord = function() {
	return this.split(" ")[0]
};
var DomUtils = {
	displayItems: function() {
		Cart.displayCount();
		for (var i = 0; i < dynamicCons.length; i++) {
			if (!dynamicCons[i].classList.contains("loadCart")) {
				const cat = dynamicCons[i].getAttribute("data-categories");
				const filteredItems = itemsList.reduce(function(filtered, item) {
					if (item.category == cat || item.categories.indexOf(cat) != -1) {
						item.id = itemsList.indexOf(item);
						filtered.push(item);
					}
					return filtered;
				}, []);
				location.href.indexOf("index.html") > -1 ||
				location.href == "https://kamapeter.github.io/sal_digital/"?
					filteredItems.forEach((prod, j) => {
						dynamicCons[i].innerHTML +=
							`<div class='itemCon'>
          <div class="item" data-id=${prod.id} data-cartId=${Cart.inCart(prod.id).where}>
              						<img src = ${prod.imgSrcs[0]} alt="" class="itemPic" loading="lazy">
              						<span class="discount">${prod.discount}%</span>
              						<h5 class="itemName">${prod.name}</h5>            <h6 class = "oldPrice" > ${ getOldPrice(prod.discount, prod.price)}
              						<h5 class="itemPrice">${f.format(prod.price)}</h5> 
              				</div></div>`
					}) :
					filteredItems.forEach((prod, j) => {
						dynamicCons[i].innerHTML +=
							`
                <div class="item" data-id=${prod.id} data-cartId=${Cart.inCart(prod.id).where}>
                    						<img src = ${prod.imgSrcs[0]} alt="" class="itemPic" loading="lazy">
                    						<span class="discount">${prod.discount}%</span>
                    						<h5 class="itemName">${prod.name}</h5>
                    						<h6 class="oldPrice">${getOldPrice(prod.discount,prod.price)}</h6>
                    						<h5 class="itemPrice">N${prod.price}</h5> ${Cart.inCart(prod.id)? 
                    						`<div class="qtyCon">
          	    								<button class="qtyBtn decr"><i class="fa fa-minus"></i></button>
               								<input type="number" class="qty" value="${Cart.inCart(prod.id).qty}" data-cartId = ${Cart.inCart(prod.id).where}>
      		    								<button class="qtyBtn incr"><i class="fa fa-plus"></i></button>
        		    						</div></div>`: 
                    						`<button class="addToCartBtn">Add To Cart <i class="fa fa-shopping-cart"></i></button>
                    				</div>`}`
					});
			} else {
				if (Cart.cartItems.length == 0) {
					$('.main').innerHTML = `
            <div class="cartItems">
              <h2 class=""> Oops...looks Like Your Cart is Empty</h2>
              <img src="icons/cart2.svg" class='cartp' >
              <a href ="index.html"><button class="bigBtn order"> shop</button>
              </a>
            </div>
            `
				} else {
					Cart.cartItems.forEach((item, j) => {
						var key = item.id;
						let product = itemsList[key];
						dynamicCons[i].innerHTML += `
            <div class="cartItem">
              <img src=${product.imgSrcs[0]}>
              <div class="cartItemInfo">
                <h3>${product.name}</h3>
                <h4>${f.format(product.price)} <span class="oldPrice">${getOldPrice(product.discount,product.price)}</span></h4>
              </div>
              <div class="botto">
                <span class="purple askDel" data-cartId=${j}><span class="fa fa-trash askDel"> Remove</span></span>
                <div class="qtyCon">
                <button class="qtyBtn decr"><i class="fa fa-minus"></i></button>
                <input type="number" class="qty" value="${item.qty}" data-cartId=${j}>
                  <button class="qtyBtn incr"><i class="fa fa-plus"></i></button>  
                </div>
              </div>
                `;
					});
					$("#total").innerText = `${Cart.calcTotal()}`;
				}
			}
		}
	},
	eventExec: function eventers() {
		//do something when item is clicked
		var item = document || $(".main") || $(".carousel");
		item.addEventListener("click", handleItemClick, false);

		function handleItemClick(e) {
			if (e.target.classList.contains("item") || e.target.parentNode.classList.contains("item")) {
				if (!(e.target.nodeName == "BUTTON")) {
					$(".overlay").style.display = "block";
					$(".itemInfo").style.display = "block";
					var id = e.target.getAttribute("data-id") || e.target.parentNode.getAttribute("data-id");
					var inCart = (e.target.getAttribute("data-cartId") || e.target.parentNode.getAttribute("data-cartId"));
					var itemObj = itemsList[id];
					DomUtils.initItemInfo(itemObj, inCart, id);
					$(".overlay").addEventListener("click", (e) => {
						e.target.style.display = "none";
						$(".productPicCon .pics").innerHTML = "";
						$(".itemInfo").style.display = "none";
					}, false);
				}
			}
			if (e.target.classList.contains("addToCartBtn")) {
				Cart.addToCart(e)
			}
			if (e.target.classList.contains("askDel")) Cart.dialog(e);
		}
		document.addEventListener("click", Cart.changeQty, false);
		document.addEventListener("change", Cart.update, false);
		document.addEventListener("click", Cart.update, false);
		document.addEventListener("click", DomUtils.close, false);
		if ($("#nextBtn"))
			$("#nextBtn").addEventListener("click", () => DomUtils.slideInImages(".productPicCon", "moveIn", "moveOut", 1), false);
		if ($("#prevBtn"))
			$("#prevBtn").addEventListener("click", () => DomUtils.slideInImages(".productPicCon", "moveIn", "moveOut", -1), false);
	},
	//construct itemInfo ui
	initItemInfo: function(obj, cid, id) {
		for (var i = 0; i < obj.imgSrcs.length; i++) {
			var img = document.createElement("img");
			Object.assign(img, {
				src: obj.imgSrcs[i],
				load: "lazy",
				className: i == 0 ? "moveIn" : "moveOut"
			})
			$(".productPicCon .pics").appendChild(img)
		}
		$(".genDrpShadow").innerHTML = `
    <h3>${obj.name}<h3>
    <h3 class ='oldPrice'> ${getOldPrice(obj.discount,obj.price)}<h3>
    <h3> ${f.format(obj.price)}<h3>
    <h5>Brand: <span class="purple">${obj.brand? obj.brand : obj.name.firstWord()}</span></h5>
    `;
		var btnCon = $(".bottom.panel")
		btnCon.setAttribute("data-id", id)
		if (cid != "undefined") {
			replBtn = `<div class="qtyCon">
              	    <button class="qtyBtn decr"><i class="fa fa-minus"></i></button>
                   		<input type="number" class="qty" value="${Cart.cartItems[cid].qty}" data-cartId = ${cid}>
          		    		<button class="qtyBtn incr"><i class="fa fa-plus"></i></button>
            		    			</div>`;
			btnCon.innerHTML = `
        <button class="callBtn"><i class="fa fa-phone purple"></i></button> ${replBtn}`
		} else $(".bottom.panel").innerHTML =
			`<a href="tel: +2349086417512>"<button class="callBtn"><i class="fa fa-phone purple"></i></button>
     </a>
    		  <button class="addToCartBtn">ADD TO CART <i class="fa fa-shopping-cart"></i></button>
 `;
	},
	slideInImages: function(parent, inClass, outClass, inc) {
		var parent = $(parent),
			imgs = parent.querySelectorAll("img"),
			imgsNo = imgs.length;
		if (imgs[current].classList.contains(inClass))
			imgs[current].classList.replace(inClass, outClass);
		current = Math.abs((current + inc)) % (imgsNo);

		if (imgs[current].classList.contains(outClass))
			imgs[current].classList.replace(outClass, inClass);
	},
	close: function(e) {
		if (e.target.classList.contains("closeBtn") && !e.target.parentNode.classList.contains('sideNav')) {
			e.target.parentNode
				.style.display = 'none';
			$('.overlay').style.display = 'none';
                        if($(".productPicCon .pic"))
                                $(".productPicCon .pics").innerHTML = "";
		}
	}

}

var Cart = {
	cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
	addToCart: function(e) {
		var key = e.target.parentNode.getAttribute("data-id");
		Cart.cartItems.push({
			"id": key,
			"qty": 1
		});
		localStorage.setItem("cartItems", JSON.stringify(Cart.cartItems))
		location.assign("cart.html");
	},
	inCart: function(id) {
		var found = false;
		if (Cart.cartItems != []) {
			for (var i = 0; i < Cart.cartItems.length; i++) {
				if (Cart.cartItems[i].id == id) {
					found = {
						where: i,
						qty: Cart.cartItems[i].qty
					};
					break;
				}
			}
		}
		return found;
	},
	changeQty: function(e) {
		var qty = e.target.parentNode.querySelector(".qty");
		if (e.target.classList.contains("incr")) {
			qty.value = parseInt(qty.value) + 1;
		} else if (e.target.classList.contains("decr")) {
			qty.value > 1 ? qty.value-- : qty.value = 1;
		}
		Cart.displayCount()
	},
	update: function(e) {
		var elem = e.target;
		if (elem.classList.contains("qtyBtn") || elem.classList.contains("qty")) {
			elem = elem.getAttribute("data-cartId") ? elem : elem.parentNode.querySelector(".qty");

			Cart.cartItems[elem.getAttribute("data-cartId")].qty = elem.value;
			localStorage.setItem("cartItems",
				JSON.stringify(Cart.cartItems));
			Cart.displayCount();
			if ($("#total")) $("#total").innerText = Cart.calcTotal();
		}
	},
	displayCount: function() {
		if (Cart.cartItems != []) {
			count.style.display = "inline-block";
			let countVal = Cart.cartItems.reduce(
				(pr, curr) => pr + Number(curr.qty),
				0);
			if (countVal > 0)
				count.textContent = countVal;
			else
				count.style.display = "none";
		}
	},
	calcTotal: function() {
		if (Cart.cartItems != []) {
			let total = Cart.cartItems.reduce(
				(pre, curr) => pre + (curr.qty * itemsList[curr.id].price), 0
			);
			return f.format(total)
		}
	},
	dialog: function(e) {
		$(".overlay").style.display = "block";
		$(".dialog").style.display = "block";
		var id = e.target.getAttribute("data-cartId") || e.target.parentNode.getAttribute("data-cartId");
		$(".dialog").addEventListener("click", function(e) {
			if (e.target.classList.contains("remove")) {
				Cart.removeItem(id);
			}
			if (e.target.nodeName == "BUTTON") {
				$(".overlay").style.display = "none";
				$(".dialog").style.display = "none";
			}

		}, false);
	},
	removeItem: function(id) {
		Cart.cartItems.splice(id, 1);
		localStorage.setItem("cartItems", JSON.stringify(Cart.cartItems));
		location.href = location.href;
	}
}

function getOldPrice(discount, price) {
	return f.format((Number(price) + (discount * price) / 100));
}
