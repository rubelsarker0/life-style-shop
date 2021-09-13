const loadProducts = () => {
	const url = `https://fakestoreapi.com/products`;
	fetch(url)
		.then((response) => response.json())
		.then((data) => showProducts(data));
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
					<div class="card border-warning border-bottom border-3 border-0 single-product">
							<img src="${image}" class="product-image card-img-top" alt="...">
							<div class="card-body">
								<h5 class="card-title text-black">${product.title}</h5>
								<p class="card-text"><strong>Category:</strong><span class="fs-5"> ${product.category}</span></p>
								<p class="card-text"><strong>Price:</strong><span class="fs-5"> $${product.price}</span></p>
								<p class="card-text"><strong>Rating:</strong><span class="fs-5"> ${product.rating.rate}</span></p>
								<p class="card-text"><strong>Participate:</strong><span class="fs-5"> ${product.rating.count}</span></p>
								<hr>
								<div class="d-flex justify-content-center align-items-center  gap-2">
									<a onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="btn  btn-primary"><i class="fas fa-cart-plus"></i> ADD TO CART</a>
									<a onclick="getSpecificProduct(${product.id})" id="details-btn" class="btn btn-warning"><i class="fas fa-info-circle text-white"></i> DETAILS</a>
								</div>
							</div>
					</div>`;
		document.getElementById('all-products').appendChild(div);
	}
};

// Calling Specific Product product end-point function
const getSpecificProduct = async (productId) => {
	try {
		const url = `https://fakestoreapi.com/products/${productId}`;
		const response = await fetch(url);
		const data = await response.json();
		console.log(data);
		displaySpecificProduct(data);
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
					padding: 50px; width: 300px; height: 300px">
				</div>
				<div class="col-md-8">
					<div class="card-body" style="padding: 4rem 2rem;">
						<h4 class="card-title">${product.title}</h4>
						<ul class="fs-5">
							<li>Category: ${product.category}</li>
							<li>Price: $${product.price}</li>
							<li>Rating: ${product.rating.rate}</li>
							<li>Participate: ${product.rating.count}</li>
						</ul>
						<div class="gap-3">
						<a onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="btn btn-primary"><i class="fas fa-cart-plus"></i> ADD TO CART</a>
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
const setInnerText = (id, value) => {
	document.getElementById(id).innerText = Math.round(value);
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
