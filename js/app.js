//global variables
const spinner = document.getElementById('spinner');

// show and hide spinner functions
const showSpinner = () => {
	spinner.classList.remove('d-none');
};

const hideSpinner = () => {
	spinner.classList.add('d-none');
};

const loadProducts = async () => {
	try {
		showSpinner();
		const url = `https://fakestoreapi.com/products`;
		const response = await fetch(url);
		const data = await response.json();
		showProducts(data);
		hideSpinner();
	} catch (error) {
		console.log(error);
	}
};
loadProducts();

// show all product in UI
const showProducts = (products) => {
	const allProducts = products.map((pd) => pd);
	for (const product of allProducts) {
		const image = product.image;
		const div = document.createElement('div');
		div.classList.add('product');
		div.innerHTML = `
			<div class="card h-100 border-warning border-bottom border-3 border-0 single-product">
				<img src="${image}" class="product-image card-img-top" alt="...">
					<div class="card-body">
						<h5 class="card-title text-black fw-bold">${product.title}</h5>
						<p class="card-text"><strong>Category:</strong><span class="fs-5"> ${product.category}</span></p>
						<p class="card-text"><strong>Price:</strong><span class="fs-5"> $${product.price}</span></p>
						<p class="card-text">
						<i class="fas fa-star text-warning"></i>
						<i class="fas fa-star text-warning"></i>
						<i class="fas fa-star text-warning"></i>
						<i class="fas fa-star text-warning"></i>
						<i class="fas fa-star text-warning"></i>
						<i class="far fa-star text-warning"></i>
						<span class="rating-rate"> ${product.rating.rate}</span>
						</p>
						<p class="pt-2"><i class="fas fa-users fa-lg me-2"></i>${product.rating.count} global ratings</p>
						<hr>
						<div class="d-flex justify-content-center align-items-center gap-2">
							<a onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="btn  btn-primary"><i class="fas fa-cart-plus pe-2"></i>ADD TO CART</a>
							<a onclick="getSpecificProduct(${product.id})" href="#specific-section" id="details-btn" class="btn btn-warning"><i class="fas fa-info-circle text-white pe-2"></i>DETAILS</a>
						</div>
					</div>
			</div>`;
		document.getElementById('all-products').appendChild(div);
	}
};

// Calling Specific Product product end-point function
const getSpecificProduct = async (productId) => {
	try {
		showSpinner();
		const url = `https://fakestoreapi.com/products/${productId}`;
		const response = await fetch(url);
		const data = await response.json();
		displaySpecificProduct(data);
		hideSpinner();
	} catch (error) {
		console.log(error);
	}
};

//Displaying Specific Product function
const displaySpecificProduct = (product) => {
	const displaySpecificProduct = document.getElementById(
		'display-specific-product'
	);
	displaySpecificProduct.textContent = '';
	const div = document.createElement('div');
	div.className = 'card mb-2';
	div.innerHTML = generateSpecificProductHtml(product);
	displaySpecificProduct.appendChild(div);
};

//Generate Specific Product Html function
const generateSpecificProductHtml = (product) => {
	return `
			<div class="row g-0">
				<div class="col-md-4">
					<img src="${product.image}" class="img-fluid rounded-start" alt="product-image" style="
					padding: 30px; width: 300px; height: 300px">
					<p class="card-text pb-1 card-padding">
					<i class="fas fa-star text-warning"></i>
					<i class="fas fa-star text-warning"></i>
					<i class="fas fa-star text-warning"></i>
					<i class="fas fa-star text-warning"></i>
					<i class="fas fa-star text-warning"></i>
					<i class="far fa-star text-warning"></i>
					<span class="rating-rate"> ${product.rating.rate}</span>
					</p>
					<p class="card-padding"><i class="fas fa-users fa-lg me-2"></i>${product.rating.count} global ratings</p>
				</div>
				<div class="col-md-8">
					<div class="card-body" style="padding: 4rem 2rem;">
						<h4 class="card-title fw-bold">${product.title}</h4>
						<p class="product-description text-muted">${product.description}</p>
						<ul class="fs-5">
							<li>Category: ${product.category}</li>
							<li>Price: $${product.price}</li>
						</ul>
						<div class="gap-3">
						<a onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="btn btn-primary"><i class="fas fa-cart-plus pe-2"></i>ADD TO CART</a>
						<a onclick="clearSpecificProduct()" id="clear-btn" class="btn btn-danger text-white"><i class="fas fa-trash-alt pe-2"></i>CLEAR</a>
						</div>
					</div>
				</div>
			</div>`;
};

let count = 0;
const addToCart = (id, price) => {
	count = count + 1;
	updatePrice('price', price);
	updateTaxAndCharge();
	document.getElementById('total-Products').innerText = count;
	updateTotal();
};

const getInputValue = (id) => {
	const element = document.getElementById(id).innerText;
	const converted = parseFloat(element);
	return converted;
};

// main price update function
const updatePrice = (id, value) => {
	const convertedOldPrice = getInputValue(id);
	const convertPrice = parseFloat(value);
	const total = convertedOldPrice + convertPrice;
	document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value, isTrue = true) => {
	if (!isTrue) {
		document.getElementById(id).innerText = value.toFixed();
		return;
	}
	document.getElementById(id).innerText = value.toFixed(2);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
	const priceConverted = getInputValue('price');
	if (priceConverted > 200) {
		setInnerText('delivery-charge', 30);
		setInnerText('total-tax', priceConverted * 0.2);
	}
	if (priceConverted > 400) {
		setInnerText('delivery-charge', 50);
		setInnerText('total-tax', priceConverted * 0.3);
	}
	if (priceConverted > 500) {
		setInnerText('delivery-charge', 60);
		setInnerText('total-tax', priceConverted * 0.4);
	}
};

//grandTotal update function
const updateTotal = () => {
	const grandTotal =
		getInputValue('price') +
		getInputValue('delivery-charge') +
		getInputValue('total-tax');
	document.getElementById('total').innerText = grandTotal.toFixed(2);
};

updateTotal();

const clearSpecificProduct = () => {
	const specificProduct = document.getElementById('display-specific-product');
	specificProduct.innerHTML = '';
};

// handle modal alert
const buyProduct = () => {
	const alertModal = document.getElementById('alertModal');
	alertModal.textContent = '';
	const productQuantity = getInputValue('total-Products');
	const message = {};
	// console.log(productQuantity);
	if (productQuantity > 0) {
		message.title = 'Congratulations!';
		message.type = 'success';
		alertModal.appendChild(alertHTML(message));
		clearCart();
	} else {
		message.title = 'Opps!';
		message.type = 'fail';
		alertModal.appendChild(alertHTML(message));
	}
};

const clearCart = () => {
	setInnerText('total-Products', 0, false);
	setInnerText('price', 0, false);
	setInnerText('delivery-charge', 20, false);
	setInnerText('total-tax', 0, false);
	setInnerText('total', 0, false);
};

const alertHTML = (alertMessage) => {
	const { title, type } = alertMessage;
	const div = document.createElement('div');
	div.classList.add('modal-content');
	div.innerHTML = `
   			<div class="modal-header">
                <h5 class="modal-title text-center" id="alertModalLabel">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                	<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </symbol>
                <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                	<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </symbol>
                </svg>
            <div class="alert alert-${
							type === 'success' ? 'primary' : 'danger'
						} d-flex align-items-center" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#${
									type === 'success' ? 'check-circle-fill' : 'info-fill'
								}"/></svg>
            <div>
 				${
					type === 'success'
						? 'Congratulations! Successfully placed your order!'
						: 'Sorry! You Have No Items In Cart! Please Add item to the cart.'
				}
            </div>
            </div>
            <div class="modal-footer">
                 <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Okay</button>
            </div>`;
	return div;
};
